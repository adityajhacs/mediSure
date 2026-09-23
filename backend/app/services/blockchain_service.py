import json
import os
from urllib import request as urllib_request
from urllib.error import HTTPError, URLError

from dotenv import load_dotenv

load_dotenv()

FABRIC_GATEWAY_URL = os.getenv(
    "FABRIC_GATEWAY_URL",
    "http://127.0.0.1:8081",
).rstrip("/")


class FabricGatewayError(RuntimeError):
    """Raised when the Fabric Gateway returns an error."""


def _post(path: str, payload: dict) -> dict:
    url = f"{FABRIC_GATEWAY_URL}{path}"

    body = json.dumps(payload).encode("utf-8")

    req = urllib_request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib_request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            data = json.loads(raw)
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            data = {"error": raw or str(exc)}

        raise FabricGatewayError(
            data.get("error", str(exc))
        ) from exc

    except URLError as exc:
        raise FabricGatewayError(
            f"Fabric Gateway is unavailable at {FABRIC_GATEWAY_URL}: {exc.reason}"
        ) from exc

    if not data.get("success"):
        raise FabricGatewayError(
            data.get("error", "Fabric Gateway request failed")
        )

    return data


def create_batch(
    batch_id: str,
    medicine_name: str,
    quantity: int,
    manufacturer: str,
) -> str:
    result = _post(
        "/submit",
        {
            "function": "CreateBatch",
            "args": [
                batch_id,
                medicine_name,
                str(quantity),
                manufacturer,
            ],
        },
    )

    return result["transaction_id"]


def transfer_batch(
    batch_id: str,
    from_org: str,
    to_org: str,
) -> str:
    result = _post(
        "/submit",
        {
            "function": "TransferBatch",
            "args": [
                batch_id,
                from_org,
                to_org,
            ],
        },
    )

    return result["transaction_id"]


def receive_batch(
    batch_id: str,
    received_by: str,
) -> str:
    result = _post(
        "/submit",
        {
            "function": "ReceiveBatch",
            "args": [
                batch_id,
                received_by,
            ],
        },
    )

    return result["transaction_id"]


def mark_at_pharmacy(batch_id: str) -> str:
    result = _post(
        "/submit",
        {
            "function": "MarkAtPharmacy",
            "args": [batch_id],
        },
    )

    return result["transaction_id"]


def mark_available(batch_id: str) -> str:
    result = _post(
        "/submit",
        {
            "function": "MarkAvailable",
            "args": [batch_id],
        },
    )

    return result["transaction_id"]


def get_batch(batch_id: str):
    result = _post(
        "/evaluate",
        {
            "function": "GetBatch",
            "args": [batch_id],
        },
    )

    return result["result"]


def get_batch_history(batch_id: str):
    result = _post(
        "/evaluate",
        {
            "function": "GetBatchHistory",
            "args": [batch_id],
        },
    )

    return result["result"]


def batch_exists(batch_id: str) -> bool:
    result = _post(
        "/evaluate",
        {
            "function": "BatchExists",
            "args": [batch_id],
        },
    )

    return bool(result["result"])
