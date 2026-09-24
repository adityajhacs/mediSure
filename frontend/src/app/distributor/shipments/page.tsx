"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Boxes, CheckCircle2, PackageCheck, RefreshCcw, Truck } from "lucide-react";
import { DistributorFooter, DistributorNav, EmptyState, StatusBadge } from "@/components/distributor/DistributorShell";

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
  manufacturer?: string;
  min_temperature?: number;
  max_temperature?: number;
  created_at?: string;
  updated_at?: string;
};

function listFrom(payload: unknown): Batch[] {
  if (Array.isArray(payload)) return payload as Batch[];
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    for (const key of ["batches", "data", "items"]) if (Array.isArray(p[key])) return p[key] as Batch[];
  }
  return [];
}

function orgName() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return String(user?.organization || user?.organization_name || user?.company_name || user?.company || "Distributor");
  } catch {
    return "Distributor";
  }
}

function keyOf(batch: Batch) {
  return String(batch.batch_number || batch.batch_id || batch.id || "");
}

export default function DistributorShipmentsPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [organization, setOrganization] = useState("Distributor");
  const [loading, setLoading] = useState(true);
  const [receivingId, setReceivingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const org = orgName();
      setOrganization(org);
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/batches`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load shipments.");
      setBatches(listFrom(await res.json()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load shipments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const relevant = useMemo(() => batches.filter((batch) => String(batch.current_owner || "") === organization || String(batch.pending_receiver || "") === organization), [batches, organization]);
  const incoming = relevant.filter((batch) => batch.status === "IN_TRANSIT" && batch.pending_receiver === organization);
  const received = relevant.filter((batch) => batch.status === "RECEIVED" && batch.current_owner === organization);

  const receiveBatch = async (batch: Batch) => {
    try {
      setReceivingId(keyOf(batch));
      setError("");
      setSuccess("");
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/batches/${encodeURIComponent(keyOf(batch))}/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ received_by: organization, stage: "DISTRIBUTOR" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.message || "Unable to receive this shipment.");
      setSuccess(`Batch ${keyOf(batch)} has been received successfully.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to receive shipment.");
    } finally {
      setReceivingId("");
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <DistributorNav />

      <section className="bg-white px-6 pb-8 pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#008F68]"><Truck size={17} /> Shipment Workspace</div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Manage your incoming inventory.</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#667085]">Review manufacturer transfers, receive batches into your custody and open any shipment for cold-chain monitoring.</p>
            </div>
            <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-5 py-3 font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"><RefreshCcw size={17} /> Refresh</button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard icon={<PackageCheck size={20} />} label="Awaiting receipt" value={incoming.length} tone="green" />
            <SummaryCard icon={<Boxes size={20} />} label="Received inventory" value={received.length} tone="blue" />
            <SummaryCard icon={<CheckCircle2 size={20} />} label="Distributor" value={organization} tone="gray" />
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-6 py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
          {success && <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-sm font-medium text-[#047857]">{success}</div>}

          <div>
            <div className="mb-4 flex items-end justify-between gap-4"><div><p className="font-semibold text-[#00A878]">INCOMING SHIPMENTS</p><h2 className="mt-1 text-2xl font-bold">Needs your action</h2></div><span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#C2410C]">{incoming.length} pending</span></div>
            {loading ? <LoadingCard /> : incoming.length === 0 ? <EmptyState title="No incoming shipments" text="Manufacturer transfers assigned to your organization will appear here." /> : <div className="grid gap-4 lg:grid-cols-2">{incoming.map((batch) => <ShipmentCard key={keyOf(batch)} batch={batch} incoming loading={receivingId === keyOf(batch)} onReceive={() => receiveBatch(batch)} />)}</div>}
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4"><div><p className="font-semibold text-[#00A878]">RECEIVED INVENTORY</p><h2 className="mt-1 text-2xl font-bold">Ready for cold-chain monitoring</h2></div><span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#047857]">{received.length} received</span></div>
            {loading ? <LoadingCard /> : received.length === 0 ? <EmptyState title="Nothing received yet" text="After you accept an incoming batch, it will move here for temperature monitoring and pharmacy transfer." /> : <div className="grid gap-4 lg:grid-cols-2">{received.map((batch) => <ShipmentCard key={keyOf(batch)} batch={batch} />)}</div>}
          </div>
        </div>
      </section>

      <DistributorFooter />
    </main>
  );
}

function SummaryCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string | number; tone: "green" | "blue" | "gray" }) {
  const iconClass = tone === "green" ? "bg-[#ECFDF5] text-[#00A878]" : tone === "blue" ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#F8FAFC] text-[#475467]";
  return <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm"><div className={`mb-4 inline-flex rounded-xl p-2.5 ${iconClass}`}>{icon}</div><p className="text-sm text-[#667085]">{label}</p><p className="mt-1 text-2xl font-bold text-[#101828]">{value}</p></div>;
}

function ShipmentCard({ batch, incoming = false, loading = false, onReceive }: { batch: Batch; incoming?: boolean; loading?: boolean; onReceive?: () => void }) {
  const key = keyOf(batch);
  return <article className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00A878] hover:shadow-md">
    <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]"><Boxes size={22} /></div><div><h3 className="text-lg font-bold text-[#101828]">{batch.medicine_name || batch.medicine || "Unknown Medicine"}</h3><p className="mt-1 text-sm text-[#667085]">Batch {key}</p></div></div><StatusBadge status={batch.status} /></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-3"><Info label="Quantity" value={`${Number(batch.quantity || 0).toLocaleString()} units`} /><Info label="Manufacturer" value={batch.manufacturer || "—"} /><Info label="Temperature" value={`${batch.min_temperature ?? "—"}°C – ${batch.max_temperature ?? "—"}°C`} /></div>
    <div className="mt-6 flex flex-col gap-3 border-t border-[#E4E7EC] pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[#667085]">{incoming ? "Shipment transferred to your organization." : "Batch is in your custody."}</p><div className="flex flex-wrap gap-3"><Link href={`/distributor/shipments/${encodeURIComponent(key)}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]">View Details <ArrowRight size={15} /></Link>{incoming && <button disabled={loading} onClick={onReceive} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-60"><PackageCheck size={16} />{loading ? "Receiving..." : "Receive Shipment"}</button>}</div></div>
  </article>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-[#F8FAFC] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">{label}</p><p className="mt-1.5 text-sm font-semibold text-[#101828]">{value}</p></div>; }
function LoadingCard() { return <div className="animate-pulse rounded-2xl border border-[#E4E7EC] bg-white p-8"><div className="h-5 w-40 rounded bg-[#F2F4F7]" /><div className="mt-3 h-4 w-64 rounded bg-[#F2F4F7]" /><div className="mt-6 h-24 rounded-xl bg-[#F8FAFC]" /></div>; }
