import { Bookmark, Eye, MessageCircle, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNest } from "../../store/NestContext";
import type { Book } from "../../types";
import { AuthorDashboardStory } from "./AuthorDashboardStory";

interface Stat {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function AuthorDashboardRow() {
  const { publications } = useNest();
  const published = publications.filter((p) => p.status === "published");
  const totals = published.reduce(
    (acc, p) => ({
      readers: acc.readers + (p.stats?.readers ?? 0),
      bookmarks: acc.bookmarks + (p.stats?.bookmarks ?? 0),
      comments: acc.comments + (p.stats?.comments ?? 0),
    }),
    { readers: 0, bookmarks: 0, comments: 0 }
  );

  const stats: Stat[] = [
    { icon: Eye, label: "Total readers", value: totals.readers.toLocaleString() },
    { icon: Bookmark, label: "Bookmarks", value: totals.bookmarks.toLocaleString() },
    { icon: MessageCircle, label: "Comments", value: totals.comments.toLocaleString() },
    { icon: PenLine, label: "Published", value: String(published.length) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-parchment-deep/40 bg-ivory p-4 text-center shadow-paper">
          <s.icon className="mx-auto h-5 w-5 text-terracotta" />
          <p className="mt-1.5 font-serif text-2xl font-semibold text-espresso">{s.value}</p>
          <p className="text-[11px] text-espresso/50">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function AuthorDashboard({ relatedBooks }: { relatedBooks?: Book[] }) {
  const { publications } = useNest();
  const { user } = useNest();

  return (
    <div className="space-y-6">
      <AuthorDashboardRow />
      <div className="rounded-3xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-espresso">Your stories in the nest</h2>
            <p className="mt-0.5 text-sm text-espresso/55">
              {relatedBooks?.length ?? 0} stories on shelf · {user.displayName}
            </p>
          </div>
          <span className="rounded-full bg-parchment/60 px-3 py-1 text-xs font-medium text-coffee-deep">Weekly publishing rhythm</span>
        </div>
        <div className="space-y-3">
          {publications.map((p) => (
            <AuthorDashboardStory key={p.id} publication={p} />
          ))}
        </div>
      </div>
    </div>
  );
}