from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    BatchCreateRequest,
    TransferRequest,
    ReceiveRequest,
    TemperatureRequest,
    RegisterRequest,
    LoginRequest,
)

from app.data_store import batches, users

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)



from app.services import blockchain_service
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
# AUTHENTICATION
# =========================================================

@app.post("/api/auth/register")
def register_user(request: RegisterRequest):

    email = request.email.lower().strip()

    # Check if email already exists
    if email in users:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create user
    users[email] = {
        "full_name": request.full_name,
        "organization": request.organization,
        "email": email,
        "password": hash_password(request.password),
        "role": request.role,
    }

    return {
        "success": True,
        "message": "Registration successful",
        "user": {
            "full_name": request.full_name,
            "organization": request.organization,
            "email": email,
            "role": request.role,
        }
    }


@app.post("/api/auth/login")
def login_user(request: LoginRequest):

    email = request.email.lower().strip()

    user = users.get(email)

    # User doesn't exist
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Password check
    if not verify_password(
        request.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT
    token = create_access_token({
        "sub": email,
        "role": user["role"],
    })

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "full_name": user["full_name"],
            "organization": user["organization"],
            "email": user["email"],
            "role": user["role"],
        }
    }


@app.get("/api/auth/me")
def get_current_user(
    authorization: str | None = Header(default=None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    # Expected format:
    # Bearer <token>

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    email = payload.get("sub")

    user = users.get(email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "success": True,
        "user": {
            "full_name": user["full_name"],
            "organization": user["organization"],
            "email": user["email"],
            "role": user["role"],
        }
    }


# =========================================================
# HELPER
# =========================================================

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# =========================================================
# ROOT API
# =========================================================

@app.get("/")
def root():
    return {
        "message": "MediTrace Backend is running",
        "status": "OK"
    }
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MediTrace Backend",
        "version": "1.0.0"
    }

# =========================================================
# GET ALL BATCHES
# =========================================================

@app.get("/api/batches")
def get_all_batches():

    return {
        "count": len(batches),
        "batches": list(batches.values())
    }


# =========================================================
# CREATE BATCH
# =========================================================

@app.post("/api/batches")
def create_batch(request: BatchCreateRequest):

    # Check duplicate batch
    if request.batch_number in batches:
        raise HTTPException(
            status_code=409,
            detail="Batch already exists"
        )

    # Validate dates
    if request.expiry_date <= request.manufacturing_date:
        raise HTTPException(
            status_code=400,
            detail="Expiry date must be after manufacturing date"
        )

    # Validate temperature range
    if request.min_temperature >= request.max_temperature:
        raise HTTPException(
            status_code=400,
            detail="Minimum temperature must be lower than maximum temperature"
        )

    # Call mock blockchain
    blockchain_tx_id = blockchain_service.create_batch(
        request.batch_number
    )

    # Create batch object
    batch = {
        "batch_id": request.batch_number,

        "medicine_name": request.medicine_name,

        "quantity": request.quantity,

        "manufacturing_date": str(
            request.manufacturing_date
        ),

        "expiry_date": str(
            request.expiry_date
        ),

        "min_temperature": request.min_temperature,

        "max_temperature": request.max_temperature,

        # Supply chain
        "manufacturer": request.manufacturer,
        "distributor": None,
        "pharmacy": None,

        # Ownership
        "current_owner": request.manufacturer,

        # Pending transfer
        "pending_receiver": None,
        "pending_stage": None,

        # Status
        "status": "CREATED",

        # Blockchain
        "blockchain_verified": True,
        "blockchain_tx_id": blockchain_tx_id,

        # Temperature
        "temperature_status": "SAFE",
        "temperature_logs": [],
        "alerts": [],

        # QR code
        "qr_code": request.batch_number,

        # History
        "history": [
            {
                "action": "CREATED",
                "actor": request.manufacturer,
                "timestamp": now_iso(),
                "blockchain_tx_id": blockchain_tx_id
            }
        ],

        "created_at": now_iso()
    }

    # Save temporarily
    batches[request.batch_number] = batch

    return {
        "success": True,
        "message": "Batch created successfully",
        "batch_id": request.batch_number,
        "status": "CREATED",
        "qr_code": request.batch_number,
        "blockchain_tx_id": blockchain_tx_id
    }


# =========================================================
# GET SINGLE BATCH
# =========================================================

@app.get("/api/batches/{batch_id}")
def get_batch(batch_id: str):

    batch = batches.get(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    return batch


# =========================================================
# TRANSFER BATCH
# =========================================================

@app.post("/api/batches/{batch_id}/transfer")
def transfer_batch(
    batch_id: str,
    request: TransferRequest
):

    batch = batches.get(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    # -----------------------------------------------------
    # Manufacturer → Distributor
    # -----------------------------------------------------

    if (
        batch["status"] == "CREATED"
        and request.stage == "DISTRIBUTOR"
    ):

        from_org = batch["current_owner"]

        tx_id = blockchain_service.transfer_batch(
            batch_id,
            from_org,
            request.to_org
        )

        batch["pending_receiver"] = request.to_org
        batch["pending_stage"] = "DISTRIBUTOR"
        batch["status"] = "IN_TRANSIT"

        batch["history"].append({
            "action": "TRANSFERRED",
            "from": from_org,
            "to": request.to_org,
            "timestamp": now_iso(),
            "blockchain_tx_id": tx_id
        })

        return {
            "success": True,
            "batch_id": batch_id,
            "status": "IN_TRANSIT",
            "from": from_org,
            "to": request.to_org,
            "blockchain_tx_id": tx_id
        }


    # -----------------------------------------------------
    # Distributor → Pharmacy
    # -----------------------------------------------------

    if (
        batch["status"] == "RECEIVED"
        and request.stage == "PHARMACY"
    ):

        from_org = batch["current_owner"]

        tx_id = blockchain_service.transfer_batch(
            batch_id,
            from_org,
            request.to_org
        )

        batch["pending_receiver"] = request.to_org
        batch["pending_stage"] = "PHARMACY"
        batch["status"] = "IN_TRANSIT"

        batch["history"].append({
            "action": "TRANSFERRED",
            "from": from_org,
            "to": request.to_org,
            "timestamp": now_iso(),
            "blockchain_tx_id": tx_id
        })

        return {
            "success": True,
            "batch_id": batch_id,
            "status": "IN_TRANSIT",
            "from": from_org,
            "to": request.to_org,
            "blockchain_tx_id": tx_id
        }


    raise HTTPException(
        status_code=400,
        detail="Invalid transfer for current batch status/stage"
    )


# =========================================================
# RECEIVE BATCH
# =========================================================

@app.post("/api/batches/{batch_id}/receive")
def receive_batch(
    batch_id: str,
    request: ReceiveRequest
):

    batch = batches.get(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    # Must be in transit
    if batch["status"] != "IN_TRANSIT":
        raise HTTPException(
            status_code=400,
            detail="Batch is not currently in transit"
        )

    # Check stage
    if batch["pending_stage"] != request.stage:
        raise HTTPException(
            status_code=400,
            detail="Receiving stage does not match transfer stage"
        )

    # Check receiver
    if batch["pending_receiver"] != request.received_by:
        raise HTTPException(
            status_code=400,
            detail="Receiver does not match pending receiver"
        )

    # Blockchain receive
    tx_id = blockchain_service.receive_batch(
        batch_id,
        request.received_by
    )

    # -----------------------------------------------------
    # Distributor receives
    # -----------------------------------------------------

    if request.stage == "DISTRIBUTOR":

        batch["distributor"] = request.received_by
        batch["current_owner"] = request.received_by
        batch["status"] = "RECEIVED"


    # -----------------------------------------------------
    # Pharmacy receives
    # -----------------------------------------------------

    elif request.stage == "PHARMACY":

        batch["pharmacy"] = request.received_by
        batch["current_owner"] = request.received_by
        batch["status"] = "AT_PHARMACY"


    batch["pending_receiver"] = None
    batch["pending_stage"] = None

    batch["history"].append({
        "action": "RECEIVED",
        "actor": request.received_by,
        "stage": request.stage,
        "timestamp": now_iso(),
        "blockchain_tx_id": tx_id
    })

    return {
        "success": True,
        "batch_id": batch_id,
        "status": batch["status"],
        "received_by": request.received_by,
        "blockchain_tx_id": tx_id
    }


# =========================================================
# ADD TEMPERATURE
# =========================================================

@app.post("/api/temperature")
def add_temperature(
    request: TemperatureRequest
):

    batch = batches.get(request.batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    minimum = batch["min_temperature"]
    maximum = batch["max_temperature"]

    # Check temperature range
    is_safe = (
        minimum <= request.temperature <= maximum
    )

    temperature_status = (
        "SAFE"
        if is_safe
        else "VIOLATION"
    )

    # Create temperature log
    log = {
        "temperature": request.temperature,
        "status": temperature_status,
        "timestamp": now_iso()
    }

    batch["temperature_logs"].append(log)

    # Temperature violation
    if not is_safe:

        batch["temperature_status"] = "VIOLATION"

        batch["alerts"].append({
            "type": "TEMPERATURE",
            "message": (
                f"Temperature {request.temperature}°C "
                f"is outside allowed range "
                f"{minimum}°C - {maximum}°C"
            ),
            "severity": "HIGH",
            "timestamp": now_iso()
        })

    # Safe temperature
    else:

        # Don't remove a previous violation
        if batch["temperature_status"] != "VIOLATION":
            batch["temperature_status"] = "SAFE"

    return {
        "success": True,
        "batch_id": request.batch_id,
        "temperature": request.temperature,
        "temperature_status": temperature_status
    }


# =========================================================
# GET TEMPERATURE HISTORY
# =========================================================

@app.get("/api/batches/{batch_id}/temperature")
def get_temperature_history(
    batch_id: str
):

    batch = batches.get(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    return {
        "batch_id": batch_id,
        "current_status": batch["temperature_status"],
        "logs": batch["temperature_logs"],
        "alerts": batch["alerts"]
    }


# =========================================================
# GET BATCH HISTORY
# =========================================================

@app.get("/api/batches/{batch_id}/history")
def get_batch_history(
    batch_id: str
):

    batch = batches.get(batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    return {
        "batch_id": batch_id,
        "history": batch["history"]
    }


# =========================================================
# VERIFY BATCH
# =========================================================

@app.get("/api/verify/{batch_id}")
def verify(batch_id: str):

    batch = batches.get(batch_id)

    # Fake / unknown QR
    if not batch:

        return {
            "batch_id": batch_id,
            "status": "SUSPICIOUS",
            "reason": "Batch could not be verified",
            "trust_score": 0
        }


    # Existing batch
    return verify_batch(batch)