import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryBySlug, getTopCountrySlugs } from "@/lib/marketing/countries";
import {
  ACTIVITY_LABELS,
  ACTIVITY_SLUGS,
  isActivitySlug,
} from "@/lib/marketing/pseo-config";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const countries = getTopCountrySlugs(55);
  const out: { country: string; activity: string }[] = [];
  for (const country of countries) {
    for (const activity of ACTIVITY_SLUGS) {
      out.push({ country, activity });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; activity: string }>;
}): Promise<Metadata> {
  const { country: slug, activity } = await params;
  const c = getCountryBySlug(slug);
  if (!c || !isActivitySlug(activity)) {
    return { title: "eSIM guide" };
  }
  const label = ACTIVITY_LABELS[activity];
  const title = `${label} eSIM for ${c.name}`;
  const description = `Prepaid eSIM options for ${label.toLowerCase()} trips to ${c.name}. Compare data plans and open the wizard for a shortlist.`;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `/esim/${c.slug}/activity/${activity}`,
    },
  };
}

export default async function ActivityEsimPage({
  params,
}: {
  params: Promise<{ country: string; activity: string }>;
}) {
  const { country: slug, activity } = await params;
  const c = getCountryBySlug(slug);
  if (!c || !isActivitySlug(activity)) notFound();
  const label = ACTIVITY_LABELS[activity];

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
        {label} eSIM for {c.name}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/85">
        Whether you need light maps-and-messaging or heavier video and hotspot
        use, start from the wizard—we factor in how you travel and typical data
        needs for {label.toLowerCase()} visits to {c.name}.
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
