import hashlib
import hmac
import json
import os

from dotenv import load_dotenv

load_dotenv()

QR_SIGNING_SECRET = os.getenv("QR_SIGNING_SECRET")

if not QR_SIGNING_SECRET:
    raise RuntimeError("QR_SIGNING_SECRET is missing")


def _canonical_payload(payload: dict) -> bytes:
    return json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def generate_qr_proof(payload: dict) -> tuple[str, str]:
    data = _canonical_payload(payload)

    commitment = hashlib.sha256(data).hexdigest()

    proof = hmac.new(
        QR_SIGNING_SECRET.encode("utf-8"),
        data,
        hashlib.sha256,
    ).hexdigest()

    return commitment, proof


def verify_qr_proof(
    payload: dict,
    commitment: str,
    proof: str,
) -> bool:
    expected_commitment, expected_proof = (
        generate_qr_proof(payload)
    )

    return (
        hmac.compare_digest(
            expected_commitment,
            commitment,
        )
        and hmac.compare_digest(
            expected_proof,
            proof,
        )
    )
