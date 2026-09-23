"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function BatchDetails() {
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [customDistributor, setCustomDistributor] = useState("");

  const batch = {
    id: "MED-2026-004",
    medicine: "Paracetamol 500mg",
    quantity: "1000 units",
    manufacturingDate: "23 Sep 2026",
    expiryDate: "22 Sep 2028",
    minTemp: "2°C",
    maxTemp: "8°C",
    manufacturer: "ABC Pharma",
  };

  const qrValue = `https://medisure.vercel.app/verify/${batch.id}`;

  const downloadQR = () => {
    const svg = document.getElementById("medicine-qr");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 600, 600);

      ctx.drawImage(img, 50, 50, 500, 500);

      const link = document.createElement("a");
      link.download = `${batch.id}-QR.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!distributor) return;

    if (distributor === "OTHER" && !customDistributor.trim()) {
      return;
    }

    setTransferred(true);
    setShowTransfer(false);
  };

  const finalDistributor =
    distributor === "OTHER" ? customDistributor : distributor;

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
                <strong>{finalDistributor}</strong>.
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
              transferred
              ? "bg-[#FFF7ED] text-[#F97316]"
              : "bg-[#ECFDF5] text-[#00A878]"
            }`}
          >
            {transferred ? "IN TRANSIT" : "CREATED"}
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
                  value={batch.manufacturingDate}
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
                  label="Storage Temperature"
                  value={`${batch.minTemp} – ${batch.maxTemp}`}
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
                  icon={<ShieldCheck size={20} />}
                  title="Unique Identity"
                  text="QR assigned"
                />

                <StatusCard
                  icon={<Link2 size={20} />}
                  title="Blockchain"
                  text="Record created"
                />

                <StatusCard
                  icon={<Thermometer size={20} />}
                  title="Cold Chain"
                  text="2°C – 8°C"
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
                        Send this batch to a registered distributor.
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={() => setShowTransfer(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68]"
                    >
                      <Truck size={19} />
                      Transfer to Distributor
                    </button>

                  </div>

                ) : (

                  <form onSubmit={handleTransfer}>

                    <div className="mb-6">

                      <h2 className="text-xl font-bold text-[#101828]">
                        Transfer to Distributor
                      </h2>

                      <p className="mt-1 text-sm text-[#475467]">
                        Select the distributor receiving this shipment.
                      </p>

                    </div>


                    {/* Distributor */}
                    <label className="mb-2 block text-sm font-semibold text-[#101828]">
                      Distributor <span className="text-[#F97316]">*</span>
                    </label>

<div className="relative w-full">
  <select
    value={distributor}
    onChange={(e) => {
      setDistributor(e.target.value);
      if (e.target.value !== "OTHER") {
        setCustomDistributor("");
      }
    }}
    required
    className="w-full appearance-none rounded-xl border border-[#00A878] bg-white px-4 py-3 pr-12 text-[#101828] outline-none transition focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
  >
<option value="">Select distributor</option>
<option value="MEDSUPPLY">MedSupply Distributors</option>
<option value="HEALTHCARE">HealthCare Distributors</option>
<option value="PHARMAHUB">PharmaHub Distributors</option>
<option value="OTHER">Other / Custom Distributor</option>
  </select>

  {/* Custom dropdown arrow */}
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


                    {/* Custom Distributor */}
                    {distributor === "OTHER" && (
                      <div className="mt-4">

                        <label className="mb-2 block text-sm font-semibold text-[#101828]">
                          Distributor Name{" "}
                          <span className="text-[#F97316]">*</span>
                        </label>

                        <input
                          type="text"
                          value={customDistributor}
                          onChange={(e) =>
                            setCustomDistributor(e.target.value)
                          }
                          required
                          placeholder="Enter distributor name"
                          className="w-full rounded-xl border border-[#E4E7EC] bg-white px-4 py-3 text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
                        />

                      </div>
                    )}


                    {/* Buttons */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                      <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68]"
                      >
                        <Send size={18} />
                        Confirm Transfer
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowTransfer(false);
                          setDistributor("");
                          setCustomDistributor("");
                        }}
                        className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-5 py-3 font-semibold text-[#008F6B] transition hover:bg-[#D1FAE5]"
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
                      <strong>{finalDistributor}</strong>
                    </p>

                    <p className="mt-1 text-sm text-[#475467]">
                      Batch ownership transfer has been initiated.
                    </p>

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
 Unique QR generated for this medicine batch.
</p>

              <div className="mx-auto mt-6 flex w-fit rounded-2xl border border-[#E4E7EC] bg-white p-4">

                <QRCodeSVG
                  id="medicine-qr"
                  value={qrValue}
                  size={210}
                  level="H"
                  includeMargin
                />

              </div>

              <p className="mt-4 text-xs text-[#667085]">
                {batch.id}
              </p>

              <button
                type="button"
                onClick={downloadQR}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:bg-[#008F68]"
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


/* ================= DETAIL CARD ================= */

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


/* ================= TRACEABILITY CARD ================= */

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

        <span className="font-semibold text-[#101828] transition-colors duration-300 hover:text-[#008F68]">
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