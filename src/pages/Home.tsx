import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import { BOOKS } from "../data/books";
import { AUTHORS } from "../data/books";
import { DISCUSSIONS, GROUPS } from "../data/community";
import { quoteOfTheDay } from "../data/quotes";
import { useNest } from "../store/NestContext";
import { Button } from "../components/ui/Button";
import { BookGrid } from "../components/ui/BookGrid";
import { BookCard } from "../components/ui/BookCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { QuoteCard } from "../components/ui/QuoteCard";
import { Avatar } from "../components/ui/Avatar";
import { LibraryBackdrop, OpenBookMotif } from "../components/ui/LibraryBackdrop";
import { BookCardSkeleton } from "../components/ui/Skeleton";
import { ProgressBar } from "../components/ui/ProgressBar";
import { daypart } from "../lib/time";
import { getBook } from "../data/books";
import { BookCover } from "../components/ui/BookCover";

export function HomePage() {
  const navigate = useNavigate();
  const { progress, user } = useNest();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  const quote = useMemo(() => quoteOfTheDay(), []);

  const continuing = Object.keys(progress)
    .map((id) => getBook(id))
    .filter((b) => b !== undefined);

  const recommended = BOOKS.filter((b) => b.genres.includes("romance") || b.genres.includes("fantasy")).slice(0, 8);
  const trending = [...BOOKS].sort((a, b) => b.readers - a.readers).slice(0, 8);
  const newThisWeek = [...BOOKS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)).slice(0, 8);
  const spotlightAuthor = AUTHORS[0];
  const featuredDiscussions = [...DISCUSSIONS].sort((a, b) => (a.reactions[0]?.count ?? 0) - (b.reactions[0]?.count ?? 0)).reverse().slice(0, 3);

  return (
    <div className="space-y-12 pb-4">
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
        <LibraryBackdrop className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-ivory/15 px-4 py-1.5 text-xs font-medium tracking-wide text-ivory/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Welcome back to your nest, {user.displayName.split(" ")[0]}
          </p>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-ivory drop-shadow-lg sm:text-6xl">
            Stories have a place here.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-ivory/85 sm:text-lg">
            Find a quiet corner and get lost in a good story. Read. Highlight. Share. Discover your next favorite book.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="gold" size="lg" icon={BookOpen} onClick={() => navigate("/explore")}>
              Explore Books
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="border border-ivory/30 bg-ivory/10 text-ivory hover:bg-ivory/20"
              onClick={() => (continuing[0] ? navigate(`/read/${continuing[0].id}`) : navigate("/explore"))}
            >
              Start Reading
            </Button>
          </div>
          <form
            className="mx-auto mt-10 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
            }}
          >
            <label className="flex h-13 items-center gap-3 rounded-full bg-ivory/95 px-5 shadow-lift">
              <Search className="h-5 w-5 shrink-0 text-coffee" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for your next favorite story…"
                className="h-full w-full bg-transparent text-[15px] text-espresso placeholder:text-espresso/40 focus:outline-none"
              />
              <button type="submit" className="hidden rounded-full bg-coffee px-4 py-2 text-xs font-semibold text-cream sm:block" aria-label="Search">
                Search
              </button>
            </label>
          </form>
          <OpenBookMotif className="mx-auto mt-12 hidden h-12 w-36 text-ivory/70 sm:block" />
        </div>
      </section>

      {/* Continue reading */}
      {!loading && continuing.length > 0 ? (
        <section aria-label="Continue reading">
          <SectionHeader
            title="Continue Reading"
            subtitle={daypart()}
            action={
              <Link to="/shelf" className="inline-flex items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-deep">
                My Shelf <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {continuing.map((book) => {
              const p = progress[book.id];
              return (
                <Link
                  key={book.id}
                  to={`/read/${book.id}`}
                  className="group flex items-center gap-5 rounded-2xl border border-parchment-deep/40 bg-ivory p-4 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="w-20 shrink-0 sm:w-24">
                    <BookCover cover={book.cover} title={book.title} author={book.authorName} src={book.coverImage} className="rounded-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-espresso/40">
                      {Math.round((p?.progress ?? 0) * 100)}% complete
                    </p>
                    <h3 className="mt-0.5 font-serif text-lg font-semibold leading-snug text-espresso group-hover:text-coffee">
                      {book.title}
                    </h3>
                    <p className="text-xs text-espresso/55">{book.authorName}</p>
                    <div className="mt-3">
                      <ProgressBar progress={p?.progress ?? 0} />
                    </div>
                    <p className="mt-2 hidden items-center gap-1.5 text-xs text-terracotta sm:flex">
                      <BookOpen className="h-3.5 w-3.5" /> Keep reading
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Recommended */}
      <section aria-label="Recommended for you">
        <SectionHeader
          title="Recommended For You"
          subtitle="Chosen from your shelves and moods"
          action={
            <Link to="/explore" className="hidden items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-deep sm:inline-flex">
              Explore all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <BookGrid books={recommended} />
        )}
      </section>

      {/* Trending */}
      <section aria-label="Trending novels">
        <SectionHeader
          title="Trending Novels"
          subtitle="What the Nest is reading this week"
          action={
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta">
              <TrendingUp className="h-4 w-4" /> Updated daily
            </span>
          }
        />
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-40 shrink-0">
                <BookCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {trending.map((book, i) => (
              <div key={book.id} className="relative w-40 shrink-0">
                <span className="absolute -left-1 -top-2 z-10 font-serif text-4xl font-semibold text-parchment-deep">{i + 1}</span>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New this week + Author spotlight */}
      <section aria-label="New this week">
        <SectionHeader
          title="New This Week"
          subtitle="Fresh pages, still warm from the press"
          action={
            <Link to="/explore?tab=new" className="inline-flex items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-deep">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <BookGrid books={newThisWeek} />
        )}
      </section>

      {/* Hero author spotlight */}
      <section aria-label="Author spotlight">
        <div className="paper relative overflow-hidden rounded-3xl border border-parchment-deep/40 p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-6 -top-6 rotate-12 font-serif text-8xl text-parchment/50">”</div>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5 sm:flex-col sm:items-start sm:gap-3">
              <Avatar label={spotlightAuthor.avatar} size="xl" />
              <div className="sm:hidden">
                <h3 className="font-serif text-xl font-semibold text-espresso">{spotlightAuthor.name}</h3>
                <p className="text-xs text-espresso/55">{spotlightAuthor.handle}</p>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-terracotta">Author Spotlight</p>
              <h3 className="mt-1 hidden font-serif text-2xl font-semibold text-espresso sm:block">{spotlightAuthor.name}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-espresso/70">{spotlightAuthor.bio}</p>
              <blockquote className="mt-3 font-quote text-lg italic text-coffee">“{spotlightAuthor.favoriteQuote}”</blockquote>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-espresso/55">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-sage" /> {spotlightAuthor.followers.toLocaleString()} followers
                </span>
                <span>{spotlightAuthor.stories} stories</span>
                <span>{spotlightAuthor.totalReaders.toLocaleString()} readers</span>
              </div>
              <div className="mt-5">
                <Button variant="secondary" icon={BookOpen} onClick={() => navigate(`/authors/${spotlightAuthor.id}`)}>
                  Visit {spotlightAuthor.name.split(" ")[0]}'s Nest
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community discussions */}
      <section aria-label="Community discussions">
        <SectionHeader
          title="Community Discussions"
          subtitle="Happening in your groups right now"
          action={
            <Link to="/community" className="inline-flex items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-deep">
              Visit Community <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {featuredDiscussions.map((d) => {
            const group = GROUPS.find((g) => g.id === d.groupId);
            const book = d.bookId ? getBook(d.bookId) : undefined;
            return (
              <Link
                key={d.id}
                to="/community"
                className="group flex flex-col gap-3 rounded-2xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-espresso/50">
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar label={d.authorAvatar} size="xs" /> {d.authorName}
                  </span>
                  <span className="rounded-full bg-parchment/60 px-2 py-0.5 text-[10px] text-coffee-deep">{group?.name}</span>
                </div>
                <h3 className="line-clamp-2 font-serif text-[15px] font-semibold leading-snug text-espresso group-hover:text-coffee">
                  {d.title}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-espresso/55">{d.body}</p>
                <div className="mt-auto flex items-center gap-3 text-[11px] text-espresso/45">
                  <span className="inline-flex items-center gap-1">{d.reactions[0]?.emoji} {d.reactions[0]?.count}</span>
                  <span className="inline-flex items-center gap-1">💬 {d.commentCount}</span>
                  {book ? <span className="ms-auto text-terracotta">{book.title}</span> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quote of the day */}
      <section aria-label="Quote of the day">
        <SectionHeader title="Quote of the Day" subtitle="A line to carry with you today" />
        <QuoteCard quote={quote} />
      </section>
    </div>
  );
}