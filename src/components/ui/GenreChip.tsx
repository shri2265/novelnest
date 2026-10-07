import { GENRES } from "../../data/genres";

interface GenreChipProps {
  genre: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
}

export function GenreChip({ genre, active, count, onClick }: GenreChipProps) {
  const label = genre === "all" ? "All genres" : GENRES.find((g) => g.id === genre)?.name ?? genre;
  const tip = GENRES.find((g) => g.id === genre)?.description;
  const Comp: "button" | "span" = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      title={tip}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? "border-coffee bg-coffee text-cream shadow-paper"
          : "border-parchment-deep/70 bg-ivory text-coffee-deep hover:border-coffee hover:bg-parchment/50"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
      {count !== undefined ? <span className={`tabular-nums ${active ? "text-cream/80" : "text-espresso/45"}`}>{count}</span> : null}
    </Comp>
  );
}

export function TagChip({ label, onClick }: { label: string; onClick?: () => void }) {
  const Comp: "button" | "span" = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="inline-flex items-center rounded-md bg-parchment/50 px-2 py-0.5 text-[11px] font-medium text-coffee-deep transition-colors hover:bg-parchment"
    >
      #{label.replace(/\s+/g, "-")}
    </Comp>
  );
}