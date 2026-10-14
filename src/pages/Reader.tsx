import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AArrowDown, Bookmark, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Settings2, X } from "lucide-react";
import { useNest, themeClass } from "../store/NestContext";
import { chaptersFor } from "../data/chapters";
import type { Book, HighlightColor } from "../types";
import { getBook } from "../data/books";
import { stickerById } from "../data/stickers";
import { StickerArt } from "../components/stickers/StickerArt";
import { StickerPicker } from "../components/stickers/StickerPicker";
import { HighlightToolbar, NotePopover } from "../components/reader/HighlightToolbar";
import { ReaderSettingsPanel } from "../components/reader/ReaderSettingsPanel";
import { Button } from "../components/ui/Button";
import { toast } from "../lib/toast";

const MAX_W: Record<string, string> = {
  narrow: "max-w-[40rem]",
  medium: "max-w-[46rem]",
  wide: "max-w-[54rem]",
};

const HIGHLIGHT_STYLE: Record<HighlightColor, { bg: string; fg: string }> = {
  coffee: { bg: "#60452F", fg: "#F3EBDD" },
  terracotta: { bg: "#A56F52", fg: "#FFF9EF" },
  sage: { bg: "#7D8B72", fg: "#FFF9EF" },
  gold: { bg: "#E9D3A4", fg: "#30251E" },
  lavender: { bg: "#DCD1E8", fg: "#30251E" },
};

interface Span {
  text: string;
  color?: HighlightColor;
}

function renderWithHighlights(text: string, intervals: { start: number; end: number; color: HighlightColor }[]): Span[] {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const out: Span[] = [];
  let pos = 0;
  for (const iv of sorted) {
    if (iv.start < pos) continue;
    if (pos < iv.start) out.push({ text: text.slice(pos, iv.start) });
    out.push({ text: text.slice(iv.start, iv.end), color: iv.color });
    pos = iv.end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos) });
  if (out.length === 0) out.push({ text });
  return out;
}

interface SelectionInfo {
  para: number;
  text: string;
  x: number;
  y: number;
}

function locateSelection(scope: HTMLElement): SelectionInfo | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const text = sel.toString().trim();
  if (!text) return null;
  const range = sel.getRangeAt(0);
  let node: Node | null = range.startContainer;
  while (node && node !== scope && !(node instanceof HTMLElement && node.hasAttribute("data-para"))) {
    node = node.parentElement;
  }
  if (!node || !(node instanceof HTMLElement)) return null;
  const para = Number(node.getAttribute("data-para"));
  const rect = range.getBoundingClientRect();
  return {
    para,
    text,
    x: rect.left + rect.width / 2,
    y: rect.bottom + 10,
  };
}

export function ReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [params] = useSearchParams();
  const book: Book | undefined = bookId ? getBook(bookId) : undefined;

  const {
    readerSettings,
    highlights,
    addHighlight,
    notes,
    addNote,
    passageBookmarks,
    addPassageBookmark,
    removePassageBookmark,
    stickerPlacements,
    addStickerPlacement,
    removeStickerPlacement,
    progress,
    setProgressForBook,
    isBookmarked,
    toggleBookmark,
    moveBook,
  } = useNest();

  const chapters = useMemo(() => (book ? chaptersFor(book) : []), [book]);
  const savedProgress = book ? progress[book.id] : undefined;

  const [chapterIndex, setChapterIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [noteAt, setNoteAt] = useState<{ para: number; default: string } | null>(null);
  const [flashPara, setFlashPara] = useState<number | null>(null);
  const [chapterListOpen, setChapterListOpen] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const progressTimer = useRef<number | null>(null);

  // Restore position from saved progress or from ?at=&p=
  useEffect(() => {
    if (!book) return;
    const targetChapter = params.get("at");
    if (targetChapter) {
      const idx = chapters.findIndex((c) => c.id === targetChapter);
      if (idx >= 0) setChapterIndex(idx);
      const p = params.get("p");
      if (p) setFlashPara(Number(p));
      return;
    }
    if (savedProgress && savedProgress.chapterId) {
      const idx = chapters.findIndex((c) => c.id === savedProgress.chapterId);
      if (idx >= 0) setChapterIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  const chapter = chapters[chapterIndex];
  const totalChapters = chapters.length;

  const currentHighlights = useMemo(
    () =>
      highlights.filter((h) => h.bookId === book?.id && h.chapterId === chapter?.id),
    [highlights, book, chapter]
  );
  const currentNotes = useMemo(() => notes.filter((n) => n.bookId === book?.id && n.chapterId === chapter?.id), [notes, book, chapter]);
  const currentStickers = useMemo(
    () => stickerPlacements.filter((s) => s.bookId === book?.id && s.chapterId === chapter?.id),
    [stickerPlacements, book, chapter]
  );

  const saveProgress = useCallback(
    (para: number, frac: number) => {
      if (!book || !chapter) return;
      const overall = (chapterIndex + frac) / totalChapters;
      setProgressForBook(book.id, chapter.id, para, overall);
    },
    [book, chapter, chapterIndex, totalChapters, setProgressForBook]
  );

  const onScroll = useCallback(() => {
    if (!book) return;
    if (readerSettings.mode === "scroll") {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const frac = max > 0 ? window.scrollY / max : 0;
      if (progressTimer.current) window.clearTimeout(progressTimer.current);
      progressTimer.current = window.setTimeout(() => {
        const para = Math.min(chapter ? chapter.content.length - 1 : 0, Math.floor(Math.random() * 2));
        setProgressForBook(book.id, chapter?.id ?? "", para, frac);
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readerSettings.mode, book, chapter]);

  useEffect(() => {
    if (readerSettings.mode === "scroll") {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [readerSettings.mode, onScroll]);

  // Scroll to top on chapter change (pages mode)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [chapter?.id]);

  useEffect(() => {
    if (flashPara === null || !chapter) return;
    const el = paraRefs.current[flashPara];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setFlashPara(null);
      toast("Back to that moment.");
    } else if (chapterIndex < chapters.length - 1) {
      setFlashPara(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashPara, chapter?.id]);

  const handleMouseUp = useCallback(() => {
    if (!articleRef.current) return;
    const info = locateSelection(articleRef.current);
    if (info) {
      setSelection(info);
      setPickerOpen(false);
      setNoteAt(null);
    } else {
      window.setTimeout(() => setSelection(null), 120);
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) handleMouseUp();
      if (e.key === "Escape") {
        setSelection(null);
        setSettingsOpen(false);
        setPickerOpen(false);
        setNoteAt(null);
        setChapterListOpen(false);
      }
    },
    [handleMouseUp]
  );

  const applyHighlight = (para: number, text: string, color: HighlightColor, note?: string) => {
    if (!book || !chapter) return;
    addHighlight({ bookId: book.id, chapterId: chapter.id, paragraphIndex: para, text, color, note });
    if (note) addNote({ bookId: book.id, chapterId: chapter.id, paragraphIndex: para, text: note });
    window.getSelection()?.removeAllRanges();
    setSelection(null);
    toast("Saved to your highlights");
  };

  const centrePara = useCallback(() => {
    if (!chapter || !articleRef.current) return 0;
    const paras = articleRef.current.querySelectorAll<HTMLElement>("[data-para]");
    let nearest = 0;
    let best = Number.MAX_SAFE_INTEGER;
    paras.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top <= 0 && r.bottom >= 0) nearest = Number(el.dataset.para);
      const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
      if (d < best) {
        best = d;
        nearest = Number(el.dataset.para);
      }
    });
    return nearest;
  }, [chapter]);

  const defaultBookmark = () => isBookmarked(book?.id ?? "");

  const changeChapter = (idx: number) => {
    setChapterIndex(Math.max(0, Math.min(totalChapters - 1, idx)));
    setChapterListOpen(false);
    const frac = 0;
    setSelection(null);
    if (book && chapters[idx]) {
      // record progress instantly when flipping
      saveProgress(0, frac);
    }
  };

  if (!book || chapters.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
        <BookOpen className="mb-4 h-10 w-10 text-terracotta" />
        <h1 className="font-serif text-2xl font-semibold text-espresso">This story hasn't found its cover yet.</h1>
        <Link to="/explore" className="mt-6 rounded-full bg-coffee px-5 py-2.5 text-sm font-medium text-cream">
          Back to Explore
        </Link>
      </div>
    );
  }

  const themeCls = themeClass(readerSettings.theme);

  const nextPct =
    readerSettings.mode === "scroll"
      ? Math.round((progress[book.id]?.progress ?? 0) * 100)
      : Math.round(((chapterIndex + 1) / totalChapters) * 100);

  return (
    <div className={`flex min-h-screen flex-col ${themeCls}`} onKeyUp={handleKeyUp} role="document">
      {/* Top bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-sm ${readerSettings.theme === "dark" ? "border-white/10 bg-[#1c1410]/90" : "border-parchment-deep/40 bg-cream/85"}`}>
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3 sm:px-6">
          <Link
            to={`/book/${book.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-parchment/50"
            aria-label="Back to book"
          >
            <X className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          </Link>
          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setChapterListOpen((o) => !o)}
              className="flex w-full items-center gap-1.5 text-left"
              aria-expanded={chapterListOpen}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-sm font-semibold">{book.title}</span>
                <span className="block truncate text-[11px] opacity-60">
                  {chapter.number}. {chapter.title}
                </span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 opacity-60 transition-transform ${chapterListOpen ? "rotate-180" : ""}`} />
            </button>
            {chapterListOpen ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-parchment-deep/50 bg-ivory p-2 shadow-lift">
                {chapters.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => changeChapter(i)}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      i === chapterIndex ? "bg-coffee text-cream" : "text-espresso hover:bg-parchment/50"
                    }`}
                  >
                    <span className="mr-2 text-xs opacity-60">Ch. {c.number}</span>
                    {c.title}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => (book.id ? toggleBookmark(book.id) : undefined)}
            aria-pressed={defaultBookmark()}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              defaultBookmark() ? "bg-terracotta text-cream" : "hover:bg-parchment/50"
            }`}
            aria-label={defaultBookmark() ? "Remove bookmark" : "Bookmark this book"}
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-parchment/50"
            aria-label="Reader settings"
            aria-expanded={settingsOpen}
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
        {/* mini progress */}
        <div className="h-0.5 w-full bg-parchment/40">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${nextPct}%` }} />
        </div>
      </header>

      {settingsOpen ? (
        <ReaderSettingsPanel onClose={() => setSettingsOpen(false)} />
      ) : null}

      {/* Content */}
      <main
        className={`flex-1 px-4 pb-28 pt-10 sm:px-6 lg:pt-14 ${MAX_W[readerSettings.readingWidth]} mx-auto w-full`}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setSelection(null)}
      >
        <div className="text-center">
          <span className="rounded-full bg-parchment/40 px-3 py-1 text-[11px] font-medium uppercase tracking-widest opacity-70">
            Chapter {chapter.number}
          </span>
          <h1
            className="mt-3 font-serif text-3xl font-semibold leading-snug sm:text-4xl"
            style={{ fontFamily: readerSettings.fontFamily === "sans" ? "Inter, sans-serif" : undefined }}
          >
            {chapter.title}
          </h1>
          <div className="mx-auto mt-4 flex max-w-xs items-center gap-3 text-sm opacity-50">
            <span className="h-px flex-1 bg-current" />✦<span className="h-px flex-1 bg-current" />
          </div>
          <p className="mt-4 text-sm italic opacity-60">{book.title} · {book.authorName}</p>
        </div>

        <article
          ref={articleRef}
          className="mt-10 space-y-7"
          style={{
            fontFamily: readerSettings.fontFamily === "serif" ? "'Cormorant Garamond', Georgia, serif" : "'Inter', system-ui, sans-serif",
            fontSize: `${readerSettings.fontSize}%`,
            lineHeight: readerSettings.lineSpacing,
          }}
        >
          {chapter.content.map((para, i) => {
            const intervals = currentHighlights
              .filter((h) => h.paragraphIndex === i)
              .map((h) => ({ start: para.indexOf(h.text), end: para.indexOf(h.text) + h.text.length, color: h.color }))
              .filter((iv) => iv.start >= 0);
            const spans = renderWithHighlights(para, intervals);
            const note = currentNotes.find((n) => n.paragraphIndex === i);
            const sticker = currentStickers.find((s) => s.paragraphIndex === i);
            const passage = passageBookmarks.find((pb) => pb.bookId === book.id && pb.chapterId === chapter.id && pb.paragraphIndex === i);

            return (
              <p
                key={i}
                data-para={i}
                ref={(el) => {
                  paraRefs.current[i] = el;
                }}
                className={`relative text-[1.15em] leading-[inherit] ${note ? "cursor-help underline decoration-dotted underline-offset-4" : ""} ${
                  flashPara === i ? "rounded bg-gold/30" : ""
                }`}
                onClick={() => (note ? setNoteAt({ para: i, default: note.text }) : undefined)}
                onDoubleClick={() => {
                  const info = locateSelection(articleRef.current ?? document.body);
                  if (info) setSelection(info);
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  if (!articleRef.current) return;
                  window.setTimeout(() => {
                    const info = locateSelection(articleRef.current!);
                    if (info && info.para === i) setSelection(info);
                  }, 10);
                }}
              >
                {spans.map((s, si) =>
                  s.color ? (
                    <mark
                      key={si}
                      style={{
                        backgroundColor: HIGHLIGHT_STYLE[s.color].bg,
                        color: HIGHLIGHT_STYLE[s.color].fg,
                      }}
                      className="rounded-[3px] px-0.5"
                      data-color={s.color}
                    >
                      {s.text}
                    </mark>
                  ) : (
                    <span key={si}>{s.text}</span>
                  )
                )}
                {sticker ? (
                  <button
                    type="button"
                    className="ml-2 inline-block align-middle rounded-lg bg-parchment/40 p-0.5 transition-transform hover:scale-110"
                    title={`Sticker: ${stickerById(sticker.stickerId)?.name ?? "sticker"}`}
                    aria-label="Remove sticker"
                    onClick={() => {
                      removeStickerPlacement(sticker.id);
                      toast("Sticker tucked back into the pocket.");
                    }}
                  >
                    <StickerArt motif={stickerById(sticker.stickerId)?.motif ?? ""} color={stickerById(sticker.stickerId)?.color} className="h-5 w-5" />
                  </button>
                ) : null}
                {passage && !sticker ? (
                  <span
                    className="ml-2 inline-block h-3.5 w-2 translate-y-[-2px] cursor-pointer rounded-sm bg-terracotta"
                    title="Bookmarked passage"
                    onClick={() => removePassageBookmark(passage.id)}
                  />
                ) : null}
              </p>
            );
          })}
        </article>

        {/* End of chapter */}
        <div className="mt-14 text-center">
          <div className="mx-auto mb-5 flex max-w-xs items-center gap-3 text-sm opacity-50">
            <span className="h-px flex-1 bg-current" />✧<span className="h-px flex-1 bg-current" />
          </div>
          <p className="font-quote text-lg italic opacity-70">
            {(chapter.content[chapter.content.length - 1] ?? "").split(".")[0]}.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              icon={ChevronLeft}
              disabled={chapterIndex === 0}
              onClick={() => changeChapter(chapterIndex - 1)}
            >
              Previous
            </Button>
            {chapterIndex < totalChapters - 1 ? (
              <Button variant="primary" onClick={() => changeChapter(chapterIndex + 1)}>
                Next chapter <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  icon={Check}
                  onClick={() => {
                    moveBook(book.id, "finished");
                    toast("Shelved as finished. Congratulations — that's another one read.");
                  }}
                >
                  Mark as finished
                </Button>
                <Link to="/highlights" className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-4 text-sm font-medium text-espresso hover:bg-gold-deep">
                  <BookOpen className="h-4 w-4" /> Back to your nest
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Sticker picker */}
      {pickerOpen ? (
        <div className="fixed inset-x-0 bottom-4 z-[65] flex justify-center px-4 sm:bottom-auto sm:top-24 sm:justify-start sm:px-6">
          <StickerPicker
            compact
            onClose={() => setPickerOpen(false)}
            onPick={(id) => {
              const para = selection ? selection.para : centrePara();
              if (chapter) {
                addStickerPlacement({ stickerId: id, bookId: book.id, chapterId: chapter.id, paragraphIndex: para });
                toast("Sticker placed — right where you were reading.");
              }
              setPickerOpen(false);
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
          />
        </div>
      ) : null}

      {/* Selection toolbar */}
      {selection ? (
        <HighlightToolbar
          x={selection.x}
          y={selection.y}
          onColor={(c) => applyHighlight(selection.para, selection.text, c)}
          onTogglePicker={() => setPickerOpen((o) => !o)}
          onNote={() => setNoteAt({ para: selection.para, default: "" })}
          onBookmark={() => {
            if (chapter) {
              addPassageBookmark({ bookId: book.id, chapterId: chapter.id, paragraphIndex: selection.para });
              toast("Passage bookmarked.");
            }
            window.getSelection()?.removeAllRanges();
            setSelection(null);
          }}
          onShare={() => {
            navigator.clipboard?.writeText(`"${selection.text}" — ${book.title}`).catch(() => undefined);
            toast("Copied — share it somewhere cozy.");
            window.getSelection()?.removeAllRanges();
            setSelection(null);
          }}
          onClose={() => {
            window.getSelection()?.removeAllRanges();
            setSelection(null);
          }}
        />
      ) : null}

      {/* Note composer for a selected passage */}
      {noteAt ? (
        <NotePopover
          defaultText={noteAt.default}
          onCancel={() => setNoteAt(null)}
          onSave={(txt) => {
            if (selection) {
              applyHighlight(selection.para, selection.text, "gold", txt);
              setNoteAt(null);
            }
          }}
        />
      ) : null}

      {/* Sticky reading-notes hint */}
      <footer className={`fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-sm ${readerSettings.theme === "dark" ? "border-white/10 bg-[#1c1410]/90" : "border-parchment-deep/40 bg-ivory/85"}`}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 text-sm sm:px-6">
          <button
            type="button"
            disabled={chapterIndex === 0}
            onClick={() => changeChapter(chapterIndex - 1)}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium opacity-80 transition-opacity hover:opacity-100 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="hidden items-center gap-2 text-[11px] opacity-50 sm:flex">
            <AArrowDown className="h-3.5 w-3.5" />
            Select any text to highlight, note, stick or share it
          </span>
          <span className="text-[11px] tabular-nums opacity-60">{nextPct}% · {chapterIndex + 1}/{totalChapters}</span>
          <button
            type="button"
            disabled={chapterIndex >= totalChapters - 1}
            onClick={() => changeChapter(chapterIndex + 1)}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium opacity-80 transition-opacity hover:opacity-100 disabled:opacity-30"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}