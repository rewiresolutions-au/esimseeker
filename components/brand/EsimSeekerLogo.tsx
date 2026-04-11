import Image from "next/image";
import Link from "next/link";

const SRC = {
  onLight: "/brand/logo_primary_light.png",
  onDark: "/brand/logo_dark_mode.png",
} as const;

/** Intrinsic dimensions from source PNG (IHDR); browser scales via CSS. */
const INTRINSIC = { width: 2528, height: 1696 };

const sizeClasses = {
  /** Main site header — meets ≥120px width at md+ */
  nav: "h-9 w-auto min-w-[120px] max-w-[200px] md:h-10 md:max-w-[240px]",
  /** Wizard top bar — slightly tighter */
  compact: "h-8 w-auto min-w-[100px] max-w-[180px] md:h-9 md:max-w-[200px]",
  /** Footer column */
  footer: "h-10 w-auto min-w-[120px] max-w-[260px] md:h-11 md:max-w-[280px]",
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
      {...INTRINSIC}
      className={`${sizeClasses[size]} ${className}`.trim()}
      sizes="(max-width: 768px) 200px, 260px"
      priority={priority}
    />
  );

  if (href === null) {
    return img;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
    >
      {img}
    </Link>
  );
};
