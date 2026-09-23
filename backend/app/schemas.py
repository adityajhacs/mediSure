from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


class BatchCreateRequest(BaseModel):
    medicine_name: str = Field(..., min_length=2)
    batch_number: str = Field(..., min_length=2)
    quantity: int = Field(..., gt=0)

    medicine_id: int | None = None
    manufacturer_id: int | None = None

    manufacturing_date: date
    expiry_date: date

    min_temperature: float
    max_temperature: float

    manufacturer: str = Field(..., min_length=2)

class TransferRequest(BaseModel):
    to_org: str = Field(..., min_length=2)
    stage: Literal["DISTRIBUTOR", "PHARMACY"]


class ReceiveRequest(BaseModel):
    received_by: str = Field(..., min_length=2)
    stage: Literal["DISTRIBUTOR", "PHARMACY"]


class TemperatureRequest(BaseModel):
    batch_id: str
    temperature: float
    location: str | None = None
# =========================================================
# AUTH SCHEMAS
# =========================================================

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2)
    organization: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    role: Literal["MANUFACTURER", "DISTRIBUTOR", "PHARMACY"]


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
# =========================================================
# MEDICINE SCHEMAS
# =========================================================

# =========================================================
# MEDICINE SCHEMAS
# =========================================================

class MedicineCreateRequest(BaseModel):
    medicine_name: str = Field(..., min_length=2)
    medicine_type: str = Field(..., min_length=2)
    manufacturer: str = Field(..., min_length=2)
    min_temperature: float
    max_temperature: float


# =========================================================
# ORGANIZATION SCHEMAS
# =========================================================

class OrganizationCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)
    type: Literal[
        "MANUFACTURER",
        "DISTRIBUTOR",
        "PHARMACY",
    ]
    license_number: str = Field(..., min_length=2)
    address: str = Field(..., min_length=2)


# =========================================================
# PRODUCT SCHEMAS
# =========================================================

class ProductCreateRequest(BaseModel):
    product_id: str = Field(..., min_length=2)
    batch_id: str = Field(..., min_length=2)
    serial_number: str = Field(..., min_length=2)
    qr_payload: str = Field(..., min_length=2)
    status: Literal[
        "ACTIVE",
        "SOLD",
        "RECALLED",
    ] = "ACTIVE"
