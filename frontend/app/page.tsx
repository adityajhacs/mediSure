import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-4 py-2 text-xs font-semibold text-[#008F68]">
              <ShieldCheck size={16} />
              Pharmacy Portal
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#101828] md:text-6xl">
              Manage medicines with
              <span className="text-[#00A878]"> complete traceability.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#475467]">
              Receive medicines, manage pharmacy inventory and verify the
              complete supply-chain journey through mediSure.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68]"
              >
                Open Dashboard
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/verification"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-6 py-3 font-semibold text-[#344054] transition hover:border-[#00A878] hover:text-[#00A878]"
              >
                Verify Medicine
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border border-[#A7F3D0] bg-[#F8FAFC] p-6">
            <div className="grid gap-4">
              <Feature
                icon={Truck}
                title="Receive Medicines"
                description="Track incoming batches from authorized distributors."
              />

              <Feature
                icon={Package}
                title="Manage Inventory"
                description="View available medicines and batch information."
              />

              <Feature
                icon={ShieldCheck}
                title="Verify Authenticity"
                description="Review supply-chain and verification information."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Flow */}
      <section className="bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#00A878]">
              SCAN. TRACE. TRUST.
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#101828]">
              A traceable medicine journey
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#475467]">
              From manufacturer to distributor to pharmacy, every stage
              contributes to medicine verification.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FlowItem number="01" title="Manufacturer" />
            <FlowItem number="02" title="Distributor" />
            <FlowItem number="03" title="Pharmacy" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#00A878]">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold text-[#101828]">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-[#667085]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FlowItem({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 text-center shadow-sm">
      <p className="text-sm font-bold text-[#00A878]">{number}</p>

      <h3 className="mt-2 text-lg font-bold text-[#101828]">
        {title}
      </h3>
    </div>
  );
}