from ..UploadTransaction import UploadTransaction
from ...config.development import development_config
from ...config.production import production_config
import requests
from .ResqUser import ResqUser


def populate_transaction_with_user_data(
    transaction: UploadTransaction,
    is_development: bool
):
    """Fetches user metadata and hospitals from the RES-Q registry"""
    api_base_url = development_config.resq_api_base_url if is_development \
        else production_config.resq_api_base_url
    
    # GET /myself
    response = requests.get(
        api_base_url + "myself",
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + transaction.resq_access_token
        }
    )
    response.raise_for_status()
    user_data = response.json()

    settings = user_data["settings"]
    provider_id = int(settings["currentProvider"]["id"]) \
        if "currentProvider" in settings else None
    transaction.resq_user = ResqUser(
        id=str(user_data["id"]),
        first_name=str(user_data["firstName"]),
        last_name=str(user_data["lastName"]),
        title=str(user_data["title"]),
        current_provider_id=provider_id
    )

    # GET /provider-role-assignments
    response = requests.get(
        api_base_url + "provider-role-assignments",
        params={
            "user": transaction.resq_user.id,
            "expand": "provider"
        },
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + transaction.resq_access_token
        }
    )
    response.raise_for_status()
    assignments_data = response.json()

    transaction.resq_providers = {}
    for assignment in assignments_data["results"]:
        if assignment["role"] not in ["dataEntry", "localCoordinator"]:
            continue
        provider = assignment["provider"]
        transaction.resq_providers[provider["id"]] = provider["nameNative"]
