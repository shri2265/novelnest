import { useState } from "react";
import { Bookmark, Feather, Share2, Smile, StickyNote, X } from "lucide-react";
import { HIGHLIGHT_COLORS } from "../../data/stickers";
import type { HighlightColor } from "../../types";

interface HighlightToolbarProps {
  x: number;
  y: number;
  color?: HighlightColor;
  onColor: (c: HighlightColor) => void;
  onTogglePicker: () => void;
  onNote: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onClose: () => void;
}

export function HighlightToolbar({ x, y, color = "gold", onColor, onTogglePicker, onNote, onBookmark, onShare, onClose }: HighlightToolbarProps) {
  return (
    <div
      className="fixed z-[60] -translate-x-1/2 translate-y-2 fade-in"
      style={{ left: Math.max(140, Math.min(x, window.innerWidth - 140)), top: y }}
      role="toolbar"
      aria-label="Text tools"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-0.5 rounded-full border border-parchment-deep/50 bg-ivory p-1.5 shadow-lift">
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-espresso/50 hover:bg-parchment/60"
          aria-label="Close tools"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <span className="mx-0.5 h-5 w-px bg-parchment-deep/50" />
        {HIGHLIGHT_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onColor(c.id)}
            aria-label={`Highlight in ${c.name}`}
            title={c.name}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 ${
              color === c.id ? "ring-2 ring-coffee ring-offset-1" : ""
            }`}
            style={{ backgroundColor: c.swatch }}
          />
        ))}
        <span className="mx-0.5 h-5 w-px bg-parchment-deep/50" />
        <button
          type="button"
          onClick={onTogglePicker}
          className="flex h-7 w-7 items-center justify-center rounded-full text-coffee hover:bg-parchment/60"
          aria-label="Add sticker"
          title="Sticker"
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onNote}
          className="flex h-7 w-7 items-center justify-center rounded-full text-coffee hover:bg-parchment/60"
          aria-label="Add a note"
          title="Note"
        >
          <StickyNote className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onBookmark}
          className="flex h-7 w-7 items-center justify-center rounded-full text-coffee hover:bg-parchment/60"
          aria-label="Bookmark this passage"
          title="Bookmark passage"
        >
          <Bookmark className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex h-7 w-7 items-center justify-center rounded-full text-coffee hover:bg-parchment/60"
          aria-label="Share this passage"
          title="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function NotePopover({ defaultText = "", onSave, onCancel }: { defaultText?: string; onSave: (text: string) => void; onCancel: () => void }) {
  const [text, setText] = useState(defaultText);
  return (
    <div
      className="fixed z-[61] w-72 rounded-2xl border border-parchment-deep/50 bg-ivory p-3 shadow-lift fade-in"
      role="dialog"
      aria-label="Write a note"
      onMouseDown={(e) => e.preventDefault()}
    >
      <p className="flex items-center gap-1.5 px-1 text-xs font-semibold text-coffee-deep">
        <StickyNote className="h-3.5 w-3.5" /> A note for this passage
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        autoFocus
        placeholder="What struck you here?"
        className="mt-2 w-full resize-none rounded-xl border border-parchment-deep/50 bg-cream/70 p-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
      />
      <div className="mt-2 flex items-center justify-between">
        <button type="button" onClick={onCancel} className="px-2 py-1 text-xs text-espresso/50 hover:text-espresso">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => text.trim() && onSave(text.trim())}
          className="rounded-full bg-coffee px-3.5 py-1.5 text-xs font-medium text-cream hover:bg-coffee-deep disabled:opacity-40"
          disabled={!text.trim()}
        >
          Save note
        </button>
      </div>
    </div>
  );
}

export function HighlightLegend() {
  return (
    <span className="hidden items-center gap-1.5 text-[11px] text-espresso/40 md:inline-flex" title="Your highlight colors">
      <Feather className="h-3 w-3" /> {HIGHLIGHT_COLORS.map((c) => (
        <span key={c.id} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.swatch }} />
      ))}
    </span>
  );
}