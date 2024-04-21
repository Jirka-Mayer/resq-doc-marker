from .config.development import developmentConfig
from .config.production import productionConfig
import requests


def verify_token(token: str, is_development: bool) -> bool:
    """
    Queries the /myself RES-Q registry endpoint with the token
    and checks that it gets a 200 response. If the token is valid,
    it returns true.
    """
    url = developmentConfig.resqApiBaseUrl if is_development \
        else productionConfig.resqApiBaseUrl

    response = requests.get(
        url,
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        }
    )

    if response.status_code == 200:
        return True
    
    if response.status_code == 401:
        return False
    
    response.raise_for_status()
