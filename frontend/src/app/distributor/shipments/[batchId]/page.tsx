"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  MapPin,
  PackageCheck,
  Send,
  Thermometer,
  Warehouse,
} from "lucide-react";
import {
  DistributorFooter,
  DistributorNav,
  StatusBadge,
  TempBadge,
} from "@/components/distributor/DistributorShell";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Batch = {
  id?: string | number;
  batch_id?: string;
  batch_number?: string;
  medicine_name?: string;
  medicine?: string;
  quantity?: number;
  status?: string;
  current_owner?: string;
  pending_receiver?: string;
  pending_stage?: string;
  manufacturer?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  min_temperature?: number;
  max_temperature?: number;
  temperature_status?: string;
  blockchain_verified?: boolean;
  blockchain_tx_id?: string;
};

type Org = {
  id?: string | number;
  name?: string;
  type?: string;
};

type Temp = {
  temperature?: number;
  status?: string;
  location?: string;
  created_at?: string;
  recorded_at?: string;
  timestamp?: string;
};

type Alert = {
  message?: string;
  created_at?: string;
  type?: string;
};

function listFrom(payload: any, keys: string[]) {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return Array.isArray(payload?.data) ? payload.data : [];
}

function organizationName() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");

    return String(
      u.organization ||
        u.organization_name ||
        u.company_name ||
        u.company ||
        "Distributor"
    );
  } catch {
    return "Distributor";
  }
}

export default function DistributorShipmentDetails() {
  const params = useParams<{ batchId: string }>();
  const batchId = decodeURIComponent(String(params?.batchId || ""));

  const [batch, setBatch] = useState<Batch | null>(null);
  const [temps, setTemps] = useState<Temp[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [pharmacies, setPharmacies] = useState<Org[]>([]);
  const [pharmacy, setPharmacy] = useState("");
  const [temperature, setTemperature] = useState("");
  const [location, setLocation] = useState("Distributor Warehouse");
  const [organization, setOrganization] = useState("Distributor");
  const [loading, setLoading] = useState(true);
  const [receiving, setReceiving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const authHeaders = () => {
    const token = localStorage.getItem("access_token");

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const org = organizationName();
      setOrganization(org);

      const headers = authHeaders();

      const [batchRes, tempRes, orgRes] = await Promise.all([
        fetch(
          `${API_URL}/api/batches/${encodeURIComponent(batchId)}`,
          {
            headers,
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/api/batches/${encodeURIComponent(
            batchId
          )}/temperature`,
          {
            headers,
            cache: "no-store",
          }
        ),

        fetch(`${API_URL}/api/organizations`, {
          headers,
          cache: "no-store",
        }),
      ]);

      if (!batchRes.ok) {
        throw new Error("Failed to load batch details.");
      }

      setBatch(await batchRes.json());

      if (tempRes.ok) {
        const data = await tempRes.json();

        // Backend returns temperature readings inside "logs"
        setTemps(
          listFrom(data, [
            "logs",
            "temperatures",
            "temperature_logs",
            "history",
          ])
        );

        setAlerts(listFrom(data, ["alerts"]));
      } else {
        setTemps([]);
        setAlerts([]);
      }

      if (orgRes.ok) {
        const data = listFrom(
          await orgRes.json(),
          ["organizations", "items"]
        );

        setPharmacies(
          data.filter(
            (o: Org) =>
              String(o.type || "").toUpperCase() === "PHARMACY"
          )
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load batch details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) load();
    /* eslint-disable-line react-hooks/exhaustive-deps */
  }, [batchId]);

  const incoming =
    batch?.status === "IN_TRANSIT" &&
    batch.pending_receiver === organization &&
    batch.pending_stage === "DISTRIBUTOR";

  const received =
    batch?.status === "RECEIVED" &&
    batch.current_owner === organization;

  const range = useMemo(
    () =>
      `${batch?.min_temperature ?? "—"}°C – ${
        batch?.max_temperature ?? "—"
      }°C`,
    [batch]
  );

  const receive = async () => {
    try {
      setReceiving(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_URL}/api/batches/${encodeURIComponent(
          batchId
        )}/receive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({
            received_by: organization,
            stage: "DISTRIBUTOR",
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to receive shipment."
        );
      }

      setMessage(
        "Shipment received successfully. Cold-chain monitoring is now available."
      );

      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to receive shipment."
      );
    } finally {
      setReceiving(false);
    }
  };

  const recordTemperature = async (value?: number) => {
    const next = value ?? Number(temperature);

    if (!Number.isFinite(next)) {
      setError(
        "Enter a valid temperature before recording it."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/api/temperature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          batch_id: batchId,
          temperature: next,
          location,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to record temperature."
        );
      }

      setTemperature("");

      setMessage(
        data?.status === "VIOLATION"
          ? "Temperature violation recorded and an alert was generated."
          : "Safe temperature reading recorded successfully."
      );

      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to record temperature."
      );
    } finally {
      setSaving(false);
    }
  };

  const transfer = async () => {
    if (!pharmacy) {
      setError("Select a registered pharmacy first.");
      return;
    }

    try {
      setTransferring(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_URL}/api/batches/${encodeURIComponent(
          batchId
        )}/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({
            to_org: pharmacy,
            stage: "PHARMACY",
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to transfer batch."
        );
      }

      setMessage(
        `Batch transferred to ${pharmacy}. The shipment is now in transit.`
      );

      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to transfer batch."
      );
    } finally {
      setTransferring(false);
    }
  };

  if (loading && !batch) {
    return (
      <main className="min-h-screen bg-white">
        <DistributorNav />

        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 rounded bg-[#F2F4F7]" />
            <div className="h-12 w-80 rounded bg-[#F2F4F7]" />
            <div className="h-64 rounded-3xl bg-[#F8FAFC]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <DistributorNav />

      <section className="border-b border-[#E4E7EC] bg-[#F8FAFC] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/distributor/shipments"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#00A878] hover:underline"
          >
            <ArrowLeft size={17} />
            Back to Shipments
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#008F68]">
                  SHIPMENT DETAILS
                </span>

                <StatusBadge status={batch?.status} />
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                {batch?.medicine_name ||
                  batch?.medicine ||
                  "Medicine Batch"}
              </h1>

              <p className="mt-3 text-lg text-[#667085]">
                Batch{" "}
                {batch?.batch_number ||
                  batch?.batch_id ||
                  batchId}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#E4E7EC] bg-white px-5 py-4 shadow-sm">
              <Warehouse
                className="text-[#00A878]"
                size={22}
              />

              <div>
                <p className="text-xs text-[#98A2B3]">
                  Current distributor
                </p>

                <p className="font-semibold">
                  {organization}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-sm font-medium text-[#047857]">
              {message}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-3xl border border-[#E4E7EC] bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#667085]">
                    Batch overview
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Supply-chain information
                  </h2>
                </div>

                <div className="rounded-xl bg-[#ECFDF5] p-3 text-[#00A878]">
                  <Boxes size={24} />
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Detail
                  label="Quantity"
                  value={`${Number(
                    batch?.quantity || 0
                  ).toLocaleString()} units`}
                  icon={<Boxes size={17} />}
                />

                <Detail
                  label="Manufacturer"
                  value={batch?.manufacturer || "—"}
                  icon={<Factory size={17} />}
                />

                <Detail
                  label="Manufacturing Date"
                  value={
                    batch?.manufacturing_date || "—"
                  }
                  icon={<ClipboardCheck size={17} />}
                />

                <Detail
                  label="Expiry Date"
                  value={batch?.expiry_date || "—"}
                  icon={<CheckCircle2 size={17} />}
                />

                <Detail
                  label="Current Owner"
                  value={batch?.current_owner || "—"}
                  icon={<Warehouse size={17} />}
                />

                <Detail
                  label="Storage Range"
                  value={range}
                  icon={<Thermometer size={17} />}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
                      Blockchain verification
                    </p>

                    <p className="mt-1 font-semibold">
                      {batch?.blockchain_verified
                        ? "Verified on supply-chain ledger"
                        : "Pending verification"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      batch?.blockchain_verified
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "bg-[#FFF7ED] text-[#C2410C]"
                    }`}
                  >
                    {batch?.blockchain_verified
                      ? "VERIFIED"
                      : "PENDING"}
                  </span>
                </div>

                {batch?.blockchain_tx_id && (
                  <p className="mt-3 break-all text-xs text-[#667085]">
                    Transaction: {batch.blockchain_tx_id}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E4E7EC] bg-[#F8FAFC] p-7 shadow-sm">
              <p className="text-sm text-[#667085]">
                Shipment action
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {incoming
                  ? "Ready to receive"
                  : received
                  ? "Batch received"
                  : "Shipment status"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                {incoming
                  ? "Confirm receipt to move the batch into distributor custody and unlock cold-chain actions."
                  : received
                  ? "This batch is now under your custody. Continue with temperature monitoring and pharmacy handoff."
                  : `Current status: ${
                      batch?.status || "UNKNOWN"
                    }.`}
              </p>

              {incoming && (
                <button
                  onClick={receive}
                  disabled={receiving}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white hover:bg-[#008F68] disabled:opacity-60"
                >
                  <PackageCheck size={18} />

                  {receiving
                    ? "Receiving Shipment..."
                    : "Receive Shipment"}
                </button>
              )}

              {received && (
                <div className="mt-6 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 text-[#00A878]"
                      size={20}
                    />

                    <div>
                      <p className="font-semibold text-[#047857]">
                        Custody confirmed
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#475467]">
                        Temperature monitoring and pharmacy
                        transfer are now available below.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {received && (
            <>
              <div className="rounded-3xl border border-[#E4E7EC] bg-white p-7 shadow-sm">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#008F68]">
                      <Thermometer size={14} />
                      COLD CHAIN
                    </span>

                    <h2 className="mt-3 text-2xl font-bold">
                      Cold Chain Monitoring
                    </h2>

                    <p className="mt-1 text-sm text-[#667085]">
                      Allowed range:{" "}
                      <span className="font-semibold">
                        {range}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs text-[#98A2B3]">
                      Current status
                    </p>

                    <div className="mt-1">
                      <TempBadge
                        status={
                          batch?.temperature_status ||
                          temps[0]?.status ||
                          "SAFE"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-6">
                    <p className="font-semibold">
                      Record a reading
                    </p>

                    <p className="mt-1 text-sm text-[#667085]">
                      Use a warehouse reading or a demo
                      simulation.
                    </p>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Temperature (°C)
                        </label>

                        <div className="relative">
                          <Thermometer
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                          />

                          <input
                            type="number"
                            step="0.1"
                            value={temperature}
                            onChange={(e) =>
                              setTemperature(e.target.value)
                            }
                            placeholder="e.g. 5.2"
                            className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Location
                        </label>

                        <div className="relative">
                          <MapPin
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                          />

                          <input
                            value={location}
                            onChange={(e) =>
                              setLocation(e.target.value)
                            }
                            className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => recordTemperature()}
                      disabled={saving}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white hover:bg-[#008F68] disabled:opacity-60"
                    >
                      <Thermometer size={18} />

                      {saving
                        ? "Recording..."
                        : "Record Temperature"}
                    </button>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() =>
                          recordTemperature(5.2)
                        }
                        disabled={saving}
                        className="rounded-xl border border-[#A7F3D0] bg-white px-4 py-3 text-sm font-semibold text-[#047857] hover:bg-[#ECFDF5]"
                      >
                        Simulate Safe · 5.2°C
                      </button>

                      <button
                        onClick={() =>
                          recordTemperature(9.7)
                        }
                        disabled={saving}
                        className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Simulate Violation · 9.7°C
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          Temperature History
                        </p>

                        <p className="mt-1 text-sm text-[#667085]">
                          Latest readings recorded for this
                          batch.
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#ECFDF5] p-2.5 text-[#00A878]">
                        <ClipboardCheck size={18} />
                      </div>
                    </div>

                    {temps.length === 0 ? (
                      <div className="mt-8 rounded-xl border border-dashed border-[#D0D5DD] p-6 text-center text-sm text-[#667085]">
                        No temperature readings yet.
                      </div>
                    ) : (
                      <div className="mt-5 overflow-hidden rounded-xl border border-[#E4E7EC]">
                        <div className="divide-y divide-[#E4E7EC]">
                          {temps
                            .slice(0, 8)
                            .map((t, i) => (
                              <div
                                key={i}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="font-semibold">
                                    {t.temperature ?? "—"}°C
                                  </p>

                                  <p className="mt-1 text-xs text-[#667085]">
                                    {t.location ||
                                      "Distributor Warehouse"}{" "}
                                    ·{" "}
                                    {t.timestamp ||
                                      t.created_at ||
                                      t.recorded_at ||
                                      "Recorded"}
                                  </p>
                                </div>

                                <TempBadge
                                  status={t.status}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {alerts.length > 0 && (
                      <div className="mt-5 space-y-3">
                        {alerts
                          .slice(0, 3)
                          .map((a, i) => (
                            <div
                              key={i}
                              className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                            >
                              <AlertTriangle
                                className="mt-0.5 text-red-600"
                                size={18}
                              />

                              <div>
                                <p className="text-sm font-semibold text-red-800">
                                  Temperature alert
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                  {a.message ||
                                    "A temperature violation was recorded."}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E4E7EC] bg-[#F8FAFC] p-7 shadow-sm">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
                      <Send size={14} />
                      PHARMACY HANDOFF
                    </span>

                    <h2 className="mt-3 text-2xl font-bold">
                      Transfer to Pharmacy
                    </h2>

                    <p className="mt-1 text-sm text-[#667085]">
                      Select a registered pharmacy from the
                      organization database.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#475467]">
                    {pharmacies.length} registered
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Pharmacy
                    </label>

                    <div className="relative">
                      <Building2
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                      />

                      <select
                        value={pharmacy}
                        onChange={(e) =>
                          setPharmacy(e.target.value)
                        }
                        className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
                      >
                        <option value="">
                          {pharmacies.length
                            ? "Select pharmacy"
                            : "No registered pharmacy found"}
                        </option>

                        {pharmacies.map((p) => (
                          <option
                            key={String(p.id || p.name)}
                            value={p.name || ""}
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={transfer}
                    disabled={
                      transferring ||
                      !pharmacy ||
                      pharmacies.length === 0
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-semibold text-white hover:bg-[#008F68] disabled:opacity-50"
                  >
                    <Send size={18} />

                    {transferring
                      ? "Transferring..."
                      : "Transfer to Pharmacy"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <DistributorFooter />
    </main>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-2 text-[#00A878]">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}