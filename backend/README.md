Backend server
==============

This folder contains the implementation of the backend server used for uploading
annotations to the Charles University. This server is not used to serve the
Doc Marker application, that is a frontend-only app; it only handles annotated
file uploading, validation, and storage.

> **Note:** All code in this folder expects *current working directory* to be this folder.


## After cloning

Create virtual environment:

```
python3 -m venv .venv
.venv/bin/python3 -m pip install -r requirements.txt
```

Start the service locally for development:

```
.venv/bin/python3 -m uvicorn app.main:app --reload
```

And open http://localhost:8000/docs for the OpenAPI docs.
