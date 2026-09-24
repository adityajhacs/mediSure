"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Factory,
  PackageCheck,
  Thermometer,
  Truck,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import { DistributorFooter, DistributorNav, StatusBadge } from "@/components/distributor/DistributorShell";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
  min_temperature?: number;
  max_temperature?: number;
  temperature_status?: string;
  created_at?: string;
  updated_at?: string;
};

type Alert = {
  id?: string | number;
  batch_id?: string;
  type?: string;
  severity?: string;
  message?: string;
  created_at?: string;
};

function itemsFrom(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    for (const key of ["batches", "alerts", "data", "items"]) {
      if (Array.isArray(p[key])) return p[key] as any[];
    }
  }
  return [];
}

function batchKey(batch: Batch) {
  return String(batch.batch_number || batch.batch_id || batch.id || "");
}

function batchName(batch: Batch) {
  return batch.medicine_name || batch.medicine || "Unknown Medicine";
}

function getUserOrganization() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "Distributor";
    const user = JSON.parse(raw);
    return String(
      user?.organization ||
        user?.organization_name ||
        user?.company_name ||
        user?.company ||
        "Distributor"
    );
  } catch {
    return "Distributor";
  }
}

export default function DistributorDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [organization, setOrganization] = useState("Distributor");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const org = getUserOrganization();
        setOrganization(org);
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const [batchRes, alertRes] = await Promise.all([
          fetch(`${API_URL}/api/batches`, { headers, cache: "no-store" }),
          fetch(`${API_URL}/api/alerts`, { headers, cache: "no-store" }),
        ]);

        if (!batchRes.ok) throw new Error("Failed to load distributor batches.");

        const batchPayload = await batchRes.json();
        setBatches(itemsFrom(batchPayload));
        if (alertRes.ok) {
          setAlerts(itemsFrom(await alertRes.json()));
        } else {
          setAlerts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const relevantBatches = useMemo(
    () =>
      batches.filter(
        (batch) =>
          String(batch.current_owner || "") === organization ||
          String(batch.pending_receiver || "") === organization
      ),
    [batches, organization]
  );

  const incoming = relevantBatches.filter(
    (batch) => batch.status === "IN_TRANSIT" && batch.pending_receiver === organization
  );
  const received = relevantBatches.filter(
    (batch) => batch.status === "RECEIVED" && batch.current_owner === organization
  );
  const inTransit = relevantBatches.filter((batch) => batch.status === "IN_TRANSIT").length;

  const tempAlerts = alerts.filter((alert) => {
    const id = String(alert.batch_id || "");
    return String(alert.type || "").toUpperCase().includes("TEMP") &&
      relevantBatches.some((batch) => batchKey(batch) === id || String(batch.id) === id);
  });

  const recent = [...relevantBatches].sort((a, b) => {
    const first = Date.parse(String(a.updated_at || a.created_at || "")) || 0;
    const second = Date.parse(String(b.updated_at || b.created_at || "")) || 0;
    return second - first;
  }).slice(0, 5);

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <DistributorNav />

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-10 pt-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#008F68]">
              <Truck size={17} />
              Distributor Supply-Chain Portal
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-[#101828] md:text-6xl">
              Move every batch with
              <span className="block text-[#00A878]">complete traceability.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#475467]">
              Receive manufacturer shipments, monitor cold-chain conditions and transfer verified inventory to registered pharmacies.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/distributor/shipments" className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#008F68] hover:shadow-md">
                Open Shipments <ArrowRight size={18} />
              </Link>
              <Link href="/distributor/shipments" className="inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-6 py-3 font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]">
                View Incoming
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#101828]">Distributor readiness</p>
                  <p className="mt-1 text-sm text-[#667085]">Your portal is connected to the MediSure supply chain.</p>
                </div>
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">ACTIVE</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniReadiness icon={<Factory size={17} />} title="Manufacturer" text="Connected" />
                <MiniReadiness icon={<Thermometer size={17} />} title="Cold Chain" text="Monitored" />
                <MiniReadiness icon={<CheckCircle2 size={17} />} title="Traceability" text="Enabled" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E4E7EC] bg-[#F8FAFC] p-7 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">Distributor Overview</p>
                <h2 className="mt-1 text-2xl font-bold text-[#101828]">{organization}</h2>
              </div>
              <div className="rounded-xl bg-[#ECFDF5] p-3 text-[#00A878]"><Warehouse size={25} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <OverviewStat icon={<PackageCheck size={20} />} label="Incoming" value={loading ? "..." : String(incoming.length)} />
              <OverviewStat icon={<Boxes size={20} />} label="Received" value={loading ? "..." : String(received.length)} />
              <OverviewStat icon={<Truck size={20} />} label="In Transit" value={loading ? "..." : String(inTransit)} />
              <OverviewStat icon={<AlertTriangle size={20} />} label="Temp Alerts" value={loading ? "..." : String(tempAlerts.length)} danger={tempAlerts.length > 0} />
            </div>

            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

            <div className="mt-6 rounded-2xl border border-[#E4E7EC] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#667085]">Current Activity</p>
                  <p className="mt-1 font-bold text-[#101828]">{incoming.length > 0 ? "Shipment awaiting receipt" : received.length > 0 ? "Inventory ready for cold-chain monitoring" : "No active shipments"}</p>
                </div>
                <div className="rounded-xl bg-[#ECFDF5] p-2.5 text-[#00A878]"><Truck size={18} /></div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#667085]">
                {incoming.length > 0
                  ? `${incoming.length} shipment${incoming.length > 1 ? "s" : ""} is waiting for your receiving action.`
                  : received.length > 0
                  ? `${received.length} received batch${received.length > 1 ? "es are" : " is"} available for the next step.`
                  : "Once the manufacturer transfers a batch, it will appear here."}
              </p>
              <Link href="/distributor/shipments" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#00A878] hover:underline">Open shipment workspace <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E4E7EC] bg-[#F8FAFC] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-[#00A878]">DISTRIBUTOR FLOW</p>
            <h2 className="mt-2 text-3xl font-bold text-[#101828] md:text-4xl">From receiving to pharmacy</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#475467]">Every handoff stays visible, and temperature exceptions are recorded before the next transfer.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <FlowCard number="01" icon={<PackageCheck size={25} />} title="Receive Shipment" text="Accept an incoming manufacturer batch and move it into distributor custody." />
            <FlowCard number="02" icon={<Thermometer size={25} />} title="Monitor Cold Chain" text="Record safe or violating temperature readings against the allowed range." />
            <FlowCard number="03" icon={<Truck size={25} />} title="Transfer to Pharmacy" text="Send the received batch to a registered pharmacy through the backend and blockchain flow." />
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-[#00A878]">RECENT ACTIVITY</p>
              <h2 className="mt-2 text-3xl font-bold text-[#101828]">Recent shipments</h2>
            </div>
            <Link href="/distributor/shipments" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00A878] hover:underline">View all <ArrowRight size={15} /></Link>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
            {recent.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#667085]">No shipments are currently linked to {organization}.</div>
            ) : (
              <div className="divide-y divide-[#E4E7EC]">
                {recent.map((batch) => (
                  <Link key={batchKey(batch)} href={`/distributor/shipments/${encodeURIComponent(batchKey(batch))}`} className="group flex flex-col gap-4 p-5 transition hover:bg-[#F8FAFC] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]"><Boxes size={21} /></div>
                      <div>
                        <p className="font-semibold text-[#101828] group-hover:text-[#00A878]">{batchName(batch)}</p>
                        <p className="mt-1 text-sm text-[#667085]">Batch {batchKey(batch)} · {Number(batch.quantity || 0).toLocaleString()} units</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={batch.status} />
                      <ArrowRight size={17} className="text-[#98A2B3] group-hover:text-[#00A878]" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <DistributorFooter />
    </main>
  );
}

function OverviewStat({ icon, label, value, danger = false }: { icon: React.ReactNode; label: string; value: string; danger?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${danger ? "border-red-200 bg-red-50" : "border-[#E4E7EC] bg-white"}`}><div className={`mb-3 inline-flex rounded-xl p-2.5 ${danger ? "bg-white text-red-600" : "bg-[#ECFDF5] text-[#00A878]"}`}>{icon}</div><p className="text-sm text-[#667085]">{label}</p><p className="mt-1 text-2xl font-bold text-[#101828]">{value}</p></div>;
}

function MiniReadiness({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-xl border border-[#E4E7EC] bg-white p-3"><div className="flex items-center gap-2 text-[#00A878]">{icon}<span className="text-xs font-semibold uppercase tracking-wide text-[#667085]">{title}</span></div><p className="mt-2 text-sm font-semibold text-[#101828]">{text}</p></div>;
}

function FlowCard({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#00A878] hover:shadow-md"><div className="flex items-start justify-between"><div className="rounded-xl bg-[#ECFDF5] p-3 text-[#00A878]">{icon}</div><span className="text-sm font-bold text-[#98A2B3]">{number}</span></div><h3 className="mt-5 text-lg font-bold text-[#101828]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#667085]">{text}</p></div>;
}
