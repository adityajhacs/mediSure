"use client";

import { Suspense, useEffect, useState } from "react";
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
  distributor?: string;
  pharmacy?: string;
  current_owner?: string;
  status?: string;
  blockchain_verified?: boolean;
  blockchain_tx_id?: string;
  temperature_status?: string;
};

type Verification = {
  status?: string;
  reason?: string;
  trust_score?: number;
  verified?: boolean;
  duplicate_detected?: boolean;
  qr_proof_verified?: boolean;
  scan_count?: number;
  batch_verification?: {
    status?: string;
    reason?: string;
    trust_score?: number;
  };
};

function VerificationPageContent() {
  const searchParams = useSearchParams();
  const medicineId = searchParams.get("id");

  const [medicine, setMedicine] = useState<Batch | null>(null);
  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!medicineId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const loadVerification = async () => {
      try {
        setLoading(true);
        setError("");

        const [batchResponse, verificationResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/batches/${encodeURIComponent(
                medicineId
              )}`
            ),
            fetch(
              `${API_URL}/api/verify/${encodeURIComponent(
                medicineId
              )}`
            ),
          ]);

        const batchData = await batchResponse.json();
        const verificationData =
          await verificationResponse.json();

        if (!batchResponse.ok) {
          throw new Error(
            batchData.detail || "Medicine batch not found."
          );
        }

        if (!verificationResponse.ok) {
          throw new Error(
            verificationData.detail ||
              "Verification failed."
          );
        }

        setMedicine(batchData);
        setVerification(verificationData);
      } catch (err) {
        console.error(
          "Verification loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load verification result."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVerification();
  }, [medicineId]);

  if (loading) {
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

            <p className="mt-2 text-sm text-[#475467]">
              Checking medicine identity and supply-chain records...
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-10 text-center shadow-sm">
            <ShieldCheck
              size={42}
              className="mx-auto animate-pulse text-[#00A878]"
            />

            <h2 className="mt-4 text-xl font-bold text-[#101828]">
              Verifying medicine...
            </h2>

            <p className="mt-2 text-sm text-[#667085]">
              Checking blockchain, participants, supply chain and
              verification records.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!medicineId || !medicine) {
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

            <p className="mt-2 text-sm text-[#475467]">
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
              Open the Inventory page and click Verify on the medicine
              you want to check.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !verification) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <section className="border-b border-[#E4E7EC] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
              <AlertTriangle size={15} />
              Pharmacy Verification
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
              Verification Result
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-8 text-center">
            <AlertTriangle
              size={42}
              className="mx-auto text-orange-500"
            />

            <h2 className="mt-4 text-xl font-bold text-[#101828]">
              Verification Failed
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
              {error || "Unable to retrieve verification data."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const medicineName =
    medicine.medicine_name ||
    medicine.medicine ||
    "Unknown Medicine";

  const batchNumber =
    medicine.batch_number ||
    medicine.batch_id;

  const isVerified =
    String(
      verification.status ||
        verification.batch_verification?.status ||
        ""
    ).toUpperCase() === "VERIFIED";

  const trustScore =
    verification.trust_score ??
    verification.batch_verification?.trust_score ??
    0;

  const reason =
    verification.reason ||
    verification.batch_verification?.reason ||
    "";

  const duplicateDetected =
    verification.duplicate_detected === true;

  const qrProofVerified =
    verification.qr_proof_verified !== false;

  const manufacturerPassed =
    Boolean(medicine.manufacturer);

  const distributorPassed =
    Boolean(medicine.distributor);

  const pharmacyPassed =
    Boolean(medicine.pharmacy || medicine.current_owner);

  const blockchainPassed =
    medicine.blockchain_verified === true;

  const temperaturePassed =
    String(medicine.temperature_status || "")
      .toUpperCase()
      .includes("NORMAL") ||
    String(medicine.temperature_status || "")
      .toUpperCase()
      .includes("OK") ||
    medicine.temperature_status === undefined;

  const supplyChainPassed =
    manufacturerPassed &&
    distributorPassed &&
    pharmacyPassed;

  const checks = [
    {
      title: "Product Identity",
      passed: true,
      description: `${medicineName} exists in the registered medicine database.`,
      icon: Package,
    },
    {
      title: "Batch Verification",
      passed: true,
      description: `Batch ${batchNumber} is registered and linked to this medicine.`,
      icon: ShieldCheck,
    },
    {
      title: "Manufacturer",
      passed: manufacturerPassed,
      description: manufacturerPassed
        ? `${medicine.manufacturer} is recorded for this batch.`
        : "Manufacturer information is missing.",
      icon: Factory,
    },
    {
      title: "Distributor",
      passed: distributorPassed,
      description: distributorPassed
        ? `${medicine.distributor} is recorded in the supply chain.`
        : "Distributor information is missing.",
      icon: Truck,
    },
    {
      title: "Pharmacy",
      passed: pharmacyPassed,
      description: pharmacyPassed
        ? "Current pharmacy ownership is recorded."
        : "Pharmacy ownership could not be verified.",
      icon: Store,
    },
    {
      title: "Supply Chain",
      passed: supplyChainPassed,
      description: supplyChainPassed
        ? "Manufacturer → Distributor → Pharmacy information is available."
        : "Supply-chain participant information is incomplete.",
      icon: Link2,
    },
    {
      title: "Cold Chain",
      passed: temperaturePassed,
      description: temperaturePassed
        ? "Temperature records are within the expected verification state."
        : "Temperature records indicate a possible cold-chain issue.",
      icon: Thermometer,
    },
    {
      title: "Duplicate Scan Detection",
      passed: !duplicateDetected,
      description: duplicateDetected
        ? "Suspicious duplicate scan activity was detected."
        : "No suspicious duplicate scan activity was detected.",
      icon: ScanLine,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* PAGE HEADER */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div>
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isVerified
                  ? "bg-[#ECFDF5] text-[#008F68]"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {isVerified ? (
                <ShieldCheck size={15} />
              ) : (
                <AlertTriangle size={15} />
              )}

              Pharmacy Verification
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
              Verification Result
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
              Review the verification checks performed using the current
              backend verification data.
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
                <p
                  className={`text-sm font-medium ${
                    isVerified
                      ? "text-[#008F68]"
                      : "text-orange-600"
                  }`}
                >
                  Final Verification Status
                </p>

                <p
                  className={`mt-1 text-3xl font-bold ${
                    isVerified
                      ? "text-[#008F68]"
                      : "text-[#F97316]"
                  }`}
                >
                  {isVerified
                    ? "VERIFIED"
                    : "SUSPICIOUS"}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white px-8 py-5">
              <p className="text-xs font-medium text-[#667085]">
                Trust Score
              </p>

              <p
                className={`mt-1 text-3xl font-bold ${
                  isVerified
                    ? "text-[#00A878]"
                    : "text-[#F97316]"
                }`}
              >
                {trustScore}
                <span className="text-lg">/100</span>
              </p>
            </div>
          </div>

          {reason && (
            <div className="mt-6 rounded-xl bg-white/80 px-4 py-3 text-sm text-[#475467]">
              <span className="font-semibold text-[#101828]">
                Verification reason:
              </span>{" "}
              {reason}
            </div>
          )}
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
                  {medicineName}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Medicine ID: {medicine.batch_id} · Batch:{" "}
                  {batchNumber}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] px-6 py-4 md:min-w-[170px] md:text-right">
              <p className="text-xs font-medium text-[#667085]">
                Verification Confidence
              </p>

              <p
                className={`mt-1 text-3xl font-bold ${
                  isVerified
                    ? "text-[#00A878]"
                    : "text-[#F97316]"
                }`}
              >
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
            Checks are displayed from the current medicine and backend
            verification data.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {checks.map((check) => {
            const Icon = check.icon;

            return (
              <div
                key={check.title}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  check.passed
                    ? "border-[#E4E7EC] hover:border-[#A7F3D0]"
                    : "border-orange-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      check.passed
                        ? "bg-[#ECFDF5] text-[#00A878]"
                        : "bg-orange-50 text-orange-500"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-bold text-[#101828]">
                        {check.title}
                      </h3>

                      <span
                        className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          check.passed
                            ? "bg-[#ECFDF5] text-[#008F68]"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {check.passed ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <AlertTriangle size={13} />
                        )}

                        {check.passed
                          ? "PASSED"
                          : "FLAGGED"}
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
                Why this medicine received this result
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
                The displayed result uses the backend verification response
                together with recorded medicine, participant, blockchain,
                temperature and scan information.
              </p>
            </div>

            <div className="shrink-0 md:text-right">
              <p
                className={`text-5xl font-bold ${
                  isVerified
                    ? "text-[#00A878]"
                    : "text-[#F97316]"
                }`}
              >
                {trustScore}
                <span className="text-2xl">/100</span>
              </p>

              <p className="mt-1 text-sm font-medium text-[#667085]">
                Verification confidence
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ScoreItem
              label="Manufacturer"
              passed={manufacturerPassed}
            />

            <ScoreItem
              label="Distributor"
              passed={distributorPassed}
            />

            <ScoreItem
              label="Pharmacy"
              passed={pharmacyPassed}
            />

            <ScoreItem
              label="Blockchain"
              passed={blockchainPassed}
            />

            <ScoreItem
              label="Cold Chain"
              passed={temperaturePassed}
            />
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-[#475467]">
                Verification confidence
              </span>

              <span
                className={`font-semibold ${
                  isVerified
                    ? "text-[#00A878]"
                    : "text-[#F97316]"
                }`}
              >
                {trustScore}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#E4E7EC]">
              <div
                className={`h-full rounded-full ${
                  isVerified
                    ? "bg-[#00A878]"
                    : "bg-[#F97316]"
                }`}
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, trustScore)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL MESSAGE */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div
          className={`rounded-2xl border p-6 ${
            isVerified
              ? "border-[#A7F3D0] bg-[#ECFDF5]"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ${
                isVerified
                  ? "text-[#00A878]"
                  : "text-[#F97316]"
              }`}
            >
              {isVerified ? (
                <CheckCircle2 size={22} />
              ) : (
                <AlertTriangle size={22} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-[#101828]">
                {medicineName}{" "}
                {isVerified
                  ? "verified successfully"
                  : "requires attention"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#475467]">
                {isVerified
                  ? "The available backend verification checks passed successfully based on the current verification data."
                  : reason ||
                    "The backend verification identified an inconsistency that should be reviewed before treating this medicine as verified."}
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
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        passed
          ? "border-[#E4E7EC] bg-[#F8FAFC]"
          : "border-orange-200 bg-orange-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {passed ? (
          <CheckCircle2
            size={17}
            className="text-[#00A878]"
          />
        ) : (
          <AlertTriangle
            size={17}
            className="text-[#F97316]"
          />
        )}

        <p className="text-sm font-semibold text-[#101828]">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 text-sm font-bold ${
          passed
            ? "text-[#00A878]"
            : "text-[#F97316]"
        }`}
      >
        {passed ? "PASSED" : "FLAGGED"}
      </p>
    </div>
  );
}
export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
              <p className="text-sm text-[#667085]">
                Loading verification...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <VerificationPageContent />
    </Suspense>
  );
}