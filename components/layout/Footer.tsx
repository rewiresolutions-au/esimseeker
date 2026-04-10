import Link from "next/link";

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
    <footer className="mt-16 bg-brand-navy py-12 text-brand-slate">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">eSIMSeeker</p>
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
          <p className="mt-3 text-sm text-brand-slate/90">
            Get destination data price drops and new provider updates.
          </p>
          <div className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm">
            hello@esimseeker.com
          </div>
        </div>
      </div>
    </footer>
  );
};
