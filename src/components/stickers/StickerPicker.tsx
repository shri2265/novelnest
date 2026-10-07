import { useMemo, useState } from "react";
import { STICKERS } from "../../data/stickers";
import type { StickerCategory } from "../../types";
import { StickerArt } from "./StickerArt";

const CATEGORIES: { id: StickerCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reading", label: "Reading" },
  { id: "cozy", label: "Cozy" },
  { id: "reactions", label: "Reactions" },
  { id: "nature", label: "Nature" },
  { id: "books", label: "Books" },
];

interface StickerPickerProps {
  onPick: (stickerId: string) => void;
  onClose: () => void;
  compact?: boolean;
}

export function StickerPicker({ onPick, onClose, compact }: StickerPickerProps) {
  const [category, setCategory] = useState<StickerCategory | "all">("all");
  const items = useMemo(
    () => (category === "all" ? STICKERS : STICKERS.filter((s) => s.category === category)),
    [category]
  );

  return (
    <div className="w-72 overflow-hidden rounded-2xl border border-parchment-deep/50 bg-ivory shadow-lift" role="dialog" aria-label="Choose a sticker">
      <div className="flex items-center justify-between border-b border-parchment-deep/40 px-3 py-2">
        <span className="text-xs font-semibold text-coffee-deep">Stickers</span>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-espresso/50 hover:bg-parchment/60 hover:text-espresso" aria-label="Close sticker picker">
          ✕
        </button>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-parchment-deep/40 px-2 py-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
              category === cat.id ? "bg-coffee text-cream" : "text-coffee-deep hover:bg-parchment/60"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={`grid grid-cols-5 gap-1 overflow-y-auto p-2 ${compact ? "max-h-40" : "max-h-56"}`}>
        {items.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => onPick(sticker.id)}
            className="flex aspect-square items-center justify-center rounded-xl bg-cream/70 p-1.5 text-coffee transition-all hover:scale-105 hover:bg-parchment/50 active:scale-95"
            title={sticker.name}
          >
            <StickerArt motif={sticker.motif} color={sticker.color} className="h-full w-full" />
          </button>
        ))}
      </div>
      <div className="border-t border-parchment-deep/40 px-3 py-1.5 text-center text-[10px] text-espresso/40">
        Stickers land right at your reading spot.
      </div>
    </div>
  );
}