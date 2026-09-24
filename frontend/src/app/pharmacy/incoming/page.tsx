
"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Package,
  Truck,
  UserRound,
  CheckCircle2,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Batch = {
  batch_id: string;
  id?: string;
  medicine_name?: string;
  medicine?: string;
  batch_number?: string;
  quantity?: number;
  expiry_date?: string;
  distributor?: string;
  current_owner?: string;
  pending_receiver?: string;
  pending_stage?: string;
  status?: string;
};

export default function IncomingMedicines() {
  const [incomingMedicines, setIncomingMedicines] = useState<Batch[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Batch | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [receivingId, setReceivingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadIncomingMedicines = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/batches`);

      if (!response.ok) {
        throw new Error("Failed to fetch incoming medicines");
      }

      const data = await response.json();

      const batches = (data.batches || []).filter(
        (batch: Batch) =>
          String(batch.status || "").toUpperCase() === "IN_TRANSIT"
      );

      setIncomingMedicines(batches);
    } catch (err) {
      console.error("Error loading incoming medicines:", err);
      setError("Unable to load incoming medicines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomingMedicines();
  }, []);

  const handleReceive = async (medicineId: string) => {
    try {
      setReceivingId(medicineId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/batches/${encodeURIComponent(
          medicineId
        )}/receive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to receive medicine"
        );
      }

      // Refresh the incoming list after successful receipt.
      await loadIncomingMedicines();

      // Close modal if the received batch was being viewed.
      if (selectedMedicine?.batch_id === medicineId) {
        setSelectedMedicine(null);
      }
    } catch (err) {
      console.error("Error receiving medicine:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to receive medicine."
      );
    } finally {
      setReceivingId(null);
    }
  };

  const formatExpiry = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const getMedicineName = (medicine: Batch) => {
    return (
      medicine.medicine_name ||
      medicine.medicine ||
      "Unknown Medicine"
    );
  };

  const getBatchNumber = (medicine: Batch) => {
    return (
      medicine.batch_number ||
      medicine.batch_id ||
      "N/A"
    );
  };

  const getDistributor = (medicine: Batch) => {
    return medicine.distributor || "Authorized Distributor";
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                <Package size={15} />
                Pharmacy Inventory
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
                Incoming Medicines
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
                Medicines received from authorized distributors and waiting
                for pharmacy confirmation.
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-5 py-4">
              <p className="text-xs font-medium text-[#667085]">
                Incoming Batches
              </p>

              <p className="mt-1 text-3xl font-bold text-[#00A878]">
                {loading ? "..." : incomingMedicines.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        </section>
      )}

      {/* Medicine Cards */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-10 text-center">
            <Package
              size={40}
              className="mx-auto animate-pulse text-[#00A878]"
            />

            <h2 className="mt-4 text-lg font-bold text-[#101828]">
              Loading incoming medicines...
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Fetching shipments from the distributor.
            </p>
          </div>
        ) : incomingMedicines.length === 0 ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-10 text-center">
            <CheckCircle2
              size={40}
              className="mx-auto text-[#00A878]"
            />

            <h2 className="mt-4 text-lg font-bold text-[#101828]">
              No incoming medicines
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              There are currently no shipments waiting for pharmacy receipt.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {incomingMedicines.map((medicine) => {
              const medicineId = medicine.batch_id;
              const medicineName = getMedicineName(medicine);
              const batchNumber = getBatchNumber(medicine);
              const isReceiving = receivingId === medicineId;

              return (
                <div
                  key={medicineId}
                  className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:shadow-md"
                >
                  {/* Top Row */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
                        <Package size={24} />
                      </div>

                      {/* Medicine Info */}
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold text-[#101828]">
                            {medicineName}
                          </h2>

                          <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#F97316]">
                            IN TRANSIT
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[#667085]">
                          Medicine ID: {medicineId} · Batch:{" "}
                          {batchNumber}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMedicine(medicine)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-5 py-3 text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
                      >
                        View
                        <ArrowRight size={17} />
                      </button>

                      <button
                        type="button"
                        disabled={isReceiving}
                        onClick={() => handleReceive(medicineId)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isReceiving ? "Receiving..." : "Receive"}
                        <Package size={17} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-6 grid gap-4 border-t border-[#E4E7EC] pt-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Batch */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878]">
                        <Package size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#667085]">
                          Batch ID
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#101828]">
                          {batchNumber}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878]">
                        <Package size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#667085]">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#101828]">
                          {Number(medicine.quantity || 0)} units
                        </p>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878]">
                        <CalendarDays size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#667085]">
                          Expiry
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#101828]">
                          {formatExpiry(medicine.expiry_date)}
                        </p>
                      </div>
                    </div>

                    {/* Distributor */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878]">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#667085]">
                          Distributor
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#101828]">
                          {getDistributor(medicine)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#475467]">
                    <MapPin
                      size={17}
                      className="text-[#00A878]"
                    />

                    <span>
                      Currently at:{" "}
                      <span className="font-semibold text-[#101828]">
                        {medicine.current_owner ||
                          medicine.distributor ||
                          "Distribution Center"}
                      </span>
                    </span>

                    <Truck
                      size={17}
                      className="ml-auto text-[#667085]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* View Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 px-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#101828]">
                  {getMedicineName(selectedMedicine)}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Medicine ID: {selectedMedicine.batch_id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedicine(null)}
                className="rounded-lg p-2 text-[#667085] hover:bg-[#F8FAFC]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <Detail
                label="Batch ID"
                value={getBatchNumber(selectedMedicine)}
              />

              <Detail
                label="Quantity"
                value={`${Number(
                  selectedMedicine.quantity || 0
                )} units`}
              />

              <Detail
                label="Expiry"
                value={formatExpiry(
                  selectedMedicine.expiry_date
                )}
              />

              <Detail
                label="Distributor"
                value={getDistributor(selectedMedicine)}
              />

              <Detail
                label="Current Owner"
                value={
                  selectedMedicine.current_owner ||
                  "Distribution Center"
                }
              />

              <Detail
                label="Status"
                value={selectedMedicine.status || "IN_TRANSIT"}
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedMedicine(null)}
              className="mt-6 w-full rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white hover:bg-[#008F68]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E4E7EC] pb-3">
      <span className="text-sm text-[#667085]">{label}</span>

      <span className="text-right text-sm font-semibold text-[#101828]">
        {value}
      </span>
    </div>
  );
}
