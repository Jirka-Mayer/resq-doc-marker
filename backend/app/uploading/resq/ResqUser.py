from dataclasses import dataclass
from typing import Optional


@dataclass
class ResqUser:
    id: str
    "ID of the RES-Q user"

    first_name: str
    "Given name of the user"

    last_name: str
    "Surename of the user"
    
    title: str
    "Title of the user"

    current_provider_id: Optional[int]
    "ID of the currently active provider (hospital)"
