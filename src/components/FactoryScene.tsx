/**
 * FactoryScene — wide illustrated banner evoking a tea-garden hillside at the
 * edge of a small bottling plant in the Western Ghats. Used in the brand story
 * section of the landing page. Palette stays Studio-neutral (creams, muted
 * greens) so it reads as a calm editorial illustration, not busy clip-art.
 */

export function FactoryScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 300"
      fill="none"
      role="img"
      aria-label="Vibhin Enterprises goli soda factory beside tea gardens in the Chikmagalur hills"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f1e6" />
          <stop offset="1" stopColor="#efe6d4" />
        </linearGradient>
        <linearGradient id="fs-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cdd6c4" />
          <stop offset="1" stopColor="#bccab2" />
        </linearGradient>
        <linearGradient id="fs-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b3c2a4" />
          <stop offset="1" stopColor="#9fb28f" />
        </linearGradient>
        <linearGradient id="fs-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#94a884" />
          <stop offset="1" stopColor="#7f9470" />
        </linearGradient>
        <linearGradient id="fs-tea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c926b" />
          <stop offset="1" stopColor="#64795a" />
        </linearGradient>
        <linearGradient id="fs-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c26a3a" />
          <stop offset="1" stopColor="#a2532a" />
        </linearGradient>
        <linearGradient id="fs-chimney" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8d2c6" />
          <stop offset="1" stopColor="#b7ae9e" />
        </linearGradient>
        <linearGradient id="fs-steam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="800" height="300" fill="url(#fs-sky)" />

      {/* far hills */}
      <path
        d="M0 150 Q90 96 190 128 Q300 66 420 108 Q540 60 660 110 Q730 84 800 116 L800 300 L0 300 Z"
        fill="url(#fs-far)"
      />
      {/* mid hills with tea rows */}
      <path
        d="M0 190 Q120 140 250 172 Q380 128 520 168 Q660 138 800 176 L800 300 L0 300 Z"
        fill="url(#fs-mid)"
      />
      {/* near ground */}
      <path d="M0 232 Q200 206 420 226 Q620 244 800 224 L800 300 L0 300 Z" fill="url(#fs-near)" />

      {/* tea rows on mid hill */}
      <g stroke="rgba(255,255,255,0.28)" strokeWidth="2" fill="none">
        <path d="M30 178 Q140 152 250 174" />
        <path d="M60 188 Q170 162 280 184" />
        <path d="M330 164 Q440 142 540 168" />
        <path d="M360 176 Q470 152 570 178" />
        <path d="M600 162 Q690 148 780 172" />
      </g>

      {/* factory building */}
      <g>
        <rect x="470" y="168" width="180" height="70" fill="#efe7d6" stroke="rgba(38,32,24,0.14)" strokeWidth="1.5" />
        <rect x="470" y="152" width="180" height="18" fill="url(#fs-roof)" />
        {/* sawtooth roof */}
        <path d="M470 152 L500 132 L530 152 Z" fill="url(#fs-roof)" />
        <path d="M530 152 L560 132 L590 152 Z" fill="url(#fs-roof)" />
        <path d="M590 152 L620 132 L650 152 Z" fill="url(#fs-roof)" />
        {/* chimney + steam */}
        <rect x="608" y="86" width="16" height="52" fill="url(#fs-chimney)" stroke="rgba(38,32,24,0.12)" strokeWidth="1" />
        <path d="M598 84 Q612 62 604 46 Q620 58 616 78 Q630 66 634 50 Q640 74 622 88 Z" fill="url(#fs-steam)" />
        {/* windows */}
        <rect x="486" y="186" width="20" height="26" fill="#dfd6c2" stroke="rgba(38,32,24,0.12)" strokeWidth="1" />
        <rect x="522" y="186" width="20" height="26" fill="#dfd6c2" stroke="rgba(38,32,24,0.12)" strokeWidth="1" />
        <rect x="558" y="186" width="20" height="26" fill="#dfd6c2" stroke="rgba(38,32,24,0.12)" strokeWidth="1" />
        <rect x="594" y="186" width="20" height="26" fill="#dfd6c2" stroke="rgba(38,32,24,0.12)" strokeWidth="1" />
        {/* door */}
        <rect x="536" y="212" width="30" height="26" fill="#b98d5f" stroke="rgba(38,32,24,0.14)" strokeWidth="1" />
        {/* signage */}
        <rect x="480" y="156" width="72" height="10" rx="2" fill="#faf7f1" stroke="rgba(38,32,24,0.12)" strokeWidth="1" />
        <text x="516" y="164" textAnchor="middle" fontSize="6.5" letterSpacing="1" fontFamily="Helvetica, sans-serif" fill="#3a3733">
          VIBHIN
        </text>
      </g>

      {/* crates of bottles outside the plant */}
      <g stroke="rgba(38,32,24,0.2)" strokeWidth="1.2">
        <rect x="668" y="226" width="26" height="18" fill="#d9c9a8" />
        <rect x="672" y="212" width="26" height="18" fill="#e2d4b4" />
        <rect x="698" y="226" width="26" height="18" fill="#d9c9a8" />
      </g>

      {/* palm-ish trees near the plant */}
      <g stroke="#5f7350" strokeWidth="3" strokeLinecap="round">
        <path d="M440 236 Q438 208 442 190" fill="none" />
        <path d="M442 190 Q428 182 418 186" fill="none" />
        <path d="M442 190 Q456 180 466 186" fill="none" />
        <path d="M442 190 Q434 174 424 170" fill="none" />
        <path d="M442 190 Q452 172 462 170" fill="none" />
      </g>

      {/* foreground tea bushes */}
      <g fill="url(#fs-tea)">
        <ellipse cx="60" cy="252" rx="58" ry="26" />
        <ellipse cx="170" cy="262" rx="70" ry="28" />
        <ellipse cx="700" cy="262" rx="80" ry="30" />
        <ellipse cx="470" cy="272" rx="90" ry="26" />
      </g>
      <g stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none">
        <path d="M10 250 Q70 236 130 252" />
        <path d="M130 262 Q200 246 260 262" />
        <path d="M640 258 Q720 244 790 260" />
      </g>
    </svg>
  );
}
