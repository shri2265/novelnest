import { Bookmark, CalendarClock, Clock, Heart, MessageCircle, Send } from "lucide-react";
import type { Publication } from "../../types";

const STATUS_LABEL: Record<Publication["status"], string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  review: "In review",
  published: "Published",
};

const STATUS_STYLE: Record<Publication["status"], string> = {
  draft: "bg-parchment/60 text-coffee-deep",
  scheduled: "bg-gold/25 text-gold-deep",
  review: "bg-sage/20 text-sage-deep",
  published: "bg-sage/25 text-sage-deep",
};

export function AuthorDashboardStory({ publication }: { publication: Publication }) {
  const s = publication.stats;
  const date = publication.publishedAt ? new Date(publication.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "not published yet";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-parchment-deep/30 bg-cream/50 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-[15px] font-semibold text-espresso">{publication.title}</h3>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[publication.status]}`}>
            {STATUS_LABEL[publication.status]}
          </span>
        </div>
        <p className="line-clamp-1 text-xs text-espresso/55">{publication.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-espresso/45">
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {publication.chapters} chapters</span>
          <span>{publication.words.toLocaleString()} words</span>
          <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" /> {date}</span>
        </div>
      </div>
      {s ? (
        <div className="flex items-center gap-5 sm:shrink-0">
          <span className="flex items-center gap-1.5 text-xs text-espresso/60">
            <Heart className="h-4 w-4 text-terracotta" /> {s.readers.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-espresso/60">
            <Bookmark className="h-4 w-4 text-gold-deep" /> {s.bookmarks.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-espresso/60">
            <MessageCircle className="h-4 w-4 text-sage" /> {s.comments.toLocaleString()}
          </span>
          <span className="hidden items-center gap-1.5 text-xs text-espresso/45 md:flex">
            <Send className="h-3.5 w-3.5" /> avg {s.averageReadTime}
          </span>
        </div>
      ) : (
        <span className="text-xs italic text-espresso/40 sm:shrink-0">still being woven</span>
      )}
    </div>
  );
}