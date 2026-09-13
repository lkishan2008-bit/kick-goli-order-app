/**
 * BottleArt — detailed SVG illustration of a traditional 200ml glass goli
 * (marble) soda bottle. One component, parameterized by flavor, so the whole
 * product family renders consistently across the site.
 */

import { useId } from "react";

export const FLAVOR_COLORS: Record<
  string,
  { liquid: string; deep: string; glass: string; glow: string }
> = {
  cola: { liquid: "#8a4a1f", deep: "#52280e", glass: "#f3e3cf", glow: "rgba(138,74,31,0.25)" },
  blueberry: { liquid: "#2f5fc4", deep: "#1c3a7d", glass: "#dbe7fb", glow: "rgba(47,95,196,0.22)" },
  "green-apple": { liquid: "#5c9e31", deep: "#33651a", glass: "#e2f0d3", glow: "rgba(92,158,49,0.22)" },
  original: { liquid: "#e9edf2", deep: "#c3ccd6", glass: "#eef1f5", glow: "rgba(180,190,200,0.25)" },
  orange: { liquid: "#e2761b", deep: "#a34d0d", glass: "#fbe6cd", glow: "rgba(226,118,27,0.24)" },
  lemon: { liquid: "#dfc31c", deep: "#a08a0d", glass: "#f7f0c9", glow: "rgba(223,195,28,0.22)" },
  rose: { liquid: "#d96a8b", deep: "#a63c5e", glass: "#f9e2e8", glow: "rgba(217,106,139,0.22)" },
};

const CROWN_DIAMOND = "#3a3733";

/** Classic crown-to-marble goli bottle profile, drawn in a 120 x 320 viewBox. */
export function BottleArt({
  flavor,
  className,
  showShadow = true,
}: {
  flavor: string;
  className?: string;
  showShadow?: boolean;
}) {
  const c = FLAVOR_COLORS[flavor] ?? FLAVOR_COLORS.original;
  const id = `bottle-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox="0 0 120 320"
      fill="none"
      role="img"
      aria-label={`Kick Goli Soda ${flavor} bottle`}
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-liquid`} x1="30" y1="140" x2="95" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.liquid} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="20" y1="60" x2="100" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.glass} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={c.glass} stopOpacity="0.55" />
          <stop offset="1" stopColor={c.glass} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`${id}-marble`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#e8e4de" />
          <stop offset="1" stopColor="#9c968e" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M34 84 Q34 74 42 66 L54 54 Q60 46 60 36 L60 26 L60 36 Q60 46 66 54 L78 66 Q86 74 86 84 L86 296 Q86 306 76 306 L44 306 Q34 306 34 296 Z" />
        </clipPath>
      </defs>

      {showShadow && (
        <ellipse cx="60" cy="312" rx="34" ry="6" fill="rgba(38,32,24,0.10)" />
      )}

      {/* crown lip */}
      <rect x="50" y="8" width="20" height="8" rx="2" fill={CROWN_DIAMOND} />

      {/* neck + body glass outline */}
      <path
        d="M34 84 Q34 74 42 66 L54 54 Q60 46 60 36 L60 26 L60 36 Q60 46 66 54 L78 66 Q86 74 86 84 L86 296 Q86 306 76 306 L44 306 Q34 306 34 296 Z"
        fill={`url(#${id}-glass)`}
        stroke="rgba(38,32,24,0.16)"
        strokeWidth="1.5"
      />

      <g clipPath={`url(#${id}-clip)`}>
        {/* liquid fills lower three quarters */}
        <path
          d="M34 118 L86 118 L86 296 Q86 306 76 306 L44 306 Q34 306 34 296 Z"
          fill={`url(#${id}-liquid)`}
        />
        {/* fizz bubbles */}
        <circle cx="48" cy="286" r="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="60" cy="266" r="2.2" fill="rgba(255,255,255,0.35)" />
        <circle cx="72" cy="290" r="2.6" fill="rgba(255,255,255,0.3)" />
        <circle cx="52" cy="242" r="1.8" fill="rgba(255,255,255,0.3)" />
        <circle cx="70" cy="230" r="1.6" fill="rgba(255,255,255,0.25)" />
        {/* liquid surface line */}
        <rect x="34" y="116" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      </g>

      {/* marble stopper in the neck */}
      <circle cx="60" cy="58" r="7" fill={`url(#${id}-marble)`} stroke="rgba(38,32,24,0.25)" strokeWidth="1" />
      <circle cx="57.5" cy="55.5" r="2" fill="rgba(255,255,255,0.85)" />

      {/* paper label */}
      <rect x="34" y="168" width="52" height="74" fill="#faf7f1" />
      <rect x="34" y="168" width="52" height="74" fill="none" stroke="rgba(38,32,24,0.14)" strokeWidth="1" />
      <text x="60" y="192" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill={CROWN_DIAMOND} fontWeight="600">
        KICK
      </text>
      <text x="60" y="210" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fill="#6b655c">
        GOLI SODA
      </text>
      <line x1="44" y1="219" x2="76" y2="219" stroke={c.liquid} strokeWidth="1.4" />
      <text x="60" y="233" textAnchor="middle" fontSize="6.5" letterSpacing="1.6" fontFamily="Helvetica, sans-serif" fill="#8a8378">
        200 ML
      </text>

      {/* glass highlights */}
      <path d="M42 92 Q42 86 48 78" stroke="rgba(255,255,255,0.75)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M42 160 L42 288" stroke="rgba(255,255,255,0.45)" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 108 L80 286" stroke="rgba(38,32,24,0.08)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** Hero band: the full product family — all 7 flavors in canonical order. */
export function BottleFamily({ className }: { className?: string }) {
  const flavors = ["cola", "blueberry", "green-apple", "original", "orange", "lemon", "rose"];
  return (
    <div className={className}>
      <div className="flex items-end justify-center gap-2 sm:gap-4">
        {flavors.map((f, i) => (
          <div
            key={f}
            className="relative"
            style={{
              zIndex: flavors.length - i,
              transform: `translateY(${Math.abs(i - 3) * 2}px)`,
            }}
          >
            <BottleArt
              flavor={f}
              className="w-[9vw] max-w-[64px] min-w-[30px] drop-shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
