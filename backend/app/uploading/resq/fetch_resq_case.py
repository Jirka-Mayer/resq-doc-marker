from ...config.development import development_config
from ...config.production import production_config
import requests
from .ResqCase import ResqCase
from .ResqRecord import ResqRecord


def fetch_resq_case(
    resq_access_token: str,
    is_development: bool,
    case_id: str,
):
    """Fetches a RES-Q case given its ID"""
    api_base_url = development_config.resq_api_base_url if is_development \
        else production_config.resq_api_base_url
    
    # GET /cases/{id}
    response = requests.get(
        api_base_url + "cases/" + case_id,
        params={
            "expand": "records"
        },
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + resq_access_token
        }
    )
    response.raise_for_status()
    case_data = response.json()

    resq_case = ResqCase(
        id=str(case_data["id"]),
        state=str(case_data["state"]),
        records=[]
    )

    for record_data in case_data["records"]:
        resq_record = ResqRecord(
            id=int(record_data["id"]),
            state=str(record_data["state"]),
            localization=int(record_data["localization"]),
            latest_entry_id=int(record_data["latestEntry"]["id"]),
            submitted=bool(record_data["latestEntry"]["submitted"])
        )
        resq_case.records.append(resq_record)

    return resq_case
