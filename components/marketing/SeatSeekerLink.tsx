import type { ReactNode } from "react";

const DEFAULT_HREF = "https://seats.aero";

export function SeatSeekerLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const href =
    process.env.NEXT_PUBLIC_SEATSEEKER_URL?.trim() || DEFAULT_HREF;

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ?? "Find award flights on SeatSeeker →"}
    </a>
  );
}
