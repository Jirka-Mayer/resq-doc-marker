from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class UploadTransaction:
    """Represents one started upload transaction flow"""
    
    id: int
    "ID of the upload transaction"

    created_at: datetime
    "When was the transaction created"

    doc_marker_token: str
    "Access token used to finalize the transaction"

    authorization_code: str
    """OAuth authorization code used to initiate this upload transaction and get
    the RES-Q access token. Used when the DocMarker is refreshed and code is
    re-sent to the uploading server."""

    resq_access_token: str
    "Access token used to access the RES-Q API"

    resq_user: Optional[dict]
    "JSON describing the RES-Q user directly from the RES-Q API"
