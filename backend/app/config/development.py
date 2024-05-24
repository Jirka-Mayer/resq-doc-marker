from .Config import Config
from pathlib import Path

development_config = Config(
    resq_api_base_url="https://stroke.dev.qualityregistry.org/api/rest/hpfdc/",
    uploaded_files_storage_path=Path("storage", "development"),
    keycloak_token_url="https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/token",
    oauth_client_id="doc-marker",
    oauth_client_password=None,
)
