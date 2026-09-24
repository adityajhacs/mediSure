"use client";

import { useState } from "react";
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

const incomingMedicines = [
  {
    id: "MED-001",
    medicine: "Paracetamol 500mg",
    batch: "PCM2026A01",
    quantity: 500,
    expiry: "Dec 2027",
    distributor: "HealthCare Distributors",
    location: "Ranchi Distribution Center",
    status: "IN TRANSIT",
  },
  {
    id: "MED-002",
    medicine: "Azithromycin 500mg",
    batch: "AZM2026B04",
    quantity: 300,
    expiry: "Aug 2027",
    distributor: "MediSupply Pvt. Ltd.",
    location: "Jamshedpur Distribution Center",
    status: "IN TRANSIT",
  },
  {
    id: "MED-003",
    medicine: "Amoxicillin 250mg",
    batch: "AMX2026C02",
    quantity: 250,
    expiry: "Nov 2027",
    distributor: "Jharkhand Pharma Supply",
    location: "Dhanbad Distribution Center",
    status: "IN TRANSIT",
  },
];

export default function IncomingMedicines() {
  const [receivedBatches, setReceivedBatches] = useState<string[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<
    (typeof incomingMedicines)[number] | null
  >(null);

  const handleReceive = (medicineId: string) => {
    setReceivedBatches((current) => [...current, medicineId]);
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
                {incomingMedicines.length - receivedBatches.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medicine Cards */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="space-y-5">
          {incomingMedicines.map((medicine) => {
            const isReceived = receivedBatches.includes(medicine.id);

            return (
              <div
                key={medicine.id}
                className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${
                  isReceived
                    ? "border-[#A7F3D0] bg-[#ECFDF5]"
                    : "border-[#E4E7EC] hover:-translate-y-1 hover:border-[#00A878] hover:shadow-md"
                }`}
              >
                {/* Top Row */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
                      {isReceived ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>

                    {/* Medicine Info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-[#101828]">
                          {medicine.medicine}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isReceived
                              ? "bg-[#ECFDF5] text-[#008F68]"
                              : "bg-[#FFF7ED] text-[#F97316]"
                          }`}
                        >
                          {isReceived ? "RECEIVED" : medicine.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#667085]">
                        Medicine ID: {medicine.id} · Batch: {medicine.batch}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMedicine(medicine)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-5 py-3 text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
                    >
                      View
                      <ArrowRight size={17} />
                    </button>

                    {!isReceived && (
                      <button
                        type="button"
                        onClick={() => handleReceive(medicine.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68]"
                      >
                        Receive
                        <Package size={17} />
                      </button>
                    )}
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
                        {medicine.batch}
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
                        {medicine.quantity} units
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
                        {medicine.expiry}
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
                        {medicine.distributor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#475467]">
                  <MapPin size={17} className="text-[#00A878]" />

                  <span>
                    Currently at:{" "}
                    <span className="font-semibold text-[#101828]">
                      {isReceived ? "ABC Pharmacy" : medicine.location}
                    </span>
                  </span>

                  <Truck size={17} className="ml-auto text-[#667085]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* View Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 px-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#101828]">
                  {selectedMedicine.medicine}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Medicine ID: {selectedMedicine.id}
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
              <Detail label="Batch ID" value={selectedMedicine.batch} />
              <Detail
                label="Quantity"
                value={`${selectedMedicine.quantity} units`}
              />
              <Detail label="Expiry" value={selectedMedicine.expiry} />
              <Detail
                label="Distributor"
                value={selectedMedicine.distributor}
              />
              <Detail label="Location" value={selectedMedicine.location} />
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