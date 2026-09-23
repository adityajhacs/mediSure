"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Package,
  ShieldCheck,
  Thermometer,
  Link2,
  Truck,
  Send,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* =========================================================
   TYPES
   ========================================================= */

type BatchData = {
  id: string;
  medicine: string;
  quantity: string;
  manufacturingDate: string;
  expiryDate: string;
  minTemp: string;
  maxTemp: string;
  manufacturer: string;
  currentOwner: string;
  status: string;
  blockchainTxId: string;
};

type Distributor = {
  id?: number | string;
  name?: string;
  organization_name?: string;
  organizationName?: string;
  org_name?: string;
  orgName?: string;
  fabric_org?: string;
  fabricOrg?: string;
  code?: string;
  type?: string;
  organization_type?: string;
  organizationType?: string;
  org_type?: string;
  role?: string;
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function BatchDetails() {
  const params = useParams<{ batchId: string }>();

  const [showTransfer, setShowTransfer] = useState(false);
  const [transferred, setTransferred] = useState(false);

  const [distributor, setDistributor] = useState("");

  const [distributors, setDistributors] = useState<
    Distributor[]
  >([]);

  const [distributorsLoading, setDistributorsLoading] =
    useState(false);

  const [distributorsError, setDistributorsError] =
    useState("");

  const [transferLoading, setTransferLoading] =
    useState(false);

  const [batch, setBatch] = useState<BatchData | null>(
    null
  );

  const [qrValue, setQrValue] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     AUTH HEADERS
     ========================================================= */

  const getHeaders = (): HeadersInit => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  /* =========================================================
     NORMALIZE BATCH
     ========================================================= */

  const normalizeBatch = (apiBatch: any): BatchData => {
    const realStatus = String(
      apiBatch?.status || "CREATED"
    ).toUpperCase();

    return {
      id:
        apiBatch?.batch_id ||
        apiBatch?.batch_number ||
        String(apiBatch?.id || ""),

      medicine:
        apiBatch?.medicine_name ||
        apiBatch?.medicine ||
        "Unknown Medicine",

      quantity: `${Number(apiBatch?.quantity ?? 0)} units`,

      manufacturingDate: formatDate(
        apiBatch?.manufacturing_date
      ),

      expiryDate: formatDate(apiBatch?.expiry_date),

      minTemp: `${apiBatch?.min_temperature ?? "—"}°C`,

      maxTemp: `${apiBatch?.max_temperature ?? "—"}°C`,

      manufacturer:
        typeof apiBatch?.manufacturer === "string"
          ? apiBatch.manufacturer
          : apiBatch?.manufacturer?.name ||
            apiBatch?.manufacturer_name ||
            "Unknown",

      currentOwner:
        typeof apiBatch?.current_owner === "string"
          ? apiBatch.current_owner
          : apiBatch?.current_owner?.name ||
            apiBatch?.current_owner?.organization_name ||
            "Unknown",

      status: realStatus,

      blockchainTxId:
        apiBatch?.blockchain_tx_id ||
        apiBatch?.transaction_id ||
        apiBatch?.tx_id ||
        "Not available",
    };
  };

  /* =========================================================
     LOAD BATCH
     ========================================================= */

  const loadBatch = async () => {
    if (!params.batchId) return;

    const response = await fetch(
      `${API_URL}/api/batches/${encodeURIComponent(
        params.batchId
      )}`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.detail ||
          data?.message ||
          "Failed to load batch"
      );
    }

    const normalizedBatch = normalizeBatch(data);

    setBatch(normalizedBatch);

    setTransferred(
      normalizedBatch.status === "IN_TRANSIT"
    );

    return normalizedBatch;
  };

  /* =========================================================
     LOAD DISTRIBUTORS
     ========================================================= */

  const loadDistributors = async () => {
    try {
      setDistributorsLoading(true);
      setDistributorsError("");

      const response = await fetch(
        `${API_URL}/api/organizations`,
        {
          method: "GET",
          headers: getHeaders(),
          cache: "no-store",
        }
      );

      const data = await response
        .json()
        .catch(() => []);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to load distributors"
        );
      }

      const organizations: Distributor[] =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.organizations)
          ? data.organizations
          : Array.isArray(data?.data)
          ? data.data
          : [];

      const distributorOrganizations =
        organizations.filter((organization) => {
          const type = String(
            organization?.organization_type ||
              organization?.organizationType ||
              organization?.org_type ||
              organization?.type ||
              organization?.role ||
              ""
          )
            .trim()
            .toUpperCase();

          return type === "DISTRIBUTOR";
        });

      setDistributors(distributorOrganizations);
    } catch (err) {
      console.error(
        "Load distributors error:",
        err
      );

      setDistributorsError(
        err instanceof Error
          ? err.message
          : "Unable to load distributors."
      );

      setDistributors([]);
    } finally {
      setDistributorsLoading(false);
    }
  };

  /* =========================================================
     LOAD QR PAYLOAD
     ========================================================= */

  const loadQrPayload = async () => {
    if (!params.batchId) return;

    try {
      const response = await fetch(
        `${API_URL}/api/batches/${encodeURIComponent(
          params.batchId
        )}/verification-payload`,
        {
          method: "GET",
          headers: getHeaders(),
          cache: "no-store",
        }
      );

      const payloadData = await response
        .json()
        .catch(() => null);

      if (response.ok && payloadData) {
        setQrValue(
          typeof payloadData === "string"
            ? payloadData
            : JSON.stringify(payloadData)
        );
      } else {
        // Do not put an API URL in the QR.
        // The QR should contain a self-contained payload
        // for later offline verification.
        setQrValue("");
      }
    } catch (err) {
      console.error(
        "QR payload error:",
        err
      );

      setQrValue("");
    }
  };

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          loadBatch(),
          loadDistributors(),
          loadQrPayload(),
        ]);
      } catch (err) {
        console.error("Batch details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load batch"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.batchId) {
      loadPage();
    }
  }, [params.batchId]);

  /* =========================================================
     DOWNLOAD QR
     ========================================================= */

  const downloadQR = () => {
    if (!batch || !qrValue) return;

    const svg =
      document.getElementById("medicine-qr");

    if (!svg) return;

    const svgData =
      new XMLSerializer().serializeToString(svg);

    const canvas =
      document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 600, 600);

      ctx.drawImage(
        img,
        50,
        50,
        500,
        500
      );

      const link =
        document.createElement("a");

      link.download = `${batch.id}-QR.png`;

      link.href =
        canvas.toDataURL("image/png");

      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(
        unescape(
          encodeURIComponent(svgData)
        )
      );
  };

  /* =========================================================
     DISTRIBUTOR VALUE
     ========================================================= */

  const getDistributorValue = (
    organization: Distributor
  ) => {
    return (
      organization.fabric_org ||
      organization.fabricOrg ||
      organization.code ||
      organization.organization_name ||
      organization.organizationName ||
      organization.org_name ||
      organization.orgName ||
      organization.name ||
      String(organization.id ?? "")
    );
  };

  /* =========================================================
     DISTRIBUTOR LABEL
     ========================================================= */

  const getDistributorLabel = (
    organization: Distributor
  ) => {
    return (
      organization.organization_name ||
      organization.organizationName ||
      organization.org_name ||
      organization.orgName ||
      organization.name ||
      organization.fabric_org ||
      organization.fabricOrg ||
      `Distributor ${organization.id ?? ""}`
    );
  };

  /* =========================================================
     TRANSFER TO DISTRIBUTOR
     ========================================================= */

  const handleTransfer = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!distributor || !batch) {
      return;
    }

    try {
      setTransferLoading(true);

      const response = await fetch(
        `${API_URL}/api/batches/${encodeURIComponent(
          batch.id
        )}/transfer`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            to_org: distributor,
            stage: "DISTRIBUTOR",
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to transfer batch"
        );
      }

      /*
       * IMPORTANT:
       * Do not trust only the frontend response to decide
       * the final state.
       *
       * Fetch the batch again from M2 so the UI shows
       * the actual backend/DB/Fabric state.
       */

      const updatedBatch = await loadBatch();

      setTransferred(true);
      setShowTransfer(false);
      setDistributor("");

      if (updatedBatch) {
        setBatch(updatedBatch);
      }
    } catch (err) {
      console.error(
        "Transfer error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to transfer batch"
      );
    } finally {
      setTransferLoading(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-[#475467]">
          Loading batch details...
        </p>
      </main>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !batch) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-semibold text-red-600">
            {error || "Batch not found"}
          </p>

          <Link
            href="/manufacturer/batches"
            className="mt-4 inline-block text-[#00A878]"
          >
            Back to Batches
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     DISPLAY STATUS
     ========================================================= */

  const displayStatus =
    batch.status === "IN_TRANSIT"
      ? "IN TRANSIT"
      : batch.status;

  /* =========================================================
     RETURN
     ========================================================= */

  return (
    <main className="min-h-screen bg-white text-[#101828] flex flex-col">
      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-[#E4E7EC] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link
            href="/manufacturer/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight">
                <span className="text-[#101828]">
                  medi
                </span>

                <span className="text-[#F97316]">
                  Sure
                </span>
              </p>

              <p className="text-xs text-[#667085]">
                Manufacturer Portal
              </p>
            </div>
          </Link>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {/* Back */}

        <Link
          href="/manufacturer/batches"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#00A878] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Batches
        </Link>

        {/* Success Message */}

        {transferred && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5">
            <CheckCircle2
              className="mt-0.5 text-[#00A878]"
              size={22}
            />

            <div>
              <p className="font-bold text-[#101828]">
                Shipment Created Successfully
              </p>

              <p className="mt-1 text-sm text-[#475467]">
                {batch.id} has been transferred to{" "}
                <strong>
                  {batch.currentOwner}
                </strong>
                .
              </p>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#ECFDF5] p-3">
              <Package
                size={28}
                className="text-[#00A878]"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-[#667085]">
                Batch Details
              </p>

              <h1 className="text-3xl font-bold text-[#101828]">
                {batch.medicine}
              </h1>

              <p className="mt-1 font-medium text-[#00A878]">
                {batch.id}
              </p>
            </div>
          </div>

          {/* Status */}

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              batch.status === "IN_TRANSIT"
                ? "bg-[#FFF7ED] text-[#F97316]"
                : "bg-[#ECFDF5] text-[#00A878]"
            }`}
          >
            {displayStatus}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ================= LEFT ================= */}

          <div className="space-y-6 lg:col-span-2">
            {/* ================= BATCH INFORMATION ================= */}

            <div className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-7">
              <h2 className="mb-5 text-xl font-bold text-[#101828]">
                Batch Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Detail
                  label="Batch ID"
                  value={batch.id}
                />

                <Detail
                  label="Quantity"
                  value={batch.quantity}
                />

                <Detail
                  label="Manufacturing Date"
                  value={
                    batch.manufacturingDate
                  }
                />

                <Detail
                  label="Expiry Date"
                  value={batch.expiryDate}
                />

                <Detail
                  label="Manufacturer"
                  value={batch.manufacturer}
                />

                <Detail
                  label="Current Owner"
                  value={batch.currentOwner}
                />

                <Detail
                  label="Storage Temperature"
                  value={`${batch.minTemp} – ${batch.maxTemp}`}
                />

                <Detail
                  label="Blockchain Transaction"
                  value={batch.blockchainTxId}
                />
              </div>
            </div>

            {/* ================= TRACEABILITY ================= */}

            <div className="rounded-2xl border border-[#E4E7EC] bg-white p-7">
              <h2 className="mb-5 text-xl font-bold text-[#101828]">
                Traceability Status
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatusCard
                  icon={
                    <ShieldCheck size={20} />
                  }
                  title="Unique Identity"
                  text={
                    qrValue
                      ? "QR assigned"
                      : "QR unavailable"
                  }
                />

                <StatusCard
                  icon={
                    <Link2 size={20} />
                  }
                  title="Blockchain"
                  text={
                    batch.blockchainTxId !==
                    "Not available"
                      ? "Record created"
                      : "Pending"
                  }
                />

                <StatusCard
                  icon={
                    <Thermometer size={20} />
                  }
                  title="Cold Chain"
                  text={`${batch.minTemp} – ${batch.maxTemp}`}
                />
              </div>
            </div>

            {/* ================= TRANSFER ================= */}

            {!transferred && (
              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-7">
                {!showTransfer ? (
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[#101828]">
                        Transfer Batch
                      </h2>

                      <p className="mt-1 text-sm text-[#475467]">
                        Send this batch to a registered
                        distributor.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowTransfer(true)
                      }
                      disabled={
                        distributorsLoading ||
                        distributors.length === 0
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Truck size={19} />

                      {distributorsLoading
                        ? "Loading Distributors..."
                        : "Transfer to Distributor"}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleTransfer}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-[#101828]">
                        Transfer to Distributor
                      </h2>

                      <p className="mt-1 text-sm text-[#475467]">
                        Select a registered distributor
                        receiving this shipment.
                      </p>
                    </div>

                    {/* Distributor Error */}

                    {distributorsError && (
                      <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                          {distributorsError}
                        </p>
                      </div>
                    )}

                    {/* Distributor */}

                    <label className="mb-2 block text-sm font-semibold text-[#101828]">
                      Distributor{" "}
                      <span className="text-[#F97316]">
                        *
                      </span>
                    </label>

                    <div className="relative w-full">
                      <select
                        value={distributor}
                        onChange={(e) =>
                          setDistributor(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          distributorsLoading ||
                          transferLoading
                        }
                        className="w-full appearance-none rounded-xl border border-[#00A878] bg-white px-4 py-3 pr-12 text-[#101828] outline-none transition focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                      >
                        <option value="">
                          {distributorsLoading
                            ? "Loading distributors..."
                            : distributors.length ===
                              0
                            ? "No registered distributors"
                            : "Select distributor"}
                        </option>

                        {distributors.map(
                          (organization) => {
                            const value =
                              getDistributorValue(
                                organization
                              );

                            const label =
                              getDistributorLabel(
                                organization
                              );

                            return (
                              <option
                                key={
                                  String(
                                    organization.id ??
                                      value
                                  )
                                }
                                value={value}
                              >
                                {label}
                              </option>
                            );
                          }
                        )}
                      </select>

                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#344054]">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>

                    {/* Buttons */}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={
                          !distributor ||
                          transferLoading ||
                          distributorsLoading
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={18} />

                        {transferLoading
                          ? "Transferring..."
                          : "Confirm Transfer"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowTransfer(
                            false
                          );
                          setDistributor("");
                        }}
                        disabled={
                          transferLoading
                        }
                        className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-5 py-3 font-semibold text-[#008F6B] transition hover:bg-[#D1FAE5] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ================= TRANSFER COMPLETE ================= */}

            {transferred && (
              <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-7">
                <div className="flex items-start gap-3">
                  <Truck
                    className="mt-0.5 text-[#00A878]"
                    size={24}
                  />

                  <div>
                    <h2 className="font-bold text-[#101828]">
                      Shipment In Transit
                    </h2>

                    <p className="mt-1 text-sm text-[#475467]">
                      Destination:{" "}
                      <strong>
                        {batch.currentOwner}
                      </strong>
                    </p>

                    <p className="mt-1 text-sm text-[#475467]">
                      Batch ownership transfer
                      has been initiated.
                    </p>

                    {batch.blockchainTxId !==
                      "Not available" && (
                      <p className="mt-2 break-all text-xs text-[#667085]">
                        Transaction:{" "}
                        {batch.blockchainTxId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= QR ================= */}

          <div className="h-fit rounded-2xl border border-[#E4E7EC] bg-white p-7 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-[#475467]">
                Unique Medicine QR
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#101828]">
                Medicine Batch QR
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm text-[#667085]">
                Unique QR generated for this medicine
                batch.
              </p>

              <div className="mx-auto mt-6 flex min-h-[242px] w-fit items-center justify-center rounded-2xl border border-[#E4E7EC] bg-white p-4">
                {qrValue ? (
                  <QRCodeSVG
                    id="medicine-qr"
                    value={qrValue}
                    size={210}
                    level="H"
                    includeMargin
                  />
                ) : (
                  <div className="flex h-[210px] w-[210px] flex-col items-center justify-center px-4 text-center text-sm text-[#667085]">
                    Verification QR payload
                    unavailable.
                  </div>
                )}
              </div>

              <p className="mt-4 break-all text-xs text-[#667085]">
                {batch.id}
              </p>

              <button
                type="button"
                onClick={downloadQR}
                disabled={!qrValue}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={19} />
                Download QR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-[#101828] bg-[#101828] px-6 py-8 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A878] text-white">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="font-bold text-white">
                <span>medi</span>
                <span className="text-[#F97316]">
                  Sure
                </span>
              </p>

              <p className="text-xs text-[#98A2B3]">
                Scan. Trace. Trust.
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-[#98A2B3]">
            © 2026 MediSure. All rights reserved.
          </div>

          <div className="text-center text-sm font-medium text-[#D0D5DD] md:text-right">
            Secure • Transparent • Traceable
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(value: unknown): string {
  if (!value) return "—";

  const parsed = new Date(String(value));

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   DETAIL CARD
   ========================================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
      <p className="text-sm font-medium text-[#667085]">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-[#101828]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   TRACEABILITY CARD
   ========================================================= */

function StatusCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        relative z-10
        rounded-xl
        border border-[#E4E7EC]
        bg-[#F8FAFC]
        p-4
        transition-all
        duration-300
        ease-out
        hover:-translate-y-2
        hover:border-[#00A878]
        hover:bg-[#ECFDF5]
        hover:shadow-lg
      "
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="text-[#00A878]">
          {icon}
        </div>

        <span className="font-semibold text-[#101828]">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-[#475467]">
        <CheckCircle2
          size={16}
          className="text-[#00A878]"
        />

        {text}
      </div>
    </div>
  );
}

/* =========================================================
   ORGANIZATION HELPERS
   ========================================================= */

function getDistributorValue(
  organization: Distributor
): string {
  return (
    organization.fabric_org ||
    organization.fabricOrg ||
    organization.code ||
    organization.organization_name ||
    organization.organizationName ||
    organization.org_name ||
    organization.orgName ||
    organization.name ||
    String(organization.id ?? "")
  );
}

function getDistributorLabel(
  organization: Distributor
): string {
  return (
    organization.organization_name ||
    organization.organizationName ||
    organization.org_name ||
    organization.orgName ||
    organization.name ||
    organization.fabric_org ||
    organization.fabricOrg ||
    `Distributor ${organization.id ?? ""}`
  );
}