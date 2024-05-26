from pydantic import BaseModel
from typing import Optional


class FinalizeUploadResponse(BaseModel):
    file_json: dict
    "JSON serializer DocMarker file that was uploaded and may have been modified"
