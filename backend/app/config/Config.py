from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class Config:
    resq_api_base_url: str
    "Base URL for the RES-Q registry API"

    uploaded_files_storage_path: Path
    "Path to a folder that should store the uploaded files"

    keycloak_token_url: str
    """
    The endpoint for exchanging an authorization code for the access token
    (the OAuth2 *token endpoint*)
    """

    oauth_client_id: str
    """Name of the doc-marker OAuth2 client, sent to the RES-Q "login" page
    as a parameter, needs to be white-listed in the keycloak configuration"""

    oauth_client_password: Optional[str]
    "Password for the DocMarker client to authenticate against RES-Q"
