import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise RuntimeError("Supabase environment variables are missing")

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
)


BATCH_FIELDS = [
    "batch_id",
    "medicine_name",
    "quantity",
    "manufacturing_date",
    "expiry_date",
    "min_temperature",
    "max_temperature",
    "manufacturer",
    "distributor",
    "pharmacy",
    "current_owner",
    "pending_receiver",
    "pending_stage",
    "status",
    "blockchain_verified",
    "blockchain_tx_id",
    "temperature_status",
    "qr_code",
    "created_at",
    "updated_at",
]


def list_batches() -> List[Dict[str, Any]]:
    result = (
        supabase
        .table("batches")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


def get_batch(batch_id: str) -> Optional[Dict[str, Any]]:
    result = (
        supabase
        .table("batches")
        .select("*")
        .eq("batch_id", batch_id)
        .limit(1)
        .execute()
    )

    if not result.data:
        return None

    return result.data[0]


def get_batch_full(batch_id: str) -> Optional[Dict[str, Any]]:
    batch = get_batch(batch_id)

    if not batch:
        return None

    batch["history"] = get_batch_history(batch_id)
    batch["temperature_logs"] = get_temperature_logs(batch_id)
    batch["alerts"] = get_alerts(batch_id)

    return batch


def get_all_batches_full() -> List[Dict[str, Any]]:
    batches = list_batches()

    for batch in batches:
        batch_id = batch["batch_id"]
        batch["history"] = get_batch_history(batch_id)
        batch["temperature_logs"] = get_temperature_logs(batch_id)
        batch["alerts"] = get_alerts(batch_id)

    return batches


def create_batch(data: Dict[str, Any]) -> Dict[str, Any]:
    payload = {
        key: data.get(key)
        for key in BATCH_FIELDS
        if key in data
    }

    payload.pop("created_at", None)
    payload.pop("updated_at", None)

    result = (
        supabase
        .table("batches")
        .insert(payload)
        .execute()
    )

    if not result.data:
        raise RuntimeError("Failed to create batch in Supabase")

    return result.data[0]


def update_batch(
    batch_id: str,
    updates: Dict[str, Any],
) -> Dict[str, Any]:
    updates = dict(updates)
    updates.pop("batch_id", None)

    result = (
        supabase
        .table("batches")
        .update(updates)
        .eq("batch_id", batch_id)
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            f"Failed to update batch {batch_id}"
        )

    return result.data[0]


def get_batch_history(batch_id: str) -> List[Dict[str, Any]]:
    result = (
        supabase
        .table("batch_history")
        .select("*")
        .eq("batch_id", batch_id)
        .order("timestamp", desc=False)
        .execute()
    )

    return result.data or []


def add_history(
    batch_id: str,
    action: str,
    actor: Optional[str] = None,
    from_org: Optional[str] = None,
    to_org: Optional[str] = None,
    stage: Optional[str] = None,
    blockchain_tx_id: Optional[str] = None,
) -> Dict[str, Any]:

    payload = {
        "batch_id": batch_id,
        "action": action,
        "actor": actor,
        "from_org": from_org,
        "to_org": to_org,
        "stage": stage,
        "blockchain_tx_id": blockchain_tx_id,
    }

    result = (
        supabase
        .table("batch_history")
        .insert(payload)
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            f"Failed to create history for {batch_id}"
        )

    return result.data[0]


def add_temperature(
    batch_id: str,
    temperature: float,
    status: str,
) -> Dict[str, Any]:

    payload = {
        "batch_id": batch_id,
        "temperature": temperature,
        "status": status,
    }

    result = (
        supabase
        .table("temperature_logs")
        .insert(payload)
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            f"Failed to save temperature for {batch_id}"
        )

    return result.data[0]


def get_temperature_logs(
    batch_id: str,
) -> List[Dict[str, Any]]:

    result = (
        supabase
        .table("temperature_logs")
        .select("*")
        .eq("batch_id", batch_id)
        .order("timestamp", desc=False)
        .execute()
    )

    return result.data or []


def add_alert(
    batch_id: str,
    alert_type: str,
    message: str,
    severity: str,
) -> Dict[str, Any]:

    payload = {
        "batch_id": batch_id,
        "type": alert_type,
        "message": message,
        "severity": severity,
    }

    result = (
        supabase
        .table("alerts")
        .insert(payload)
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            f"Failed to save alert for {batch_id}"
        )

    return result.data[0]


def get_alerts(batch_id: str) -> List[Dict[str, Any]]:
    result = (
        supabase
        .table("alerts")
        .select("*")
        .eq("batch_id", batch_id)
        .order("timestamp", desc=False)
        .execute()
    )

    return result.data or []
