from pydantic import BaseModel
from .uploading.UploadTransaction import UploadTransaction


class InitiateUploadResponse(BaseModel):
    id: int
    "ID of the upload transaction that has just been initiated"

    doc_marker_token: str
    "Access token for DocMarker needed to finalize the transaction"

    resq_user: dict
    "JSON describing the RES-Q user directly from the RES-Q API"

    @staticmethod
    def from_transaction(transaction: UploadTransaction):
        return InitiateUploadResponse(
            id=transaction.id,
            doc_marker_token=transaction.doc_marker_token,
            resq_user=transaction.resq_user
        )
