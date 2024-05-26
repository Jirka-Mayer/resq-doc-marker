from pydantic import BaseModel
from .uploading.UploadTransaction import UploadTransaction
from .uploading.resq.ResqUser import ResqUser
from typing import Dict


class InitiateUploadResponse(BaseModel):
    id: int
    "ID of the upload transaction that has just been initiated"

    doc_marker_token: str
    "Access token for DocMarker needed to finalize the transaction"

    resq_user: ResqUser
    "RES-Q user that initiated this upload transaction"

    resq_providers: Dict[int, str]
    "Map from provider IDs (hospitals) to their display names"

    @staticmethod
    def from_transaction(transaction: UploadTransaction):
        return InitiateUploadResponse(
            id=transaction.id,
            doc_marker_token=transaction.doc_marker_token,
            resq_user=transaction.resq_user,
            resq_providers=transaction.resq_providers
        )
