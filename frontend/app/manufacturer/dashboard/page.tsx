"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Factory,
  Truck,
  Store,
  Thermometer,
  Link2,
  PackagePlus,
  Boxes,
  QrCode,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";

export default function ManufacturerDashboard() {
  return (
    <main className="min-h-screen bg-white text-[#101828]">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link href="/manufacturer/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-[#101828]">medi</span>
                <span className="text-[#F97316]">Sure</span>
              </h1>

              <p className="text-xs text-[#667085]">
                Manufacturer Portal
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/manufacturer/dashboard"
              className="text-[#00A878] hover:text-[#008F68]"
            >
              Dashboard
            </Link>

            <Link
              href="/manufacturer/create-medicine"
              className="text-[#475467] hover:text-[#00A878]"
            >
              Create Medicine
            </Link>

            <Link
              href="/manufacturer/create-batch"
              className="text-[#475467] hover:text-[#00A878]"
            >
              Create Batch
            </Link>

            <Link
              href="/manufacturer/batches"
              className="text-[#475467] hover:text-[#00A878]"
            >
              Batches
            </Link>
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-10 pt-6 lg:grid-cols-2 lg:items-center">

          {/* LEFT */}
<div className="lg:-translate-y-1">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-medium text-[#008F68]">
              <Factory size={17} />
              Manufacturer Supply-Chain Portal
            </div>

            <h2 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[#101828] md:text-6xl">
              Build trust into
              <span className="block text-[#00A878]">
                every medicine.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#475467]">
              Create medicine batches, generate unique QR identities and
              maintain a transparent supply-chain record from manufacturing
              to distribution.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/manufacturer/create-batch"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#008F68]"
              >
                Create New Batch
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/manufacturer/batches"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-6 py-3 font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
              >
                View All Batches
              </Link>

            </div>

            {/* Batch Readiness */}
<div className="mt-8 rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-5">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-base font-semibold text-[#101828]">
  Batch readiness
</p>

      <p className="mt-1 text-sm text-[#667085]">
        Everything needed to create a traceable medicine batch.
      </p>
    </div>

    <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
      READY
    </span>
  </div>

  <div className="mt-5 grid grid-cols-3 gap-3">

    <ReadinessItem
      icon={<PackagePlus size={18} />}
      title="Medicine"
      text="Registered"
    />

    <ReadinessItem
      icon={<QrCode size={18} />}
      title="Batch ID"
      text="Unique"
    />

    <ReadinessItem
      icon={<Thermometer size={18} />}
      title="Storage"
      text="Defined"
    />

  </div>
</div>
          </div>


          {/* RIGHT — MANUFACTURER OVERVIEW */}
          <div className="rounded-3xl border border-[#E4E7EC] bg-[#F8FAFC] p-7 shadow-sm">

            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Manufacturer Overview
                </p>

                <h3 className="mt-1 text-2xl font-bold text-[#101828]">
                  ABC Pharma
                </h3>
              </div>

              <div className="rounded-xl bg-[#ECFDF5] p-3">
                <Factory className="text-[#00A878]" size={25} />
              </div>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">

              <OverviewStat
                icon={<Boxes size={20} />}
                label="Total Batches"
                value="156"
              />

              <OverviewStat
                icon={<PackagePlus size={20} />}
                label="Medicines"
                value="24"
              />

              <OverviewStat
                icon={<Truck size={20} />}
                label="In Transit"
                value="32"
              />

              <OverviewStat
                icon={<CheckCircle2 size={20} />}
                label="Delivered"
                value="86"
              />

            </div>


            {/* Current Activity */}
            <div className="group mt-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#667085]">
                    Latest Batch
                  </p>

                  <p className="mt-1 font-bold text-[#101828]">
                    MED-2026-004
                  </p>

                  <p className="mt-1 text-sm text-[#475467]">
                    Paracetamol 500mg · 1000 units
                  </p>
                </div>

                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                  CREATED
                </span>
              </div>

            </div>


            {/* Quick Actions */}
            <div className="mt-5 grid grid-cols-2 gap-3">

              <Link
                href="/manufacturer/create-medicine"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3 text-sm font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
              >
                <PackagePlus size={17} />
                 New Medicine
              </Link>

              <Link
                href="/manufacturer/create-batch"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#008F68]"
              >
                <QrCode size={17} />
                New Batch
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="border-y border-[#E4E7EC] bg-[#F8FAFC] px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="font-semibold text-[#00A878]">
              MANUFACTURER FLOW
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#101828] md:text-4xl">
              From production to distribution
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[#475467]">
              Every medicine gets a traceable identity before it moves
              through the supply chain.
            </p>
          </div>


          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-stretch">

  <div className="flex-1">
    <Step
      icon={<Factory size={25} />}
      number="01"
      title="Create Medicine"
      text="Register the medicine with its type and required storage conditions."
    />
  </div>

  <div className="hidden items-center md:flex">
    <ArrowRight className="text-[#00A878]" size={24} />
  </div>

  <div className="flex-1">
    <Step
      icon={<Boxes size={25} />}
      number="02"
      title="Create Batch"
      text="Add batch number, quantity, manufacturing date and expiry information."
    />
  </div>

  <div className="hidden items-center md:flex">
    <ArrowRight className="text-[#00A878]" size={24} />
  </div>

  <div className="flex-1">
    <Step
      icon={<QrCode size={25} />}
      number="03"
      title="Generate QR"
      text="Assign a unique QR identity that stays linked to the medicine batch."
    />
  </div>

  <div className="hidden items-center md:flex">
    <ArrowRight className="text-[#00A878]" size={24} />
  </div>

  <div className="flex-1">
    <Step
      icon={<Truck size={25} />}
      number="04"
      title="Transfer"
      text="Send the batch to a registered distributor and record the movement."
    />
  </div>

</div>

        </div>
      </section>


      {/* ================= SCAN TRACE TRUST ================= */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">

           <p className="-translate-y-1 font-semibold text-[#00A878]">
  MEDISURE
</p>

            <h2 className="mt-2 text-3xl font-bold text-[#101828] md:text-4xl">
              Scan. Trace. Trust.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[#475467]">
              Every stage contributes evidence that helps establish
              confidence in the medicine's journey.
            </p>

          </div>


          {/* Pipeline */}
          <div className="mt-14">

            <div className="hidden items-center md:flex">

              <PipelineNode
                icon={<Factory size={23} />}
                title="Manufacturer"
                score="+20"
              />

              <PipelineLine />

              <PipelineNode
                icon={<Truck size={23} />}
                title="Distributor"
                score="+20"
              />

              <PipelineLine />

              <PipelineNode
                icon={<Store size={23} />}
                title="Pharmacy"
                score="+20"
              />

              <PipelineLine />

              <PipelineNode
                icon={<Link2 size={23} />}
                title="Blockchain"
                score="+20"
              />

              <PipelineLine />

              <PipelineNode
                icon={<Thermometer size={23} />}
                title="Cold Chain"
                score="+10"
              />

            </div>


            {/* Mobile */}
            <div className="space-y-4 md:hidden">

              <MobilePipeline
                icon={<Factory size={21} />}
                title="Manufacturer"
                score="+20"
              />

              <MobilePipeline
                icon={<Truck size={21} />}
                title="Distributor"
                score="+20"
              />

              <MobilePipeline
                icon={<Store size={21} />}
                title="Pharmacy"
                score="+20"
              />

              <MobilePipeline
                icon={<Link2 size={21} />}
                title="Blockchain"
                score="+20"
              />

              <MobilePipeline
                icon={<Thermometer size={21} />}
                title="Cold Chain"
                score="+10"
              />

            </div>


{/* Explainable Trust Score */}
<div className="group mx-auto mt-10 max-w-4xl rounded-3xl border border-[#A7F3D0] bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md md:p-8">

  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

    <div>
      <p className="text-sm font-semibold text-[#00A878]">
        EXPLAINABLE TRUST SCORE
      </p>

      <h3 className="mt-1 text-2xl font-bold text-[#101828]">
        Why mediSure is trusted
      </h3>

      <p className="mt-1 text-sm text-[#667085]">
        Each verified stage contributes to the final score.
      </p>
    </div>

    <div className="flex items-end gap-2">
      <span className="text-5xl font-bold text-[#00A878]">
        90
      </span>

      <span className="mb-2 text-lg text-[#667085]">
        / 100
      </span>
    </div>

  </div>


  {/* Score Breakdown */}
  <div className="mt-7 grid gap-3 md:grid-cols-5">

    <ScoreItem
      title="Manufacturer"
      score="+20"
    />

    <ScoreItem
      title="Distributor"
      score="+20"
    />

    <ScoreItem
      title="Pharmacy"
      score="+20"
    />

    <ScoreItem
      title="Blockchain"
      score="+20"
    />

    <ScoreItem
      title="Cold Chain"
      score="+10"
    />

  </div>


  {/* Progress */}
  <div className="mt-7">

    <div className="mb-2 flex justify-between text-xs font-medium">
      <span className="text-[#667085]">
        Verification confidence
      </span>

      <span className="text-[#008F68]">
        90%
      </span>
    </div>

    <div className="h-3 overflow-hidden rounded-full bg-[#E4E7EC]">
      <div
        className="h-full rounded-full bg-[#00A878]"
        style={{ width: "90%" }}
      />
    </div>

  </div>

</div>

          </div>

        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="bg-[#F8FAFC] px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="font-semibold text-[#00A878]">
              WHY MEDISURE?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#101828]">
              More than a medicine database
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[#475467]">
              Manufacturer data becomes the foundation for traceability,
              verification and patient trust.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Feature
              icon={<QrCode size={25} />}
              title="Unique QR Identity"
              text="Every batch receives a traceable identity that can follow the medicine through the supply chain."
            />

            <Feature
              icon={<Thermometer size={25} />}
              title="Cold-Chain Evidence"
              text="Storage requirements are recorded from the beginning so later temperature checks have context."
            />

            <Feature
              icon={<Link2 size={25} />}
              title="Blockchain Traceability"
              text="Important batch and transfer events can be linked with an immutable supply-chain record."
            />

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
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


/* ================= COMPONENTS ================= */

function OverviewStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#E4E7EC] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md">

      <div className="mb-3 flex items-center justify-between">

        <span className="text-sm text-[#667085]">
          {label}
        </span>

        <div className="rounded-lg bg-[#ECFDF5] p-2 text-[#00A878]">
          {icon}
        </div>

      </div>

      <p className="text-2xl font-bold text-[#101828]">
        {value}
      </p>

    </div>
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
    <div className="group cursor-pointer rounded-2xl border border-[#E4E7EC] bg-white p-6 transition-all duration-300 hover:-translate-y-3 hover:border-[#A7F3D0] hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <span className="text-sm font-bold text-[#D0D5DD]">
          {number}
        </span>

      </div>

      <h3 className="mt-5 text-lg font-bold text-[#101828]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#475467]">
        {text}
      </p>

    </div>
  );
}


function PipelineNode({
  icon,
  title,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  score: string;
}) {
  return (
    <div className="flex min-w-[130px] flex-1 flex-col items-center text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#ECFDF5] bg-[#00A878] text-white shadow-sm">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-[#101828]">
        {title}
      </p>

      <span className="mt-1 text-sm font-bold text-[#00A878]">
        {score}
      </span>

    </div>
  );
}


function PipelineLine() {
  return (
    <div className="mb-10 h-0.5 flex-1 bg-[#A7F3D0]" />
  );
}


function MobilePipeline({
  icon,
  title,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  score: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00A878] text-white">
          {icon}
        </div>

        <span className="font-semibold text-[#101828]">
          {title}
        </span>

      </div>

      <span className="font-bold text-[#00A878]">
        {score}
      </span>

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
    <div className="group rounded-2xl border border-[#E4E7EC] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#A7F3D0] hover:bg-[#ECFDF5] hover:shadow-md">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878] transition-colors duration-300 group-hover:bg-[#00A878] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#101828] transition-colors duration-300 group-hover:text-[#008F68]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#475467]">
        {text}
      </p>

    </div>
  );
}

function ReadinessItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5]">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-[#101828]">
        {title}
      </p>

      <div className="mt-1 flex items-center gap-1 text-sm text-[#008F68]">
        <CheckCircle2 size={13} />
        {text}
      </div>
    </div>
  );
}
function ScoreItem({
  title,
  score,
}: {
  title: string;
  score: string;
}) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5]">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF5] text-[#00A878]">
        <CheckCircle2 size={17} />
      </div>

      <p className="mt-3 text-xs font-medium text-[#667085]">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold text-[#00A878]">
        {score}
      </p>
    </div>
  );
}