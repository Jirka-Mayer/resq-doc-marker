from pydantic import BaseModel
from enum import Enum
from typing import Union
from datetime import datetime


class UploadFileRequest(BaseModel):
    is_development: bool
    file_json: dict
