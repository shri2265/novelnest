import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bookmark, Compass, Feather, Heart, Search, Star, TrendingUp } from "lucide-react";
import { BOOKS, AUTHORS } from "../data/books";
import { GENRES } from "../data/genres";
import type { Book } from "../types";
import { BookGrid } from "../components/ui/BookGrid";
import { GenreChip, TagChip } from "../components/ui/GenreChip";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Avatar } from "../components/ui/Avatar";
import { BookCardSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";

type Tab = "trending" | "new" | "bookmarked" | "highlighted" | "favorites";

const TABS: { id: Tab; label: string; icon: typeof Star }[] = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "new", label: "New releases", icon: Star },
  { id: "bookmarked", label: "Most bookmarked", icon: Bookmark },
  { id: "highlighted", label: "Most highlighted", icon: Feather },
  { id: "favorites", label: "Community favorites", icon: Heart },
];

function sortBooks(tab: Tab, books: Book[]): Book[] {
  switch (tab) {
    case "trending":
      return [...books].sort((a, b) => b.readers - a.readers);
    case "new":
      return [...books].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    case "bookmarked":
      return [...books].sort((a, b) => b.bookmarkCount - a.bookmarkCount);
    case "highlighted":
      return [...books].sort((a, b) => b.ratingCount - a.ratingCount);
    case "favorites":
      return [...books].sort((a, b) => b.rating - a.rating);
  }
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const activeGenres = params.getAll("genre");
  const tab = (params.get("tab") as Tab | null) ?? "trending";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [query, activeGenres.join(","), tab]);

  const toggleGenre = (id: string) => {
    const next = activeGenres.includes(id) ? activeGenres.filter((g) => g !== id) : [...activeGenres, id];
    setParams((p) => {
      p.delete("genre");
      next.forEach((g) => p.append("genre", g));
      return p;
    });
  };

  const setTab = (t: Tab) => {
    setParams((p) => {
      p.set("tab", t);
      return p;
    });
  };

  const filtered = useMemo(() => {
    let books = BOOKS.filter((b) => (activeGenres.length === 0 ? true : b.genres.some((g) => activeGenres.includes(g))));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.authorName.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q)) ||
          b.genres.some((g) => g.includes(q))
      );
    }
    return sortBooks(tab, books);
  }, [query, activeGenres, tab]);

  const authors = query.trim()
    ? AUTHORS.filter(
        (a) => a.name.toLowerCase().includes(query.trim().toLowerCase()) || a.bio.toLowerCase().includes(query.trim().toLowerCase())
      )
    : AUTHORS;

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-parchment/50 px-3 py-1 text-xs font-medium text-coffee-deep">
          <Compass className="h-3.5 w-3.5 text-terracotta" /> The library shelves
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-espresso sm:text-4xl">Explore the shelves</h1>
        <p className="mt-2 text-sm leading-relaxed text-espresso/60">
          Wander the stacks — by genre, by mood, by what the Nest can't stop talking about.
        </p>
      </header>

      {/* Tabs */}
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-coffee text-cream shadow-paper" : "bg-ivory text-coffee-deep hover:bg-parchment/50"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Genre filters */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-espresso/40">Filter by genre</label>
        <div className="flex flex-wrap gap-2">
          <GenreChip
            genre="all"
            active={activeGenres.length === 0}
            onClick={activeGenres.length === 0 ? undefined : () => setParams((p) => { p.delete("genre"); return p; })}
          />
          {GENRES.map((g) => (
            <GenreChip key={g.id} genre={g.id} active={activeGenres.includes(g.id)} onClick={() => toggleGenre(g.id)} />
          ))}
        </div>
      </div>

      {/* Results */}
      <section aria-live="polite">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-espresso">
            {query.trim() ? `Results for “${query.trim()}”` : tab === "trending" ? "Trending in the Nest" : TABS.find((t) => t.id === tab)?.label}
          </h2>
          {query.trim() ? (
            <button
              type="button"
              onClick={() => setParams((p) => { p.delete("q"); return p; })}
              className="rounded-full bg-parchment/60 px-3 py-1 text-xs font-medium text-coffee-deep hover:bg-parchment"
            >
              Clear search
            </button>
          ) : null}
          <span className="text-xs text-espresso/45">{filtered.length} {filtered.length === 1 ? "story" : "stories"}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <BookGrid books={filtered.slice(0, 10)} columns={5} />
            {filtered.length > 10 ? (
              <p className="mt-6 text-center text-sm text-espresso/45">And {filtered.length - 10} more waiting on the far shelf…</p>
            ) : null}
          </>
        ) : (
          <EmptyState
            icon={Search}
            title="Nothing on this shelf yet."
            body="Your next favorite story is probably hiding in a different nook. Try a new genre, or a hazier search."
          />
        )}
      </section>

      {/* Authors */}
      <section aria-label="Authors">
        <SectionHeader title="Writers to follow" subtitle="The authors making the Nest feel like home" />
        <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {authors.map((a) => (
            <Link
              key={a.id}
              to={`/authors/${a.id}`}
              className="flex w-64 shrink-0 items-start gap-4 rounded-2xl border border-parchment-deep/40 bg-ivory p-4 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Avatar label={a.avatar} size="lg" />
              <div className="min-w-0">
                <h3 className="font-serif text-[15px] font-semibold text-espresso">{a.name}</h3>
                <p className="text-[11px] text-espresso/50">{a.handle}</p>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-espresso/60">{a.bio}</p>
                <div className="mt-2 flex items-center gap-2">
                  {a.genres.slice(0, 2).map((g) => (
                    <TagChip key={g} label={g} />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}