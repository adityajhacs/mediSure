"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ScanLine,
  Search,
  ArrowRight,
  Factory,
  Truck,
  Store,
  Thermometer,
  Link2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function Home() {
  const [batchId, setBatchId] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    if (batchId.trim()) {
      setVerified(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">MediSure</h1>
              <p className="text-xs text-slate-500">Scan. Trace. Trust.</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#verify" className="text-slate-700 hover:text-emerald-600">
              Verify Medicine
            </a>
            <a href="#how" className="text-slate-700 hover:text-emerald-600">
              How It Works
            </a>
            <a href="#features" className="text-slate-700 hover:text-emerald-600">
              Features
            </a>
          </div>

          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Manufacturer Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <ShieldCheck size={17} />
              Blockchain-powered medicine verification
            </div>

            <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Know your medicine.
              <span className="text-emerald-600"> Trust its journey.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              MediSure helps patients verify medicines by tracing their
              supply-chain journey and checking authenticity, cold-chain
              conditions and verification history.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#verify"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Verify a Medicine
                <ArrowRight size={18} />
              </a>

              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                How it works
              </a>
            </div>
          </div>

          {/* TRUST CARD */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Sample verification
                </p>
                <h3 className="mt-1 text-xl font-bold">Paracetamol 500mg</h3>
              </div>

              <CheckCircle2 className="text-emerald-600" size={30} />
            </div>

            <div className="rounded-2xl bg-white p-6">
              <p className="text-center text-sm font-medium text-slate-500">
                TRUST SCORE
              </p>

              <div className="my-3 text-center">
                <span className="text-5xl font-bold text-emerald-600">92</span>
                <span className="text-lg text-slate-400"> / 100</span>
              </div>

              <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[92%] rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Manufacturer verified</span>
                  <span className="font-semibold text-emerald-600">+20 ✓</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Distributor verified</span>
                  <span className="font-semibold text-emerald-600">+20 ✓</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Pharmacy verified</span>
                  <span className="font-semibold text-emerald-600">+20 ✓</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Blockchain history</span>
                  <span className="font-semibold text-emerald-600">+20 ✓</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Cold chain maintained</span>
                  <span className="font-semibold text-emerald-600">+10 ✓</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
                <p className="font-bold text-emerald-700">
                  ✓ TRUSTED MEDICINE
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  Verification based on supply-chain evidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFY SECTION */}
      <section id="verify" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <ScanLine size={28} />
            </div>

            <h2 className="mt-5 text-3xl font-bold">
              Verify your medicine
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Scan the medicine QR code or enter the batch ID to check its
              supply-chain journey.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 py-8 font-semibold text-emerald-700 hover:bg-emerald-100">
              <ScanLine size={22} />
              Scan QR Code
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <label className="text-sm font-semibold text-slate-700">
              Enter Batch ID
            </label>

            <div className="mt-2 flex gap-3">
              <input
                value={batchId}
                onChange={(e) => {
                  setBatchId(e.target.value);
                  setVerified(false);
                }}
                placeholder="e.g. MED-2026-001"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              <button
                onClick={handleVerify}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                <Search size={18} />
                Verify
              </button>
            </div>

            {verified && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-emerald-600"
                    size={22}
                  />

                  <div>
                    <p className="font-bold text-emerald-700">
                      Demo verification successful
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      Batch <strong>{batchId}</strong> is ready for backend
                      verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-emerald-600">HOW IT WORKS</p>
            <h2 className="mt-2 text-3xl font-bold">
              Scan → Trace → Trust
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Step
              icon={<Factory size={25} />}
              number="01"
              title="Manufacturer"
              text="Medicine batch is created and registered with a unique identity."
            />

            <Step
              icon={<Truck size={25} />}
              number="02"
              title="Distributor"
              text="Every transfer is recorded as the medicine moves through the supply chain."
            />

            <Step
              icon={<Store size={25} />}
              number="03"
              title="Pharmacy"
              text="Pharmacy receives and verifies the medicine before making it available."
            />

            <Step
              icon={<ScanLine size={25} />}
              number="04"
              title="Patient"
              text="Patient scans the QR and checks the complete verification report."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-emerald-600">OUR USP</p>
            <h2 className="mt-2 text-3xl font-bold">
              More than just a QR scanner
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              MediSure evaluates the complete medicine journey instead of
              simply checking whether a QR code exists.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon={<ShieldCheck size={25} />}
              title="Trust Score"
              text="Get an explainable score based on manufacturer, distributor, pharmacy, blockchain and cold-chain verification."
            />

            <Feature
              icon={<Thermometer size={25} />}
              title="Cold-Chain Risk"
              text="Detect temperature violations that may affect medicines requiring controlled storage."
            />

            <Feature
              icon={<Link2 size={25} />}
              title="Tamper & Duplicate Detection"
              text="Identify suspicious supply-chain changes and unusual repeated QR verification patterns."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row">
          <div>
            <p className="font-bold">MediSure</p>
            <p className="text-sm text-slate-500">
              Scan. Trace. Trust.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Blockchain-powered medicine traceability
          </p>
        </div>
      </footer>
    </main>
  );
}

function Step({
  icon,
  number,
  title,
  text,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          {icon}
        </div>

        <span className="text-sm font-bold text-slate-300">{number}</span>
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}