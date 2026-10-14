import { GENRES } from "../../data/genres";
import { GenreEmblem } from "./GenreEmblem";

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
      className={`group inline-flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-all duration-150 ${
        active
          ? "border-coffee bg-coffee shadow-paper"
          : "border-parchment-deep/70 bg-ivory hover:-translate-y-0.5 hover:border-coffee/60 hover:bg-parchment/40 hover:shadow-paper"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border transition-colors ${
          active ? "border-cream/35 bg-cream/10 text-cream" : "border-coffee/25 bg-parchment/50 text-coffee group-hover:text-coffee-deep"
        }`}
      >
        <GenreEmblem genre={genre} className="h-[18px] w-[18px]" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span
          className={`font-serif text-[13px] font-semibold leading-tight tracking-[0.01em] ${active ? "text-cream" : "text-espresso"}`}
        >
          {label}
        </span>
        {count !== undefined ? (
          <span className={`mt-0.5 text-[10px] leading-none tabular-nums ${active ? "text-cream/70" : "text-espresso/45"}`}>
            {count} tales
          </span>
        ) : null}
      </span>
      {active ? (
        <span aria-hidden="true" className="ml-0.5 h-1.5 w-1.5 shrink-0 rotate-45 border border-cream/60 bg-cream/70" />
      ) : null}
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