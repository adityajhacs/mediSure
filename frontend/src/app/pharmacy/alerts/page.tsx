
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type BackendAlert = {
  id: number;
  batch_id: string;
  type: string;
  message: string;
  severity: string;
  timestamp: string;
  resolved: boolean;
};

type DisplayAlert = BackendAlert & {
  title: string;
  description: string;
  icon: typeof Thermometer;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<DisplayAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/alerts`);

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const data = await response.json();

        const mappedAlerts: DisplayAlert[] = (data.alerts || []).map(
          (alert: BackendAlert) => {
            let title = "Pharmacy Alert";
            let Icon = AlertTriangle;

            if (alert.type === "TEMPERATURE") {
              title = "Temperature Violation Detected";
              Icon = Thermometer;
            } else if (alert.type === "VERIFICATION") {
              title = "Suspicious Verification Attempt";
              Icon = ShieldAlert;
            } else if (alert.type === "TRANSFER") {
              title = "Supply Chain Transfer Alert";
              Icon = Truck;
            } else if (alert.type === "RECEIVED") {
              title = "Medicine Batch Received";
              Icon = Package;
            }

            return {
              ...alert,
              title,
              description: alert.message,
              icon: Icon,
            };
          }
        );

        setAlerts(mappedAlerts);
      } catch (error) {
        console.error("Error loading alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const activeAlerts = alerts.filter((alert) => !alert.resolved);

  const resolvedAlerts = alerts.filter((alert) => alert.resolved);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getMedicineName = (batchId: string) => {
    const medicineNames: Record<string, string> = {
      "MED-001": "Paracetamol 500mg",
      "MED-002": "Azithromycin 500mg",
      "MED-003": "Amoxicillin 250mg",
      "MED-004": "Cetirizine 10mg",
    };

    return medicineNames[batchId] || "Medicine Batch";
  };

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
            value={loading ? "..." : String(activeAlerts.length)}
            description="Require attention"
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            label="Recent Events"
            value={loading ? "..." : String(alerts.length)}
            description="Recorded recently"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Resolved"
            value={loading ? "..." : String(resolvedAlerts.length)}
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

        {loading ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#667085]">
            Loading alerts...
          </div>
        ) : activeAlerts.length === 0 ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
            <CheckCircle2
              size={30}
              className="mx-auto text-[#00A878]"
            />
            <p className="mt-3 font-semibold text-[#101828]">
              No active alerts
            </p>
            <p className="mt-1 text-sm text-[#667085]">
              All pharmacy events are currently under control.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => {
              const Icon = alert.icon;
              const isDanger =
                alert.severity.toUpperCase() === "HIGH";

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
                            {isDanger
                              ? "HIGH PRIORITY"
                              : "ATTENTION"}
                          </span>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                          {alert.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#667085]">
                          <span>
                            <strong className="text-[#475467]">
                              Batch:
                            </strong>{" "}
                            {alert.batch_id}
                          </span>

                          <span>
                            <strong className="text-[#475467]">
                              Medicine:
                            </strong>{" "}
                            {getMedicineName(alert.batch_id)}
                          </span>

                          <span>
                            <strong className="text-[#475467]">
                              Time:
                            </strong>{" "}
                            {formatTime(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/pharmacy/verification?id=${encodeURIComponent(
  alert.batch_id
)}`}
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
        )}
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

        {loading ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#667085]">
            Loading events...
          </div>
        ) : resolvedAlerts.length === 0 ? (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#667085]">
            No resolved events yet.
          </div>
        ) : (
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
                          {getMedicineName(alert.batch_id)}
                        </span>

                        <span>
                          <strong className="text-[#475467]">
                            Batch:
                          </strong>{" "}
                          {alert.batch_id}
                        </span>

                        <span>
                          <strong className="text-[#475467]">
                            {formatTime(alert.timestamp)}
                          </strong>
                        </span>
                      </div>
                    </div>
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
