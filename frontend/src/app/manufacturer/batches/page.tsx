"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Search,
  Eye,
  QrCode,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  X,
} from "lucide-react";

const batches = [
  {
    id: "MED-2026-001",
    medicine: "Paracetamol 500mg",
    quantity: 1000,
    date: "22 Sep 2026",
    status: "CREATED",
  },
  {
    id: "MED-2026-002",
    medicine: "Amoxicillin 250mg",
    quantity: 500,
    date: "20 Sep 2026",
    status: "IN_TRANSIT",
  },
  {
    id: "MED-2026-003",
    medicine: "Azithromycin 500mg",
    quantity: 800,
    date: "18 Sep 2026",
    status: "DELIVERED",
  },
  {
    id: "MED-2026-004",
    medicine: "Paracetamol 500mg",
    quantity: 1000,
    date: "23 Sep 2026",
    status: "CREATED",
  },
];

export default function BatchesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.id.toLowerCase().includes(search.toLowerCase()) ||
      batch.medicine.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || batch.status === filter;

    return matchesSearch && matchesFilter;
  });

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
                <span className="text-[#101828]">medi</span>
                <span className="text-[#F97316]">Sure</span>
              </p>

              <p className="text-xs text-[#667085]">
                Manufacturer Portal
              </p>
            </div>
          </Link>

        </div>
      </nav>


      {/* ================= MAIN CONTENT ================= */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">

        {/* Back to Dashboard */}
        <Link
          href="/manufacturer/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#00A878] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>


        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-[#101828]">
              All Medicine Batches
            </h1>

            <p className="mt-1 text-[#475467]">
              Manage and track all medicine batches created by your company.
            </p>
          </div>

          <Link
            href="/manufacturer/create-batch"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68]"
          >
            <Package size={19} />
            Create New Batch
          </Link>

        </div>


        {/* ================= STATS ================= */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Batches"
            value="156"
            icon={<Package size={21} />}
          />

          <StatCard
            title="Created"
            value="124"
            icon={<CheckCircle2 size={21} />}
          />

          <StatCard
            title="In Transit"
            value="32"
            icon={<Truck size={21} />}
          />

          <StatCard
            title="Delivered"
            value="86"
            icon={<Clock3 size={21} />}
          />

        </div>


        {/* ================= SEARCH + FILTER ================= */}
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-4 md:flex-row">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
            />

            <input
              type="text"
              placeholder="Search by Batch ID or medicine name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 ${
                search ? "pr-11" : "pr-4"
              } text-[#101828] outline-none transition focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]`}
            />

            {/* Clear Search Button */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#667085] transition hover:bg-[#ECFDF5] hover:text-[#00A878]"
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}

          </div>


          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-3 text-sm font-medium text-[#101828] outline-none transition focus:border-[#00A878]"
          >
            <option value="ALL">All Status</option>
            <option value="CREATED">Created</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>

        </div>


        {/* ================= TABLE ================= */}
        <div className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-[#F8FAFC]">
                <tr className="border-b border-[#E4E7EC] text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-[#667085]">
                    Batch ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-[#667085]">
                    Medicine
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-[#667085]">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-[#667085]">
                    Created
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-[#667085]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-[#667085]">
                    Actions
                  </th>

                </tr>
              </thead>


              <tbody>

                {filteredBatches.map((batch) => (

                  <tr
                    key={batch.id}
                    className="border-b border-[#E4E7EC] last:border-b-0 hover:bg-[#F8FAFC]"
                  >

                    <td className="px-6 py-5">
                      <span className="font-semibold text-[#101828]">
                        {batch.id}
                      </span>
                    </td>


                    <td className="px-6 py-5 text-[#475467]">
                      {batch.medicine}
                    </td>


                    <td className="px-6 py-5 text-[#475467]">
                      {batch.quantity} units
                    </td>


                    <td className="px-6 py-5 text-[#475467]">
                      {batch.date}
                    </td>


                    <td className="px-6 py-5">
                      <StatusBadge status={batch.status} />
                    </td>


                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <Link
                          href={`/manufacturer/batch/${batch.id}`}
                          className="rounded-lg border border-[#E4E7EC] p-2 text-[#475467] transition hover:border-[#00A878] hover:bg-[#ECFDF5] hover:text-[#00A878]"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>


                        <button
  type="button"
  onClick={() => setSelectedBatch(batch.id)}
  className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878] transition hover:bg-[#D1FAE5]"
  title="View QR"
>
  <QrCode size={18} />
</button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {filteredBatches.length === 0 && (
            <div className="px-6 py-12 text-center text-[#667085]">
              No batches found.
            </div>
          )}

        </div>

      </section>

{/* ================= QR MODAL ================= */}
{selectedBatch && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

    <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

      {/* Close Button */}
      <button
        type="button"
        onClick={() => setSelectedBatch(null)}
        className="absolute right-4 top-4 rounded-lg p-2 text-[#667085] transition hover:bg-[#F2F4F7] hover:text-[#101828]"
        title="Close"
      >
        <X size={20} />
      </button>


      {/* Heading */}
      <div className="text-center">

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
          <QrCode size={25} />
        </div>

        <h2 className="text-xl font-bold text-[#101828]">
          Batch QR Code
        </h2>

        <p className="mt-1 text-sm text-[#667085]">
          Scan this QR code to verify the medicine batch.
        </p>

      </div>


      {/* QR Code */}
      <div className="mx-auto mt-6 flex w-fit items-center justify-center rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm">

        <QRCodeSVG
          id="batch-qr-code"
          value={`https://medisure.vercel.app/verify/${selectedBatch}`}
          size={210}
          bgColor="#FFFFFF"
          fgColor="#101828"
          level="H"
          includeMargin
        />

      </div>


      {/* Batch ID */}
      <div className="mt-5 rounded-xl bg-[#F8FAFC] px-4 py-3 text-center">

        <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
          Batch ID
        </p>

        <p className="mt-1 font-bold text-[#101828]">
          {selectedBatch}
        </p>

      </div>


      {/* Buttons */}
      <div className="mt-5 flex gap-3">

        <button
          type="button"
          onClick={() => setSelectedBatch(null)}
          className="flex-1 rounded-xl border border-[#E4E7EC] px-4 py-3 text-sm font-semibold text-[#475467] transition hover:bg-[#F8FAFC]"
        >
          Close
        </button>

        <button
          type="button"
          onClick={() => {
            const svg = document.getElementById("batch-qr-code");

            if (!svg) return;

            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svg);
            const blob = new Blob([source], {
              type: "image/svg+xml;charset=utf-8",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `${selectedBatch}-QR.svg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
          }}
          className="flex-1 rounded-xl bg-[#00A878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#008F68]"
        >
          Download QR
        </button>

      </div>

    </div>

  </div>
)}

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#101828] bg-[#101828] px-6 py-8 text-white">

        <div className="mx-auto grid max-w-7xl items-center gap-6 md:grid-cols-3">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A878] text-white">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="font-bold text-white">
                <span>medi</span>
                <span className="text-[#F97316]">Sure</span>
              </p>

              <p className="text-xs text-[#98A2B3]">
                Scan. Trace. Trust.
              </p>
            </div>

          </div>


          {/* Copyright */}
          <div className="text-center text-sm text-[#98A2B3]">
            © 2026 MediSure. All rights reserved.
          </div>


          {/* Trust Message */}
          <div className="text-center text-sm font-medium text-[#D0D5DD] md:text-right">
            Secure • Transparent • Traceable
          </div>

        </div>

      </footer>

    </main>
  );
}


/* ================= STATS ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group cursor-default rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-5 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-lg">

      <div className="mb-3 flex items-center justify-between">

        <span className="text-sm text-[#475467] transition-colors group-hover:text-[#008F68]">
          {title}
        </span>

        <div className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878] transition-all group-hover:bg-[#00A878] group-hover:text-white">
          {icon}
        </div>

      </div>

      <p className="text-2xl font-bold text-[#101828] transition-colors group-hover:text-[#008F68]">
        {value}
      </p>

    </div>
  );
}


/* ================= STATUS ================= */

function StatusBadge({ status }: { status: string }) {

  if (status === "IN_TRANSIT") {
    return (
      <span className="inline-flex rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#F97316]">
        IN TRANSIT
      </span>
    );
  }


  if (status === "DELIVERED") {
    return (
      <span className="inline-flex rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#00A878]">
        DELIVERED
      </span>
    );
  }


  return (
    <span className="inline-flex rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-semibold text-[#DB2777]">
      CREATED
    </span>
  );
}