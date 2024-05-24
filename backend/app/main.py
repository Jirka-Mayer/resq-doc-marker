import os
from typing import Annotated
from fastapi import FastAPI, Header, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer
from .UploadFileRequest import UploadFileRequest
from .verify_token import verify_token
from .store_file import store_file
from .uploading.UploadTransaction import UploadTransaction
from .uploading.UploadTransactionRepository import UploadTransactionRepository
from .uploading.exchange_authorization_code_for_resq_token \
    import exchange_authorization_code_for_resq_token
from .uploading.populate_transaction_with_user_data \
    import populate_transaction_with_user_data
from .InitiateUploadRequest import InitiateUploadRequest
from .InitiateUploadResponse import InitiateUploadResponse
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


# TODO: PATCH /upload-transaction/:id


# TODO: deprecated
@app.post(
    "/uploaded-file",
    status_code=201,
    responses={
        401: {
            "description": "Given access token is invalid"
        }
    }
)
def upload_file(
    token: Annotated[str, Depends(oauth2_scheme)],
    request: UploadFileRequest
):
    if not verify_token(token, request.is_development):
        raise HTTPException(status_code=401, detail="Invalid bearer token")

    store_file(request.file_json, request.is_development)
    
    return {"message": "File was uploaded successfully."}
