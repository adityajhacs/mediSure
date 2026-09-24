"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Batch = {
  batch_id?: string;
  id?: string;
  medicine_name?: string;
  medicine?: string;
  batch_number?: string;
  quantity?: number;
  status?: string;
  blockchain_verified?: boolean;
  temperature_status?: string;
  created_at?: string;
};

type AlertItem = {
  id?: string;
  batch_id?: string;
  alert_type?: string;
  message?: string;
  severity?: string;
};

type Stat = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

export default function Dashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [batchesResponse, alertsResponse] = await Promise.all([
          fetch(`${API_URL}/api/batches`),
          fetch(`${API_URL}/api/alerts`),
        ]);

        if (batchesResponse.ok) {
          const batchData = await batchesResponse.json();
          setBatches(
            Array.isArray(batchData.batches)
              ? batchData.batches
              : []
          );
        }

        if (alertsResponse.ok) {
          const alertData = await alertsResponse.json();
          setAlerts(
            Array.isArray(alertData.alerts)
              ? alertData.alerts
              : []
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const incomingCount = batches.filter(
    (batch) => batch.status === "IN_TRANSIT"
  ).length;

  const availableCount = batches.filter(
    (batch) => batch.status === "AVAILABLE"
  ).length;

  const verifiedCount = batches.filter(
    (batch) => batch.blockchain_verified === true
  ).length;

  const stats: Stat[] = [
    {
      title: "Incoming Medicines",
      value: loading ? "..." : String(incomingCount),
      description: "Awaiting receipt",
      icon: Truck,
    },
    {
      title: "Available Medicines",
      value: loading ? "..." : String(availableCount),
      description: "Currently in pharmacy",
      icon: Package,
    },
    {
      title: "Verified Batches",
      value: loading ? "..." : String(verifiedCount),
      description: "Successfully verified",
      icon: ShieldCheck,
    },
    {
      title: "Alerts",
      value: loading ? "..." : String(alerts.length),
      description: "Require attention",
      icon: AlertTriangle,
    },
  ];

  const recentMedicines = [...batches]
    .sort((a, b) => {
      const dateA = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const dateB = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                <ShieldCheck size={15} />
                Pharmacy Portal
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
                Pharmacy Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#475467]">
                Manage medicines, batches and supply-chain verification.
              </p>
            </div>

            <Link
              href="/pharmacy/incoming"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68]"
            >
              View Incoming Medicines
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
                  <Icon size={21} />
                </div>

                <p className="mt-5 text-sm font-medium text-[#667085]">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-[#101828]">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <QuickAction
            href="/pharmacy/incoming"
            icon={Truck}
            title="Incoming Medicines"
            description="Review medicines sent by distributors."
          />

          <QuickAction
            href="/pharmacy/inventory"
            icon={Package}
            title="View Inventory"
            description="Manage medicines currently available."
          />

          <QuickAction
            href="/pharmacy/verification"
            icon={ShieldCheck}
            title="Verify Medicine"
            description="Check medicine authenticity and traceability."
          />
        </div>
      </section>

      {/* Recent Medicines */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E4E7EC] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#101828]">
                Recent Medicines
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Recently received and tracked medicine batches.
              </p>
            </div>

            <Link
              href="/pharmacy/inventory"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#00A878] hover:text-[#008F68]"
            >
              View Inventory
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Batch ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Medicine
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Batch
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-[#667085]"
                    >
                      Loading medicines...
                    </td>
                  </tr>
                ) : recentMedicines.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-[#667085]"
                    >
                      No medicine batches found.
                    </td>
                  </tr>
                ) : (
                  recentMedicines.map((medicine) => {
                    const batchId =
                      medicine.batch_id ||
                      medicine.id ||
                      "N/A";

                    const medicineName =
                      medicine.medicine_name ||
                      medicine.medicine ||
                      "Unknown Medicine";

                    const batchNumber =
                      medicine.batch_number ||
                      medicine.batch_id ||
                      "N/A";

                    const status =
                      medicine.status || "UNKNOWN";

                    return (
                      <tr
                        key={batchId}
                        className="border-t border-[#E4E7EC]"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-[#101828]">
                          {batchId}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#475467]">
                          {medicineName}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#667085]">
                          {batchNumber}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={status} />
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            href={`/pharmacy/batch?batchId=${encodeURIComponent(
                              batchId
                            )}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00A878] hover:text-[#008F68]"
                          >
                            View Details
                            <ArrowRight size={15} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
        <Icon size={21} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-bold text-[#101828]">
          {title}
        </h3>

        <ArrowRight
          size={18}
          className="text-[#667085] transition group-hover:translate-x-1 group-hover:text-[#00A878]"
        />
      </div>

      <p className="mt-1 text-sm leading-6 text-[#667085]">
        {description}
      </p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();

  const isAvailable =
    normalizedStatus === "AVAILABLE";

  const isVerified =
    normalizedStatus === "VERIFIED";

  const isTransit =
    normalizedStatus === "IN_TRANSIT" ||
    normalizedStatus === "IN TRANSIT";

  const badgeClass =
    isAvailable || isVerified
      ? "bg-[#ECFDF5] text-[#008F68]"
      : isTransit
        ? "bg-[#FFF7ED] text-[#F97316]"
        : "bg-[#F2F4F7] text-[#475467]";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
    >
      {status}
    </span>
  );
}