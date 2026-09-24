"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";

const medicines = [
  {
    id: "MED-001",
    medicine: "Paracetamol 500mg",
    batch: "PCM2026A01",
    quantity: 500,
    expiry: "Dec 2027",
    manufacturer: "Jharkhand Pharma",
    distributor: "HealthCare Distributors",
  },
  {
    id: "MED-002",
    medicine: "Azithromycin 500mg",
    batch: "AZM2026B04",
    quantity: 300,
    expiry: "Aug 2027",
    manufacturer: "MediCare Labs",
    distributor: "MediSupply Pvt. Ltd.",
  },
  {
    id: "MED-003",
    medicine: "Amoxicillin 250mg",
    batch: "AMX2026C02",
    quantity: 250,
    expiry: "Nov 2027",
    manufacturer: "HealthGen Pharma",
    distributor: "Jharkhand Pharma Supply",
  },
  {
    id: "MED-004",
    medicine: "Cetirizine 10mg",
    batch: "CTR2026D05",
    quantity: 180,
    expiry: "Jan 2028",
    manufacturer: "LifeCare Pharmaceuticals",
    distributor: "HealthCare Distributors",
  },
];

export default function BatchPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "MED-001";

  const medicine = medicines.find((item) => item.id === id);

  if (!medicine) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-[#101828]">
            Medicine Not Found
          </h1>

          <Link
            href="/inventory"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back to Inventory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Back */}
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-[#00A878]"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#101828]">
                {medicine.medicine}
              </h1>

              <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                AVAILABLE
              </span>
            </div>

            <p className="mt-2 text-sm text-[#667085]">
              Medicine ID: {medicine.id} • Batch: {medicine.batch}
            </p>
          </div>

          <Link
            href={`/verification?id=${medicine.id}`}
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
                  Medicine ID
                </span>
                <span className="text-sm font-semibold text-[#101828]">
                  {medicine.id}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
                <span className="text-sm text-[#667085]">
                  Batch ID
                </span>
                <span className="text-sm font-semibold text-[#101828]">
                  {medicine.batch}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
                <span className="text-sm text-[#667085]">
                  Quantity
                </span>
                <span className="text-sm font-semibold text-[#101828]">
                  {medicine.quantity} units
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#667085]">
                  Expiry Date
                </span>

                <span className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
                  <CalendarDays size={16} />
                  {medicine.expiry}
                </span>
              </div>

            </div>
          </div>

          {/* Verification Status */}
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#00A878]">
                <CheckCircle2 size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#101828]">
                  Verification Status
                </h2>

                <p className="text-sm text-[#008F68]">
                  Supply chain is traceable
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#475467]">
              This batch has a recorded journey from manufacturer to
              distributor and pharmacy.
            </p>
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
                {medicine.manufacturer}
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
                {medicine.distributor}
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
                ABC Pharmacy
              </h3>

              <p className="mt-2 flex items-center gap-1 text-xs text-[#667085]">
                <MapPin size={14} />
                Sahibabad, Ghaziabad
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

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#00A878]">
                <Factory size={18} />
              </div>

              <div>
                <p className="font-semibold text-[#101828]">
                  Manufactured
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  {medicine.manufacturer} created batch {medicine.batch}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF7ED] text-[#F97316]">
                <Truck size={18} />
              </div>

              <div>
                <p className="font-semibold text-[#101828]">
                  Transferred to Distributor
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Batch transferred to {medicine.distributor}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#00A878]">
                <Store size={18} />
              </div>

              <div>
                <p className="font-semibold text-[#101828]">
                  Received at Pharmacy
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Batch received by ABC Pharmacy
                </p>
              </div>
            </div>

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
              {medicine.batch}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#008F68]">
              <CheckCircle2 size={17} />
              Blockchain history available
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}