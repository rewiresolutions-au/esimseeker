/** Monochrome wordmarks for the provider strip (SVG text; not official trademark artwork). */

type MarkProps = {
  className?: string;
};

const textAttrs = {
  fill: "currentColor",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  fontWeight: 700 as const,
};

export const AiraloMark = ({ className }: MarkProps) => (
  <svg className={className} viewBox="0 0 86 22" role="img" aria-label="Airalo">
    <text x="0" y="17" {...textAttrs} fontSize="17">
      Airalo
    </text>
  </svg>
);

export const HolaflyMark = ({ className }: MarkProps) => (
  <svg className={className} viewBox="0 0 108 22" role="img" aria-label="Holafly">
    <text x="0" y="17" {...textAttrs} fontSize="17">
      Holafly
    </text>
  </svg>
);

export const NomadMark = ({ className }: MarkProps) => (
  <svg className={className} viewBox="0 0 78 22" role="img" aria-label="Nomad">
    <text x="0" y="17" {...textAttrs} fontSize="17">
      Nomad
    </text>
  </svg>
);

export const EsimGoMark = ({ className }: MarkProps) => (
  <svg className={className} viewBox="0 0 96 22" role="img" aria-label="eSIM Go">
    <text x="0" y="17" {...textAttrs} fontSize="15">
      eSIM Go
    </text>
  </svg>
);
