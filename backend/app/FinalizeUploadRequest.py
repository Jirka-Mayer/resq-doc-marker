from pydantic import BaseModel


class FinalizeUploadRequest(BaseModel):
    doc_marker_token: str
    "Access token for DocMarker needed to finalize the transaction"

    file_json: dict
    "JSON serializer DocMarker file that is being uploaded"

    upload_to_resq: bool
    "Should the file be uploaded to the RES-Q registry"

    upload_to_ufal: bool
    "Should the file be uploaded to ÚFAL"

    resq_provider_id: int
    "ID of the hospital we upload this file as (hospital = provider)"

    resq_form_localization_id: int
    "ID of the form version in RES-Q to upload the data as"
