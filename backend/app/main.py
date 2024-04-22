import os
from typing import Annotated
from fastapi import FastAPI, Header, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer
from .UploadFileRequest import UploadFileRequest
from .verify_token import verify_token
from .store_file import store_file
from app import __version__


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


@app.get("/version")
def version():
    return { "version": __version__ }


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
