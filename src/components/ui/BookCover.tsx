import type { CoverSpec } from "../../types";

interface BookCoverProps {
  cover: CoverSpec;
  title: string;
  className?: string;
}

function Frame({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.4} opacity={0.7}>
      <rect x="16" y="16" width="268" height="418" rx="10" />
      <rect x="22" y="22" width="256" height="406" rx="7" />
    </g>
  );
}

function Motif({ name, color }: { name: string; color: string }) {
  const props = { fill: "none", stroke: color, strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "lighthouse":
      return (
        <g {...props}>
          <path d="M150 330 v-160 M150 170 l-34 40 h68 z M150 245 l-26 32 h52 z" />
          <line x1="138" y1="330" x2="162" y2="330" />
          <path d="M150 140 q-6 -8 6 -8 q8 0 4 10" />
          <path d="M118 330 q0 -26 12 -34 M182 330 q0 -26 -12 -34" />
        </g>
      );
    case "tree":
      return (
        <g {...props}>
          <path d="M150 340 v-50 M150 290 c-38 -6 -46 -44 -20 -62 c2 -36 40 -46 40 -46 s38 10 40 46 c26 18 18 56 -20 62" />
          <path d="M132 214 c-4 -8 4 -12 10 -10 M166 198 c4 -8 -4 -12 -10 -10" />
        </g>
      );
    case "map":
      return (
        <g {...props}>
          <path d="M118 180 c36 -14 66 -12 62 24 c-6 54 -10 84 4 114 l-34 12 l-6 -34 c-30 6 -48 -8 -44 -30 c6 -30 -2 -62 18 -86 z" />
          <path d="M150 204 q2 12 -8 16 q14 2 10 16" />
          <path d="M128 268 l10 -6 l-6 26" />
        </g>
      );
    case "star":
      return (
        <g {...props}>
          <path d="M150 140 l6 16 18 2 -13 12 4 18 -15 -9 -15 9 4 -18 -13 -12 18 -2 z" />
          <path d="M176 200 q2 8 -6 10 M124 210 q-2 10 6 12" />
          <path d="M138 248 l2 10 8 2 M166 292 l-2 -10 -8 -2" />
          <circle cx="188" cy="150" r="3" />
          <circle cx="122" cy="182" r="3" />
        </g>
      );
    case "compass":
      return (
        <g {...props}>
          <circle cx="150" cy="230" r="56" />
          <circle cx="150" cy="230" r="38" />
          <path d="M150 200 L162 230 L150 260 L138 230 z M150 208 l6 10 -6 10 -6 -10 z" />
          <path d="M118 176 q-8 6 -8 16 M182 176 q8 6 8 16" />
        </g>
      );
    case "letter":
      return (
        <g {...props}>
          <rect x="108" y="180" width="84" height="112" rx="6" />
          <path d="M110 186 l40 30 l40 -30" />
          <path d="M126 252 h24 M132 268 h16" />
          <path d="M150 120 q-14 0 -14 -12 q14 0 14 -12 q0 12 14 12 q-14 0 -14 12 z" opacity={0.85} />
        </g>
      );
    case "moon":
      return (
        <g {...props}>
          <path d="M170 170 c-4 54 26 96 74 104 c-30 32 -78 32 -106 -2 c-30 -36 -18 -86 32 -102 z" />
          <path d="M140 196 q3 8 -2 12 M132 232 q-4 10 4 14 M172 244 q-2 8 4 10" strokeWidth={3} />
        </g>
      );
    case "thread":
      return (
        <g {...props}>
          <path d="M120 220 q30 -34 60 0 t60 0" />
          <path d="M120 248 q30 -34 60 0 t60 0" />
          <path d="M120 276 q30 -34 60 0 t60 0" />
          <circle cx="120" cy="224" r="8" />
          <circle cx="120" cy="252" r="8" />
          <circle cx="120" cy="280" r="8" />
        </g>
      );
    case "vinyl":
      return (
        <g {...props}>
          <circle cx="150" cy="230" r="62" />
          <circle cx="150" cy="230" r="40" />
          <circle cx="150" cy="230" r="8" fill={color} />
          <path d="M120 182 q-6 -10 4 -16 M182 276 q6 10 -4 16" strokeWidth={3} />
        </g>
      );
    case "wheat":
      return (
        <g {...props}>
          <path d="M150 340 v-130" />
          <path d="M150 250 q-26 -6 -30 -26 q24 2 30 26 z M150 222 q-26 -6 -30 -26 q24 2 30 26 z M150 194 q-26 -6 -30 -26 q24 2 30 26 z" />
          <path d="M150 250 q26 -6 30 -26 q-24 2 -30 26 z M150 222 q26 -6 30 -26 q-24 2 -30 26 z M150 194 q26 -6 30 -26 q-24 2 -30 26 z" />
        </g>
      );
    case "spark":
      return (
        <g {...props}>
          <path d="M150 150 l8 22 22 8 -22 8 -8 22 -8 -22 -22 -8 22 -8 z" />
          <path d="M188 210 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" opacity={0.8} />
          <path d="M112 228 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" opacity={0.8} />
        </g>
      );
    case "house":
      return (
        <g {...props}>
          <path d="M112 230 v90 h76 v-90 L150 168 z" />
          <rect x="134" y="236" width="32" height="30" />
          <line x1="132" y1="238" x2="168" y2="238" />
          <circle cx="174" cy="176" r="4" />
          <path d="M120 322 q0 -14 -9 -20 M180 322 q0 -14 9 -20" />
        </g>
      );
    case "waves":
      return (
        <g {...props}>
          <path d="M96 210 q20 -18 40 0 t40 0 t40 0" />
          <path d="M96 238 q20 -18 40 0 t40 0 t40 0" />
          <path d="M96 266 q20 -18 40 0 t40 0 t40 0" />
          <path d="M150 330 q-22 -8 -34 -26 M150 330 q22 -8 34 -26" />
        </g>
      );
    case "openbook":
      return (
        <g {...props}>
          <path d="M74 200 q18 -14 38 -12 l38 8 v86 q-20 -6 -38 -6 c-18 0 -34 6 -38 8 z" />
          <path d="M226 200 q-18 -14 -38 -12 l-38 8 v86 q20 -6 38 -6 c18 0 34 6 38 8 z" />
          <path d="M150 196 v86" />
        </g>
      );
    default:
      return (
        <g {...props}>
          <path d="M112 202 q24 -20 48 -18 24 -2 40 18 l-40 46 z" />
          <path d="M112 202 q24 -20 48 -18" />
        </g>
      );
  }
}

export function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter((w) => w && w.toLowerCase() !== "the" && w.toLowerCase() !== "of")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function BookCover({ cover, title, className = "" }: BookCoverProps) {
  const [base, soft, accent, ink] = cover.palette;
  const gid = `bg-${cover.motif}-${Math.abs(title.split("").reduce((a, c) => a + c.charCodeAt(0), 0))}`;
  return (
    <svg viewBox="0 0 300 450" className={`aspect-[2/3] w-full ${className}`} role="img" aria-label={`Cover of ${title}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={soft} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="300" height="450" fill={base} />
      <rect width="300" height="450" fill={`url(#${gid})`} />
      <rect x="12" y="0" width="6" height="450" fill={ink} opacity="0.08" />
      <rect x="26" y="0" width="1.5" height="450" fill={ink} opacity="0.18" />

      <Frame color={ink} />

      <text
        x="150"
        y="66"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="40"
        fill={ink}
        opacity="0.96"
        letterSpacing="6"
      >
        {(cover.initial ?? initials(title)).toUpperCase()}
      </text>

      <g transform="translate(0, -30)">
        <Motif name={cover.motif} color={ink} />
      </g>

      <text
        x="150"
        y="418"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontSize="11"
        fill={ink}
        opacity="0.85"
        letterSpacing="3.4"
      >
        NOVELNEST
      </text>
    </svg>
  );
}