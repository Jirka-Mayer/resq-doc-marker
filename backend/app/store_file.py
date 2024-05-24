from .config.development import development_config
from .config.production import production_config
from pathlib import Path
from datetime import datetime
import json


def _prepare_storage_folder(is_development: bool) -> Path:
    """Selects and optionally creates the storage folder"""
    folder = development_config.uploaded_files_storage_path \
        if is_development else production_config.uploaded_files_storage_path
    
    if not folder.exists():
        folder.mkdir(parents=True)
    
    if not folder.is_dir():
        raise Exception(f"The path {folder} is not a folder.")

    return folder


def store_file(file: dict, is_development: bool):
    """Stores an uploaded report file"""
    folder_path = _prepare_storage_folder(is_development)

    uuid = str(file["_uuid"])
    uploaded_at: str = datetime.now().isoformat()
    file_path = folder_path / f"{uploaded_at}_{uuid}.json"

    if file_path.exists():
        raise Exception(
            f"A file with the name {file_path.name} already exists."
        )

    file_path.write_text(
        data=json.dumps(file, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    # written by "mayer" in group "resq-plus"
    file_path.chmod(0o660) # -rw-rw----
