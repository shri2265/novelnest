import type { ReactNode } from "react";

interface GenreEmblemProps {
  genre: string;
  className?: string;
}

function Sparkle({ cx, cy, r, sw = 1.1 }: { cx: number; cy: number; r: number; sw?: number }) {
  const i = Number((r * 0.32).toFixed(2));
  return (
    <path
      d={`M${cx} ${cy - r} L${cx + i} ${cy - i} L${cx + r} ${cy} L${cx + i} ${cy + i} L${cx} ${cy + r} L${cx - i} ${cy + i} L${cx - r} ${cy} L${cx - i} ${cy - i} Z`}
      strokeWidth={sw}
    />
  );
}

const ART: Record<string, ReactNode> = {
  all: (
    <>
      <path d="M12 7.4 L14 12 L12 16.6 L10 12 Z" />
      <path d="M9.8 12 C8 10 5.4 10.2 4.2 12.4 C5.9 14.2 8.5 14 9.8 12 Z" strokeWidth={1.1} />
      <path d="M14.2 12 C16 10 18.6 10.2 19.8 12.4 C18.1 14.2 15.5 14 14.2 12 Z" strokeWidth={1.1} />
      <circle cx="12" cy="4.6" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19.4" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  romance: (
    <>
      <circle cx="12" cy="7.4" r="3.5" />
      <path d="M11.9 4.8 C13.6 5.1 14.4 6.5 13.9 7.8 C13.3 9 11.8 9.4 10.7 8.6" strokeWidth={1} />
      <path d="M12 10.9 V19.7" />
      <path d="M12 14.6 C9.5 13.9 7.5 15 7 17.2 C9.7 18 11.7 16.8 12 14.6 Z" strokeWidth={1.1} />
      <path d="M12 17.6 C14.3 16.9 16.2 17.9 16.7 19.9 C14.2 20.7 12.3 19.6 12 17.6 Z" strokeWidth={1.1} />
    </>
  ),
  fantasy: (
    <>
      <path d="M16 4 C9.6 5.4 4.6 8.6 4.6 12.4 C4.6 16.4 9.4 19.6 16 20.6 C11.6 18 10 15.4 10 12.4 C10 9.2 11.6 6.6 16 4 Z" />
      <Sparkle cx={19.7} cy={6.6} r={3} />
      <Sparkle cx={20.4} cy={14.6} r={2.1} sw={1} />
    </>
  ),
  mystery: (
    <>
      <circle cx="10.6" cy="10.6" r="5.8" />
      <path d="M14.9 14.9 L19.4 19.4" />
      <path d="M18.2 20.7 L20.7 18.2" strokeWidth={1.1} />
      <circle cx="10.6" cy="9.4" r="1.5" strokeWidth={1} />
      <path d="M9.9 10.7 L9.6 13 H11.6 L11.3 10.7" strokeWidth={1} />
    </>
  ),
  thriller: (
    <>
      <path d="M12 3.2 L13.7 8.6 V13 H10.3 V8.6 Z" />
      <path d="M12 5.6 V12.8" strokeWidth={1} />
      <path d="M8.2 13 H15.8" />
      <path d="M11.1 13.8 V17.6" />
      <path d="M12.9 13.8 V17.6" />
      <path d="M11.1 17.6 C11.6 19.3 12.4 19.3 12.9 17.6" strokeWidth={1.1} />
    </>
  ),
  "science-fiction": (
    <>
      <circle cx="11.8" cy="12" r="5.1" />
      <ellipse cx="11.8" cy="12" rx="9.4" ry="3.3" transform="rotate(-24 11.8 12)" strokeWidth={1} />
      <Sparkle cx={19.9} cy={5.4} r={2.8} />
      <Sparkle cx={4.5} cy={5.8} r={1.9} sw={1} />
    </>
  ),
  "historical-fiction": (
    <>
      <circle cx="12" cy="4.6" r="1.7" />
      <path d="M11 5.9 V7.5 M13 5.9 V7.5" strokeWidth={1} />
      <circle cx="12" cy="14" r="6.7" />
      <path d="M12 14 V9.7" />
      <path d="M12 14 L14.9 15.2" />
      <circle cx="12" cy="14" r="0.7" fill="currentColor" stroke="none" />
      <path d="M12 8.9 V10 M17.1 14 H16 M12 19.1 V18 M6.9 14 H8" strokeWidth={1} />
    </>
  ),
  "young-adult": (
    <>
      <path d="M12 11 C10.2 9.5 7.9 9.1 5.8 9.5 V17.8 C7.9 17.4 10.2 17.8 12 19.3 C13.8 17.8 16.1 17.4 18.2 17.8 V9.5 C16.1 9.1 13.8 9.5 12 11 Z" />
      <path d="M12 11 V19.3" strokeWidth={1} />
      <Sparkle cx={6.4} cy={5.4} r={2.6} />
      <Sparkle cx={17.4} cy={4.6} r={2} sw={1} />
      <Sparkle cx={20.2} cy={8.6} r={1.5} sw={1} />
    </>
  ),
  horror: (
    <>
      <path d="M12 12.4 C9.8 10.6 10.2 7.7 12 6.1 C13.8 7.7 14.2 10.6 12 12.4 Z" />
      <path d="M12 12.4 V13.7" strokeWidth={1} />
      <path d="M9.6 14.4 Q10.4 15.3 11.2 14.4 Q12 13.5 12.8 14.4 Q13.6 15.3 14.4 14.4 V19.6 H9.6 Z" />
      <path d="M10.5 15.6 C10 17.1 10.1 18.1 10.6 18.8" strokeWidth={0.9} />
      <path d="M8.2 19.6 H15.8 L14.3 21.8 H9.7 Z" />
    </>
  ),
  adventure: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 5.6 L13.3 10.7 L18.4 12 L13.3 13.3 L12 18.4 L10.7 13.3 L5.6 12 L10.7 10.7 Z" strokeWidth={1.1} />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <path d="M16.3 16.3 L17 17 M7.7 16.3 L7 17 M16.3 7.7 L17 7 M7.7 7.7 L7 7" strokeWidth={1} />
    </>
  ),
  "literary-fiction": (
    <>
      <path d="M7.6 4.4 H16.4 V6.2 H7.6 Z" />
      <path d="M8.8 7.6 H15.2" strokeWidth={1.1} />
      <path d="M9.6 7.6 V18.4 M12 7.6 V18.4 M14.4 7.6 V18.4" strokeWidth={1} />
      <path d="M8.8 18.4 H15.2" strokeWidth={1.1} />
      <path d="M7.6 18.4 H16.4 V20.4 H7.6 Z" />
    </>
  ),
  poetry: (
    <>
      <path d="M19.6 5.4 C22.2 8.6 21.4 12.2 17.4 13.6 C17.2 10.6 16.6 7.6 19.6 5.4 Z" />
      <path d="M18.4 7.6 L20.9 8.8" strokeWidth={0.9} />
      <path d="M17.9 10.6 L20.6 11.6" strokeWidth={0.9} />
      <path d="M17.4 13.6 L10.6 17.2" strokeWidth={1.1} />
      <path d="M8.4 11.4 H11.2 V14.2 H8.4 Z" />
      <path d="M8 9.6 H11.6 V11.4 H8 Z" />
      <path d="M6 14.2 H13.6 V19 C13.6 20 12.8 20.8 11.8 20.8 H7.8 C6.8 20.8 6 20 6 19 Z" />
    </>
  ),
  "short-stories": (
    <>
      <path d="M5.6 16.4 H17.4 V20 H5.6 Z" />
      <path d="M7.2 16.4 V20" strokeWidth={0.9} />
      <path d="M6.8 12.4 H18.6 V16 H6.8 Z" />
      <path d="M8.4 12.4 V16" strokeWidth={0.9} />
      <path d="M5.2 8.4 H17 V12 H5.2 Z" />
      <path d="M6.8 8.4 V12" strokeWidth={0.9} />
      <path d="M8.4 9.8 H15.4 M8.4 10.9 H13.2" strokeWidth={0.9} />
    </>
  ),
};

export function GenreEmblem({ genre, className = "" }: GenreEmblemProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ART[genre] ?? ART.all}
    </svg>
  );
}
