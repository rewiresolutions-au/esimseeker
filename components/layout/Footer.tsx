import Link from "next/link";
import { EsimSeekerLogo } from "@/components/brand/EsimSeekerLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/wizard", label: "AI Wizard" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];

export const Footer = () => {
  return (
    <footer className="mt-16 bg-gradient-to-br from-brand-navy to-[#0f2144] py-12 text-brand-slate">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <EsimSeekerLogo variant="onDark" size="footer" />
          <p className="mt-3 text-sm text-brand-slate/90">
            Stay Connected. Anywhere. Instantly.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-brand-slate/80">
            eSIMSeeker earns commissions when you purchase through our partner links. You pay the
            same provider price; this helps us keep the comparison tool free.{" "}
            <Link href="/affiliate-disclosure" className="font-medium text-brand-teal hover:underline">
              Read our affiliate disclosure
            </Link>
            .
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Navigate</p>
          <div className="mt-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Legal</p>
          <div className="mt-3 flex flex-col gap-2">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Updates</p>
          <p className="mt-3 text-sm text-brand-slate/90">
            Occasional tips on travel data and new provider deals.
          </p>
          <div className="mt-3 space-y-2">
            <input
              type="email"
              name="newsletter-email"
              autoComplete="email"
              className="h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-brand-slate/70"
              placeholder="you@example.com"
            />
            <button
              type="button"
              className="h-10 w-full rounded-full bg-brand-red text-sm font-semibold text-white transition hover:bg-brand-red/90"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-white/10 px-4 pt-8">
        <p className="text-center text-xs text-brand-slate/70">
          © {new Date().getFullYear()} eSIMSeeker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
