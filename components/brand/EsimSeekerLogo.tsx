import Image from "next/image";
import Link from "next/link";

const SRC = {
  /** PNG wordmark for light UI (header/footer on pale backgrounds). */
  onLight: "/brand/logo_primary_light.png",
  onDark: "/brand/logo_dark_mode.png",
} as const;

/** Intrinsic dimensions from source PNGs (IHDR); CSS caps height so the mark fits the header bar. */
const INTRINSIC = { width: 2528, height: 1696 };

const sizeClasses = {
  /** Main site header (`Navbar` is h-16) — height-led so the wordmark never overflows the bar */
  nav: "h-9 w-auto max-h-9 sm:h-10 sm:max-h-10 md:h-11 md:max-h-11",
  /** Wizard top bar (h-14) */
  compact: "h-8 w-auto max-h-8 sm:h-9 sm:max-h-9",
  /** Footer — more vertical room */
  footer: "h-11 w-auto max-h-11 sm:h-12 sm:max-h-12 md:h-14 md:max-h-14",
} as const;

export type EsimSeekerLogoSize = keyof typeof sizeClasses;

type EsimSeekerLogoProps = {
  variant: "onLight" | "onDark";
  size?: EsimSeekerLogoSize;
  /** Wrap in link to home; pass `null` for image only */
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export const EsimSeekerLogo = ({
  variant,
  size = "nav",
  href = "/",
  className = "",
  priority = false,
}: EsimSeekerLogoProps) => {
  const img = (
    <Image
      src={SRC[variant]}
      alt="eSIMSeeker"
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      className={`${sizeClasses[size]} max-w-full bg-transparent object-contain object-left ${className}`.trim()}
      sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 170px"
      priority={priority}
    />
  );

  if (href === null) {
    return img;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-sm bg-transparent py-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
    >
      {img}
    </Link>
  );
};
