"use client";

import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Factory,
  Link2,
  Package,
  ScanLine,
  ShieldCheck,
  Store,
  Thermometer,
  Truck,
} from "lucide-react";
import { useMemo } from "react";

const medicines = [
  {
    id: "MED-001",
    name: "Paracetamol 500mg",
    batch: "PCM2026A01",
    quantity: 500,
    expiry: "Dec 2027",
    manufacturer: "Jharkhand Pharma",
    distributor: "HealthCare Distributors",
  },
  {
    id: "MED-002",
    name: "Azithromycin 500mg",
    batch: "AZM2026B04",
    quantity: 300,
    expiry: "Aug 2027",
    manufacturer: "MediCare Labs",
    distributor: "MediSupply Pvt. Ltd.",
  },
  {
    id: "MED-003",
    name: "Amoxicillin 250mg",
    batch: "AMX2026C02",
    quantity: 250,
    expiry: "Nov 2027",
    manufacturer: "HealthGen Pharma",
    distributor: "Jharkhand Pharma Supply",
  },
  {
    id: "MED-004",
    name: "Cetirizine 10mg",
    batch: "CTR2026D05",
    quantity: 180,
    expiry: "Jan 2028",
    manufacturer: "LifeCare Pharmaceuticals",
    distributor: "HealthCare Distributors",
  },
];

export default function VerificationPage() {
  const searchParams = useSearchParams();

  // Gets the medicine ID from:
  // /verification?id=MED-001
  const medicineId = searchParams.get("id");

  const medicine = useMemo(() => {
    return medicines.find((item) => item.id === medicineId);
  }, [medicineId]);

  // Don't show a random/hardcoded medicine
  if (!medicine) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <section className="border-b border-[#E4E7EC] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#008F68]">
              <ShieldCheck size={15} />
              Pharmacy Verification
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
              Verification Result
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Select a medicine from inventory to perform verification.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
              <Package size={28} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#101828]">
              No Medicine Selected
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
              Open the Inventory page and click Verify on the medicine you
              want to check.
            </p>
          </div>
        </section>
      </main>
    );
  }

  /*
   * TEMPORARY FRONTEND VERIFICATION RESULT
   *
   * This is still dummy verification until M2 API is connected.
   * The MEDICINE itself is now completely dynamic.
   */
  const isVerified = true;
  const trustScore = 100;

  const checks = [
    {
      title: "Product Identity",
      description: `${medicine.name} exists in the registered medicine database.`,
      icon: Package,
    },
    {
      title: "Batch Verification",
      description: `Batch ${medicine.batch} is registered and linked to this medicine.`,
      icon: ShieldCheck,
    },
    {
      title: "Manufacturer",
      description: `${medicine.manufacturer} is registered and authorized.`,
      icon: Factory,
    },
    {
      title: "Distributor",
      description: `${medicine.distributor} is recorded in the supply chain.`,
      icon: Truck,
    },
    {
      title: "Pharmacy",
      description: "Current pharmacy matches the recorded ownership.",
      icon: Store,
    },
    {
      title: "Supply Chain",
      description:
        "Manufacturer → Distributor → Pharmacy history is complete.",
      icon: Link2,
    },
    {
      title: "Cold Chain",
      description:
        "Temperature records are within the expected range.",
      icon: Thermometer,
    },
    {
      title: "Duplicate Scan Detection",
      description:
        "No suspicious duplicate scan activity was detected.",
      icon: ScanLine,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* PAGE HEADER */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#008F68]">
              <ShieldCheck size={15} />
              Pharmacy Verification
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
              Verification Result
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
              Review the verification checks performed for this medicine
              before confirming its authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div
          className={`rounded-2xl border px-6 py-7 ${
            isVerified
              ? "border-[#A7F3D0] bg-[#ECFDF5]"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-xl bg-white ${
                  isVerified
                    ? "text-[#00A878]"
                    : "text-[#F97316]"
                }`}
              >
                {isVerified ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <AlertTriangle size={32} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-[#008F68]">
                  Final Verification Status
                </p>

                <p
                  className={`mt-1 text-3xl font-bold ${
                    isVerified
                      ? "text-[#008F68]"
                      : "text-[#F97316]"
                  }`}
                >
                  {isVerified ? "VERIFIED" : "SUSPICIOUS"}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white px-8 py-5">
              <p className="text-xs font-medium text-[#667085]">
                Trust Score
              </p>

              <p className="mt-1 text-3xl font-bold text-[#00A878]">
                {trustScore}
                <span className="text-lg">/100</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEDICINE SUMMARY */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
                <Package size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#101828]">
                  {medicine.name}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Medicine ID: {medicine.id} · Batch: {medicine.batch}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] px-6 py-4 md:min-w-[170px] md:text-right">
              <p className="text-xs font-medium text-[#667085]">
                Verification Confidence
              </p>

              <p className="mt-1 text-3xl font-bold text-[#00A878]">
                {trustScore}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFICATION CHECKS */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#101828]">
            Verification Checks
          </h2>

          <p className="mt-1 text-sm text-[#667085]">
            Each check contributes to the final verification result.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {checks.map((check) => {
            const Icon = check.icon;

            return (
              <div
                key={check.title}
                className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A7F3D0] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-bold text-[#101828]">
                        {check.title}
                      </h3>

                      <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                        <CheckCircle2 size={13} />
                        PASSED
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                      {check.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST SCORE */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-2xl border border-[#A7F3D0] bg-white p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#00A878]">
                Explainable Trust Score
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#101828]">
                Why this medicine is trusted
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
                The verification result is based on the recorded identity,
                participants, supply-chain history, blockchain record,
                cold-chain information and scan history.
              </p>
            </div>

            <div className="shrink-0 md:text-right">
              <p className="text-5xl font-bold text-[#00A878]">
                {trustScore}
                <span className="text-2xl">/100</span>
              </p>

              <p className="mt-1 text-sm font-medium text-[#667085]">
                Verification confidence
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ScoreItem label="Manufacturer" score="+20" />
            <ScoreItem label="Distributor" score="+20" />
            <ScoreItem label="Pharmacy" score="+20" />
            <ScoreItem label="Blockchain" score="+20" />
            <ScoreItem label="Cold Chain" score="+10" />
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-[#475467]">
                Verification confidence
              </span>

              <span className="font-semibold text-[#00A878]">
                {trustScore}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#E4E7EC]">
              <div
                className="h-full rounded-full bg-[#00A878]"
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL MESSAGE */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#00A878]">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <h2 className="font-bold text-[#101828]">
                {medicine.name} verified successfully
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#475467]">
                The available verification checks passed successfully.
                The medicine can be treated as verified based on the
                current verification data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ScoreItem({
  label,
  score,
}: {
  label: string;
  score: string;
}) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={17} className="text-[#00A878]" />

        <p className="text-sm font-semibold text-[#101828]">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-bold text-[#00A878]">
        {score}
      </p>
    </div>
  );
}