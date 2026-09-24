import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#101828] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">

          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878]">
                <ShieldCheck size={22} />
              </div>

              <div>
                <div className="text-xl font-bold">
                  <span className="text-white">medi</span>
                  <span className="text-[#F97316]">Sure</span>
                </div>

                <p className="text-[10px] font-medium text-[#98A2B3]">
                  Scan. Trace. Trust.
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#98A2B3]">
              Pharmacy medicine tracking and supply-chain verification
              platform for safer and more transparent medicine distribution.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Pharmacy Portal
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="text-sm text-[#98A2B3] hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/incoming"
                className="text-sm text-[#98A2B3] hover:text-white"
              >
                Incoming Medicines
              </Link>

              <Link
                href="/inventory"
                className="text-sm text-[#98A2B3] hover:text-white"
              >
                Inventory
              </Link>

              <Link
                href="/verification"
                className="text-sm text-[#98A2B3] hover:text-white"
              >
                Verification
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Supply Chain Trust
            </h3>

            <p className="mt-4 text-sm leading-6 text-[#98A2B3]">
              Track medicine movement from manufacturer to distributor to
              pharmacy with transparent supply-chain verification.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#008F68]">
              <ShieldCheck size={14} />
              Verified Supply Chain
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-[#344054] pt-5">
          <div className="flex flex-col gap-2 text-xs text-[#98A2B3] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 mediSure. All rights reserved.</p>
            <p>Scan. Trace. Trust.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}