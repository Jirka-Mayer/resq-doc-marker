from .UploadTransaction import UploadTransaction
from ..config.development import development_config
from ..config.production import production_config
import requests


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
    transaction.resq_user = response.json()
