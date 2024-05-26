from dataclasses import dataclass


@dataclass
class ResqRecord:
    id: int
    "ID of the RES-Q record"

    state: str
    """Record state, either "active" or "deleted"."""

    localization: int
    "ID of the form localization used for this record"

    latest_entry_id: int
    "ID of the latest entry for this record"
