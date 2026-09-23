"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PackagePlus,
  CalendarDays,
  Thermometer,
  Hash,
  Boxes,
  ShieldCheck,
  Building2,
  Pill,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* =========================================================
   TYPES
========================================================= */

type Medicine = {
  id?: number | string;
  medicine_id?: number | string;

  name?: string;
  medicine_name?: string;

  type?: string;
  medicine_type?: string;

  manufacturer?: string;
  manufacturer_name?: string;

  manufacturer_id?: number | string;

  min_temperature?: number | string;
  max_temperature?: number | string;

  min_temp?: number | string;
  max_temp?: number | string;

  minimum_temperature?: number | string;
  maximum_temperature?: number | string;

  organization?: {
    id?: number | string;
    name?: string;
  };

  manufacturer_org?: {
    id?: number | string;
    name?: string;
  };
};

type MedicineDetailResponse = {
  id?: number | string;
  medicine_id?: number | string;

  name?: string;
  medicine_name?: string;

  type?: string;
  medicine_type?: string;

  manufacturer?: string;
  manufacturer_name?: string;
  manufacturer_id?: number | string;

  min_temperature?: number | string;
  max_temperature?: number | string;

  min_temp?: number | string;
  max_temp?: number | string;

  minimum_temperature?: number | string;
  maximum_temperature?: number | string;

  organization?: {
    id?: number | string;
    name?: string;
  };

  manufacturer_org?: {
    id?: number | string;
    name?: string;
  };
};

type FormState = {
  medicineId: string;
  medicineName: string;
  medicineType: string;
  manufacturer: string;
  manufacturerId: string;

  batchId: string;
  quantity: string;
  manufacturingDate: string;
  expiryDate: string;

  minTemp: string;
  maxTemp: string;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CreateBatch() {
  const [medicines, setMedicines] = useState<Medicine[]>(
    []
  );

  const [medicinesLoading, setMedicinesLoading] =
    useState(true);

  const [medicineDetailsLoading, setMedicineDetailsLoading] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    medicineId: "",
    medicineName: "",
    medicineType: "",
    manufacturer: "",
    manufacturerId: "",

    batchId: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",

    minTemp: "",
    maxTemp: "",
  });

  /* =========================================================
     AUTH HEADERS
  ========================================================= */

  const getHeaders = (): HeadersInit => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  /* =========================================================
     MEDICINE HELPERS
  ========================================================= */

  const getMedicineId = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    return (
      medicine.medicine_id ??
      medicine.id ??
      ""
    );
  };

  const getMedicineName = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    return (
      medicine.medicine_name ||
      medicine.name ||
      ""
    );
  };

  const getMedicineType = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    return (
      medicine.medicine_type ||
      medicine.type ||
      ""
    );
  };

  const getManufacturerName = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    if (typeof medicine.manufacturer === "string") {
      return medicine.manufacturer;
    }

    return (
      medicine.manufacturer_name ||
      medicine.organization?.name ||
      medicine.manufacturer_org?.name ||
      ""
    );
  };

  const getManufacturerId = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    return (
      medicine.manufacturer_id ??
      medicine.organization?.id ??
      medicine.manufacturer_org?.id ??
      ""
    );
  };

  const getMinTemperature = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    return (
      medicine.min_temperature ??
      medicine.min_temp ??
      medicine.minimum_temperature ??
      ""
    );
  };

  const getMaxTemperature = (
    medicine: Medicine | MedicineDetailResponse
  ) => {
    return (
      medicine.max_temperature ??
      medicine.max_temp ??
      medicine.maximum_temperature ??
      ""
    );
  };

  /* =========================================================
     LOAD MEDICINES
  ========================================================= */

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setMedicinesLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/medicines`,
          {
            method: "GET",
            headers: getHeaders(),
            cache: "no-store",
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.message ||
              "Failed to load medicines."
          );
        }

        const list: Medicine[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.medicines)
            ? data.medicines
            : Array.isArray(data?.data)
            ? data.data
            : [];

        setMedicines(list);
      } catch (err) {
        console.error(
          "Load medicines error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load medicines."
        );
      } finally {
        setMedicinesLoading(false);
      }
    };

    loadMedicines();
  }, []);

  /* =========================================================
     SELECT MEDICINE
  ========================================================= */

  const handleMedicineSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = e.target.value;

    setError("");

    if (!selectedId) {
      setForm((previous) => ({
        ...previous,
        medicineId: "",
        medicineName: "",
        medicineType: "",
        manufacturer: "",
        manufacturerId: "",
        minTemp: "",
        maxTemp: "",
      }));

      return;
    }

    const selectedMedicine = medicines.find(
      (medicine) =>
        String(getMedicineId(medicine)) ===
        selectedId
    );

    if (!selectedMedicine) {
      setError(
        "Selected medicine could not be found."
      );
      return;
    }

    /* -------------------------------------------------------
       Show list data immediately
    ------------------------------------------------------- */

    setForm((previous) => ({
      ...previous,

      medicineId: selectedId,

      medicineName:
        getMedicineName(selectedMedicine),

      medicineType:
        getMedicineType(selectedMedicine),

      manufacturer:
        getManufacturerName(selectedMedicine),

      manufacturerId:
        getManufacturerId(selectedMedicine)
          ? String(
              getManufacturerId(selectedMedicine)
            )
          : "",

      minTemp:
        getMinTemperature(selectedMedicine) !== ""
          ? String(
              getMinTemperature(selectedMedicine)
            )
          : "",

      maxTemp:
        getMaxTemperature(selectedMedicine) !== ""
          ? String(
              getMaxTemperature(selectedMedicine)
            )
          : "",
    }));

    /* -------------------------------------------------------
       Fetch complete medicine details
    ------------------------------------------------------- */

    try {
      setMedicineDetailsLoading(true);

      const response = await fetch(
        `${API_URL}/api/medicines/${encodeURIComponent(
          selectedId
        )}`,
        {
          method: "GET",
          headers: getHeaders(),
          cache: "no-store",
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to load medicine details."
        );
      }

      /*
       * Depending on M2 response structure:
       * - direct object
       * - { medicine: {...} }
       * - { data: {...} }
       */

      const fullMedicine =
        data?.medicine ||
        data?.data ||
        data;

      setForm((previous) => ({
        ...previous,

        medicineId: selectedId,

        medicineName:
          getMedicineName(fullMedicine) ||
          previous.medicineName,

        medicineType:
          getMedicineType(fullMedicine) ||
          previous.medicineType,

        manufacturer:
          getManufacturerName(fullMedicine) ||
          previous.manufacturer,

        manufacturerId:
          getManufacturerId(fullMedicine)
            ? String(
                getManufacturerId(fullMedicine)
              )
            : previous.manufacturerId,

        minTemp:
          getMinTemperature(fullMedicine) !== ""
            ? String(
                getMinTemperature(fullMedicine)
              )
            : previous.minTemp,

        maxTemp:
          getMaxTemperature(fullMedicine) !== ""
            ? String(
                getMaxTemperature(fullMedicine)
              )
            : previous.maxTemp,
      }));
    } catch (err) {
      console.error(
        "Medicine details error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load complete medicine details."
      );
    } finally {
      setMedicineDetailsLoading(false);
    }
  };

  /* =========================================================
     NORMAL INPUT CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     CREATE BATCH
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    /* ---------------- VALIDATION ---------------- */

    if (!form.medicineId) {
      setError(
        "Please select a medicine."
      );
      return;
    }

    if (!form.batchId.trim()) {
      setError(
        "Please enter a Batch ID."
      );
      return;
    }

    if (!form.quantity) {
      setError(
        "Please enter the quantity."
      );
      return;
    }

    if (!form.manufacturingDate) {
      setError(
        "Please select the manufacturing date."
      );
      return;
    }

    if (!form.expiryDate) {
      setError(
        "Please select the expiry date."
      );
      return;
    }

    if (
      form.expiryDate <=
      form.manufacturingDate
    ) {
      setError(
        "Expiry date must be after manufacturing date."
      );
      return;
    }

    if (!form.minTemp || !form.maxTemp) {
      setError(
        "Storage temperature information is missing for this medicine."
      );
      return;
    }

    if (
      Number(form.minTemp) >
      Number(form.maxTemp)
    ) {
      setError(
        "Minimum temperature cannot be greater than maximum temperature."
      );
      return;
    }

    if (!form.manufacturer) {
      setError(
        "Manufacturer information is missing for this medicine."
      );
      return;
    }

    try {
      setLoading(true);

      const body: Record<string, unknown> = {
        medicine_id: Number(
          form.medicineId
        ),

        medicine_name:
          form.medicineName,

        batch_number:
          form.batchId.trim(),

        quantity:
          Number(form.quantity),

        manufacturing_date:
          form.manufacturingDate,

        expiry_date:
          form.expiryDate,

        min_temperature:
          Number(form.minTemp),

        max_temperature:
          Number(form.maxTemp),

        manufacturer:
          form.manufacturer,
      };

      /*
       * Send manufacturer_id only when we actually
       * have one from the selected medicine.
       */

      if (form.manufacturerId) {
        body.manufacturer_id =
          Number(form.manufacturerId);
      }

      console.log(
        "Create Batch Payload:",
        body
      );

      const response = await fetch(
        `${API_URL}/api/batches`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(body),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to create batch."
        );
      }

      console.log(
        "Batch Created:",
        data
      );

      const createdBatchId =
        data?.batch_id ||
        data?.batch_number ||
        data?.id ||
        form.batchId;

      /* Go directly to actual batch details */

      window.location.href =
        `/manufacturer/batch/${encodeURIComponent(
          String(createdBatchId)
        )}`;
    } catch (err) {
      console.error(
        "Create batch error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create batch."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-[#E4E7EC] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/manufacturer/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="text-xl font-bold leading-none">
                <span className="text-[#101828]">
                  medi
                </span>

                <span className="text-[#F97316]">
                  Sure
                </span>
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
                Select an existing medicine and
                create its production batch.
              </p>
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* ================= MEDICINE ================= */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#101828]">
                Medicine{" "}
                <span className="text-[#F97316]">
                  *
                </span>
              </label>

              <div className="relative">
                <Pill
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                />

                <select
                  value={form.medicineId}
                  onChange={
                    handleMedicineSelect
                  }
                  required
                  disabled={
                    medicinesLoading ||
                    loading
                  }
                  className="w-full appearance-none rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-10 text-[#101828] outline-none transition focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
                >
                  <option value="">
                    {medicinesLoading
                      ? "Loading medicines..."
                      : medicines.length === 0
                      ? "No medicines available"
                      : "Select medicine"}
                  </option>

                  {medicines.map(
                    (medicine) => {
                      const id =
                        getMedicineId(
                          medicine
                        );

                      return (
                        <option
                          key={String(id)}
                          value={String(id)}
                        >
                          {getMedicineName(
                            medicine
                          )}
                        </option>
                      );
                    }
                  )}
                </select>

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

              {medicineDetailsLoading && (
                <p className="mt-2 text-xs text-[#667085]">
                  Loading complete medicine details...
                </p>
              )}

              {!medicinesLoading &&
                medicines.length === 0 && (
                  <p className="mt-2 text-xs text-[#B54708]">
                    Create a medicine first before
                    creating its batch.
                  </p>
                )}
            </div>

            {/* ================= MEDICINE TYPE ================= */}

            <ReadOnlyField
              label="Medicine Type"
              value={
                form.medicineType ||
                "Select a medicine"
              }
            />

            {/* ================= MANUFACTURER ================= */}

            <ReadOnlyField
              label="Manufacturer"
              value={
                form.manufacturer ||
                "Select a medicine"
              }
              icon={
                <Building2 size={18} />
              }
            />

            {/* ================= BATCH ID ================= */}

            <InputField
              label="Batch ID"
              name="batchId"
              placeholder="e.g. MED-2026-004"
              value={form.batchId}
              onChange={handleChange}
              icon={<Hash size={18} />}
              disabled={loading}
            />

            {/* ================= QUANTITY ================= */}

            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="e.g. 1000"
              value={form.quantity}
              onChange={handleChange}
              icon={<Boxes size={18} />}
              disabled={loading}
            />

            {/* ================= MANUFACTURING DATE ================= */}

            <InputField
              label="Manufacturing Date"
              name="manufacturingDate"
              type="date"
              value={
                form.manufacturingDate
              }
              onChange={handleChange}
              icon={
                <CalendarDays size={18} />
              }
              disabled={loading}
            />

            {/* ================= EXPIRY DATE ================= */}

            <InputField
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              icon={
                <CalendarDays size={18} />
              }
              disabled={loading}
            />

            {/* ================= MIN TEMP ================= */}

            <ReadOnlyField
              label="Minimum Storage Temperature (°C)"
              value={
                form.minTemp
                  ? `${form.minTemp}°C`
                  : "Select a medicine"
              }
              icon={
                <Thermometer size={18} />
              }
            />

            {/* ================= MAX TEMP ================= */}

            <ReadOnlyField
              label="Maximum Storage Temperature (°C)"
              value={
                form.maxTemp
                  ? `${form.maxTemp}°C`
                  : "Select a medicine"
              }
              icon={
                <Thermometer size={18} />
              }
            />
          </div>

          {/* ================= SELECTED MEDICINE ================= */}

          {form.medicineId && (
            <div className="mt-7 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
              <p className="text-sm font-semibold text-[#101828]">
                Selected Medicine
              </p>

              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#667085]">
                    Medicine
                  </p>

                  <p className="mt-1 font-semibold text-[#101828]">
                    {form.medicineName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Manufacturer
                  </p>

                  <p className="mt-1 font-semibold text-[#101828]">
                    {form.manufacturer ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Storage
                  </p>

                  <p className="mt-1 font-semibold text-[#101828]">
                    {form.minTemp &&
                    form.maxTemp
                      ? `${form.minTemp}°C – ${form.maxTemp}°C`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= INFO ================= */}

          <div className="mt-7 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
            <p className="text-sm leading-6 text-[#475467]">
              <strong className="text-[#101828]">
                Next step:
              </strong>{" "}
              After creating this batch, MediSure
              will create its traceable identity and
              open the batch details page with its QR.
            </p>
          </div>

          {/* ================= BUTTON ================= */}

          <button
            type="submit"
            disabled={
              loading ||
              medicinesLoading ||
              medicineDetailsLoading ||
              medicines.length === 0 ||
              !form.medicineId
            }
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 py-4 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#008F68] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PackagePlus size={20} />

            {loading
              ? "Creating Batch..."
              : "Create Medicine Batch"}
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
                <span className="text-[#F97316]">
                  Sure
                </span>
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

          {/* Right */}

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

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#101828]">
        {label}
        <span className="ml-1 text-[#F97316]">
          *
        </span>
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
          className="w-full rounded-xl border border-[#E4E7EC] bg-white py-3 pl-10 pr-4 text-[#101828] outline-none transition placeholder:text-[#94A3B8] focus:border-[#00A878] focus:ring-2 focus:ring-[#ECFDF5] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
        />
      </div>
    </div>
  );
}

/* =========================================================
   READ ONLY FIELD
========================================================= */

function ReadOnlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#101828]">
        {label}
        <span className="ml-1 text-[#F97316]">
          *
        </span>
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
            {icon}
          </div>
        )}

        <input
          type="text"
          value={value}
          readOnly
          className={`w-full rounded-xl border border-[#E4E7EC] bg-[#F2F4F7] py-3 ${
            icon ? "pl-10" : "px-4"
          } pr-4 text-[#101828] outline-none`}
        />
      </div>
    </div>
  );
}