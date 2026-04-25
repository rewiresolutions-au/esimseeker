import Script from "next/script";
import { buildSailyAffiliateUrl } from "@/lib/partners/saily";

type SailyWidgetBannerProps = {
  variant?: "a" | "b";
  className?: string;
};

export const SailyWidgetBanner = ({
  variant = "a",
  className = "",
}: SailyWidgetBannerProps) => {
  const affiliateBannerId = process.env.SAILY_AFF_BANNER_ID ?? "partner123";
  const ctaUrl =
    process.env.SAILY_WIDGET_CTA_URL ??
    buildSailyAffiliateUrl({
      utmSource: "esimseeker",
      utmMedium: "affiliate",
      utmCampaign: "saily-widget",
    });

  const iframeSrc = `https://saily.com/embed/affiliate-banner?variant=${variant}&cta=${encodeURIComponent(
    ctaUrl,
  )}&aff_banner=${encodeURIComponent(affiliateBannerId)}`;

  return (
    <section
      className={`rounded-2xl border border-brand-navy/10 bg-white p-4 md:p-6 ${className}`}
    >
      <Script src="https://saily.com/embed/receiver.js" strategy="lazyOnload" />
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-teal">
        Partner Offer
      </p>
      <iframe
        src={iframeSrc}
        title="Saily affiliate widget"
        style={{ display: "block", width: "100%", border: 0, overflow: "hidden" }}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </section>
  );
};
