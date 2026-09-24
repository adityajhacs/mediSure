"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Package,
  Search,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

const medicines = [
  {
    id: "MED-001",
    medicine: "Paracetamol 500mg",
    batch: "PCM2026A01",
    quantity: 500,
    expiry: "Dec 2027",
    manufacturer: "Jharkhand Pharma",
    status: "AVAILABLE",
  },
  {
    id: "MED-002",
    medicine: "Azithromycin 500mg",
    batch: "AZM2026B04",
    quantity: 300,
    expiry: "Aug 2027",
    manufacturer: "MediCare Labs",
    status: "AVAILABLE",
  },
  {
    id: "MED-003",
    medicine: "Amoxicillin 250mg",
    batch: "AMX2026C02",
    quantity: 250,
    expiry: "Nov 2027",
    manufacturer: "HealthGen Pharma",
    status: "AVAILABLE",
  },
  {
    id: "MED-004",
    medicine: "Cetirizine 10mg",
    batch: "CTR2026D05",
    quantity: 180,
    expiry: "Jan 2028",
    manufacturer: "LifeCare Pharmaceuticals",
    status: "AVAILABLE",
  },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const filteredMedicines = medicines.filter((medicine) => {
    const value = search.toLowerCase();

    return (
      medicine.medicine.toLowerCase().includes(value) ||
      medicine.id.toLowerCase().includes(value) ||
      medicine.batch.toLowerCase().includes(value) ||
      medicine.manufacturer.toLowerCase().includes(value)
    );
  });

  const totalQuantity = medicines.reduce(
    (total, medicine) => total + medicine.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                <Warehouse size={15} />
                Pharmacy Inventory
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
                Medicine Inventory
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
                View medicines currently available in the pharmacy and verify
                their supply-chain information.
              </p>
            </div>

            {/* Inventory Count */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-5 py-4">
              <div className="rounded-lg bg-white p-2 text-[#00A878]">
                <Package size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#667085]">
                  Available Units
                </p>

                <p className="text-2xl font-bold text-[#00A878]">
                  {totalQuantity}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine, medicine ID, batch ID..."
              className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-11 pr-4 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
            />
          </div>

          {search && (
            <p className="mt-3 text-xs text-[#667085]">
              Showing {filteredMedicines.length} result
              {filteredMedicines.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>

      {/* Inventory */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {filteredMedicines.length === 0 ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-10 text-center">
            <Package
              size={40}
              className="mx-auto text-[#98A2B3]"
            />

            <h2 className="mt-4 text-lg font-bold text-[#101828]">
              No medicines found
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Try searching with a different medicine or batch ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md"
              >
                {/* Medicine Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
                      <Package size={24} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-[#101828]">
                        {medicine.medicine}
                      </h2>

                      <p className="mt-1 text-sm text-[#667085]">
                        {medicine.id} · Batch {medicine.batch}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                    <CheckCircle2 size={14} />
                    {medicine.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F8FAFC] p-4">
                    <p className="text-xs font-medium text-[#667085]">
                      Quantity
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#101828]">
                      {medicine.quantity}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] p-4">
                    <p className="text-xs font-medium text-[#667085]">
                      Expiry Date
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-[#00A878]"
                      />

                      <p className="text-sm font-bold text-[#101828]">
                        {medicine.expiry}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manufacturer */}
                <div className="mt-4 rounded-xl bg-[#F8FAFC] p-4">
                  <p className="text-xs font-medium text-[#667085]">
                    Manufacturer
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#101828]">
                    {medicine.manufacturer}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/batch?id=${medicine.id}`}
                    className="flex-1 rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-center text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/verification?id=${medicine.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00A878] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68]"
                  >
                    <ShieldCheck size={17} />
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}