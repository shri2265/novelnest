import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, MessageSquare, Pin } from "lucide-react";
import type { ReactNode } from "react";
import type { Discussion, PollOption } from "../../types";
import { Avatar } from "../ui/Avatar";
import { getBook } from "../../data/books";
import { GROUPS } from "../../data/community";
import { timeAgo } from "../../lib/time";
import { toast } from "../../lib/toast";

function SpoilerBox({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) return <>{children}</>;
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="mt-3 w-full rounded-xl border border-dashed border-coffee/40 bg-coffee/10 px-4 py-3 text-left text-sm text-coffee-deep transition-colors hover:bg-coffee/20"
    >
      <span className="inline-flex items-center gap-2 font-medium">
        <Eye className="h-4 w-4" /> SPOILER CONTENT — click to reveal
      </span>
      <span className="mt-0.5 block text-[11px] opacity-60">The group has hidden this behind the curtain.</span>
    </button>
  );
}

export function ReactionChip({ emoji, count, active, onClick }: { emoji: string; count: number; active?: boolean; onClick?: () => void }) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick && active ? true : undefined}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
        active ? "border-terracotta/60 bg-terracotta/15 text-terracotta-deep" : "border-parchment-deep/50 bg-ivory text-espresso/70 hover:bg-parchment/50"
      }`}
    >
      <span>{emoji}</span>
      <span className="tabular-nums">{count}</span>
    </Comp>
  );
}

export function PollBox({
  question,
  options,
  totalVotes,
}: {
  question: string;
  options: PollOption[];
  totalVotes: number;
}) {
  const [votes, setVotes] = useState(options.map((o) => o.votes));
  const [myVote, setMyVote] = useState<number | null>(null);
  const total = myVote !== null ? totalVotes + 1 : totalVotes;

  const vote = (idx: number) => {
    if (myVote !== null) return;
    setVotes((v) => v.map((x, i) => (i === idx ? x + 1 : x)));
    setMyVote(idx);
    toast("Vote cast. The group will know.");
  };

  return (
    <div className="mt-4 rounded-2xl border border-parchment-deep/50 bg-parchment/20 p-4">
      <p className="font-serif text-[15px] font-semibold text-espresso">{question}</p>
      <div className="mt-3 space-y-2">
        {options.map((o, i) => {
          const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => vote(i)}
              className="relative w-full overflow-hidden rounded-xl border border-parchment-deep/50 bg-ivory px-3.5 py-2.5 text-left transition-colors hover:border-coffee"
              aria-pressed={myVote === i}
            >
              <span
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${myVote === i ? "bg-gold/30" : votes[i] > 0 ? "bg-parchment/70" : ""}`}
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex items-center justify-between gap-3 text-sm text-espresso">
                <span>{o.text}</span>
                <span className={`tabular-nums text-xs ${myVote === i ? "font-semibold text-terracotta-deep" : "text-espresso/45"}`}>
                  {pct}%{myVote === i ? " · your vote" : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-espresso/45">{total.toLocaleString()} votes</p>
    </div>
  );
}

export function DiscussionCard({
  discussion,
  onOpen,
  onReact,
}: {
  discussion: Discussion;
  onOpen?: () => void;
  onReact?: (emoji: string) => void;
}) {
  const group = GROUPS.find((g) => g.id === discussion.groupId);
  const book = discussion.bookId ? getBook(discussion.bookId) : undefined;
  const [reactions, setReactions] = useState(discussion.reactions.map((r) => ({ ...r })));

  const react = (emoji: string) => {
    setReactions((prev) =>
      prev.map((r) => {
        if (r.emoji === emoji) {
          if (r.mine) return { ...r, mine: false, count: Math.max(0, r.count - 1) };
          return { ...r, mine: true, count: r.count + 1 };
        }
        return r;
      })
    );
    onReact?.(emoji);
  };

  return (
    <article className="rounded-2xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper transition-shadow hover:shadow-lift">
      <div className="flex items-start gap-3">
        <Avatar label={discussion.authorAvatar} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-espresso/55">
            <span className="font-semibold text-espresso/85">{discussion.authorName}</span>
            <span>{timeAgo(discussion.createdAt)}</span>
            {group ? (
              <span className="rounded-full bg-parchment/60 px-2 py-0.5 text-[10px] font-medium text-coffee-deep">{group.name}</span>
            ) : null}
            {discussion.pinned ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-medium text-gold-deep">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            ) : null}
            {discussion.spoiler ? (
              <span className="rounded-full bg-coffee/10 px-2 py-0.5 text-[10px] font-medium text-coffee">Spoilers</span>
            ) : null}
            {discussion.tags?.map((t) => (
              <span key={t} className="rounded-full bg-parchment/40 px-2 py-0.5 text-[10px] text-espresso/50">#{t}</span>
            ))}
          </div>

          <button type="button" onClick={onOpen} className="mt-1.5 block text-left">
            <h3 className="font-serif text-[17px] font-semibold leading-snug text-espresso transition-colors hover:text-coffee">{discussion.title}</h3>
          </button>

          {discussion.spoiler ? (
            <SpoilerBox>
              <p className="mt-2 text-sm leading-relaxed text-espresso/75">{discussion.body}</p>
            </SpoilerBox>
          ) : (
            <p className="mt-1.5 text-sm leading-relaxed text-espresso/70">{discussion.body}</p>
          )}

          {book ? (
            <Link
              to={`/book/${book.id}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-parchment/40 px-2.5 py-1.5 text-xs font-medium text-coffee-deep transition-colors hover:bg-parchment/70"
            >
              <BookOpen className="h-3.5 w-3.5 text-terracotta" /> {book.title}
            </Link>
          ) : null}

          {discussion.poll ? <PollBox question={discussion.poll.question} options={discussion.poll.options} totalVotes={discussion.poll.totalVotes} /> : null}

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {reactions.map((r) => (
              <ReactionChip key={r.emoji} emoji={r.emoji} count={r.count} active={r.mine} onClick={() => react(r.emoji)} />
            ))}
            <button
              type="button"
              onClick={onOpen}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-espresso/55 transition-colors hover:text-terracotta"
            >
              <MessageSquare className="h-3.5 w-3.5" /> {discussion.commentCount} {discussion.commentCount === 1 ? "comment" : "comments"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}