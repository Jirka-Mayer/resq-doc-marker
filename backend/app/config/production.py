from .Config import Config
from pathlib import Path

productionConfig = Config(
    resqApiBaseUrl="https://stroke.qualityregistry.org/api/rest/apac/",
    uploadedFilesStoragePath=Path("storage", "production")
)
