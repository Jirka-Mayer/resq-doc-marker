import os
from typing import Optional
from fastapi import FastAPI
from fastapi.responses import HTMLResponse


description = """
A web service for the RES-Q+ project, designed to store completed annotations
of discharge reports at the Charles University.
"""


app = FastAPI(
    title="RES-Q+ Annotation Storage Service",
    description=description,
    version="0.1.0-dev"
)


@app.get("/", response_class=HTMLResponse)
def index():
    path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(path) as f:
        return f.read()
