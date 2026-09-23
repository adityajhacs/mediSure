"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Pill,
  Thermometer,
  Building2,
  PackageCheck,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type MedicineResponse = {
  id?: number | string;
  medicine_id?: number | string;
  name?: string;
  medicine_name?: string;
  medicine?: {
    id?: number | string;
    medicine_id?: number | string;
    name?: string;
    medicine_name?: string;
  };
};

export default function CreateMedicinePage() {
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [medicineId, setMedicineId] = useState("");

  const [form, setForm] = useState({
    medicineName: "",
    medicineType: "",
    manufacturer: "ABC Pharma",
    minTemp: "",
    maxTemp: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= CREATE MEDICINE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      const payload = {
        medicine_name: form.medicineName,
        medicine_type: form.medicineType,
        manufacturer: form.manufacturer,
        min_temperature: Number(form.minTemp),
        max_temperature: Number(form.maxTemp),
      };

      const response = await fetch(`${API_URL}/api/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data: MedicineResponse | { detail?: string; message?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        let message = "Failed to create medicine.";

        if (
          typeof data === "object" &&
          data !== null &&
          "detail" in data &&
          typeof data.detail === "string"
        ) {
          message = data.detail;
        } else if (
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          message = data.message;
        }

        throw new Error(message);
      }

      const medicineData = data as MedicineResponse;

      const returnedId =
        medicineData.medicine_id ??
        medicineData.id ??
        medicineData.medicine?.medicine_id ??
        medicineData.medicine?.id;

      setMedicineId(
        returnedId !== undefined && returnedId !== null
          ? String(returnedId)
          : "Created"
      );

      setCreated(true);
    } catch (err) {
      console.error("Create medicine error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create medicine."
      );
    } finally {
      setLoading(false);
    }
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <ShieldCheck size={23} />
            </div>

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

        {/* Heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-[#ECFDF5] p-3">
              <Pill size={27} className="text-[#00A878]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#101828]">
                Create New Medicine
              </h1>

              <p className="mt-1 text-[#475467]">
                Register a medicine before creating its production batch.
              </p>
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && !created && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* ================= SUCCESS ================= */}
        {created ? (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#F0FDF8] p-6 md:p-8">
            {/* Success Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#A7F3D0]">
                <CheckCircle2
                  size={34}
                  className="text-[#00A878]"
                />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#101828] md:text-4xl">
                Medicine Created Successfully
              </h2>

              <p className="mt-2 text-base font-medium text-[#475467] md:text-lg">
                <span className="font-semibold text-[#101828]">
                  {form.medicineName}
                </span>{" "}
                has been registered with MediSure.
              </p>
            </div>

            {/* Medicine Information */}
            <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b border-[#E4E7EC] pb-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#475467]">
                    Medicine ID
                  </p>

                  <p className="mt-1 text-lg font-medium text-[#101828]">
                    {medicineId || "Created"}
                  </p>
                </div>

                <div className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                  CREATED
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                {/* Medicine Type */}
                <div>
                  <p className="text-sm font-bold text-[#475467]">
                    Medicine Type
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#101828]">
                    {form.medicineType}
                  </p>
                </div>

                {/* Storage Range */}
                <div>
                  <p className="text-sm font-bold text-[#475467]">
                    Storage Range
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#101828]">
                    {form.minTemp}°C – {form.maxTemp}°C
                  </p>
                </div>

                {/* Manufacturer */}
                <div>
                  <p className="text-sm font-bold text-[#475467]">
                    Manufacturer
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#101828]">
                    {form.manufacturer}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Step */}
            <div className="mt-7 flex flex-col items-center">
              <p className="mb-3 text-sm text-[#667085]">
                Next step: create a production batch for this medicine.
              </p>

              <Link
                href="/manufacturer/create-batch"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-7 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#008F68] hover:shadow-md"
              >
                <PackageCheck size={19} />
                Create Batch
              </Link>
            </div>
          </div>
        ) : (
          /* ================= FORM ================= */
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Medicine Name */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#101828]">
                  Medicine Name{" "}
                  <span className="text-[#F97316]">*</span>
                </label>

                <div className="relative">
                  <Pill
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />

                  <input
                    type="text"
                    name="medicineName"
                    placeholder="e.g. Paracetamol 500mg"
                    value={form.medicineName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 text-[#101828] outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                  />
                </div>
              </div>

              {/* Medicine Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101828]">
                  Medicine Type{" "}
                  <span className="text-[#F97316]">*</span>
                </label>

                <select
                  name="medicineType"
                  value={form.medicineType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#E4E7EC] bg-white px-4 py-3 text-[#101828] outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                >
                  <option value="">Select type</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Manufacturer */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101828]">
                  Manufacturer{" "}
                  <span className="text-[#F97316]">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />

                  <input
                    type="text"
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 text-[#101828] outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                  />
                </div>
              </div>

              {/* Minimum Temperature */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101828]">
                  Minimum Storage Temperature (°C){" "}
                  <span className="text-[#F97316]">*</span>
                </label>

                <div className="relative">
                  <Thermometer
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />

                  <input
                    type="number"
                    name="minTemp"
                    placeholder="e.g. 2"
                    value={form.minTemp}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 text-[#101828] outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                  />
                </div>
              </div>

              {/* Maximum Temperature */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101828]">
                  Maximum Storage Temperature (°C){" "}
                  <span className="text-[#F97316]">*</span>
                </label>

                <div className="relative">
                  <Thermometer
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />

                  <input
                    type="number"
                    name="maxTemp"
                    placeholder="e.g. 8"
                    value={form.maxTemp}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 text-[#101828] outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-7 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
              <p className="text-sm leading-6 text-[#475467]">
                <strong className="text-[#101828]">
                  Note:
                </strong>{" "}
                Storage temperature will later be used by MediSure for
                cold-chain verification and Trust Score calculation.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PackageCheck size={20} />

              {loading ? "Creating Medicine..." : "Create Medicine"}
            </button>
          </form>
        )}
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