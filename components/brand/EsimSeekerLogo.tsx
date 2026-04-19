import Image from "next/image";
import Link from "next/link";

const SRC = {
  /** PNG wordmark for light UI (header/footer on pale backgrounds). */
  onLight: "/brand/logo_primary_light.png",
  onDark: "/brand/logo_dark_mode.png",
} as const;

/** Intrinsic dimensions from source PNGs (IHDR); layout uses width-first so the wordmark stays legible. */
const INTRINSIC = { width: 2528, height: 1696 };

const sizeClasses = {
  /** Main site header — width-led so the logo is not shrunk to a short strip */
  nav: "h-auto w-[180px] sm:w-[196px] md:w-[208px]",
  /** Wizard top bar — slightly tighter */
  compact: "h-auto w-[150px] md:w-[170px]",
  /** Footer column */
  footer: "h-auto w-[180px] md:w-[208px]",
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
      sizes="(max-width: 640px) 180px, (max-width: 768px) 196px, 208px"
      priority={priority}
    />
  );

  if (href === null) {
    return img;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-sm bg-transparent py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
    >
      {img}
    </Link>
  );
};
