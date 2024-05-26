import os
from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer
from .uploading.store_file_at_ufal import store_file_at_ufal
from .uploading.UploadTransactionRepository import UploadTransactionRepository
from .uploading.resq.exchange_authorization_code_for_resq_token \
    import exchange_authorization_code_for_resq_token
from .uploading.resq.populate_transaction_with_user_data \
    import populate_transaction_with_user_data
from .uploading.resq.create_new_resq_case import create_new_resq_case
from .uploading.resq.create_resq_record_for_case \
    import create_resq_record_for_case
from .uploading.resq.fetch_resq_case import fetch_resq_case
from .uploading.resq.update_resq_record_for_case \
    import update_resq_record_for_case
from .uploading.DocMarkerFile import DocMarkerFile
from .InitiateUploadRequest import InitiateUploadRequest
from .InitiateUploadResponse import InitiateUploadResponse
from .FinalizeUploadRequest import FinalizeUploadRequest
from .FinalizeUploadResponse import FinalizeUploadResponse
from app import __version__


description = """
A web service for the RES-Q+ project, designed to store completed annotations
of discharge reports at the Charles University. It also proxies case uploads
to the RES-Q registry if asked for it.
"""


app = FastAPI(
    title="RES-Q+ Annotation Storage Service",
    description=description,
    version=__version__
)

upload_transaction_repository = UploadTransactionRepository()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:1234",
        "https://ufallab.ms.mff.cuni.cz",
        "https://quest.ms.mff.cuni.cz"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
def index():
    path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(path) as f:
        return f.read()


@app.get("/version")
def version():
    return { "version": __version__ }


@app.post(
    "/upload-transaction",
    status_code=201,
    responses={
        401: {
            "description": "Given authorization code is invalid"
        }
    }
)
def initiate_upload_transaction(
    request: InitiateUploadRequest
) -> InitiateUploadResponse:
    # handle the case when the authorization code has already been sent
    transaction = upload_transaction_repository.find_by_authorization_code(
        request.authorization_code
    )
    if transaction is not None:
        return InitiateUploadResponse.from_transaction(transaction)
    
    # convert the authorization code to an access token
    resq_access_token = exchange_authorization_code_for_resq_token(
        authorization_code=request.authorization_code,
        keycloak_redirect_uri=request.keycloak_redirect_uri,
        is_development=request.is_development
    )
    if resq_access_token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization code"
        )
    
    # create a new transaction
    transaction = upload_transaction_repository.create(
        is_development=request.is_development,
        authorization_code=request.authorization_code,
        resq_access_token=resq_access_token
    )

    # populate the transaction with user data
    populate_transaction_with_user_data(
        transaction=transaction,
        is_development=request.is_development
    )

    # store the transaction
    upload_transaction_repository.store(transaction)

    # return the transaction response
    return InitiateUploadResponse.from_transaction(transaction)


@app.patch(
    "/upload-transaction/{transaction_id}",
    status_code=200,
    responses={
        401: {
            "description": "Given DocMakrer token is invalid"
        },
        404: {
            "description": "Given upload transaction ID does not exist"
        },
        422: {
            "description": "Invalid request format"
        }
    }
)
def finalize_upload_transaction(
    token: Annotated[str, Depends(oauth2_scheme)],
    transaction_id: int,
    request: FinalizeUploadRequest
) -> FinalizeUploadResponse:
    # fetch the upload transaction
    transaction = upload_transaction_repository.find(transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # verify the DocMarker token
    if token != transaction.doc_marker_token:
        raise HTTPException(status_code=401, detail="Invalid bearer token")
    
    # verify chosen provider ID
    if request.resq_provider_id not in transaction.resq_providers:
        raise HTTPException(status_code=422, detail="Invalid RES-Q provider ID")

    # wrap the DocMarker file to allow manipulations
    dm_file = DocMarkerFile(request.file_json)
    
    # keep track of important IDs
    case_id = dm_file.get_case_id()
    record_id = dm_file.get_record_id()
    
    # first, upload to resq to set the case ID
    if request.upload_to_resq:
        if case_id is None:
            # create a fresh new case and record
            case_id = create_new_resq_case(
                transaction.resq_access_token,
                transaction.is_development,
                request.resq_provider_id
            )
            record_id = create_resq_record_for_case(
                transaction.resq_access_token,
                transaction.is_development,
                case_id,
                request.resq_form_localization_id,
                dm_file.get_form_data()
            )
        else:
            # update an existing case and record
            resq_case = fetch_resq_case(
                transaction.resq_access_token,
                transaction.is_development,
                case_id
            )
            if resq_case is None:
                raise HTTPException(
                    status_code=422,
                    detail="Cannot access the linked RES-Q case"
                )
            
            resq_record = resq_case.find_record(record_id)
            if resq_record is None:
                raise HTTPException(
                    status_code=422,
                    detail="Cannot find the linked RES-Q record"
                )
            
            if resq_record.submitted:
                raise HTTPException(
                    status_code=422,
                    detail="The RES-Q record has been submitted and so its " +
                    "overwriting is disabled. You need to set it back to a " +
                    "draft in RES-Q in order for the upload to work again."
                )

            update_resq_record_for_case(
                transaction.resq_access_token,
                transaction.is_development,
                resq_record,
                dm_file.get_form_data()
            )

    # update upload-related metadata
    dm_file.set_case_id(case_id)
    dm_file.set_record_id(record_id)
    dm_file.set_resq_user_metadata(
        request.resq_provider_id,
        transaction
    )
    dm_file.set_uploaded_at_to_now()

    # store the file at ufal
    if request.upload_to_ufal:
        store_file_at_ufal(dm_file.json, transaction.is_development)

    # send the updated file back as part of the response
    return FinalizeUploadResponse(
        file_json=dm_file.json
    )
