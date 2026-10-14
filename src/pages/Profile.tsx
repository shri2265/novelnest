import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookOpen, Camera, CloudRain, Feather, Heart, Library, MessageSquare, Pencil, Sparkles } from "lucide-react";
import { useNest } from "../store/NestContext";
import { getBook, AUTHOR_MAP } from "../data/books";
import { Avatar } from "../components/ui/Avatar";
import { InfoTile } from "../components/ui/InfoTile";
import { BookCover } from "../components/ui/BookCover";
import { QuoteCard } from "../components/ui/QuoteCard";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import {
  BooksReadPanel,
  FollowingPanel,
  HighlightsPanel,
  PassageBookmarksPanel,
} from "../components/profile/ProfilePanels";
import { timeAgo } from "../lib/time";

type PanelId = "books" | "following" | "highlights" | "passage";

const PANEL_META: Record<PanelId, { title: string; description: string; icon: ReactNode }> = {
  books: { title: "Books read", description: "Every volume you've closed, most recent first.", icon: <BookOpen className="h-5 w-5" /> },
  following: { title: "Friends following", description: "The authors and readers you keep up with.", icon: <Heart className="h-5 w-5" /> },
  highlights: { title: "Highlights", description: "The sentences that stopped you.", icon: <Sparkles className="h-5 w-5" /> },
  passage: { title: "Passage bookmarks", description: "Passages you saved to return to.", icon: <Bookmark className="h-5 w-5" /> },
};

export function ProfilePage() {
  const { user, bookmarks, shelves, highlights, notes, progress, following, passageBookmarks, readingMood } = useNest();
  const [editorOpen, setEditorOpen] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const closePanel = () => setPanel(null);

  const finishedShelf = shelves.find((s) => s.kind === "finished");
  const booksReadCount = finishedShelf?.bookIds.length ?? 0;

  const favoritesShelf = shelves.find((s) => s.kind === "favorites");
  const favorites = favoritesShelf ? favoritesShelf.bookIds.map(getBook).filter(Boolean) : [];
  const customShelves = shelves.filter((s) => s.custom);
  const currentlyReading = Object.keys(progress)
    .map((bookId) => ({ book: getBook(bookId), p: progress[bookId] }))
    .filter((x) => x.book)
    .sort((a, b) => (a.p.updatedAt < b.p.updatedAt ? 1 : -1));
  const activity = [...highlights.map((h) => ({ ...h, kind: "highlight" as const })), ...notes.map((n) => ({ ...n, kind: "note" as const }))]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="space-y-8 pb-4">
      {/* Header card */}
      <section className="paper overflow-hidden rounded-3xl border border-parchment-deep/40">
        <div className="h-28 bg-gradient-to-br from-gold/30 via-parchment to-sage/25 sm:h-32" />
        <div className="px-6 pb-6 sm:px-10">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <button
                type="button"
                onClick={() => setEditorOpen(true)}
                aria-label="Change profile picture"
                className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee/40 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
              >
                <Avatar label={user.avatar} src={user.avatarImage} size="xl" className="ring-4 ring-ivory" alt={user.displayName} />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ivory bg-coffee text-cream shadow-paper transition-colors group-hover:bg-coffee-deep">
                  <Camera className="h-4 w-4" />
                </span>
              </button>
              <div className="pb-1">
                <h1 className="font-serif text-2xl font-semibold text-espresso sm:text-3xl">{user.displayName}</h1>
                <p className="text-sm text-espresso/55">
                  {user.handle}
                  {user.location.trim() ? ` · ${user.location}` : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 pb-1 sm:items-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/20 px-3 py-1 text-xs font-medium text-sage-deep">
                <CloudRain className="h-3.5 w-3.5" /> {readingMood}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-espresso/45">Reading since {user.joined}</span>
                <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditorOpen(true)}>
                  Edit profile
                </Button>
              </div>
            </div>
          </div>

          {user.bio.trim() ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-espresso/70">{user.bio}</p>
          ) : (
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="mt-4 text-sm italic text-espresso/40 transition-colors hover:text-terracotta"
            >
              Write something about yourself…
            </button>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoTile label="Books read" value={booksReadCount.toString()} icon={BookOpen} onClick={() => setPanel("books")} />
            <InfoTile label="Friends following" value={following.length.toString()} icon={Heart} onClick={() => setPanel("following")} />
            <InfoTile label="Highlights" value={highlights.length.toString()} icon={Sparkles} onClick={() => setPanel("highlights")} />
            <InfoTile label="Passage bookmarks" value={passageBookmarks.length.toString()} icon={Bookmark} onClick={() => setPanel("passage")} />
          </div>
        </div>
      </section>

      {/* Currently reading */}
      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold text-espresso">Currently reading</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {currentlyReading.map(({ book, p }) => (
            <Link
              key={book!.id}
              to={`/read/${book!.id}`}
              className="group flex gap-4 rounded-2xl border border-parchment-deep/40 bg-ivory p-4 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="w-16 shrink-0">
                <BookCover cover={book!.cover} title={book!.title} author={book!.authorName} src={book!.coverImage} className="rounded-lg shadow-paper" />
              </div>
              <div className="min-w-0 flex-1 py-1">
                <p className="font-serif text-[15px] font-semibold leading-snug text-espresso">{book!.title}</p>
                <p className="text-xs text-espresso/50">{book!.authorName}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-parchment">
                    <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${Math.round(p.progress * 100)}%` }} />
                  </div>
                  <span className="text-[11px] font-medium text-terracotta">{Math.round(p.progress * 100)}%</span>
                </div>
                <p className="mt-1 text-[10px] text-espresso/40">paused {timeAgo(p.updatedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid: activity + quote */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-parchment-deep/40 bg-ivory p-6 shadow-paper">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold text-espresso">Reading activity</h2>
            <button
              type="button"
              onClick={() => setPanel("highlights")}
              className="text-xs font-medium text-terracotta transition-colors hover:text-terracotta-deep"
            >
              View all →
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {activity.map((a) => {
              const book = getBook(a.bookId);
              return (
                <div key={a.id} className="flex gap-3">
                  <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.kind === "note" ? "bg-sage/20 text-sage-deep" : "bg-gold/25 text-gold-deep"}`}>
                    {a.kind === "note" ? <MessageSquare className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed text-espresso/80">
                      {a.kind === "highlight" ? (
                        <span>
                          “{a.text}” {a.note ? <em className="text-espresso/50">— {a.note}</em> : null}
                        </span>
                      ) : (
                        a.text
                      )}
                    </p>
                    <p className="mt-1 text-[11px] text-espresso/45">
                      {a.kind === "note" ? "note on " : "highlight in "} <Link to={`/book/${a.bookId}`} className="text-terracotta hover:underline">{book?.title ?? "a book"}</Link> · {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <QuoteCard
            quote={{
              text: user.favoriteQuote,
              source: user.favoriteQuoteSource,
              sourceType: "book",
            }}
          />
          <div className="rounded-3xl border border-parchment-deep/40 bg-parchment/30 p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso/45">Following</p>
              <button
                type="button"
                onClick={() => setPanel("following")}
                className="text-[11px] font-medium text-terracotta transition-colors hover:text-terracotta-deep"
              >
                Manage →
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {following.map((id) => {
                const author = AUTHOR_MAP.get(id);
                if (!author) return null;
                return (
                  <Link key={id} to={`/authors/${id}`} className="flex items-center gap-2 rounded-full bg-ivory py-1 pl-1 pr-3 text-xs text-espresso transition-colors hover:bg-parchment/50">
                    <Avatar label={author.avatar} size="xs" />
                    {author.name}
                  </Link>
                );
              })}
              {following.length === 0 ? <span className="text-xs text-espresso/50">You're not following anyone yet.</span> : null}
            </div>
          </div>
        </div>
      </section>

      {/* Favorite books */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">Favorite books</h2>
            <p className="mt-0.5 text-sm text-espresso/55">The ones you keep returning to</p>
          </div>
          <Link to="/shelf" className="text-xs font-medium text-terracotta hover:text-terracotta-deep">
            Visit my shelf →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {favorites.map((b) => (
            <Link key={b!.id} to={`/book/${b!.id}`} className="group">
              <div className="transition-transform group-hover:-translate-y-1">
                <BookCover cover={b!.cover} title={b!.title} author={b!.authorName} src={b!.coverImage} className="rounded-xl shadow-paper" />
              </div>
              <p className="mt-2 truncate text-xs font-medium text-espresso">{b!.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Custom shelves teaser */}
      <section className="rounded-3xl border border-parchment-deep/40 bg-ivory p-6 shadow-paper">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-espresso">
              <Library className="h-5 w-5 text-terracotta" /> My custom shelves
            </h2>
            <p className="mt-0.5 text-sm text-espresso/55">{customShelves.length} lovingly-curated corner{customShelves.length === 1 ? "" : "s"}</p>
          </div>
          <Link to="/shelf">
            <Button variant="secondary" icon={Feather}>Manage shelves</Button>
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {customShelves.map((s) => (
            <Link key={s.id} to="/shelf" className="rounded-full border border-parchment-deep/40 bg-cream/60 px-4 py-1.5 text-xs text-coffee-deep transition-colors hover:bg-parchment/60">
              {s.name} · {s.bookIds.length}
            </Link>
          ))}
          {bookmarks.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-medium text-gold-deep">
              <Bookmark className="h-3.5 w-3.5" /> {bookmarks.length} bookmarked
            </span>
          ) : null}
        </div>
      </section>

      {/* Edit profile */}
      {editorOpen ? <EditProfileModal open onClose={() => setEditorOpen(false)} /> : null}

      {/* Statistic panels */}
      {panel ? (
        <Modal
          open
          onClose={closePanel}
          title={PANEL_META[panel].title}
          description={PANEL_META[panel].description}
          icon={PANEL_META[panel].icon}
          size="lg"
        >
          {panel === "books" ? <BooksReadPanel onNavigate={closePanel} /> : null}
          {panel === "following" ? <FollowingPanel onNavigate={closePanel} /> : null}
          {panel === "highlights" ? <HighlightsPanel /> : null}
          {panel === "passage" ? <PassageBookmarksPanel onNavigate={closePanel} /> : null}
        </Modal>
      ) : null}
    </div>
  );
}
