"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { EsimSeekerLogo } from "@/components/brand/EsimSeekerLogo";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-gray-mid/80 bg-brand-gray-light/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center px-4">
        <div className="flex min-w-0 max-w-[55%] shrink-0 items-center bg-transparent sm:max-w-none md:min-w-[200px] md:max-w-[280px]">
          <EsimSeekerLogo variant="onLight" size="nav" priority />
        </div>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-navy/80 transition hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:min-w-[140px] md:justify-end">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link
            href="/wizard"
            className="hidden h-10 items-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white transition hover:bg-brand-red/90 md:inline-flex"
          >
            Try AI Wizard
          </Link>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-brand-gray-mid/80 bg-brand-gray-light px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy/90 hover:bg-white/80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wizard"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Try AI Wizard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
};
