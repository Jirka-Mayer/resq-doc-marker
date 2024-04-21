from .Config import Config
from pathlib import Path

developmentConfig = Config(
    resqApiBaseUrl="https://stroke.dev.qualityregistry.org/api/rest/apac/",
    uploadedFilesStoragePath=Path("storage", "development")
)
