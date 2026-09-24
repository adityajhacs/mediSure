"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Factory,
  Link2,
  MapPin,
  ShieldCheck,
  Store,
  Truck,
  AlertTriangle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Batch = {
  batch_id?: string;
  medicine_name?: string;
  quantity?: number;
  expiry_date?: string;
  manufacturing_date?: string;
  manufacturer?: string;
  distributor?: string | null;
  pharmacy?: string | null;
  current_owner?: string;
  status?: string;
  blockchain_verified?: boolean;
  blockchain_tx_id?: string;
  temperature_status?: string;
  qr_code?: string;
  created_at?: string;
};

type HistoryItem = {
  action?: string;
  actor?: string;
  from_org?: string;
  to_org?: string;
  stage?: string;
  blockchain_tx_id?: string;
  created_at?: string;
  timestamp?: string;
};

type Verification = {
  status?: string;
  reason?: string;
  trust_score?: number;
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status?: string) {
  if (status === "AVAILABLE") {
    return "bg-[#ECFDF5] text-[#008F68]";
  }

  if (status === "SUSPICIOUS") {
    return "bg-[#FEF2F2] text-[#DC2626]";
  }

  return "bg-[#FFF7ED] text-[#F97316]";
}

function BatchPageContent() {
  const searchParams = useSearchParams();

  const id =
    searchParams.get("id") ||
    searchParams.get("batchId");

  const [batch, setBatch] = useState<Batch | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Batch ID is missing.");
      return;
    }

    async function loadBatchDetails() {
      try {
        setLoading(true);
        setError("");

        const [
          batchResponse,
          historyResponse,
          verificationResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/batches/${encodeURIComponent(id)}`),
          fetch(
            `${API_URL}/api/batches/${encodeURIComponent(id)}/history`
          ),
          fetch(
            `${API_URL}/api/verify/${encodeURIComponent(id)}`
          ),
        ]);

        if (!batchResponse.ok) {
          throw new Error("Batch not found");
        }

        const batchData = await batchResponse.json();

        setBatch(batchData);

        if (historyResponse.ok) {
          const historyData =
            await historyResponse.json();

          setHistory(
            Array.isArray(historyData.history)
              ? historyData.history
              : []
          );
        }

        if (verificationResponse.ok) {
          const verificationData =
            await verificationResponse.json();

          setVerification(verificationData);
        }
      } catch (err) {
        console.error(
          "Failed to load batch details:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load batch details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBatchDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
            <p className="text-sm text-[#667085]">
              Loading medicine details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !batch) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-[#101828]">
            Medicine Not Found
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            {error || "The requested batch could not be found."}
          </p>

          <Link
           href="/pharmacy/inventory"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back to Inventory
          </Link>
        </div>
      </main>
    );
  }

  const batchId = batch.batch_id || id || "N/A";

  const medicineName =
    batch.medicine_name || "Unknown Medicine";

  const status =
    batch.status || "UNKNOWN";

  const manufacturer =
    batch.manufacturer || "Not available";

  const distributor =
    batch.distributor || "Not assigned";

  const pharmacy =
    batch.pharmacy || "Not assigned";

  const isVerified =
    verification?.status === "VERIFIED";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Back */}
       <Link
  href="/pharmacy/inventory"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-[#00A878]"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#101828]">
                {medicineName}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  status
                )}`}
              >
                {status}
              </span>
            </div>

            <p className="mt-2 text-sm text-[#667085]">
              Batch ID: {batchId}
            </p>
          </div>

          <Link
           href={`/pharmacy/verification?id=${encodeURIComponent(batchId)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#008F68]"
          >
            <ShieldCheck size={18} />
            Verify Medicine
          </Link>
        </div>

        {/* Medicine Information */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
            <h2 className="text-lg font-bold text-[#101828]">
              Medicine Information
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
                <span className="text-sm text-[#667085]">
                  Batch ID
                </span>

                <span className="text-sm font-semibold text-[#101828]">
                  {batchId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
                <span className="text-sm text-[#667085]">
                  Quantity
                </span>

                <span className="text-sm font-semibold text-[#101828]">
                  {batch.quantity ?? "N/A"} units
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
                <span className="text-sm text-[#667085]">
                  Manufacturing Date
                </span>

                <span className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
                  <CalendarDays size={16} />
                  {formatDate(batch.manufacturing_date)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#667085]">
                  Expiry Date
                </span>

                <span className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
                  <CalendarDays size={16} />
                  {formatDate(batch.expiry_date)}
                </span>
              </div>

            </div>
          </div>

          {/* Verification Status */}
          <div
            className={`rounded-2xl border p-6 ${
              isVerified
                ? "border-[#A7F3D0] bg-[#ECFDF5]"
                : "border-[#FED7AA] bg-[#FFF7ED]"
            }`}
          >
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                {isVerified ? (
                  <CheckCircle2
                    size={23}
                    className="text-[#00A878]"
                  />
                ) : (
                  <AlertTriangle
                    size={23}
                    className="text-[#F97316]"
                  />
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#101828]">
                  Verification Status
                </h2>

                <p
                  className={`text-sm ${
                    isVerified
                      ? "text-[#008F68]"
                      : "text-[#F97316]"
                  }`}
                >
                  {verification?.status ||
                    "Verification unavailable"}
                </p>
              </div>

            </div>

            <p className="mt-5 text-sm leading-6 text-[#475467]">
              {verification?.reason ||
                (isVerified
                  ? "Supply chain is traceable and the batch passed verification."
                  : "This batch requires verification before authenticity can be confirmed.")}
            </p>

            {verification?.trust_score !== undefined && (
              <p className="mt-3 text-sm font-semibold text-[#475467]">
                Trust Score: {verification.trust_score}
              </p>
            )}
          </div>
        </div>

        {/* Supply Chain */}
        <div className="mt-6 rounded-2xl border border-[#E4E7EC] bg-white p-6">
          <h2 className="text-lg font-bold text-[#101828]">
            Supply Chain Participants
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {/* Manufacturer */}
            <div className="rounded-xl border border-[#E4E7EC] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
                <Factory size={20} />
              </div>

              <p className="mt-4 text-xs font-medium text-[#667085]">
                MANUFACTURER
              </p>

              <h3 className="mt-1 font-bold text-[#101828]">
                {manufacturer}
              </h3>

              <p className="mt-2 flex items-center gap-1 text-xs text-[#667085]">
                <MapPin size={14} />
                Jharkhand
              </p>
            </div>

            {/* Distributor */}
            <div className="rounded-xl border border-[#E4E7EC] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F97316]">
                <Truck size={20} />
              </div>

              <p className="mt-4 text-xs font-medium text-[#667085]">
                DISTRIBUTOR
              </p>

              <h3 className="mt-1 font-bold text-[#101828]">
                {distributor}
              </h3>

              <p className="mt-2 flex items-center gap-1 text-xs text-[#667085]">
                <MapPin size={14} />
                Jharkhand
              </p>
            </div>

            {/* Pharmacy */}
            <div className="rounded-xl border border-[#E4E7EC] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
                <Store size={20} />
              </div>

              <p className="mt-4 text-xs font-medium text-[#667085]">
                PHARMACY
              </p>

              <h3 className="mt-1 font-bold text-[#101828]">
                {pharmacy}
              </h3>

              <p className="mt-2 flex items-center gap-1 text-xs text-[#667085]">
                <MapPin size={14} />
                Jharkhand
              </p>
            </div>

          </div>
        </div>

        {/* History */}
        <div className="mt-6 rounded-2xl border border-[#E4E7EC] bg-white p-6">
          <h2 className="text-lg font-bold text-[#101828]">
            Supply Chain History
          </h2>

          <div className="mt-6 space-y-6">

            {history.length === 0 ? (
              <p className="text-sm text-[#667085]">
                No supply-chain history available.
              </p>
            ) : (
              history.map((item, index) => {
                const action =
                  item.action || "Supply-chain event";

                const actor =
                  item.actor ||
                  item.to_org ||
                  item.from_org ||
                  "Unknown participant";

                const date =
                  item.created_at ||
                  item.timestamp;

                return (
                  <div
                    key={`${action}-${index}`}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#00A878]">
                      {action.includes("TRANSFER") ? (
                        <Truck size={18} />
                      ) : action.includes("PHARMACY") ||
                        action.includes("AVAILABLE") ? (
                        <Store size={18} />
                      ) : (
                        <Factory size={18} />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-[#101828]">
                        {action.replaceAll("_", " ")}
                      </p>

                      <p className="mt-1 text-sm text-[#667085]">
                        {actor}
                        {item.stage
                          ? ` • ${item.stage}`
                          : ""}
                      </p>

                      {date && (
                        <p className="mt-1 text-xs text-[#98A2B3]">
                          {formatDate(date)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* Blockchain */}
        <div className="mt-6 rounded-2xl border border-[#E4E7EC] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
              <Link2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#101828]">
                Blockchain Record
              </h2>

              <p className="text-sm text-[#667085]">
                Immutable supply-chain history
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#F8FAFC] p-4">
            <p className="text-xs text-[#667085]">
              Batch ID
            </p>

            <p className="mt-1 break-all font-mono text-sm font-semibold text-[#101828]">
              {batchId}
            </p>

            {batch.blockchain_tx_id && (
              <>
                <p className="mt-4 text-xs text-[#667085]">
                  Latest Transaction ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-[#475467]">
                  {batch.blockchain_tx_id}
                </p>
              </>
            )}

            <div
              className={`mt-4 flex items-center gap-2 text-sm font-medium ${
                batch.blockchain_verified
                  ? "text-[#008F68]"
                  : "text-[#F97316]"
              }`}
            >
              {batch.blockchain_verified ? (
                <CheckCircle2 size={17} />
              ) : (
                <AlertTriangle size={17} />
              )}

              {batch.blockchain_verified
                ? "Blockchain record verified"
                : "Blockchain verification unavailable"}
            </div>
          </div>
        </div>

      </section>
    </main>
  );
  
}
export default function BatchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
              <p className="text-sm text-[#667085]">
                Loading medicine details...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <BatchPageContent />
    </Suspense>
  );
}