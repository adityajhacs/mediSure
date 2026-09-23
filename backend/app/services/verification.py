def verify_batch(batch: dict) -> dict:
    """
    Checks whether a medicine batch can be verified.

    Verification is based on:
    1. Manufacturer
    2. Distributor
    3. Pharmacy
    4. Blockchain
    5. Cold chain
    6. Complete supply-chain status
    """

    manufacturer_verified = bool(
        batch.get("manufacturer")
    )

    distributor_verified = bool(
        batch.get("distributor")
    )

    pharmacy_verified = bool(
        batch.get("pharmacy")
    )

    blockchain_verified = bool(
        batch.get("blockchain_verified")
    )

    cold_chain_verified = (
        batch.get("temperature_status") == "SAFE"
    )

    # -----------------------------
    # Trust Score
    # -----------------------------

    trust_score = 0

    if manufacturer_verified:
        trust_score += 20

    if distributor_verified:
        trust_score += 20

    if pharmacy_verified:
        trust_score += 20

    if blockchain_verified:
        trust_score += 20

    if cold_chain_verified:
        trust_score += 20

    # -----------------------------
    # Final verification
    # -----------------------------

    supply_chain_complete = (
        batch.get("status") in ["AT_PHARMACY", "AVAILABLE"]
    )

    verified = (
        manufacturer_verified
        and distributor_verified
        and pharmacy_verified
        and blockchain_verified
        and cold_chain_verified
        and supply_chain_complete
    )

    status = "VERIFIED" if verified else "SUSPICIOUS"

    # -----------------------------
    # Reasons
    # -----------------------------

    reasons = []

    if not manufacturer_verified:
        reasons.append(
            "Manufacturer information is missing"
        )

    if not distributor_verified:
        reasons.append(
            "Distributor has not received the batch"
        )

    if not pharmacy_verified:
        reasons.append(
            "Pharmacy has not received the batch"
        )

    if not blockchain_verified:
        reasons.append(
            "Blockchain verification failed"
        )

    if not cold_chain_verified:
        reasons.append(
            "Cold-chain requirement was violated"
        )

    if not supply_chain_complete:
        reasons.append(
            "Supply chain is not complete"
        )

    return {
        "batch_id": batch["batch_id"],
        "medicine_name": batch["medicine_name"],

        "status": status,

        "manufacturer": batch["manufacturer"],
        "distributor": batch["distributor"],
        "pharmacy": batch["pharmacy"],

        "manufacturer_verified": manufacturer_verified,
        "distributor_verified": distributor_verified,
        "pharmacy_verified": pharmacy_verified,
        "blockchain_verified": blockchain_verified,
        "cold_chain_verified": cold_chain_verified,

        "temperature_status": batch["temperature_status"],

        "trust_score": trust_score,

        "reasons": reasons
    }