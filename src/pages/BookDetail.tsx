import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bookmark, BookOpen, CalendarDays, Check, MessageSquare, Plus, BookmarkCheck, Users } from "lucide-react";
import { getBook, AUTHOR_MAP } from "../data/books";
import { BOOKS } from "../data/books";
import { DISCUSSIONS } from "../data/community";
import { GENRE_NAMES } from "../data/genres";
import { useNest } from "../store/NestContext";
import { Button } from "../components/ui/Button";
import { Rating } from "../components/ui/Rating";
import { BookCover } from "../components/ui/BookCover";
import { BookGrid } from "../components/ui/BookGrid";
import { TagChip } from "../components/ui/GenreChip";
import { Avatar } from "../components/ui/Avatar";
import { InfoTile } from "../components/ui/InfoTile";

export function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const book = bookId ? getBook(bookId) : undefined;
  const { isBookmarked, toggleBookmark, shelves, addToShelf, shelfOf } = useNest();
  const [shelfOpen, setShelfOpen] = useState(false);
  const navigate = useNavigate();

  const discussions = useMemo(() => (book ? DISCUSSIONS.filter((d) => d.bookId === book.id) : []), [book]);
  const related = useMemo(
    () => (book ? BOOKS.filter((b) => b.id !== book.id && b.genres.some((g) => book.genres.includes(g))).slice(0, 8) : []),
    [book]
  );

  if (!book) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-2xl text-espresso">This book has wandered off the shelf.</h1>
        <p className="mt-2 text-sm text-espresso/55">It may be overdue, or simply shy.</p>
        <Link to="/explore" className="mt-6 rounded-full bg-coffee px-5 py-2.5 text-sm font-medium text-cream">
          Back to Explore
        </Link>
      </div>
    );
  }

  const author = AUTHOR_MAP.get(book.authorId);
  const saved = isBookmarked(book.id);
  const currentShelf = shelfOf(book.id);

  return (
    <div className="space-y-12 pb-4">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-espresso/55 transition-colors hover:text-terracotta">
        ← Back to Explore
      </Link>

      <section className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="mx-auto w-56 sm:w-64 lg:mx-0 lg:w-full lg:max-w-[300px]">
          <div className="relative">
            <BookCover cover={book.cover} title={book.title} className="rounded-2xl shadow-lift" />
            <div className="absolute right-3 top-3">
              <button
                type="button"
                onClick={() => toggleBookmark(book.id)}
                aria-pressed={saved}
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-paper transition-all active:scale-95 ${
                  saved ? "bg-terracotta text-cream" : "bg-ivory/90 text-coffee hover:bg-ivory"
                }`}
              >
                {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {book.genres.map((g) => (
              <span key={g} className="rounded-full bg-parchment/60 px-3 py-1 text-xs font-medium text-coffee-deep">
                {GENRE_NAMES.get(g) ?? g}
              </span>
            ))}
          </div>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-espresso sm:text-4xl">{book.title}</h1>
          <Link to={`/authors/${book.authorId}`} className="mt-1 inline-block font-quote text-xl italic text-terracotta hover:text-terracotta-deep">
            by {book.authorName}
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Rating value={book.rating} size="md" />
            <span className="text-xs text-espresso/50">{book.ratingCount.toLocaleString()} ratings</span>
          </div>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-espresso/75">{book.description}</p>

          <blockquote className="mt-5 max-w-2xl border-l-2 border-gold pl-4 font-quote text-lg italic leading-relaxed text-coffee">
            “{book.quote}”
          </blockquote>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button size="lg" icon={BookOpen} onClick={() => navigate(`/read/${book.id}`)}>
              Start Reading
            </Button>
            <div className="relative">
              <Button
                size="lg"
                variant="secondary"
                icon={Plus}
                onClick={() => setShelfOpen((o) => !o)}
                aria-expanded={shelfOpen}
              >
                {currentShelf ? `On shelf · ${currentShelf.name}` : "Add to Shelf"}
              </Button>
              {shelfOpen ? (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-parchment-deep/50 bg-ivory p-2 shadow-lift fade-in">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-espresso/40">Your shelves</p>
                  {shelves.map((s) => {
                    const on = s.bookIds.includes(book.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => addToShelf(s.id, book.id)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          on ? "bg-parchment/60 text-coffee-deep" : "text-espresso hover:bg-parchment/40"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-sage" />
                          {s.name}
                          {s.kind === "custom" ? <span className="text-[10px] text-espresso/40">custom</span> : null}
                        </span>
                        {on ? <Check className="h-4 w-4 text-sage" /> : null}
                      </button>
                    );
                  })}
                  <div className="mt-1 border-t border-parchment-deep/30 pt-1 text-center">
                    <Link to="/shelf" className="px-3 py-1.5 text-xs font-medium text-terracotta" onClick={() => setShelfOpen(false)}>
                      Manage shelves →
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-7 grid max-w-2xl grid-cols-3 gap-3">
            <InfoTile icon={Users} label="Readers" value={book.readers.toLocaleString()} />
            <InfoTile icon={Bookmark} label="Bookmarks" value={book.bookmarkCount.toLocaleString()} />
            <InfoTile icon={CalendarDays} label="Published" value={new Date(book.publishedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {book.tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Author */}
      {author ? (
        <section aria-label="Author">
          <div className="flex flex-col gap-5 rounded-3xl border border-parchment-deep/40 bg-parchment/30 p-6 sm:flex-row sm:items-center sm:p-7">
            <Avatar label={author.avatar} size="xl" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-terracotta">About the author</p>
              <h2 className="mt-0.5 font-serif text-2xl font-semibold text-espresso">
                <Link to={`/authors/${author.id}`} className="hover:text-coffee">
                  {author.name}
                </Link>
              </h2>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-espresso/70">{author.bio}</p>
            </div>
            <div className="flex gap-6 text-sm text-espresso/60">
              <span><strong className="font-serif text-lg text-espresso">{author.followers.toLocaleString()}</strong> followers</span>
              <span><strong className="font-serif text-lg text-espresso">{author.stories}</strong> stories</span>
            </div>
          </div>
        </section>
      ) : null}

      {/* Discussions */}
      <section aria-label="Reader discussions">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">Reader discussions</h2>
            <p className="mt-0.5 text-sm text-espresso/60">Worth reading, and worth adding to</p>
          </div>
          <Link to="/community" className="inline-flex items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-deep">
            All discussions
          </Link>
        </div>
        {discussions.length > 0 ? (
          <div className="space-y-3">
            {discussions.map((d) => (
              <Link
                key={d.id}
                to="/community"
                className="flex items-start gap-4 rounded-2xl border border-parchment-deep/40 bg-ivory p-4 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Avatar label={d.authorAvatar} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-espresso/50">
                    <span className="font-medium text-espresso/70">{d.authorName}</span>
                    {d.pinned ? <span className="rounded-full bg-gold/30 px-2 py-0.5 text-gold-deep">Pinned</span> : null}
                    {d.spoiler ? <span className="rounded-full bg-coffee/10 px-2 py-0.5 text-coffee">Spoilers</span> : null}
                  </div>
                  <h3 className="mt-1 font-serif text-[15px] font-semibold text-espresso">{d.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-espresso/55">{d.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-espresso/45">
                    <span className="inline-flex items-center gap-1">{d.reactions[0]?.emoji} {d.reactions[0]?.count}</span>
                    <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {d.commentCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-parchment-deep/50 bg-ivory/60 p-6 text-sm text-espresso/55">
            No discussions yet — be the first to wonder aloud about this one.
          </p>
        )}
      </section>

      {/* Related */}
      <section aria-label="Related books">
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-semibold text-espresso">You might also love</h2>
          <p className="mt-0.5 text-sm text-espresso/60">Same shelves, same feeling, different door to walk through</p>
        </div>
        <BookGrid books={related} columns={4} />
      </section>
    </div>
  );
}