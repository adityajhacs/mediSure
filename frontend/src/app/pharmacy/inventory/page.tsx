
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Package,
  Search,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Batch = {
  batch_id: string;
  id?: string;
  medicine_name?: string;
  medicine?: string;
  batch_number?: string;
  quantity?: number;
  expiry_date?: string;
  manufacturer?: string;
  status?: string;
};

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Batch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/batches`);

        if (!response.ok) {
          throw new Error("Failed to fetch inventory");
        }

        const data = await response.json();

        const availableBatches = (data.batches || []).filter(
          (batch: Batch) =>
            String(batch.status || "").toUpperCase() === "AVAILABLE"
        );

        setMedicines(availableBatches);
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const filteredMedicines = medicines.filter((medicine) => {
    const value = search.toLowerCase();

    const medicineName = (
      medicine.medicine_name ||
      medicine.medicine ||
      ""
    ).toLowerCase();

    const medicineId = (
      medicine.batch_id ||
      medicine.id ||
      ""
    ).toLowerCase();

    const batchNumber = (
      medicine.batch_number ||
      medicine.batch_id ||
      ""
    ).toLowerCase();

    const manufacturer = (
      medicine.manufacturer || ""
    ).toLowerCase();

    return (
      medicineName.includes(value) ||
      medicineId.includes(value) ||
      batchNumber.includes(value) ||
      manufacturer.includes(value)
    );
  });

  const totalQuantity = medicines.reduce(
    (total, medicine) => total + Number(medicine.quantity || 0),
    0
  );

  const formatExpiry = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

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
                  {loading ? "..." : totalQuantity}
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

          {search && !loading && (
            <p className="mt-3 text-xs text-[#667085]">
              Showing {filteredMedicines.length} result
              {filteredMedicines.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>

      {/* Inventory */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-10 text-center">
            <Package
              size={40}
              className="mx-auto animate-pulse text-[#00A878]"
            />

            <h2 className="mt-4 text-lg font-bold text-[#101828]">
              Loading inventory...
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Fetching available medicines from the pharmacy backend.
            </p>
          </div>
        ) : filteredMedicines.length === 0 ? (
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
            {filteredMedicines.map((medicine) => {
              const medicineId =
                medicine.batch_id || medicine.id || "";

              const medicineName =
                medicine.medicine_name ||
                medicine.medicine ||
                "Unknown Medicine";

              const batchNumber =
                medicine.batch_number ||
                medicine.batch_id ||
                "N/A";

              const quantity = Number(medicine.quantity || 0);

              return (
                <div
                  key={medicineId}
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
                          {medicineName}
                        </h2>

                        <p className="mt-1 text-sm text-[#667085]">
                          {medicineId} · Batch {batchNumber}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                      <CheckCircle2 size={14} />
                      {medicine.status || "AVAILABLE"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-medium text-[#667085]">
                        Quantity
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#101828]">
                        {quantity}
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
                          {formatExpiry(medicine.expiry_date)}
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
                      {medicine.manufacturer || "N/A"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-3">
                    <Link
                     href={`/pharmacy/batch?id=${encodeURIComponent(medicineId)}`}
                      className="flex-1 rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-center text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
                    >
                      View Details
                    </Link>

                    <Link
                     href={`/pharmacy/verification?id=${encodeURIComponent(
  medicineId
)}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00A878] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68]"
                    >
                      <ShieldCheck size={17} />
                      Verify
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
