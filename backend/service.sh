#!/bin/sh

# this file is used by systemctl to launch the service

.venv/bin/python3 -m uvicorn app.main:app --port 8000 --root-path /resq-doc-marker/backend
