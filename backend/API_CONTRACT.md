# MediTrace API Contract

## Base URL

http://127.0.0.1:8000

---

## 1. Health

GET /api/health

Response:

{
  "status": "healthy",
  "service": "MediTrace Backend",
  "version": "1.0.0"
}

---

## 2. Get All Batches

GET /api/batches

---

## 3. Create Batch

POST /api/batches

Request:

{
  "medicine_name": "Paracetamol 500mg",
  "batch_number": "MED-001",
  "quantity": 1000,
  "manufacturing_date": "2026-09-23",
  "expiry_date": "2028-09-23",
  "min_temperature": 2,
  "max_temperature": 8,
  "manufacturer": "ABC Pharma"
}

---

## 4. Get Batch

GET /api/batches/{batch_id}

Example:

GET /api/batches/MED-001

---

## 5. Transfer Batch

POST /api/batches/{batch_id}/transfer

Request:

{
  "to_org": "XYZ Distributor",
  "stage": "DISTRIBUTOR"
}

For distributor to pharmacy:

{
  "to_org": "ABC Pharmacy",
  "stage": "PHARMACY"
}

---

## 6. Receive Batch

POST /api/batches/{batch_id}/receive

Distributor:

{
  "received_by": "XYZ Distributor",
  "stage": "DISTRIBUTOR"
}

Pharmacy:

{
  "received_by": "ABC Pharmacy",
  "stage": "PHARMACY"
}

---

## 7. Add Temperature

POST /api/temperature

Request:

{
  "batch_id": "MED-001",
  "temperature": 4.2
}

---

## 8. Temperature History

GET /api/batches/{batch_id}/temperature

---

## 9. Batch History

GET /api/batches/{batch_id}/history

---

## 10. Verify Batch

GET /api/verify/{batch_id}

Example:

GET /api/verify/MED-001

Verified response:

{
  "status": "VERIFIED",
  "trust_score": 100
}

Suspicious response:

{
  "status": "SUSPICIOUS",
  "trust_score": 0
}