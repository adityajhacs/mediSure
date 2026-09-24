"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Thermometer,
  Truck,
  ShieldAlert,
  Package,
  ArrowRight,
} from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Temperature Violation Detected",
    description:
      "A temperature reading outside the expected range was recorded during medicine transit.",
    medicine: "Azithromycin 500mg",
    medicineId: "MED-002",
    batch: "AZM2026B04",
    time: "2 hours ago",
    icon: Thermometer,
  },
  {
    id: 2,
    type: "danger",
    title: "Suspicious Verification Attempt",
    description:
      "A medicine batch failed one or more verification checks and requires review.",
    medicine: "Amoxicillin 250mg",
    medicineId: "MED-003",
    batch: "AMX2026C02",
    time: "5 hours ago",
    icon: ShieldAlert,
  },
  {
    id: 3,
    type: "warning",
    title: "Incoming Medicine Pending",
    description:
      "A medicine shipment from the distributor is waiting to be received by the pharmacy.",
    medicine: "Paracetamol 500mg",
    medicineId: "MED-001",
    batch: "PCM2026A01",
    time: "Yesterday",
    icon: Truck,
  },
  {
    id: 4,
    type: "info",
    title: "Medicine Batch Received",
    description:
      "The pharmacy successfully received a medicine batch from the distributor.",
    medicine: "Cetirizine 10mg",
    medicineId: "MED-004",
    batch: "CTR2026D05",
    time: "Yesterday",
    icon: Package,
  },
];

export default function AlertsPage() {
  const activeAlerts = alerts.filter(
    (alert) => alert.type === "warning" || alert.type === "danger"
  );

  const resolvedAlerts = alerts.filter(
    (alert) => alert.type === "info"
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* PAGE HEADER */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#F97316]">
                <Bell size={15} />
                Pharmacy Alerts
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
                Alerts & Notifications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
                Review important medicine, supply-chain and verification
                events that require pharmacy attention.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F97316]">
              <Bell size={26} />
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <SummaryCard
            icon={<AlertTriangle size={21} />}
            label="Active Alerts"
            value="3"
            description="Require attention"
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            label="Recent Events"
            value="4"
            description="Recorded recently"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Resolved"
            value="1"
            description="Successfully handled"
          />
        </div>
      </section>

      {/* ACTIVE ALERTS */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#101828]">
            Active Alerts
          </h2>

          <p className="mt-1 text-sm text-[#667085]">
            Alerts that may require action from the pharmacy.
          </p>
        </div>

        <div className="space-y-4">
          {activeAlerts.map((alert) => {
            const Icon = alert.icon;
            const isDanger = alert.type === "danger";

            return (
              <div
                key={alert.id}
                className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        isDanger
                          ? "bg-red-50 text-red-600"
                          : "bg-[#FFF7ED] text-[#F97316]"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#101828]">
                          {alert.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isDanger
                              ? "bg-red-50 text-red-600"
                              : "bg-[#FFF7ED] text-[#F97316]"
                          }`}
                        >
                          {isDanger ? "HIGH PRIORITY" : "ATTENTION"}
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                        {alert.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#667085]">
                        <span>
                          <strong className="text-[#475467]">
                            Medicine:
                          </strong>{" "}
                          {alert.medicine}
                        </span>

                        <span>
                          <strong className="text-[#475467]">
                            Batch:
                          </strong>{" "}
                          {alert.batch}
                        </span>

                        <span>
                          <strong className="text-[#475467]">
                            Time:
                          </strong>{" "}
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/verification?id=${alert.medicineId}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#008F68]"
                  >
                    Review
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RECENT EVENTS */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#101828]">
            Recent Events
          </h2>

          <p className="mt-1 text-sm text-[#667085]">
            Recent supply-chain and pharmacy activity.
          </p>
        </div>

        <div className="space-y-4">
          {resolvedAlerts.map((alert) => {
            const Icon = alert.icon;

            return (
              <div
                key={alert.id}
                className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#101828]">
                          {alert.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#667085]">
                          {alert.description}
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                        <CheckCircle2 size={13} />
                        RESOLVED
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#667085]">
                      <span>
                        <strong className="text-[#475467]">
                          Medicine:
                        </strong>{" "}
                        {alert.medicine}
                      </span>

                      <span>
                        <strong className="text-[#475467]">
                          Batch:
                        </strong>{" "}
                        {alert.batch}
                      </span>

                      <span>
                        <strong className="text-[#475467]">
                          {alert.time}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A7F3D0] hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-[#667085]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#101828]">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#667085]">
        {description}
      </p>
    </div>
  );
}