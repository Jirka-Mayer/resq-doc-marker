import os
from typing import Annotated
from fastapi import FastAPI, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer
from .UploadFileRequest import UploadFileRequest


description = """
A web service for the RES-Q+ project, designed to store completed annotations
of discharge reports at the Charles University.
"""


app = FastAPI(
    title="RES-Q+ Annotation Storage Service",
    description=description,
    version="0.1.0-dev"
)

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
    # TODO: verify the token against res-q (dev or prod based on the flag)

    # TODO: write the file to the storage (dev or prod based on the flag)
    
    print(token)
    print(request)
    
    return {"message": "File was uploaded successfully."}
