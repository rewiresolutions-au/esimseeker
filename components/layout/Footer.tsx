import Link from "next/link";
import { EsimSeekerLogo } from "@/components/brand/EsimSeekerLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/wizard", label: "Wizard" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];

export const Footer = () => {
  return (
    <footer className="mt-16 bg-gradient-to-br from-[#08162a] to-[#0f2144] py-12 text-brand-slate">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <EsimSeekerLogo variant="onDark" size="footer" />
          <p className="mt-3 text-sm text-brand-slate/90">
            Stay Connected. Anywhere. Instantly.
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
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Newsletter</p>
          <p className="mt-3 text-sm text-brand-slate/90">Subscribe for your email address</p>
          <div className="mt-3 space-y-2">
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-brand-slate/70"
              placeholder="Your email address"
            />
            <button className="h-10 w-full rounded-full bg-brand-red text-sm font-semibold text-white">
              subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
