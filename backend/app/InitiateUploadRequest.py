from pydantic import BaseModel


class InitiateUploadRequest(BaseModel):
    authorization_code: str
    "The OAuth 2.0 authorization code from the keycloak server"

    keycloak_redirect_uri: str
    """The 'redirect_uri' given to Keycloak, needed again to exchange the
    authorization code and Keycloak checks for its equality. It's the URI
    where the user was redirected back to DocMarker"""

    is_development: bool
    "Should the development RES-Q server be used"
