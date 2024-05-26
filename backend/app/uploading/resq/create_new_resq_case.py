from ...config.development import development_config
from ...config.production import production_config
import requests


def create_new_resq_case(
    resq_access_token: str,
    is_development: bool,
    resq_provider_id: int
) -> str:
    """Creates new case in the RES-Q registry"""
    api_base_url = development_config.resq_api_base_url if is_development \
        else production_config.resq_api_base_url

    # POST /cases
    response = requests.post(
        api_base_url + "cases",
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + resq_access_token
        },
        json={
            "provider": resq_provider_id
        }
    )
    response.raise_for_status()
    case_data = response.json()

    return str(case_data["id"])
