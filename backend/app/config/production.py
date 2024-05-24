from .Config import Config
from pathlib import Path

production_config = Config(
    resq_api_base_url="https://stroke.qualityregistry.org/api/rest/hpfdc/",
    uploaded_files_storage_path=Path("storage", "production"),
    keycloak_token_url="https://auth.qualityregistry.org/realms/stroke/protocol/openid-connect/token",
    oauth_client_id="doc-marker",
    oauth_client_password=None,
)
