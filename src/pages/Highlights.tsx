import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Feather, Palette, StickyNote, Trash2 } from "lucide-react";
import { useNest } from "../store/NestContext";
import { HIGHLIGHT_COLORS } from "../data/stickers";
import { getBook } from "../data/books";
import { getChapter } from "../data/chapters";
import type { Highlight, HighlightColor } from "../types";
import { EmptyState } from "../components/ui/EmptyState";
import { Rating } from "../components/ui/Rating";
import { timeAgo } from "../lib/time";
import { toast } from "../lib/toast";

export function HighlightLine({
  highlight,
  onRemove,
}: {
  highlight: Highlight;
  onRemove?: (id: string) => void;
}) {
  const book = getBook(highlight.bookId);
  const chapter = getChapter(highlight.chapterId);
  const colorMeta = HIGHLIGHT_COLORS.find((c) => c.id === highlight.color);
  if (!book) return null;

  return (
    <article className={`rounded-2xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper transition-all hover:shadow-lift`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 text-[11px] text-espresso/50">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colorMeta?.swatch }} />
            {colorMeta?.name ?? "Highlight"}
          </span>
          <span>·</span>
          <span>{chapter ? `Ch. ${chapter.number} · ${chapter.title}` : "Reading sample"}</span>
          <span>·</span>
          <span>{timeAgo(highlight.createdAt)}</span>
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={() => {
              onRemove(highlight.id);
              toast("Highlight let go. The words stay in the book.");
            }}
            className="rounded-lg p-1.5 text-espresso/40 transition-colors hover:bg-parchment/60 hover:text-terracotta-deep"
            aria-label="Remove highlight"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <Link to={`/read/${book.id}?at=${highlight.chapterId}&p=${highlight.paragraphIndex ?? 0}`} className="group mt-3 block">
        <blockquote
          className="rounded-lg px-4 py-3 font-quote text-lg italic leading-relaxed transition-transform group-hover:translate-x-0.5"
          style={{
            backgroundColor: `${colorMeta?.swatch}22`,
            borderLeft: `3px solid ${colorMeta?.swatch}`,
          }}
        >
          “{highlight.text}”
        </blockquote>
        {highlight.note ? (
          <p className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-parchment/40 px-3 py-2 text-[13px] leading-relaxed text-coffee-deep">
            <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
            {highlight.note}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-4 text-[11px] text-espresso/50">
          <span className="font-medium text-espresso/70">{book.title}</span> · {book.authorName}
          <ArrowUpRight className="h-3.5 w-3.5 text-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </Link>
    </article>
  );
}

export function HighlightsPage() {
  const { highlights, removeHighlight } = useNest();
  const [colorFilter, setColorFilter] = useState<HighlightColor | "all">("all");

  const filtered = useMemo(
    () => (colorFilter === "all" ? highlights : highlights.filter((h) => h.color === colorFilter)),
    [highlights, colorFilter]
  );

  const bookIds = useMemo(() => Array.from(new Set(highlights.map((h) => h.bookId))), [highlights]);
  const withNotes = highlights.filter((h) => h.note).length;

  return (
    <div className="space-y-8 pb-4">
      <header>
        <p className="inline-flex items-center gap-2 rounded-full bg-parchment/50 px-3 py-1 text-xs font-medium text-coffee-deep">
          <Palette className="h-3.5 w-3.5 text-terracotta" /> Your reading journal
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-espresso sm:text-4xl">Highlights</h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-espresso/60">
          The sentences that stopped you. Tap any of them to step back into the book, right at that moment.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Highlights", value: highlights.length },
          { label: "Books", value: bookIds.length },
          { label: "With notes", value: withNotes },
          { label: "Great sentences", value: "countless" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-parchment-deep/40 bg-ivory p-4 text-center">
            <p className="font-serif text-2xl font-semibold text-espresso">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-espresso/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Color filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-espresso/55">Filter:</span>
        <button
          type="button"
          onClick={() => setColorFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            colorFilter === "all" ? "bg-coffee text-cream" : "bg-ivory text-coffee-deep hover:bg-parchment/60"
          }`}
        >
          All
        </button>
        {HIGHLIGHT_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setColorFilter(c.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              colorFilter === c.id ? "bg-coffee text-cream" : "bg-ivory text-coffee-deep hover:bg-parchment/60"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.swatch }} />
            {c.name}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((h) => (
            <HighlightLine key={h.id} highlight={h} onRemove={removeHighlight} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Feather}
          title="Your favorite words will live here."
          body="Select any passage while reading — in Coffee, Terracotta, Sage, Gold or Lavender — and it will roost in this journal, with its note and its chapter. Highlighted by hand, kept like letters."
        />
      )}

      {/* Footer note: preview of a sample */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-parchment-deep/50 bg-parchment/20 p-6 text-center">
        <Rating value={5} />
        <p className="max-w-md font-quote text-lg italic text-espresso/70">
          “The best part of a book isn't the reading. It's the lending of yourself to it, and keeping a little.”
        </p>
        <Link to="/explore" className="text-sm font-medium text-terracotta hover:text-terracotta-deep">
          Find something worth keeping →
        </Link>
      </div>
    </div>
  );
}