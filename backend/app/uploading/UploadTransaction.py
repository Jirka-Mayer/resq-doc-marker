from dataclasses import dataclass
from typing import Dict, Optional
from datetime import datetime
from .resq.ResqUser import ResqUser


@dataclass
class UploadTransaction:
    """Represents one started upload transaction flow"""
    
    id: int
    "ID of the upload transaction"

    is_development: bool
    "Is the transaction run against the RES-Q development or production server"

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

    resq_user: Optional[ResqUser]
    "RES-Q user that initiated this upload transaction"

    resq_providers: Dict[int, str]
    "Map from provider IDs (hospitals) to their display names"
