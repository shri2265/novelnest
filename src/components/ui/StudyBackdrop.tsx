import type { CSSProperties } from "react";

/* Vintage literary still-life — a dark European writer's study on a rainy evening.
   Composition (left → right): stack of weathered leather books + tall glass vase of
   dried baby's breath → antique walnut desk spread with overlapping aged parchment
   manuscripts → cream candle in a brass holder (upper-right, warm glow) with a vintage
   ceramic teacup and extra old books on the right. Low-key warm lighting, shallow depth
   of field (soft-focus background), film grain, vignette. The upper-center stays dark
   and calm so the hero text remains readable, with detail peaking along the edges and
   the lower-middle desk. */
export function StudyBackdrop({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="nn-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#33251A" />
          <stop offset="48%" stopColor="#2A1D13" />
          <stop offset="100%" stopColor="#20160F" />
        </linearGradient>
        <linearGradient id="nn-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#533B27" />
          <stop offset="55%" stopColor="#4A3324" />
          <stop offset="100%" stopColor="#2F2118" />
        </linearGradient>
        <linearGradient id="nn-paperMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7D8BA" />
          <stop offset="100%" stopColor="#CDB58F" />
        </linearGradient>
        <linearGradient id="nn-paperWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9C19B" />
          <stop offset="100%" stopColor="#B99A6E" />
        </linearGradient>
        <linearGradient id="nn-leather" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A2E1C" />
          <stop offset="100%" stopColor="#2C1A0E" />
        </linearGradient>
        <linearGradient id="nn-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A96B" />
          <stop offset="100%" stopColor="#8A6A3C" />
        </linearGradient>
        <linearGradient id="nn-inkglass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9A6E3C" />
          <stop offset="100%" stopColor="#5A3E26" />
        </linearGradient>
        <radialGradient id="nn-windowglow" gradientUnits="userSpaceOnUse" cx="250" cy="260" r="560">
          <stop offset="0%" stopColor="#C8B795" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#B39D7A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#B39D7A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nn-candle" gradientUnits="userSpaceOnUse" cx="1240" cy="470" r="300">
          <stop offset="0%" stopColor="#F3C98A" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#D99F52" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D99F52" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nn-center" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stopColor="#20160F" stopOpacity="0.14" />
          <stop offset="62%" stopColor="#20160F" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#20160F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nn-vignette" cx="50%" cy="48%" r="75%">
          <stop offset="0%" stopColor="#1A120B" stopOpacity="0" />
          <stop offset="72%" stopColor="#1A120B" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#1A120B" stopOpacity="0.52" />
        </radialGradient>
        <linearGradient id="nn-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="45%" stopColor="#FFC46A" />
          <stop offset="100%" stopColor="#E08A2E" />
        </linearGradient>
        <filter id="nn-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <filter id="nn-dof" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter id="nn-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="12" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.1 0.1 0.1 0 0" />
        </filter>
      </defs>

      {/* ——— Background: dark old study + rainy window, softly defocused ——— */}
      <g filter="url(#nn-dof)">
        <rect width="1600" height="900" fill="url(#nn-wall)" />
        <g stroke="#20160F" opacity="0.35">
          <line x1="400" y1="0" x2="400" y2="900" strokeWidth="2" />
          <line x1="800" y1="0" x2="800" y2="900" strokeWidth="2" />
          <line x1="1200" y1="0" x2="1200" y2="900" strokeWidth="2" />
          <line x1="0" y1="300" x2="1600" y2="300" strokeWidth="3" />
        </g>
        <rect width="1600" height="900" fill="url(#nn-windowglow)" />
        <g transform="translate(110, 88)">
          <rect width="240" height="322" rx="6" fill="#1B120B" />
          <rect x="10" y="10" width="220" height="302" rx="3" fill="#6A5A44" opacity="0.28" />
          <rect x="10" y="10" width="220" height="302" rx="3" fill="#CDB58F" opacity="0.08" />
          <line x1="120" y1="10" x2="120" y2="312" stroke="#1B120B" strokeWidth="9" />
          <line x1="10" y1="156" x2="230" y2="156" stroke="#1B120B" strokeWidth="9" />
          <g stroke="#D9CBB2" strokeWidth="1.5" opacity="0.3" strokeLinecap="round">
            <line x1="28" y1="40" x2="58" y2="78" />
            <line x1="140" y1="56" x2="176" y2="100" />
            <line x1="64" y1="176" x2="96" y2="214" />
            <line x1="172" y1="196" x2="202" y2="234" />
            <line x1="42" y1="98" x2="70" y2="132" />
            <line x1="152" y1="158" x2="178" y2="190" />
          </g>
        </g>
      </g>

      {/* ——— Antique walnut desk ——— */}
      <polygon points="0,900 0,618 1600,590 1600,900" fill="url(#nn-desk)" />
      <g stroke="#241A10" opacity="0.18" strokeWidth="2" fill="none">
        <path d="M0 672 q 800 18 1600 6" />
        <path d="M0 750 q 800 14 1600 2" />
        <path d="M0 828 q 800 12 1600 0" />
      </g>
      <line x1="0" y1="616" x2="1600" y2="588" stroke="#6B4A32" strokeWidth="2" opacity="0.35" />
      <ellipse cx="330" cy="690" rx="430" ry="170" fill="#C8B795" opacity="0.08" filter="url(#nn-soft)" />
      <rect x="0" y="895" width="1600" height="5" fill="#1E130C" opacity="0.85" />

      {/* ——— LEFT: stack of weathered leather books ——— */}
      <g>
        <ellipse cx="205" cy="630" rx="120" ry="16" fill="#1A120B" opacity="0.5" filter="url(#nn-soft)" />
        <g transform="rotate(-2 205 620)">
          <rect x="122" y="592" width="158" height="36" rx="5" fill="url(#nn-leather)" />
          <rect x="134" y="592" width="11" height="36" rx="4" fill="#1F120A" />
          <g stroke="#A98750" strokeWidth="1.4" opacity="0.6" strokeLinecap="round">
            <line x1="140" y1="600" x2="140" y2="604" />
            <line x1="140" y1="616" x2="140" y2="620" />
          </g>
          <rect x="270" y="592" width="9" height="36" fill="#D9C19B" opacity="0.85" />
          <line x1="271" y1="596" x2="271" y2="624" stroke="#A98750" strokeWidth="1" opacity="0.5" />
          <path d="M122 596 q 79 3 158 0" stroke="#6B4A32" strokeWidth="1.4" opacity="0.5" fill="none" />
        </g>
        <g transform="rotate(1.5 210 580)">
          <rect x="132" y="566" width="166" height="30" rx="5" fill="#3B2415" />
          <rect x="144" y="566" width="10" height="30" rx="4" fill="#221309" />
          <rect x="288" y="566" width="9" height="30" fill="#C9B28B" opacity="0.85" />
          <g stroke="#A98750" strokeWidth="1.4" opacity="0.55" strokeLinecap="round">
            <line x1="150" y1="573" x2="150" y2="577" />
            <line x1="150" y1="587" x2="150" y2="591" />
          </g>
          <path d="M132 570 q 83 2 166 0" stroke="#6B4A32" strokeWidth="1.4" opacity="0.45" fill="none" />
        </g>
        <g transform="rotate(-3 200 548)">
          <rect x="126" y="540" width="152" height="27" rx="4" fill="#452A18" />
          <rect x="138" y="540" width="9" height="27" rx="4" fill="#241408" />
          <rect x="268" y="540" width="9" height="27" fill="#D9C19B" opacity="0.8" />
          <line x1="144" y1="546" x2="144" y2="562" stroke="#A98750" strokeWidth="1.3" opacity="0.5" />
          <line x1="144" y1="548" x2="144" y2="560" stroke="#A98750" strokeWidth="0.8" opacity="0.4" />
          <path d="M126 543 q 76 2 152 0" stroke="#6B4A32" strokeWidth="1.3" opacity="0.4" fill="none" />
        </g>
        <g transform="rotate(4 208 520)">
          <rect x="140" y="504" width="158" height="38" rx="5" fill="#523722" />
          <rect x="150" y="504" width="10" height="38" rx="4" fill="#2B1A0D" />
          <rect x="288" y="504" width="9" height="38" fill="#E7D8BA" opacity="0.9" />
          <g stroke="#A98750" strokeWidth="1.6" opacity="0.7" strokeLinecap="round">
            <line x1="157" y1="512" x2="157" y2="517" />
            <line x1="157" y1="529" x2="157" y2="534" />
          </g>
          <rect x="280" y="508" width="7" height="30" rx="2" fill="#A98750" opacity="0.85" />
          <path d="M140 508 q 79 2 158 0" stroke="#7A5739" strokeWidth="1.6" opacity="0.55" fill="none" />
        </g>
      </g>

      {/* ——— LEFT/CENTER: tall glass vase with dried baby's breath ——— */}
      <g>
        <ellipse cx="376" cy="612" rx="44" ry="10" fill="#1A120B" opacity="0.42" filter="url(#nn-soft)" />
        <g stroke="#7C7657" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.95">
          <path d="M376 470 q -4 -40 -24 -78" />
          <path d="M376 470 q 2 -46 2 -92" />
          <path d="M376 470 q 6 -40 26 -70" />
          <path d="M376 470 q 10 -34 32 -54" />
          <path d="M376 470 q -12 -30 -42 -52" />
          <path d="M376 470 q 14 -26 42 -38" />
        </g>
        <g fill="#E7D8BA">
          <circle cx="352" cy="390" r="3.4" /><circle cx="362" cy="376" r="3" />
          <circle cx="376" cy="368" r="3.6" /><circle cx="376" cy="382" r="2.8" />
          <circle cx="390" cy="374" r="3" /><circle cx="402" cy="386" r="3.4" />
          <circle cx="408" cy="402" r="3" /><circle cx="376" cy="400" r="3.2" />
          <circle cx="334" cy="404" r="3.2" /><circle cx="345" cy="412" r="2.8" />
          <circle cx="414" cy="414" r="2.8" /><circle cx="426" cy="426" r="3" />
        </g>
        <ellipse cx="376" cy="564" rx="42" ry="34" fill="#D9C19B" opacity="0.12" />
        <ellipse cx="376" cy="516" rx="26" ry="19" fill="#D9C19B" opacity="0.12" />
        <rect x="362" y="466" width="28" height="50" fill="#D9C19B" opacity="0.12" />
        <ellipse cx="376" cy="466" rx="15" ry="5" fill="none" stroke="#E7D8BA" strokeWidth="2" opacity="0.45" />
        <line x1="358" y1="520" x2="358" y2="592" stroke="#F4EDD9" strokeWidth="2.4" opacity="0.28" />
        <line x1="350" y1="544" x2="350" y2="572" stroke="#F4EDD9" strokeWidth="1.4" opacity="0.2" />
        <g stroke="#7C7657" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M376 470 q -2 -36 6 -64" />
          <path d="M376 470 q 4 -32 18 -54" />
        </g>
        <g fill="#CDB58F">
          <circle cx="380" cy="408" r="2.6" /><circle cx="390" cy="420" r="2.6" />
          <circle cx="386" cy="430" r="2.4" /><circle cx="398" cy="438" r="2.4" />
        </g>
      </g>

      {/* ——— CENTER: antique desk spread with overlapping aged manuscripts ——— */}
      <g>
        <ellipse cx="700" cy="710" rx="320" ry="60" fill="#1A120B" opacity="0.4" filter="url(#nn-soft)" />
        <g transform="rotate(-6 480 670)">
          <rect x="380" y="620" width="150" height="100" rx="3" fill="#E7D8BA" opacity="0.95" />
          <line x1="380" y1="648" x2="530" y2="672" stroke="#B99A6E" strokeWidth="1.8" opacity="0.6" />
          <line x1="398" y1="660" x2="398" y2="706" stroke="#8A6A3C" strokeWidth="1.2" opacity="0.5" />
          <circle cx="410" cy="700" r="10" fill="#8A3A28" />
          <circle cx="407" cy="697" r="3" fill="#B0553D" opacity="0.7" />
        </g>
        <g transform="rotate(2 700 640)">
          <rect x="500" y="600" width="460" height="140" rx="4" fill="url(#nn-paperWarm)" opacity="0.92" />
          <line x1="502" y1="600" x2="958" y2="600" stroke="#A3835B" strokeWidth="1.6" opacity="0.6" />
        </g>
        <g transform="rotate(3 880 680)">
          <rect x="700" y="640" width="300" height="120" rx="4" fill="url(#nn-paperWarm)" opacity="0.85" />
          <g stroke="#7A5136" strokeLinecap="round" fill="none" opacity="0.35">
            <polyline points="880,660 960,660 1020,662" strokeWidth="2" />
            <polyline points="880,680 940,680 1010,682" strokeWidth="2" />
            <polyline points="880,700 930,700 1000,702" strokeWidth="2" />
          </g>
        </g>
        <g transform="rotate(-1 690 675)">
          <rect x="430" y="620" width="500" height="152" rx="4" fill="url(#nn-paperMain)" />
          <line x1="452" y1="632" x2="452" y2="758" stroke="#8A3A28" strokeWidth="1.6" opacity="0.55" />
          <g stroke="#7A5136" strokeLinecap="round" fill="none">
            <polyline points="470,646 516,644 566,647 616,644 664,647 714,645 764,647 812,644 862,646 908,644" strokeWidth="3" opacity="0.6" />
            <polyline points="470,664 530,662 588,664 640,662 700,664 756,662 816,664 872,662 908,664" strokeWidth="2.4" opacity="0.5" />
            <polyline points="470,682 520,680 572,682 626,680 686,682 742,680 802,682 858,680 908,682" strokeWidth="2.4" opacity="0.48" />
            <polyline points="470,700 532,698 590,700 648,698 706,700 764,698 822,700 878,698 908,700" strokeWidth="2.4" opacity="0.5" />
            <polyline points="470,718 518,716 566,718 618,716 670,718 724,716 778,718 828,716 908,718" strokeWidth="2.4" opacity="0.42" />
            <polyline points="470,736 528,734 578,736 634,734 684,736 742,734 796,736 848,734 908,736" strokeWidth="2.4" opacity="0.45" />
            <polyline points="470,754 514,752 556,754 598,752 640,754 690,752 738,754 784,752 836,754" strokeWidth="2.4" opacity="0.38" />
          </g>
        </g>

        {/* scattered dried sprigs + petals on the papers */}
        <g stroke="#6B6A4E" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M480 726 q 32 -8 66 -26" />
          <path d="M778 716 q 40 -4 72 -20" />
        </g>
        <g fill="#E7D8BA" opacity="0.9">
          <circle cx="520" cy="708" r="2.2" /><circle cx="540" cy="695" r="2.2" />
          <circle cx="556" cy="686" r="2" /><circle cx="600" cy="742" r="2.4" />
          <circle cx="648" cy="750" r="2.2" /><circle cx="728" cy="744" r="2.4" />
          <circle cx="824" cy="722" r="2.2" /><circle cx="856" cy="712" r="2.4" />
          <circle cx="512" cy="748" r="2" /><circle cx="680" cy="748" r="1.8" />
        </g>

        {/* fountain pen across the page */}
        <ellipse cx="675" cy="740" rx="72" ry="7" fill="#1A120B" opacity="0.28" filter="url(#nn-soft)" />
        <g transform="rotate(32 610 712)">
          <rect x="610" y="712" width="112" height="12" rx="6" fill="#3A2A1C" />
          <rect x="610" y="715" width="112" height="2.6" rx="1.3" fill="#CDB58F" opacity="0.35" />
          <rect x="676" y="712" width="10" height="12" rx="2" fill="#A98750" />
          <path d="M722 712 l 18 6 l -18 6 z" fill="#6B4A32" />
          <line x1="722" y1="714" x2="736" y2="718" stroke="#20160F" strokeWidth="1.4" opacity="0.5" />
        </g>

        {/* vintage ink bottle beside the papers */}
        <g>
          <ellipse cx="1004" cy="668" rx="24" ry="7" fill="#1A120B" opacity="0.4" filter="url(#nn-soft)" />
          <rect x="984" y="634" width="40" height="36" rx="9" fill="url(#nn-inkglass)" opacity="0.9" />
          <rect x="990" y="640" width="28" height="25" rx="6" fill="#241812" opacity="0.85" />
          <rect x="997" y="628" width="14" height="7" rx="2" fill="#4A3324" />
          <rect x="995" y="616" width="18" height="14" rx="3" fill="url(#nn-brass)" />
          <line x1="990" y1="642" x2="990" y2="664" stroke="#F4EDD9" strokeWidth="1.6" opacity="0.3" strokeLinecap="round" />
        </g>
      </g>

      {/* ——— RIGHT: extra old books, tucked letter & ceramic teacup ——— */}
      <g>
        <g transform="rotate(-5 1450 585)">
          <ellipse cx="1450" cy="596" rx="34" ry="8" fill="#1A120B" opacity="0.45" filter="url(#nn-soft)" />
          <rect x="1428" y="470" width="44" height="124" rx="4" fill="#6B4A32" />
          <rect x="1428" y="470" width="44" height="7" fill="#7A5739" />
          <g stroke="#A98750" strokeWidth="1.8" opacity="0.7" strokeLinecap="round">
            <line x1="1439" y1="484" x2="1439" y2="494" />
            <line x1="1439" y1="552" x2="1439" y2="562" />
          </g>
        </g>
        <g transform="rotate(-8 1380 618)">
          <rect x="1330" y="602" width="100" height="32" rx="2" fill="#E7D8BA" opacity="0.88" />
          <line x1="1342" y1="610" x2="1402" y2="610" stroke="#7A5136" strokeWidth="1.6" opacity="0.5" />
          <line x1="1342" y1="620" x2="1392" y2="620" stroke="#7A5136" strokeWidth="1.6" opacity="0.5" />
        </g>
        <g transform="rotate(3 1400 675)">
          <ellipse cx="1400" cy="682" rx="110" ry="14" fill="#1A120B" opacity="0.4" filter="url(#nn-soft)" />
          <rect x="1338" y="650" width="150" height="40" rx="6" fill="#3A2415" />
          <rect x="1348" y="654" width="130" height="32" rx="3" fill="none" stroke="#A98750" strokeWidth="1.4" opacity="0.6" />
          <rect x="1358" y="658" width="7" height="26" rx="2" fill="#A98750" opacity="0.85" />
          <rect x="1478" y="650" width="9" height="40" fill="#C9B28B" opacity="0.85" />
        </g>

        {/* vintage ceramic teacup + saucer */}
        <g>
          <ellipse cx="1300" cy="790" rx="62" ry="15" fill="#1A120B" opacity="0.45" filter="url(#nn-soft)" />
          <ellipse cx="1300" cy="782" rx="58" ry="14" fill="#E7D8BA" />
          <ellipse cx="1300" cy="780" rx="36" ry="9" fill="#CDB58F" opacity="0.75" />
          <ellipse cx="1300" cy="780" rx="30" ry="7" fill="none" stroke="#A98750" strokeWidth="1.4" opacity="0.6" />
          <path d="M1266 684 q 34 -28 68 0 l -12 72 q -22 22 -44 0 z" fill="#E7D8BA" />
          <ellipse cx="1300" cy="672" rx="32" ry="8" fill="#4A3324" opacity="0.85" />
          <ellipse cx="1300" cy="668" rx="32" ry="8" fill="none" stroke="#F4EDD9" strokeWidth="1.6" opacity="0.55" />
          <path d="M1274 706 q 26 16 52 0" stroke="#4A3324" strokeWidth="3.4" opacity="0.6" fill="none" />
          <path d="M1272 694 q 28 12 56 0" stroke="#A98750" strokeWidth="1.6" opacity="0.5" fill="none" />
          <circle cx="1284" cy="702" r="2.4" fill="#4A3324" opacity="0.7" />
          <circle cx="1316" cy="702" r="2.4" fill="#4A3324" opacity="0.7" />
          <path d="M1368 690 q 20 4 20 32 q 0 28 -22 32" stroke="#E7D8BA" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M1269 692 q -3 28 4 50" stroke="#F4EDD9" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
          <path d="M1300 640 q 8 -14 0 -26 M1312 636 q 8 -12 0 -24" stroke="#C8B795" strokeWidth="2.2" opacity="0.3" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ——— UPPER-RIGHT: cream candle in antique brass holder ——— */}
      <g>
        <ellipse cx="1240" cy="470" rx="300" ry="340" fill="url(#nn-candle)" />
        <ellipse cx="1240" cy="640" rx="150" ry="48" fill="#F3C98A" opacity="0.1" filter="url(#nn-soft)" />
        <ellipse cx="1240" cy="576" rx="34" ry="11" fill="#3D2B18" />
        <ellipse cx="1240" cy="582" rx="26" ry="8" fill="#2E1F12" />
        <rect x="1233" y="554" width="14" height="24" fill="#6B4A32" />
        <ellipse cx="1240" cy="556" rx="24" ry="8" fill="#8A6A3C" />
        <ellipse cx="1240" cy="540" rx="28" ry="10" fill="url(#nn-brass)" />
        <ellipse cx="1240" cy="536" rx="26" ry="8" fill="none" stroke="#CBB07C" strokeWidth="1.6" opacity="0.7" />
        <rect x="1222" y="436" width="36" height="104" rx="7" fill="#E7D8BA" opacity="0.96" />
        <rect x="1216" y="470" width="10" height="26" rx="4" fill="#E7D8BA" opacity="0.95" />
        <rect x="1236" y="500" width="8" height="15" rx="3" fill="#E7D8BA" opacity="0.9" />
        <ellipse cx="1240" cy="536" rx="25" ry="8" fill="#F1E9D4" opacity="0.95" />
        <rect x="1238" y="428" width="4" height="8" fill="#2E1F12" />
        <ellipse cx="1240" cy="424" rx="26" ry="34" fill="#F3C98A" opacity="0.5" filter="url(#nn-soft)" />
        <path d="M1240 396 q 12 22 12 38 q 0 16 -12 20 q -12 -4 -12 -20 q 0 -16 12 -38 z" fill="url(#nn-flame)" />
        <path d="M1240 408 q 6 14 6 24 q 0 10 -6 12 q -6 -2 -6 -12 q 0 -10 6 -24 z" fill="#FFF3CE" opacity="0.9" />
        <circle cx="1240" cy="418" r="6" fill="#FFF9E2" opacity="0.8" />
      </g>

      {/* ——— Gentle centre darkening (text legibility) ——— */}
      <rect width="1600" height="900" fill="url(#nn-center)" />

      {/* ——— Warm espresso-brown overlay (not black) ——— */}
      <rect width="1600" height="900" fill="#302217" opacity="0.38" />

      {/* ——— Film grain ——— */}
      <rect width="1600" height="900" filter="url(#nn-grain)" opacity="0.8" />

      {/* ——— Warm vignette ——— */}
      <rect width="1600" height="900" fill="url(#nn-vignette)" />
    </svg>
  );
}

export function OpenBookMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <path d="M8 30 q26 -22 52 0 q26 -22 52 0 v32 q-26 -18 -52 0 q-26 -18 -52 0 z" />
        <path d="M60 30 v32" />
        <path d="M60 22 v4" />
      </g>
    </svg>
  );
}