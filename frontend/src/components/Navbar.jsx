"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Incoming", href: "/incoming" },
  { name: "Inventory", href: "/inventory" },
  { name: "Verification", href: "/verification" },
  { name: "Alerts", href: "/alerts" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-[#E4E7EC] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                <span className="text-[#101828]">medi</span>
                <span className="text-[#F97316]">Sure</span>
              </div>

              <p className="text-[10px] font-medium text-[#667085]">
                Scan. Trace. Trust.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#475467] transition hover:text-[#00A878]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Pharmacy */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-bold text-[#00A878]">
              P
            </div>

            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-[#101828]">
                ABC Pharmacy
              </p>

              <p className="text-[11px] text-[#667085]">
                Pharmacy Portal
              </p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E7EC] text-[#475467] md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="mt-4 border-t border-[#E4E7EC] pt-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-[#475467] transition hover:bg-[#ECFDF5] hover:text-[#008F68]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}