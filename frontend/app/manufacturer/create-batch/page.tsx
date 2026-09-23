"use client";

import {
  ArrowLeft,
  PackagePlus,
  CalendarDays,
  Thermometer,
  Hash,
  Boxes,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function CreateBatch() {
  const [form, setForm] = useState({
    medicineName: "",
    batchId: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
    minTemp: "",
    maxTemp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Batch Created:", form);

    alert("Batch Created Successfully!");
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-[#E4E7EC] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Logo */}
          <Link
            href="/manufacturer/dashboard"
            className="flex items-center gap-3"
          >
            {/* Logo Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <ShieldCheck size={23} />
            </div>

            {/* Logo Text */}
            <div>
              <p className="text-xl font-bold leading-none">
                <span className="text-[#101828]">medi</span>
                <span className="text-[#F97316]">Sure</span>
              </p>

              <p className="mt-1 text-xs text-[#667085]">
                Scan. Trace. Trust.
              </p>
            </div>
          </Link>

        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">

        {/* Back */}
        <Link
          href="/manufacturer/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#00A878] transition hover:text-[#008F68] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* ================= HEADING ================= */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">

            <div className="rounded-xl bg-[#ECFDF5] p-3">
  <PackagePlus
    size={28}
    className="text-[#00A878]"
  />
</div>

            <div>
              <h1 className="text-3xl font-bold text-[#101828]">
                Create New Medicine Batch
              </h1>

              <p className="mt-1 text-[#475467]">
                Register a new medicine batch and create its traceable identity.
              </p>
            </div>

          </div>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-8 shadow-sm"
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Medicine Name */}
            <InputField
              label="Medicine Name"
              name="medicineName"
              placeholder="e.g. Paracetamol 500mg"
              value={form.medicineName}
              onChange={handleChange}
              icon={<PackagePlus size={18} />}
            />

            {/* Batch ID */}
            <InputField
              label="Batch ID"
              name="batchId"
              placeholder="e.g. MED-2026-004"
              value={form.batchId}
              onChange={handleChange}
              icon={<Hash size={18} />}
            />

            {/* Quantity */}
            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="e.g. 1000"
              value={form.quantity}
              onChange={handleChange}
              icon={<Boxes size={18} />}
            />

            {/* Manufacturing Date */}
            <InputField
              label="Manufacturing Date"
              name="manufacturingDate"
              type="date"
              value={form.manufacturingDate}
              onChange={handleChange}
              icon={<CalendarDays size={18} />}
            />

            {/* Expiry Date */}
            <InputField
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              icon={<CalendarDays size={18} />}
            />

            {/* Minimum Temperature */}
            <InputField
              label="Minimum Storage Temperature (°C)"
              name="minTemp"
              type="number"
              placeholder="e.g. 2"
              value={form.minTemp}
              onChange={handleChange}
              icon={<Thermometer size={18} />}
            />

            {/* Maximum Temperature */}
            <InputField
              label="Maximum Storage Temperature (°C)"
              name="maxTemp"
              type="number"
              placeholder="e.g. 8"
              value={form.maxTemp}
              onChange={handleChange}
              icon={<Thermometer size={18} />}
            />

          </div>

          {/* ================= INFO ================= */}
          <div className="mt-7 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
            <p className="text-sm leading-6 text-[#475467]">
              <strong className="text-[#101828]">
                Next step:
              </strong>{" "}
              After creating this batch, MediSure will generate a unique QR
              identity for the medicine.
            </p>
          </div>

          {/* ================= BUTTON ================= */}
          <button
            type="submit"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 py-4 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#008F68] hover:shadow-md"
          >
            <PackagePlus size={20} />
            Create Medicine Batch
          </button>

        </form>
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

          {/* Right side — NO ABOUT MEDISURE */}
          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-[#D0D5DD]">
              Secure • Transparent • Traceable
            </p>
          </div>

        </div>
      </footer>

    </main>
  );
}


/* ================= INPUT FIELD ================= */

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>

      {/* Label */}
      <label className="mb-2 block text-sm font-semibold text-[#101828]">
        {label}
        <span className="ml-1 text-[#F97316]">*</span>
      </label>

      <div className="relative">

        {/* Icon */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
          {icon}
        </div>

        {/* Input */}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 text-[#101828] outline-none transition placeholder:text-[#94A3B8] focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5]"
        />

      </div>
    </div>
  );
}