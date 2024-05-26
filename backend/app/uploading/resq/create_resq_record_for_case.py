from ...config.development import development_config
from ...config.production import production_config
import requests


def create_resq_record_for_case(
    resq_access_token: str,
    is_development: bool,
    case_id: str,
    resq_form_localization_id: int,
    form_data: dict
) -> int:
    """Creates new record for a given case in the RES-Q registry"""
    api_base_url = development_config.resq_api_base_url if is_development \
        else production_config.resq_api_base_url
    
    # POST /records
    response = requests.post(
        api_base_url + "records",
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + resq_access_token
        },
        json={
            "case": case_id,
            "submitted": False,
            "localization": resq_form_localization_id,
            "data": form_data
        }
    )
    response.raise_for_status()
    record_data = response.json()

    return int(record_data["id"])
