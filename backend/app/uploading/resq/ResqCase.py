from dataclasses import dataclass
from typing import List, Optional
from .ResqRecord import ResqRecord


@dataclass
class ResqCase:
    id: int
    "ID of the RES-Q case"

    state: str
    """State of the case, either "active" or "deleted"."""

    records: List[ResqRecord]
    "List of records for the case"

    def find_record(self, record_id: int) -> Optional[ResqRecord]:
        for r in self.records:
            if r.id == record_id:
                return r
        return None
