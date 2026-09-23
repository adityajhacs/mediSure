import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  QrCode,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#101828]">

      {/* NAVBAR */}
      <nav className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00A878]">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div className="text-[31px] font-bold tracking-tight">
              <span className="text-[#101828]">medi</span>
              <span className="text-[#F97316]">Sure</span>
            </div>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            <a href="#how-it-works" className="text-[16px] font-medium text-[#475467] hover:text-[#00A878]">
              How It Works
            </a>
            <a href="#why-medisure" className="text-[16px] font-medium text-[#475467] hover:text-[#00A878]">
              Why mediSure?
            </a>
            <a href="#about" className="text-[16px] font-medium text-[#475467] hover:text-[#00A878]">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#D0D5DD] px-6 py-3 text-[15px] font-semibold hover:border-[#00A878] hover:text-[#00A878]"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#00A878] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#008F68]"
            >
              Register
            </Link>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F8FAFC]">

        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#ECFDF5] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#ECFDF5] opacity-70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-2 text-sm font-medium text-[#008F68]">
              <ShieldCheck className="h-4 w-4" />
              Trusted Medicine Supply Chain
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-[64px]">
              Build trust into
              <br />
              <span className="text-[#00A878]">
                every medicine.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-8 text-[#475467]">
              mediSure makes medicines traceable from manufacturer to patient
              through secure blockchain records and simple QR-based
              verification.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              {/* ACTUAL VERIFY PAGE */}
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#008F68]"
              >
                <QrCode className="h-5 w-5" />
                Scan & Verify
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-[#D0D5DD] bg-white px-6 py-3.5 font-semibold transition hover:border-[#00A878] hover:text-[#00A878]"
              >
                Get Started
              </Link>

            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
              <TrustPoint text="Blockchain secured" />
              <TrustPoint text="QR verification" />
              <TrustPoint text="End-to-end traceability" />
            </div>

          </div>

          {/* RIGHT MEDICINE CARD */}
          <div className="relative mx-auto w-full max-w-[600px]">

            <div className="absolute inset-10 rounded-full bg-[#ECFDF5] blur-3xl" />

            <div className="relative rounded-3xl border border-[#E4E7EC] bg-white p-6 shadow-xl shadow-[#101828]/10">

              {/* HEADER */}
              <div className="flex items-start justify-between border-b border-[#E4E7EC] pb-5">

                <div>
                  <p className="text-sm text-[#667085]">
                    Medicine Verification
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Paracetamol 500mg
                  </h2>
                </div>

                <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-bold text-[#008F68]">
                  VERIFIED
                </span>

              </div>

              {/* MEDICINE */}
              <div className="flex items-center justify-center py-7">

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[#ECFDF5]">

                  <div className="flex h-36 w-28 flex-col items-center rounded-b-2xl rounded-t-xl border border-[#D0D5DD] bg-white shadow-md">

                    <div className="h-8 w-full rounded-t-xl bg-[#00A878]" />

                    <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-md border border-[#D0D5DD]">
                      <QrCode className="h-9 w-9 text-[#101828]" />
                    </div>

                    <div className="mt-2 h-1.5 w-14 rounded-full bg-[#00A878]" />

                    <p className="mt-1 text-[7px] font-bold text-[#475467]">
                      mediSure
                    </p>

                  </div>

                  <div className="absolute -right-2 bottom-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00A878] shadow-lg">
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>

                </div>
              </div>

              {/* TRUST SCORE */}
              <div className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-[#667085]">
                      Trust Score
                    </p>

                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-4xl font-bold text-[#00A878]">
                        90
                      </span>
                      <span className="mb-1 text-sm text-[#667085]">
                        /100
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white px-3 py-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-[#00A878]" />
                      <div>
                        <p className="text-xs font-bold">
                          Highly Trusted
                        </p>
                        <p className="text-[11px] text-[#667085]">
                          Blockchain verified
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
                  <div className="h-full w-[90%] rounded-full bg-[#00A878]" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Score title="Authenticity" value="Verified" />
                  <Score title="Traceability" value="Complete" />
                  <Score title="Records" value="Secure" />
                </div>

              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Detail title="Batch" value="B-20481" />
                <Detail title="Status" value="Verified" />
                <Detail title="Expiry" value="2028" />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold tracking-[0.18em] text-[#00A878]">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Scan. Trace. Trust.
            </h2>

            <p className="mt-4 leading-7 text-[#667085]">
              Every medicine gets a transparent digital journey from
              manufacturing to the hands of the patient.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">

            <Step
              icon={Factory}
              title="Manufacture"
              text="Medicine batches are registered with secure digital records."
            />

            <Step
              icon={Truck}
              title="Distribute"
              text="Medicine movement is tracked across the supply chain."
            />

            <Step
              icon={Store}
              title="Verify"
              text="Pharmacies receive and verify medicine batches."
            />

            <Step
              icon={QrCode}
              title="Scan"
              text="Patients scan the QR code to check authenticity."
            />

          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why-medisure" className="bg-[#F8FAFC] py-20">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.18em] text-[#00A878]">
              WHY MEDISURE?
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              A safer, more transparent medicine supply chain
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <Feature
              icon={ShieldCheck}
              title="Tamper-Resistant Records"
              text="Blockchain-backed records make medicine movement transparent and verifiable."
            />

            <Feature
              icon={Truck}
              title="End-to-End Tracking"
              text="Follow medicine batches across manufacturers, distributors and pharmacies."
            />

            <Feature
              icon={QrCode}
              title="Simple Verification"
              text="Patients can scan a QR code and understand the medicine's journey."
            />

          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="bg-white px-6 py-16">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-3xl border border-[#A7F3D0] bg-[#ECFDF5] px-8 py-10 md:flex-row">

          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to build a safer medicine supply chain?
            </h2>

            <p className="mt-2 text-[#475467]">
              Join mediSure and bring transparency, traceability and trust
              to every medicine.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-6 py-3.5 font-semibold text-white hover:bg-[#008F68]"
          >
            Create an Account
            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101828]">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="grid gap-10 md:grid-cols-4">

            <div className="md:col-span-2">

              <Link href="/" className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878]">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>

                <div className="text-2xl font-bold">
                  <span className="text-white">medi</span>
                  <span className="text-[#F97316]">Sure</span>
                </div>

              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#98A2B3]">
                Building a safer and more transparent medicine supply chain
                through technology, traceability and trust.
              </p>

            </div>

            <div>
              <h3 className="font-semibold text-white">
                Product
              </h3>

              <div className="mt-4 space-y-3 text-sm text-[#98A2B3]">
                <a href="#how-it-works" className="block hover:text-white">
                  How It Works
                </a>
                <a href="#why-medisure" className="block hover:text-white">
                  Why mediSure?
                </a>
                <Link href="/verify" className="block hover:text-white">
                  Scan & Verify
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Account
              </h3>

              <div className="mt-4 space-y-3 text-sm text-[#98A2B3]">
                <Link href="/login" className="block hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="block hover:text-white">
                  Register
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-sm text-[#98A2B3]">
              © 2026 mediSure. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </main>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-[#00A878]" />
      <span className="text-sm text-[#475467]">{text}</span>
    </div>
  );
}

function Score({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-3">
      <p className="text-[11px] text-[#667085]">{title}</p>
      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-3">
      <p className="text-[11px] text-[#667085]">{title}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5]">
        <Icon className="h-6 w-6 text-[#00A878]" />
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#667085]">
        {text}
      </p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5]">
        <Icon className="h-6 w-6 text-[#00A878]" />
      </div>

      <h3 className="mt-5 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-[#667085]">
        {text}
      </p>
    </div>
  );
}