import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Bookmark, Check, Heart, Sparkles, Trash2, UserPlus } from "lucide-react";
import type { Book } from "../../types";
import { useNest } from "../../store/NestContext";
import { AUTHOR_MAP, AUTHORS, getBook } from "../../data/books";
import { getChapter } from "../../data/chapters";
import { Avatar } from "../ui/Avatar";
import { BookCover } from "../ui/BookCover";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { HighlightLine } from "../../pages/Highlights";
import { timeAgo } from "../../lib/time";
import { toast } from "../../lib/toast";

/* ------------------------------ small helpers ------------------------------ */

function SortToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-xs font-medium text-espresso/55">Sort:</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o.id ? "bg-coffee text-cream" : "bg-cream/70 text-coffee-deep hover:bg-parchment/60"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ConfirmRemove({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-2.5">
      <span className="text-xs text-coffee-deep">Remove this one? It can't be undone.</span>
      <span className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Keep
        </Button>
        <Button size="sm" variant="primary" onClick={onConfirm}>
          Remove
        </Button>
      </span>
    </div>
  );
}

function BookRow({ book, completedAt, onNavigate }: { book: Book; completedAt?: string; onNavigate?: () => void }) {
  return (
    <Link
      to={`/book/${book.id}`}
      onClick={onNavigate}
      className="group flex items-center gap-4 rounded-2xl border border-parchment-deep/40 bg-cream/40 p-3 transition-all hover:-translate-y-0.5 hover:border-coffee/40 hover:shadow-paper"
    >
      <div className="w-12 shrink-0">
        <BookCover cover={book.cover} title={book.title} author={book.authorName} src={book.coverImage} className="rounded-md" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-sm font-semibold text-espresso">{book.title}</p>
        <p className="truncate text-xs text-espresso/55">{book.authorName}</p>
        {completedAt ? (
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-sage-deep">
            <Check className="h-3 w-3" /> Finished {new Date(completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        ) : null}
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-terracotta opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
    </Link>
  );
}

/* -------------------------------- Books read ------------------------------- */

export function BooksReadPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { shelves, completedAt } = useNest();
  const [sort, setSort] = useState<"recent" | "title">("recent");

  const sorted = useMemo(() => {
    const finishedIds = shelves.find((s) => s.kind === "finished")?.bookIds ?? [];
    const books = finishedIds.map(getBook).filter((b): b is Book => Boolean(b));
    const copy = [...books];
    if (sort === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy.sort((a, b) => ((completedAt[b.id] ?? "") < (completedAt[a.id] ?? "") ? -1 : 1));
  }, [shelves, sort, completedAt]);

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No finished books yet."
        body="When you turn the last page, mark a book as finished and it will gather here."
        action={
          <Link to="/explore" onClick={onNavigate}>
            <Button variant="secondary">Find something to finish</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <SortToggle
        value={sort}
        onChange={setSort}
        options={[
          { id: "recent", label: "Recently completed" },
          { id: "title", label: "Title" },
        ]}
      />
      <div className="space-y-2.5">
        {sorted.map((b) => (
          <BookRow key={b.id} book={b} completedAt={completedAt[b.id]} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Friends following --------------------------- */

export function FollowingPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { following, toggleFollow } = useNest();

  const authors = following.map((id) => AUTHOR_MAP.get(id)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const suggestions = AUTHORS.filter((a) => !following.includes(a.id)).slice(0, 4);

  return (
    <div className="space-y-6">
      {authors.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="You're not following anyone yet."
          body="Follow a few authors and their new chapters, shelves and stories will find you."
        />
      ) : (
        <div className="space-y-2.5">
          {authors.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-parchment-deep/40 bg-cream/40 p-3">
              <Link to={`/authors/${a.id}`} onClick={onNavigate} aria-label={`Open ${a.name}'s profile`}>
                <Avatar label={a.avatar} size="lg" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/authors/${a.id}`} onClick={onNavigate} className="font-serif text-sm font-semibold text-espresso hover:text-coffee">
                  {a.name}
                </Link>
                <p className="text-[11px] text-espresso/50">{a.handle} · {a.followers.toLocaleString()} followers</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-espresso/60">{a.bio}</p>
              </div>
              <Button
                size="sm"
                variant="soft"
                onClick={() => {
                  toggleFollow(a.id);
                  toast(`Unfollowed ${a.name.split(" ")[0]}.`);
                }}
              >
                Following
              </Button>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 ? (
        <div className="border-t border-parchment-deep/30 pt-5">
          <h3 className="font-serif text-base font-semibold text-espresso">Readers to follow</h3>
          <p className="mt-0.5 text-xs text-espresso/55">A few voices you might like on your shelf.</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {suggestions.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-parchment-deep/40 bg-ivory p-3">
                <Avatar label={a.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-espresso">{a.name}</p>
                  <p className="truncate text-[11px] text-espresso/50">{a.handle}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={UserPlus}
                  onClick={() => {
                    toggleFollow(a.id);
                    toast(`Now following ${a.name.split(" ")[0]}.`);
                  }}
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------- Highlights ------------------------------- */

export function HighlightsPanel() {
  const { highlights, removeHighlight } = useNest();
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (highlights.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Your favorite words will live here."
        body="Select any passage while reading and highlight it — it will roost here with its note and chapter."
      />
    );
  }

  return (
    <div className="space-y-4">
      {pendingId ? (
        <ConfirmRemove
          onCancel={() => setPendingId(null)}
          onConfirm={() => {
            removeHighlight(pendingId);
            setPendingId(null);
            toast("Highlight let go. The words stay in the book.");
          }}
        />
      ) : null}
      <div className="grid gap-4">
        {highlights.map((h) => (
          <HighlightLine key={h.id} highlight={h} onRemove={(id) => setPendingId(id)} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Passage bookmarks ---------------------------- */

export function PassageBookmarksPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { passageBookmarks, removePassageBookmark } = useNest();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...passageBookmarks].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [passageBookmarks]
  );

  if (passageBookmarks.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No passages bookmarked yet."
        body="While reading, bookmark a passage worth returning to and it will wait for you here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {pendingId ? (
        <ConfirmRemove
          onCancel={() => setPendingId(null)}
          onConfirm={() => {
            removePassageBookmark(pendingId);
            setPendingId(null);
            toast("Passage un-bookmarked.");
          }}
        />
      ) : null}
      <div className="space-y-3">
        {sorted.map((pb) => {
          const book = getBook(pb.bookId);
          if (!book) return null;
          const chapter = getChapter(pb.chapterId);
          const text = chapter?.content[pb.paragraphIndex] ?? "";
          const location = chapter ? `Ch. ${chapter.number} · ${chapter.title}` : "Reading sample";
          return (
            <article key={pb.id} className="rounded-2xl border border-parchment-deep/40 bg-cream/40 p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 shrink-0">
                  <BookCover cover={book.cover} title={book.title} author={book.authorName} src={book.coverImage} className="rounded-md" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-sm font-semibold text-espresso">{book.title}</p>
                      <p className="truncate text-xs text-espresso/55">{book.authorName} · {location} · {timeAgo(pb.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingId(pb.id)}
                      aria-label="Remove passage bookmark"
                      className="shrink-0 rounded-lg p-1.5 text-espresso/40 transition-colors hover:bg-parchment/60 hover:text-terracotta-deep"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Link
                    to={`/read/${book.id}?at=${pb.chapterId}&p=${pb.paragraphIndex}`}
                    onClick={onNavigate}
                    className="mt-2 block border-l-2 border-terracotta/50 pl-3 font-quote text-base italic leading-relaxed text-coffee hover:text-terracotta-deep"
                  >
                    <span className="line-clamp-3">“{text}”</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
