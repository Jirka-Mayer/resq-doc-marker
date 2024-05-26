from ...config.development import development_config
from ...config.production import production_config
import requests
from .ResqRecord import ResqRecord


def update_resq_record_for_case(
    resq_access_token: str,
    is_development: bool,
    resq_record: ResqRecord,
    form_data: dict
):
    """Updates a record in the RES-Q registry"""
    api_base_url = development_config.resq_api_base_url if is_development \
        else production_config.resq_api_base_url
    
    # PUT /records/{id}
    response = requests.put(
        api_base_url + "records/" + str(resq_record.id),
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + resq_access_token
        },
        json={
            "previousEntry": resq_record.latest_entry_id,
            "data": form_data,
            "submitted": False
        }
    )
    response.raise_for_status()
