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
    MedicineCreateRequest,
    OrganizationCreateRequest,
    ProductCreateRequest,
)

from app.data_store import batches

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)



from app.services import blockchain_service
from app.services import supabase_service as db
from app.services.verification import verify_batch
from app.services.qr_service import (
    generate_qr_proof,
    verify_qr_proof,
)


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

# =========================================================
# AUTHENTICATION
# =========================================================

@app.post("/api/auth/register")
def register_user(request: RegisterRequest):

    email = request.email.lower().strip()

    existing_user = db.get_user_by_email(email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    try:
        password_hash = hash_password(request.password)

        user = db.create_user(
            full_name=request.full_name,
            organization=request.organization,
            email=email,
            password_hash=password_hash,
            role=request.role,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {exc}",
        ) from exc

    return {
        "success": True,
        "message": "Registration successful",
        "user": {
            "full_name": user["full_name"],
            "organization": user["organization"],
            "email": user["email"],
            "role": user["role"],
        },
    }


@app.post("/api/auth/login")
def login_user(request: LoginRequest):

    email = request.email.lower().strip()

    user = db.get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        request.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

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
        },
    }


@app.get("/api/auth/me")
def get_current_user(
    authorization: str | None = Header(default=None),
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format",
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1,
    ).strip()

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    email = payload.get("sub")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload",
        )

    user = db.get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "success": True,
        "user": {
            "full_name": user["full_name"],
            "organization": user["organization"],
            "email": user["email"],
            "role": user["role"],
        },
    }

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

    medicine = (
        db.get_medicine(request.medicine_id)
        if request.medicine_id
        else db.get_medicine_by_name(request.medicine_name)
    )

    manufacturer_org = (
        db.get_organization(request.manufacturer_id)
        if request.manufacturer_id
        else db.get_organization_by_name(request.manufacturer)
    )

    if request.medicine_id and not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found",
        )

    if request.manufacturer_id and not manufacturer_org:
        raise HTTPException(
            status_code=404,
            detail="Manufacturer organization not found",
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
        "medicine_id": (
            medicine["id"] if medicine else None
        ),
        "manufacturer_id": (
            manufacturer_org["id"]
            if manufacturer_org
            else None
        ),
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
        db.add_temperature_with_location(
            batch_id=request.batch_id,
            temperature=request.temperature,
            status=temperature_status,
            location=request.location,
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
# =========================================================
# MARK BATCH AVAILABLE
# =========================================================

@app.post("/api/batches/{batch_id}/available")
def mark_batch_available(batch_id: str):

    batch = get_full_batch_or_404(batch_id)

    if batch["status"] != "AT_PHARMACY":
        raise HTTPException(
            status_code=400,
            detail="Batch must be at pharmacy before becoming available",
        )

    try:
        tx_id = blockchain_service.mark_available(batch_id)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Blockchain MarkAvailable failed: {exc}",
        ) from exc

    db.update_batch(
        batch_id,
        {
            "status": "AVAILABLE",
            "blockchain_verified": True,
            "blockchain_tx_id": tx_id,
        },
    )

    db.add_history(
        batch_id=batch_id,
        action="MARKED_AVAILABLE",
        actor=batch["current_owner"],
        stage="PHARMACY",
        blockchain_tx_id=tx_id,
    )

    return {
        "success": True,
        "batch_id": batch_id,
        "status": "AVAILABLE",
        "blockchain_tx_id": tx_id,
    }


# =========================================================
# GET ALL ALERTS
# =========================================================

@app.get("/api/alerts")
def get_all_alerts():
    alerts = db.get_all_alerts()

    return {
        "count": len(alerts),
        "alerts": alerts,
    }


# =========================================================
# QR / VERIFICATION PAYLOAD
# =========================================================

@app.get("/api/batches/{batch_id}/verification-payload")
def get_verification_payload(batch_id: str):

    batch = get_full_batch_or_404(batch_id)
    products = db.get_products_by_batch(batch_id)

    product = products[0] if products else None

    response = {
        "version": 1,
        "batch_id": batch["batch_id"],
        "medicine_name": batch["medicine_name"],
        "manufacturer": batch["manufacturer"],
        "current_owner": batch["current_owner"],
        "status": batch["status"],
        "qr_code": batch["qr_code"],
        "verification_endpoint": (
            f"/api/verify/{batch['batch_id']}"
        ),
        "verification_url": (
            f"/api/verify/{batch['batch_id']}"
        ),
    }

    if product:
        response.update({
            "product_id": product["product_id"],
            "serial_number": product["serial_number"],
            "qr_payload": product["qr_payload"],
            "commitment": product.get("qr_commitment"),
            "proof": product.get("qr_proof"),
        })

    return response


# =========================================================
# MEDICINES
# =========================================================

@app.post("/api/medicines")
def create_medicine(request: MedicineCreateRequest):

    try:
        return {
            "success": True,
            "medicine": db.create_medicine({
                "name": request.name,
                "dosage": request.dosage,
                "form": request.form,
            }),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create medicine: {exc}",
        ) from exc


@app.get("/api/medicines")
def get_medicines():
    return {
        "count": len(db.list_medicines()),
        "medicines": db.list_medicines(),
    }


@app.get("/api/medicines/{medicine_id}")
def get_medicine(medicine_id: int):

    medicine = db.get_medicine(medicine_id)

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found",
        )

    return medicine


# =========================================================
# ORGANIZATIONS
# =========================================================

@app.post("/api/organizations")
def create_organization(request: OrganizationCreateRequest):

    try:
        return {
            "success": True,
            "organization": db.create_organization({
                "name": request.name,
                "type": request.type,
                "license_number": request.license_number,
                "address": request.address,
            }),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create organization: {exc}",
        ) from exc


@app.get("/api/organizations")
def get_organizations():
    organizations = db.list_organizations()

    return {
        "count": len(organizations),
        "organizations": organizations,
    }


@app.get("/api/organizations/{organization_id}")
def get_organization(organization_id: int):

    organization = db.get_organization(
        organization_id
    )

    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Organization not found",
        )

    return organization


# =========================================================
# PRODUCTS / QR
# =========================================================

@app.post("/api/products")
def create_product(request: ProductCreateRequest):

    batch = db.get_batch(request.batch_id)

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    existing = db.get_product(request.product_id)

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Product already exists",
        )

    qr_data = {
        "product_id": request.product_id,
        "batch_id": request.batch_id,
        "serial_number": request.serial_number,
        "qr_payload": request.qr_payload,
    }

    qr_commitment, qr_proof = generate_qr_proof(qr_data)

    try:
        product = db.create_product({
            "product_id": request.product_id,
            "batch_id": request.batch_id,
            "serial_number": request.serial_number,
            "qr_payload": request.qr_payload,
            "qr_commitment": qr_commitment,
            "qr_proof": qr_proof,
            "status": request.status,
        })
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create product: {exc}",
        ) from exc

    return {
        "success": True,
        "product": product,
    }


@app.get("/api/products")
def get_products():
    products = db.list_products()

    return {
        "count": len(products),
        "products": products,
    }


@app.get("/api/products/{product_id}")
def get_product(product_id: str):

    product = db.get_product(product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


@app.get("/api/products/{product_id}/verify")
def verify_product(product_id: str):

    product = db.get_product(product_id)

    if not product:
        return {
            "product_id": product_id,
            "status": "SUSPICIOUS",
            "reason": "Product could not be found",
        }

    existing_scans = db.get_scan_history(product_id)
    duplicate_detected = len(existing_scans) > 0

    db.add_scan(
        product_id=product_id,
        scan_source="QR",
    )

    verification = {
        "product_id": product["product_id"],
        "batch_id": product["batch_id"],
        "serial_number": product["serial_number"],
        "qr_payload": product["qr_payload"],
        "product_status": product["status"],
        "duplicate_detected": duplicate_detected,
    }

    qr_data = {
        "product_id": product["product_id"],
        "batch_id": product["batch_id"],
        "serial_number": product["serial_number"],
        "qr_payload": product["qr_payload"],
    }

    qr_verified = False

    if product.get("qr_commitment") and product.get("qr_proof"):
        qr_verified = verify_qr_proof(
            qr_data,
            product["qr_commitment"],
            product["qr_proof"],
        )

    verification["qr_commitment"] = product.get(
        "qr_commitment"
    )
    verification["qr_proof_verified"] = qr_verified
    verification["scan_count"] = len(existing_scans) + 1

    batch = db.get_batch_full(product["batch_id"])

    if not batch:
        verification["status"] = "SUSPICIOUS"
        verification["reason"] = "Linked batch could not be found"
        return verification

    batch_verification = verify_batch(batch)

    verification["batch_verification"] = batch_verification

    final_status = batch_verification["status"]

    if not qr_verified:
        final_status = "SUSPICIOUS"
        verification["reason"] = "QR proof verification failed"

    verification["status"] = final_status

    return verification


# =========================================================
# PRODUCT HISTORY
# =========================================================

@app.get("/api/products/{product_id}/history")
def get_product_history(product_id: str):

    product = db.get_product(product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    batch = db.get_batch(product["batch_id"])

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Linked batch not found",
        )

    return {
        "product_id": product["product_id"],
        "batch_id": product["batch_id"],
        "serial_number": product["serial_number"],
        "history": db.get_batch_history(product["batch_id"]),
        "transactions": db.get_batch_transactions(
            product["batch_id"]
        ),
        "scan_history": db.get_scan_history(
            product["product_id"]
        ),
    }

# =========================================================
# BATCH TRANSACTIONS
# =========================================================

@app.get("/api/batches/{batch_id}/transactions")
def get_batch_transactions(batch_id: str):

    if not db.get_batch(batch_id):
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    transactions = db.get_batch_transactions(batch_id)

    return {
        "batch_id": batch_id,
        "count": len(transactions),
        "transactions": transactions,
    }
