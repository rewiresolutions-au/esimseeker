import { SeatSeekerLink } from "@/components/marketing/SeatSeekerLink";
import Image from "next/image";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-paper text-foreground">
      <a
        href="#site-main"
        className="absolute -left-[9999px] top-4 z-50 rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-brand-paper focus:left-4 focus:z-[100] focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="border-b border-foreground/10 bg-background shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex min-w-[120px] items-center gap-2 text-brand-navy"
          >
            <Image
              src="/logo.svg"
              alt="eSIMSeeker"
              width={180}
              height={36}
              className="h-9 w-auto min-w-[120px]"
              priority
              unoptimized
            />
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium sm:gap-6">
            <Link
              href="/#destinations"
              className="text-brand-navy transition hover:text-brand-teal dark:text-brand-paper"
            >
              Destinations
            </Link>
            <Link
              href="/wizard"
              className="text-brand-teal transition hover:text-brand-navy dark:hover:text-brand-paper"
            >
              Wizard
            </Link>
            <SeatSeekerLink className="text-brand-navy transition hover:text-brand-teal dark:text-brand-paper">
              SeatSeeker
            </SeatSeekerLink>
          </nav>
        </div>
      </header>
      <main
        id="site-main"
        className="mx-auto max-w-5xl px-4 py-10"
        tabIndex={-1}
      >
        {children}
      </main>
      <footer className="border-t border-foreground/10 bg-brand-navy py-8 text-sm text-brand-paper/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} eSIMSeeker</span>
          <SeatSeekerLink className="font-medium text-brand-teal hover:underline" />
        </div>
      </footer>
    </div>
  );
}
