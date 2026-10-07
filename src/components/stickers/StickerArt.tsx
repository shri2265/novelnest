import type { SVGAttributes } from "react";

interface StickerArtProps {
  motif: string;
  color?: string;
  className?: string;
}

export function StickerArt({ motif, color = "#60452F", className = "" }: StickerArtProps) {
  const c = color;
  const s: SVGAttributes<SVGSVGElement> = { fill: "none", stroke: c, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {motif === "coffee" ? (
        <g {...s}>
          <path d="M14 20 v16 h15 v-16 z M11 20 h21 M9 27 h-3 a5 5 0 0 0 0 10 h3 M32 27 a5 5 0 0 1 0 10" />
          <path d="M13 17 q4 -3 6 0 q4 -3 8 0 q3 -3 6 0" opacity="0.5" strokeWidth="2.4" />
        </g>
      ) : null}

      {motif === "openbook" ? (
        <g {...s}>
          <path d="M12 20 q10 -8 24 0 v16 q-12 -8 -24 0 z" />
          <path d="M36 20 q-10 -8 -24 0 v16 q12 -8 24 0 z" />
          <line x1="24" y1="20" x2="24" y2="36" />
        </g>
      ) : null}

      {motif === "closedbook" ? (
        <g {...s}>
          <rect x="12" y="14" width="24" height="24" rx="2" />
          <line x1="24" y1="14" x2="24" y2="38" />
          <circle cx="24" cy="19" r="1.5" strokeWidth="2" />
        </g>
      ) : null}

      {motif === "bookmark" ? (
        <g {...s}>
          <path d="M20 10 h12 v24 l-6 -5 l-6 5 z" />
          <line x1="22" y1="16" x2="30" y2="16" />
          <line x1="22" y1="21" x2="30" y2="21" />
        </g>
      ) : null}

      {motif === "glasses" ? (
        <g {...s}>
          <circle cx="16" cy="26" r="7" />
          <circle cx="32" cy="26" r="7" />
          <path d="M23 25 h2 M8 25 q2 -3 1 -1 M40 25 q-2 -3 -1 -1" />
          <line x1="16" y1="19" x2="24" y2="15" opacity="0.5" />
        </g>
      ) : null}

      {motif === "candle" ? (
        <g {...s}>
          <rect x="20" y="14" width="8" height="20" rx="2" />
          <path d="M24 12 q2 -3 4 -3 q-1 4 -4 5 z" />
          <path d="M17 34 h14 v3 h-14 z M15 37 h18 v3 h-18 z" opacity="0.8" />
        </g>
      ) : null}

      {motif === "blanket" ? (
        <g {...s}>
          <path d="M10 20 q2 -5 8 -5 q4 0 6 3 q2 -3 6 -3 q6 0 8 5 v12 q-2 -7 -6 -7 h-14 q-4 0 -6 7 z" />
          <path d="M14 26 h16 M14 31 h10" opacity="0.6" />
        </g>
      ) : null}

      {motif === "teacup" ? (
        <g {...s}>
          <path d="M12 22 h20 v8 q0 6 -6 8 h-8 q-6 -2 -6 -8 z" />
          <path d="M32 24 h3 a5 5 0 0 1 0 8 h-3" />
          <path d="M14 20 q3 -3 5 0 q3 -3 6 0 q3 -3 5 0 q2 -2 4 0" opacity="0.5" />
        </g>
      ) : null}

      {motif === "rain" ? (
        <g {...s}>
          <rect x="10" y="14" width="28" height="24" rx="4" />
          <line x1="12" y1="18" x2="12" y2="34" opacity="0.4" />
          <line x1="36" y1="18" x2="36" y2="34" opacity="0.4" />
          <path d="M18 12 q2 -3 4 -2 M28 10 q2 -3 4 -2" opacity="0.5" />
          <path d="M16 27 l2 -2 M30 33 l2 -3 M22 30 l2 -2" opacity="0.7" />
        </g>
      ) : null}

      {motif === "armchair" ? (
        <g {...s}>
          <path d="M14 18 h20 v12 h2 a4 4 0 0 1 0 8 h-24 a4 4 0 0 1 0 -8 h2 z" />
          <path d="M16 16 v-3 q0 -3 4 -3 h8 q4 0 4 3 v3 M12 38 v2 M36 38 v2" opacity="0.7" />
        </g>
      ) : null}

      {motif === "heart" ? (
        <g {...s}>
          <path d="M24 38 c-11 -8 -15 -14 -15 -21 a8 8 0 0 1 15 -5 a8 8 0 0 1 15 5 c0 7 -4 13 -15 21 z" />
        </g>
      ) : null}

      {motif === "sparkles" ? (
        <g {...s}>
          <path d="M24 14 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
          <path d="M40 10 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" opacity="0.8" />
          <path d="M8 32 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" opacity="0.8" />
        </g>
      ) : null}

      {motif === "happy" ? (
        <g {...s}>
          <circle cx="24" cy="24" r="16" />
          <path d="M18 20 a2 2 0 0 0 4 0 M26 20 a2 2 0 0 0 4 0" strokeWidth="2.6" />
          <path d="M17 28 q7 6 14 0" />
          <circle cx="32" cy="16" r="2" fill={c} stroke="none" />
        </g>
      ) : null}

      {motif === "tear" ? (
        <g {...s}>
          <circle cx="24" cy="24" r="16" />
          <path d="M18 20 a2 2 0 0 0 4 0 M26 20 a2 2 0 0 0 4 0" strokeWidth="2.6" />
          <path d="M16 30 q4 4 8 0" opacity="0.8" />
          <path d="M28 32 l-2 -2 l-1 1 l-2 3" strokeWidth="2.6" opacity="0.9" />
        </g>
      ) : null}

      {motif === "gasp" ? (
        <g {...s}>
          <circle cx="24" cy="24" r="16" />
          <circle cx="18" cy="22" r="1.8" fill={c} stroke="none" />
          <circle cx="30" cy="22" r="1.8" fill={c} stroke="none" />
          <ellipse cx="24" cy="30" rx="3.5" ry="4.5" />
        </g>
      ) : null}

      {motif === "twist" ? (
        <g {...s}>
          <path d="M24 8 q10 0 10 8 q0 7 -10 8 q-10 1 -10 8 q0 8 10 8" />
          <circle cx="24" cy="24" r="2.4" fill={c} stroke="none" />
          <path d="M24 8 q-8 14 0 16 M24 8 q8 14 0 16" opacity="0.4" strokeWidth="2" />
        </g>
      ) : null}

      {motif === "moon" ? (
        <g {...s}>
          <path d="M32 12 c-2 12 2 20 10 22 c-7 6 -16 5 -21 -2 c-6 -8 -3 -18 11 -20 z" />
          <path d="M34 14 c0 4 -2 6 -4 7" opacity="0.6" strokeWidth="2.2" />
        </g>
      ) : null}

      {motif === "stars" ? (
        <g {...s}>
          <path d="M24 10 l2.5 6 6.5 1 -5 5 1.5 6.5 -5.5 -3.5 -5.5 3.5 1.5 -6.5 -5 -5 6.5 -1 z" />
          <path d="M40 14 l1.2 3 3 0.6 -2.3 2 0.6 3 -2.5 -1.5 -2.5 1.5 0.6 -3 -2.3 -2 3 -0.6 z" opacity="0.7" />
        </g>
      ) : null}

      {motif === "flower" ? (
        <g {...s}>
          <circle cx="24" cy="22" r="3.4" />
          <path d="M24 18 v-5 M18 22 h-5 M30 22 h5 M19 17 l-3.5 -3.5 M29 17 l3.5 -3.5" opacity="0.7" />
          <circle cx="24" cy="13" r="3" />
          <circle cx="14" cy="22" r="3" />
          <circle cx="34" cy="22" r="3" />
          <path d="M24 25 q0 6 4 9 q-4 -3 -8 -6 q2 4 4 9" opacity="0.6" />
        </g>
      ) : null}

      {motif === "plant" ? (
        <g {...s}>
          <rect x="17" y="34" width="14" height="7" rx="1.5" />
          <path d="M24 34 v-9" />
          <path d="M24 26 q-7 -1 -8 -7 q5 1 8 1 q-1 -6 5 -7 q1 6 5 7 q2 -5 8 -1 q-4 4 -8 6 q1 3 0 3" />
        </g>
      ) : null}

      {motif === "leaf" ? (
        <g {...s}>
          <path d="M36 12 q-18 -2 -24 8 q-6 10 10 12 q-4 10 6 10 q22 -4 8 -30 z" />
          <path d="M22 24 q6 -8 14 -9 M20 32 q4 -2 7 -4" strokeWidth="2.2" opacity="0.7" />
        </g>
      ) : null}

      {motif === "snail" ? (
        <g {...s}>
          <circle cx="24" cy="30" r="8" />
          <circle cx="26" cy="26" r="3.4" />
          <path d="M24 38 c-6 0 -8 4 -12 4 h14 c3 0 3 -4 0 -4" opacity="0.7" />
          <path d="M36 14 c2 -2 4 -2 4 -4" strokeWidth="2.4" opacity="0.6" />
        </g>
      ) : null}

      {motif === "stack" ? (
        <g {...s}>
          <rect x="16" y="30" width="22" height="6" rx="1.5" />
          <rect x="13" y="24" width="26" height="6" rx="1.5" />
          <rect x="17" y="18" width="18" height="6" rx="1.5" />
          <rect x="20" y="12" width="11" height="6" rx="1.5" />
        </g>
      ) : null}

      {motif === "quill" ? (
        <g {...s}>
          <path d="M36 34 q-4 -16 -16 -22 q-6 -2 -9 2 q4 2 5 6 q0 -2 2 -2 q-2 6 -1 8 q4 2 8 2 q-5 -2 -3 -6 q2 -2 8 0 q6 2 6 12 z" />
          <path d="M22 18 q-3 -5 1 -8" opacity="0.6" />
        </g>
      ) : null}

      {motif === "lamp" ? (
        <g {...s}>
          <rect x="18" y="12" width="12" height="8" rx="2" />
          <path d="M24 20 v8 M20 34 h8 M24 28 l-3 -4 h6 z" />
          <path d="M30 30 l4 4 M34 30 l4 4" opacity="0.5" />
        </g>
      ) : null}

      {motif === "owl" ? (
        <g {...s}>
          <ellipse cx="24" cy="30" rx="13" ry="12" />
          <circle cx="18" cy="26" r="3.4" />
          <circle cx="30" cy="26" r="3.4" />
          <path d="M24 30 q-3 3 0 5 q3 -2 0 -5" />
          <path d="M24 30 v3 M24 19 l-2 -5 l-5 4 M24 19 l2 -5 l5 4" opacity="0.7" />
          <circle cx="19" cy="27" r="1.1" fill={c} stroke="none" />
          <circle cx="29" cy="27" r="1.1" fill={c} stroke="none" />
        </g>
      ) : null}

      {motif === "script" ? (
        <g {...s}>
          <rect x="14" y="14" width="22" height="26" rx="2" />
          <circle cx="20" cy="20" r="2.4" />
          <path d="M19 26 q3 0 5 3 q-4 0 -6 3 q1 -3 -1 -6 z" opacity="0.7" />
          <line x1="25" y1="18" x2="32" y2="18" />
          <line x1="25" y1="23" x2="32" y2="23" />
          <line x1="25" y1="28" x2="31" y2="28" />
        </g>
      ) : null}

      {motif === "mic" ? (
        <g {...s}>
          <rect x="20" y="10" width="8" height="18" rx="4" />
          <path d="M16 22 q0 7 8 7 q8 0 8 -7 M24 30 v5 M18 35 h5 M30 35 h-5" opacity="0.8" />
        </g>
      ) : null}

      {motif === "waves" ? (
        <g {...s}>
          <path d="M8 20 q8 -7 16 0 t16 0" />
          <path d="M8 28 q8 -7 16 0 t16 0" />
          <path d="M8 36 q8 -7 16 0 t16 0" />
        </g>
      ) : null}

      {motif === "default" || !motif ? (
        <g {...s}>
          <path d="M14 30 h4 l3 -10 l6 16 l4 -9 l3 3 h4" />
        </g>
      ) : null}
    </svg>
  );
}