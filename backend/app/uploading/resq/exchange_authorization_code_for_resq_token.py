import urllib.parse
from ...config.development import development_config
from ...config.production import production_config
from typing import Optional
import requests
import urllib
import base64


def exchange_authorization_code_for_resq_token(
    authorization_code: str,
    keycloak_redirect_uri: str,
    is_development: bool
) -> Optional[str]:
    """
    Requests the token endpoint of the Keycloak server to exchange the
    authoriztaion code for an access token.

    The list of Keycloak endpoints is documented here:
    https://www.keycloak.org/docs/24.0.2/securing_apps/#endpoints
    and we care about the "token endpoint",
    which is the one that exchanges an authorization code for an access token

    The request format is described by the OAuth 2 specs:
    https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3

    We use password client authentication if the password is present in the
    server configuration.
    """

    token_endoint_url = development_config.keycloak_token_url \
        if is_development else production_config.keycloak_token_url
    
    client_id = development_config.oauth_client_id \
        if is_development else production_config.oauth_client_id

    client_password = development_config.oauth_client_password \
        if is_development else production_config.oauth_client_password
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
    }

    if client_password is not None:
        # See how the password is encoded:
        # https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1
        payload = urllib.parse.quote(client_id) + ":" + \
            urllib.parse.quote(client_password)
        encoded_password = base64.b64encode(
            payload.encode("utf-8")
        ).decode("utf-8")
        headers["Authorization"] = "Basic " + encoded_password

    response = requests.post(
        token_endoint_url,
        headers=headers,
        data={
           "grant_type": "authorization_code",
            "code": authorization_code,
            "redirect_uri": keycloak_redirect_uri,
            "client_id": client_id
        }
    )

    data = response.json()

    if "error" in data:
        print("Error with keycloak code exchange request:", data)
        return None

    if "access_token" not in data:
        print("Missing the access_token in the keycloak response:", data)
        return None

    return str(data["access_token"])
