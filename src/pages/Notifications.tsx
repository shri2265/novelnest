import { useState } from "react";
import { Link } from "react-router-dom";
import { Bird, Bookmark, BookOpen, Heart, MessageCircle, Sparkles, Users, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNest } from "../store/NestContext";
import type { NotificationKind } from "../types";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { timeAgo } from "../lib/time";

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  new_chapter: BookOpen,
  bookmark_story: Bookmark,
  discussion_reply: MessageCircle,
  new_follower: Heart,
  group_activity: Users,
  publishing_slot: Bird,
  new_recommendation: Sparkles,
};

const KIND_TONE: Record<NotificationKind, string> = {
  new_chapter: "bg-gold/25 text-gold-deep",
  bookmark_story: "bg-sage/20 text-sage-deep",
  discussion_reply: "bg-terracotta/15 text-terracotta-deep",
  new_follower: "bg-terracotta/20 text-terracotta-deep",
  group_activity: "bg-parchment text-coffee-deep",
  publishing_slot: "bg-gold/25 text-gold-deep",
  new_recommendation: "bg-lavender/30 text-espresso",
};

export function NotificationsPage() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useNest();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const list = notifications.filter((n) => (filter === "all" ? true : !n.read));
  const sorted = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const content = (
    <div className="space-y-2.5">
      {sorted.map((n) => {
        const Icon = KIND_ICON[n.kind];
        return (
          <div key={n.id} className={`flex gap-3.5 rounded-2xl border p-4 transition-colors ${n.read ? "border-parchment-deep/30 bg-ivory" : "border-terracotta/40 bg-parchment/30"}`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${KIND_TONE[n.kind]}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-espresso">{n.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-espresso/65">{n.body}</p>
                </div>
                {!n.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" aria-label="Unread" /> : null}
              </div>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-espresso/40">
                <span>{timeAgo(n.createdAt)}</span>
                {n.avatar ? <Avatar label={n.avatar} size="xs" /> : null}
                {!n.read ? (
                  <button type="button" onClick={() => markNotificationRead(n.id)} className="font-medium text-terracotta hover:text-terracotta-deep">
                    Mark as read
                  </button>
                ) : null}
              </div>
            </div>
            {n.href ? (
              <Link to={n.href} onClick={() => markNotificationRead(n.id)} className="self-center text-xs font-medium text-coffee-deep hover:text-terracotta">
                Open →
              </Link>
            ) : null}
          </div>
        );
      })}
      {sorted.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === "unread" ? "You're all caught up." : "The nest is quiet."}
          body={filter === "unread" ? "Nothing unread left. Your lamp is tidy." : "Notifications about chapters, replies, followers and publishing slots will gather here."}
        />
      ) : null}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6 pb-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-espresso">Notifications</h1>
          <p className="mt-1 text-sm text-espresso/60">
            {unreadCount === 0 ? "All caught up — the nest is quiet." : `${unreadCount} new thing${unreadCount === 1 ? "" : "s"} to read.`}
          </p>
        </div>
        {unreadCount > 0 ? (
          <Button variant="soft" onClick={markAllNotificationsRead}>
            Mark all as read
          </Button>
        ) : null}
      </header>

      <div className="flex gap-1.5">
        <button type="button" onClick={() => setFilter("all")} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === "all" ? "bg-coffee text-cream" : "bg-ivory text-coffee-deep hover:bg-parchment/50"}`}>
          All
        </button>
        <button type="button" onClick={() => setFilter("unread")} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === "unread" ? "bg-coffee text-cream" : "bg-ivory text-coffee-deep hover:bg-parchment/50"}`}>
          Unread {unreadCount > 0 ? `(${unreadCount})` : ""}
        </button>
      </div>

      {content}
    </div>
  );
}