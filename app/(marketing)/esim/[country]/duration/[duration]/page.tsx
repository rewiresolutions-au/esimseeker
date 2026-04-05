import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryBySlug, getTopCountrySlugs } from "@/lib/marketing/countries";
import {
  DURATION_LABELS,
  DURATION_SLUGS,
  isDurationSlug,
} from "@/lib/marketing/pseo-config";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const countries = getTopCountrySlugs(55);
  const out: { country: string; duration: string }[] = [];
  for (const country of countries) {
    for (const duration of DURATION_SLUGS) {
      out.push({ country, duration });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; duration: string }>;
}): Promise<Metadata> {
  const { country: slug, duration } = await params;
  const c = getCountryBySlug(slug);
  if (!c || !isDurationSlug(duration)) {
    return { title: "eSIM guide" };
  }
  const label = DURATION_LABELS[duration];
  const title = `${c.name} eSIM — ${label}`;
  const description = `Prepaid eSIM plans suited to about ${label} in ${c.name}. Use the wizard to filter by data allowance and network quality.`;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `/esim/${c.slug}/duration/${duration}`,
    },
  };
}

export default async function DurationEsimPage({
  params,
}: {
  params: Promise<{ country: string; duration: string }>;
}) {
  const { country: slug, duration } = await params;
  const c = getCountryBySlug(slug);
  if (!c || !isDurationSlug(duration)) notFound();
  const label = DURATION_LABELS[duration];

  return (
    <article>
      <nav className="mb-6 text-sm text-foreground/70">
        <Link href="/" className="hover:text-brand-teal">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/esim/${c.slug}`} className="hover:text-brand-teal">
          {c.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-foreground">{label}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        eSIM for {label} in {c.name}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/85">
        Trip length drives how much data you burn and whether multi-month plans
        make sense. Tell the wizard your dates and usage—we surface plans that
        fit a stay of about {label} in {c.name}.
      </p>
      <p className="mt-8">
        <Link
          href="/wizard"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-red px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Open plan wizard
        </Link>
        <Link
          href={`/esim/${c.slug}`}
          className="ml-4 text-sm font-medium text-brand-teal hover:underline"
        >
          All guides for {c.name}
        </Link>
      </p>
    </article>
  );
}
