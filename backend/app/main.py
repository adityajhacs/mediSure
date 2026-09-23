from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    BatchCreateRequest,
    TransferRequest,
    ReceiveRequest,
    TemperatureRequest,
)
from app.services import blockchain_service
from app.services import supabase_service as db
from app.services.verification import verify_batch


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="MediTrace Backend",
    description="Blockchain-based traceable drug supply chain MVP",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HELPER
# =========================================================

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_full_batch_or_404(batch_id: str):
    batch = db.get_batch_full(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    return batch


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "MediTrace Backend is running",
        "status": "OK",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MediTrace Backend",
        "version": "1.0.0",
    }


# =========================================================
# GET ALL BATCHES
# =========================================================

@app.get("/api/batches")
def get_all_batches():
    batches = db.get_all_batches_full()

    return {
        "count": len(batches),
        "batches": batches,
    }


# =========================================================
# CREATE BATCH
# =========================================================

@app.post("/api/batches")
def create_batch(request: BatchCreateRequest):

    existing = db.get_batch(request.batch_number)

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Batch already exists",
        )

    if request.expiry_date <= request.manufacturing_date:
        raise HTTPException(
            status_code=400,
            detail="Expiry date must be after manufacturing date",
        )

    if request.min_temperature >= request.max_temperature:
        raise HTTPException(
            status_code=400,
            detail="Minimum temperature must be lower than maximum temperature",
        )

    try:
        blockchain_tx_id = blockchain_service.create_batch(
            batch_id=request.batch_number,
            medicine_name=request.medicine_name,
            quantity=request.quantity,
            manufacturer=request.manufacturer,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Blockchain CreateBatch failed: {exc}",
        ) from exc

    created_at = now_iso()

    batch_data = {
        "batch_id": request.batch_number,
        "medicine_name": request.medicine_name,
        "quantity": request.quantity,
        "manufacturing_date": str(request.manufacturing_date),
        "expiry_date": str(request.expiry_date),
        "min_temperature": request.min_temperature,
        "max_temperature": request.max_temperature,
        "manufacturer": request.manufacturer,
        "distributor": None,
        "pharmacy": None,
        "current_owner": request.manufacturer,
        "pending_receiver": None,
        "pending_stage": None,
        "status": "CREATED",
        "blockchain_verified": True,
        "blockchain_tx_id": blockchain_tx_id,
        "temperature_status": "SAFE",
        "qr_code": request.batch_number,
        "created_at": created_at,
    }

    try:
        db.create_batch(batch_data)

        db.add_history(
            batch_id=request.batch_number,
            action="CREATED",
            actor=request.manufacturer,
            blockchain_tx_id=blockchain_tx_id,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Database save failed after blockchain transaction: {exc}",
        ) from exc

    return {
        "success": True,
        "message": "Batch created successfully",
        "batch_id": request.batch_number,
        "status": "CREATED",
        "qr_code": request.batch_number,
        "blockchain_tx_id": blockchain_tx_id,
    }


# =========================================================
# GET SINGLE BATCH
# =========================================================

@app.get("/api/batches/{batch_id}")
def get_batch(batch_id: str):
    return get_full_batch_or_404(batch_id)


# =========================================================
# TRANSFER BATCH
# =========================================================

@app.post("/api/batches/{batch_id}/transfer")
def transfer_batch(
    batch_id: str,
    request: TransferRequest,
):

    batch = get_full_batch_or_404(batch_id)

    # -----------------------------------------------------
    # Manufacturer → Distributor
    # -----------------------------------------------------

    if (
        batch["status"] == "CREATED"
        and request.stage == "DISTRIBUTOR"
    ):

        from_org = batch["current_owner"]

        try:
            tx_id = blockchain_service.transfer_batch(
                batch_id,
                from_org,
                request.to_org,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Blockchain TransferBatch failed: {exc}",
            ) from exc

        db.update_batch(
            batch_id,
            {
                "current_owner": request.to_org,
                "pending_receiver": request.to_org,
                "pending_stage": "DISTRIBUTOR",
                "status": "IN_TRANSIT",
                "blockchain_verified": True,
                "blockchain_tx_id": tx_id,
            },
        )

        db.add_history(
            batch_id=batch_id,
            action="TRANSFERRED",
            from_org=from_org,
            to_org=request.to_org,
            stage="DISTRIBUTOR",
            blockchain_tx_id=tx_id,
        )

        return {
            "success": True,
            "batch_id": batch_id,
            "status": "IN_TRANSIT",
            "from": from_org,
            "to": request.to_org,
            "blockchain_tx_id": tx_id,
        }

    # -----------------------------------------------------
    # Distributor → Pharmacy
    # -----------------------------------------------------

    if (
        batch["status"] == "RECEIVED"
        and request.stage == "PHARMACY"
    ):

        from_org = batch["current_owner"]

        try:
            tx_id = blockchain_service.transfer_batch(
                batch_id,
                from_org,
                request.to_org,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Blockchain TransferBatch failed: {exc}",
            ) from exc

        db.update_batch(
            batch_id,
            {
                "current_owner": request.to_org,
                "pending_receiver": request.to_org,
                "pending_stage": "PHARMACY",
                "status": "IN_TRANSIT",
                "blockchain_verified": True,
                "blockchain_tx_id": tx_id,
            },
        )

        db.add_history(
            batch_id=batch_id,
            action="TRANSFERRED",
            from_org=from_org,
            to_org=request.to_org,
            stage="PHARMACY",
            blockchain_tx_id=tx_id,
        )

        return {
            "success": True,
            "batch_id": batch_id,
            "status": "IN_TRANSIT",
            "from": from_org,
            "to": request.to_org,
            "blockchain_tx_id": tx_id,
        }

    raise HTTPException(
        status_code=400,
        detail="Invalid transfer for current batch status/stage",
    )


# =========================================================
# RECEIVE BATCH
# =========================================================

@app.post("/api/batches/{batch_id}/receive")
def receive_batch(
    batch_id: str,
    request: ReceiveRequest,
):

    batch = get_full_batch_or_404(batch_id)

    if batch["status"] != "IN_TRANSIT":
        raise HTTPException(
            status_code=400,
            detail="Batch is not currently in transit",
        )

    if batch["pending_stage"] != request.stage:
        raise HTTPException(
            status_code=400,
            detail="Receiving stage does not match transfer stage",
        )

    if batch["pending_receiver"] != request.received_by:
        raise HTTPException(
            status_code=400,
            detail="Receiver does not match pending receiver",
        )

    try:
        receive_tx_id = blockchain_service.receive_batch(
            batch_id,
            request.received_by,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Blockchain ReceiveBatch failed: {exc}",
        ) from exc

    if request.stage == "DISTRIBUTOR":

        db.update_batch(
            batch_id,
            {
                "distributor": request.received_by,
                "current_owner": request.received_by,
                "status": "RECEIVED",
                "pending_receiver": None,
                "pending_stage": None,
                "blockchain_verified": True,
                "blockchain_tx_id": receive_tx_id,
            },
        )

    elif request.stage == "PHARMACY":

        try:
            pharmacy_tx_id = blockchain_service.mark_at_pharmacy(
                batch_id
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail=(
                    "Batch was received on blockchain, "
                    f"but MarkAtPharmacy failed: {exc}"
                ),
            ) from exc

        db.update_batch(
            batch_id,
            {
                "pharmacy": request.received_by,
                "current_owner": request.received_by,
                "status": "AT_PHARMACY",
                "pending_receiver": None,
                "pending_stage": None,
                "blockchain_verified": True,
                "blockchain_tx_id": pharmacy_tx_id,
            },
        )

        db.add_history(
            batch_id=batch_id,
            action="MARKED_AT_PHARMACY",
            actor=request.received_by,
            stage="PHARMACY",
            blockchain_tx_id=pharmacy_tx_id,
        )

    db.add_history(
        batch_id=batch_id,
        action="RECEIVED",
        actor=request.received_by,
        stage=request.stage,
        blockchain_tx_id=receive_tx_id,
    )

    return {
        "success": True,
        "batch_id": batch_id,
        "status": (
            "RECEIVED"
            if request.stage == "DISTRIBUTOR"
            else "AT_PHARMACY"
        ),
        "received_by": request.received_by,
        "blockchain_tx_id": receive_tx_id,
    }


# =========================================================
# ADD TEMPERATURE
# =========================================================

@app.post("/api/temperature")
def add_temperature(
    request: TemperatureRequest,
):

    batch = db.get_batch(request.batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    minimum = batch["min_temperature"]
    maximum = batch["max_temperature"]

    is_safe = (
        minimum <= request.temperature <= maximum
    )

    temperature_status = (
        "SAFE"
        if is_safe
        else "VIOLATION"
    )

    try:
        db.add_temperature(
            batch_id=request.batch_id,
            temperature=request.temperature,
            status=temperature_status,
        )

        if not is_safe:
            db.add_alert(
                batch_id=request.batch_id,
                alert_type="TEMPERATURE",
                message=(
                    f"Temperature {request.temperature}°C "
                    f"is outside allowed range "
                    f"{minimum}°C - {maximum}°C"
                ),
                severity="HIGH",
            )

            db.update_batch(
                request.batch_id,
                {
                    "temperature_status": "VIOLATION",
                },
            )

        elif batch["temperature_status"] != "VIOLATION":
            db.update_batch(
                request.batch_id,
                {
                    "temperature_status": "SAFE",
                },
            )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save temperature data: {exc}",
        ) from exc

    return {
        "success": True,
        "batch_id": request.batch_id,
        "temperature": request.temperature,
        "temperature_status": temperature_status,
    }


# =========================================================
# GET TEMPERATURE HISTORY
# =========================================================

@app.get("/api/batches/{batch_id}/temperature")
def get_temperature_history(
    batch_id: str,
):

    batch = db.get_batch(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    return {
        "batch_id": batch_id,
        "current_status": batch["temperature_status"],
        "logs": db.get_temperature_logs(batch_id),
        "alerts": db.get_alerts(batch_id),
    }


# =========================================================
# GET BATCH HISTORY
# =========================================================

@app.get("/api/batches/{batch_id}/history")
def get_batch_history(
    batch_id: str,
):

    if not db.get_batch(batch_id):
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    return {
        "batch_id": batch_id,
        "history": db.get_batch_history(batch_id),
    }


# =========================================================
# VERIFY BATCH
# =========================================================

@app.get("/api/verify/{batch_id}")
def verify(batch_id: str):

    batch = db.get_batch_full(batch_id)

    if not batch:
        return {
            "batch_id": batch_id,
            "status": "SUSPICIOUS",
            "reason": "Batch could not be verified",
            "trust_score": 0,
        }

    # -----------------------------------------------------
    # Verify live blockchain state
    # -----------------------------------------------------

    try:
        blockchain_batch = blockchain_service.get_batch(
            batch_id
        )

        batch["blockchain_verified"] = (
            blockchain_batch.get("batchId") == batch_id
            and blockchain_batch.get("medicineName")
            == batch.get("medicine_name")
            and blockchain_batch.get("quantity")
            == batch.get("quantity")
            and blockchain_batch.get("manufacturer")
            == batch.get("manufacturer")
            and blockchain_batch.get("currentOwner")
            == batch.get("current_owner")
            and blockchain_batch.get("status")
            == batch.get("status")
        )

    except Exception:
        batch["blockchain_verified"] = False

    return verify_batch(batch)