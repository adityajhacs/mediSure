from uuid import uuid4


def create_batch(batch_id: str) -> str:
    """
    Temporary mock blockchain transaction.
    Later this will call Member 1's actual blockchain/chaincode.
    """
    return f"MOCK-CREATE-{uuid4().hex[:10].upper()}"


def transfer_batch(batch_id: str, from_org: str, to_org: str) -> str:
    """
    Temporary mock transfer transaction.
    """
    return f"MOCK-TRANSFER-{uuid4().hex[:10].upper()}"


def receive_batch(batch_id: str, received_by: str) -> str:
    """
    Temporary mock receive transaction.
    """
    return f"MOCK-RECEIVE-{uuid4().hex[:10].upper()}"


def get_batch_history(batch_id: str) -> str:
    """
    Temporary mock history transaction.
    """
    return f"MOCK-HISTORY-{uuid4().hex[:10].upper()}"