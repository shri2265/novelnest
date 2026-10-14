import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface InfoTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** When provided the tile becomes an interactive, keyboard-accessible card. */
  onClick?: () => void;
}

export function InfoTile({ icon: Icon, label, value, onClick }: InfoTileProps) {
  const content = (
    <>
      <Icon className="mx-auto h-[18px] w-[18px] text-terracotta" />
      <p className="mt-1.5 font-serif text-base font-semibold text-espresso">{value}</p>
      <p className="text-[11px] text-espresso/50">{label}</p>
    </>
  );

  if (!onClick) {
    return <div className="rounded-2xl border border-parchment-deep/40 bg-ivory p-3.5 text-center">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}. Open details`}
      className="group relative w-full rounded-2xl border border-parchment-deep/40 bg-ivory p-3.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-coffee/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      <ArrowUpRight
        aria-hidden
        className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-terracotta opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      {content}
    </button>
  );
}
