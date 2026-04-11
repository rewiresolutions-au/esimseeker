import Image from "next/image";
import Link from "next/link";

const SRC = {
  onLight: "/brand/logo_primary_light.png",
  onDark: "/brand/logo_dark_mode.png",
} as const;

/** Intrinsic dimensions from source PNG (IHDR); layout uses width-first so the wordmark stays legible. */
const INTRINSIC = { width: 2528, height: 1696 };

const sizeClasses = {
  /** Main site header — width-led so the logo is not shrunk to a short strip */
  nav: "h-auto w-[168px] sm:w-[188px] md:w-[220px]",
  /** Wizard top bar — slightly tighter */
  compact: "h-auto w-[140px] md:w-[168px]",
  /** Footer column */
  footer: "h-auto w-[180px] md:w-[220px]",
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
      className={`${sizeClasses[size]} max-w-full object-contain object-left ${className}`.trim()}
      sizes="(max-width: 640px) 188px, (max-width: 768px) 200px, 240px"
      priority={priority}
    />
  );

  if (href === null) {
    return img;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-sm py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
    >
      {img}
    </Link>
  );
};
