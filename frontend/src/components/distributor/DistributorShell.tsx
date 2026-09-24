"use client";

import Link from "next/link";
import { ShieldCheck, Truck, PackageSearch, LogOut, Thermometer } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function navClass(active: boolean) {
  return `transition ${
    active
      ? "font-semibold text-[#00A878]"
      : "text-[#475467] hover:text-[#00A878]"
  }`;
}

export function DistributorNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-[#E4E7EC] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/distributor/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white shadow-sm">
            <ShieldCheck size={23} />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">
              <span className="text-[#101828]">medi</span>
              <span className="text-[#F97316]">Sure</span>
            </p>
            <p className="mt-1 text-xs text-[#667085]">Distributor Portal</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/distributor/dashboard" className={navClass(pathname === "/distributor/dashboard")}>
            Dashboard
          </Link>
          <Link href="/distributor/shipments" className={navClass(pathname.startsWith("/distributor/shipments"))}>
            Shipments
          </Link>
          <span className="hidden h-5 w-px bg-[#E4E7EC] lg:block" />
          <div className="hidden items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#008F68] lg:flex">
            <Truck size={14} />
            Supply Chain Active
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3.5 py-2 text-sm font-semibold text-[#344054] transition hover:border-[#FCA5A5] hover:text-[#DC2626]"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export function DistributorFooter() {
  return (
    <footer className="mt-12 border-t border-[#101828] bg-[#101828] px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-6 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A878] text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-bold">
              <span>medi</span>
              <span className="text-[#F97316]">Sure</span>
            </p>
            <p className="text-xs text-[#98A2B3]">Scan. Trace. Trust.</p>
          </div>
        </div>
        <div className="text-center text-sm text-[#98A2B3]">© 2026 MediSure. All rights reserved.</div>
        <div className="text-center text-sm font-medium text-[#D0D5DD] md:text-right">
          Secure • Transparent • Traceable
        </div>
      </div>
    </footer>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const value = String(status || "UNKNOWN").toUpperCase();
  const styles: Record<string, string> = {
    IN_TRANSIT: "bg-[#FFF7ED] text-[#C2410C] ring-1 ring-[#FED7AA]",
    RECEIVED: "bg-[#ECFDF5] text-[#047857] ring-1 ring-[#A7F3D0]",
    AT_PHARMACY: "bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#BFDBFE]",
    AVAILABLE: "bg-[#F0FDF4] text-[#15803D] ring-1 ring-[#BBF7D0]",
    CREATED: "bg-[#F8FAFC] text-[#475467] ring-1 ring-[#E4E7EC]",
    VIOLATION: "bg-[#FEF2F2] text-[#B91C1C] ring-1 ring-[#FECACA]",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[value] || "bg-[#F8FAFC] text-[#475467] ring-1 ring-[#E4E7EC]"}`}>
      {value.replaceAll("_", " ")}
    </span>
  );
}

export function TempBadge({ status }: { status?: string }) {
  const safe = String(status || "").toUpperCase() === "SAFE";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${safe ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#FEF2F2] text-[#B91C1C]"}`}>
      <Thermometer size={13} />
      {safe ? "SAFE" : "VIOLATION"}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#667085]">
        <PackageSearch size={23} />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#101828]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">{text}</p>
    </div>
  );
}
