from .config.development import development_config
from .config.production import production_config
import requests


# TODO: deprecated
def verify_token(token: str, is_development: bool) -> bool:
    """
    Queries the /myself RES-Q registry endpoint with the token
    and checks that it gets a 200 response. If the token is valid,
    it returns true.
    """
    url = development_config.resq_api_base_url if is_development \
        else production_config.resq_api_base_url

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
