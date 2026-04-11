import Link from "next/link";
import { EsimSeekerLogo } from "@/components/brand/EsimSeekerLogo";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-brand-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <EsimSeekerLogo variant="onLight" size="nav" priority />
        <nav className="hidden items-center gap-6 md:flex">
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
        <Link
          href="/wizard"
          className="inline-flex h-10 items-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white transition hover:bg-brand-red/90"
        >
          Find My eSIM
        </Link>
      </div>
    </header>
  );
};
