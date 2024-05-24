from typing import Optional, List
from .UploadTransaction import UploadTransaction
import uuid
from datetime import datetime


TRANSACTION_TTL_SECONDS = 3600


class UploadTransactionRepository:
    """Holds active upload transactions in memory"""
    def __init__(self):
        self._transactions: List[UploadTransaction] = []
        "Lits of active transactions"

        self._next_id = 1
        "Next transaction ID, autoincremented"
    
    def create(
        self,
        authorization_code: str,
        resq_access_token: str
    ) -> UploadTransaction:
        """Creates a new transaction instance, but does not store it yet"""
        transaction = UploadTransaction(
            id=self._next_id,
            created_at=datetime.now(),
            doc_marker_token=uuid.uuid4().hex,
            authorization_code=authorization_code,
            resq_access_token=resq_access_token,
            resq_user=None
        )
        
        self._next_id += 1
        
        return transaction

    def store(self, transaction: UploadTransaction):
        if self.find(transaction.id) is not None:
            raise Exception(
                f"Transaction with ID {transaction.id} is already present."
            )
        self._transactions.append(transaction)
        
        # trigger garbage collection after each insert
        self.collect_garbage()
    
    def collect_garbage(self):
        now = datetime.now()
        self._transactions = [
            t for t in self._transactions
            if (now - t.created_at).total_seconds() < TRANSACTION_TTL_SECONDS
        ]

    def find(
        self,
        id: int
    ) -> Optional[UploadTransaction]:
        for t in self._transactions:
            if t.id == id:
                return t
        return None
    
    def find_by_authorization_code(
        self,
        authorization_code: str
    ) -> Optional[UploadTransaction]:
        for t in self._transactions:
            if t.authorization_code == authorization_code:
                return t
        return None
