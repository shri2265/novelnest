import { useParams } from "react-router-dom";
import { Bookmark, Eye, Heart, PenLine, Users } from "lucide-react";
import { AUTHOR_MAP, booksByAuthor } from "../data/books";
import { useNest } from "../store/NestContext";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { BookCard } from "../components/ui/BookCard";
import { EmptyState } from "../components/ui/EmptyState";
import { InfoTile } from "../components/ui/InfoTile";
import { toast } from "../lib/toast";

export function AuthorProfilePage() {
  const { authorId } = useParams();
  const author = authorId ? AUTHOR_MAP.get(authorId) : undefined;
  const { toggleFollow, isFollowing } = useNest();

  if (!author) {
    return (
      <EmptyState
        icon={PenLine}
        title="No such author."
        body="This shelf is empty — maybe their name is on the door of someone else's nest."
      />
    );
  }

  const books = booksByAuthor(author.id);
  const popular = [...books].sort((a, b) => b.rating * b.ratingCount - a.rating * a.ratingCount);
  const latest = [...books].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const following = isFollowing(author.id);
  const totalReaders = books.reduce((a, b) => a + b.readers, 0);

  return (
    <div className="space-y-10 pb-4">
      {/* Profile header */}
      <section className="paper overflow-hidden rounded-3xl border border-parchment-deep/40">
        <div className="h-28 bg-gradient-to-br from-parchment/70 via-parchment to-sage/30 sm:h-36" />
        <div className="px-6 pb-6 sm:px-10">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar label={author.avatar} size="xl" className="ring-4 ring-ivory" />
              <div className="pb-1">
                <h1 className="font-serif text-2xl font-semibold text-espresso sm:text-3xl">{author.name}</h1>
                <p className="text-sm text-espresso/55">{author.handle}</p>
              </div>
            </div>
            <Button
              variant={following ? "soft" : "primary"}
              icon={following ? Heart : Users}
              onClick={() => {
                toggleFollow(author.id);
                toast(following ? `Unfollowed ${author.name.split(" ")[0]}.` : `Now following ${author.name.split(" ")[0]}. Warm introduces all around.`);
              }}
              className="w-fit"
            >
              {following ? "Following" : "Follow"}
            </Button>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-espresso/70">{author.bio}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoTile label="Followers" value={author.followers.toLocaleString()} icon={Users} />
            <InfoTile label="Stories" value={String(author.stories)} icon={PenLine} />
            <InfoTile label="Total readers" value={totalReaders.toLocaleString()} icon={Eye} />
            <InfoTile label="Bookmarks" value={books.reduce((a, b) => a + b.bookmarkCount, 0).toLocaleString()} icon={Bookmark} />
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {[...new Set(author.genres)].map((g) => (
              <span key={g} className="rounded-full bg-parchment/60 px-3 py-1 text-[11px] capitalize text-coffee-deep">{g.replace(/-/g, " ")}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Favorite quote */}
      <section className="rounded-3xl border border-gold/50 bg-gold/15 p-7 text-center sm:p-9">
        <p className="font-quote text-xl italic leading-relaxed text-coffee sm:text-2xl">{author.favoriteQuote}</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-coffee-deep/60">— {author.name.split(" ")[0]}'s favorite line</p>
      </section>

      {/* Popular stories */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">Popular stories</h2>
            <p className="mt-0.5 text-sm text-espresso/55">The ones readers kept coming back to</p>
          </div>
          <span className="text-xs text-espresso/40">sorted by rating × readers</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>

      {/* Latest stories */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">Latest</h2>
            <p className="mt-0.5 text-sm text-espresso/55">Fresh from the desk</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.slice(0, 3).map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>
    </div>
  );
}