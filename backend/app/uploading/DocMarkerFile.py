import copy
from typing import Optional
from .UploadTransaction import UploadTransaction
from datetime import datetime


FORM_DATA_KEY = "formData"
CASE_ID_KEY = "resqCaseId"
RECORD_ID_KEY = "resqRecordId"
UPLOADED_BY_USER_KEY = "uploadedByUser"
UPLOADED_AT_KEY = "uploadedAt"


class DocMarkerFile:
    """Wraps the DocMarker file JSON and provides some utility functions"""
    def __init__(self, file_json: dict):
        self.json: dict = copy.deepcopy(file_json)
    
    def get_case_id(self) -> Optional[str]:
        """Returns the RES-Q Case ID stored in the file"""
        if self.json[CASE_ID_KEY] is not None:
            return str(self.json[CASE_ID_KEY])
        return None

    def set_case_id(self, case_id: Optional[str]):
        assert case_id is None or type(case_id) is str
        self.json[CASE_ID_KEY] = case_id
    
    def get_record_id(self) -> Optional[int]:
        """Returns the RES-Q record ID stored in the file"""
        if self.json[RECORD_ID_KEY] is not None:
            return int(self.json[RECORD_ID_KEY])
        return None
    
    def set_record_id(self, record_id: Optional[int]):
        assert record_id is None or type(record_id) is int
        self.json[RECORD_ID_KEY] = record_id

    def get_form_data(self) -> dict:
        return self.json[FORM_DATA_KEY]
    
    def set_resq_user_metadata(
        self,
        provider_id: int,
        transaction: UploadTransaction
    ):
        self.json[UPLOADED_BY_USER_KEY] = {
            "id": transaction.resq_user.id,
            "firstName": transaction.resq_user.first_name,
            "lastName": transaction.resq_user.last_name,
            "title": transaction.resq_user.title,
            "providerId": provider_id,
            "providerName": transaction.resq_providers[provider_id]
        }
    
    def set_uploaded_at_to_now(self):
        self.json[UPLOADED_AT_KEY] = datetime.now().isoformat()
