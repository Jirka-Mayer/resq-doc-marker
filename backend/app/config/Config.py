from dataclasses import dataclass
from pathlib import Path


@dataclass
class Config:
    resqApiBaseUrl: str
    "Base URL for the RES-Q registry API"

    uploadedFilesStoragePath: Path
    "Path to a folder that should store the uploaded files"
