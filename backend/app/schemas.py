from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


class BatchCreateRequest(BaseModel):
    medicine_name: str = Field(..., min_length=2)
    batch_number: str = Field(..., min_length=2)
    quantity: int = Field(..., gt=0)

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