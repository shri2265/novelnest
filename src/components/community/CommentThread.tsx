import { useState } from "react";
import { BookOpen, CornerDownRight, Eye } from "lucide-react";
import type { ReactNode } from "react";
import type { Comment } from "../../types";
import { Avatar } from "../ui/Avatar";
import { getBook } from "../../data/books";
import { timeAgo } from "../../lib/time";
import { ReactionChip } from "./DiscussionCard";
import { toast } from "../../lib/toast";

export function CommentThread({ comments, onReply }: { comments: Comment[]; onReply?: (commentId: string, text: string) => void }) {
  const [texts, setTexts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      {comments.map((c) => {
        const book = c.bookId ? getBook(c.bookId) : undefined;
        const reply = texts[c.id] ?? "";
        const replies = c.replies ?? [];
        return (
          <div key={c.id} className="rounded-2xl border border-parchment-deep/30 bg-cream/50 p-4">
            <div className="flex items-start gap-3">
              <Avatar label={c.authorAvatar} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-espresso/55">
                  <span className="font-semibold text-espresso/85">{c.authorName}</span>
                  <span>{timeAgo(c.createdAt)}</span>
                  {c.spoiler ? <span className="rounded-full bg-coffee/10 px-2 py-0.5 text-[10px]">Spoilers</span> : null}
                </div>
                {c.spoiler ? (
                  <RevealOnClick>
                    <p className="mt-1.5 text-sm leading-relaxed text-espresso/75">{c.text}</p>
                  </RevealOnClick>
                ) : (
                  <p className="mt-1.5 text-sm leading-relaxed text-espresso/75">{c.text}</p>
                )}
                {book ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-parchment/50 px-2 py-1 text-[11px] font-medium text-coffee-deep">
                    <BookOpen className="h-3 w-3 text-terracotta" /> {book.title}
                  </span>
                ) : null}

                {c.reactions.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.reactions.map((r) => (
                      <ReactionChip key={r.emoji} emoji={r.emoji} count={r.count} active={r.mine} />
                    ))}
                  </div>
                ) : null}

                {onReply ? (
                  <form
                    className="mt-2.5 flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (reply.trim()) {
                        onReply(c.id, reply.trim());
                        setTexts((t) => ({ ...t, [c.id]: "" }));
                        toast("Reply added to the thread.");
                      }
                    }}
                  >
                    <input
                      value={reply}
                      onChange={(e) => setTexts((t) => ({ ...t, [c.id]: e.target.value }))}
                      placeholder="Reply to this…"
                      className="h-9 flex-1 rounded-full border border-parchment-deep/50 bg-ivory px-3.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/15"
                    />
                    <button
                      type="submit"
                      className="flex h-9 items-center gap-1.5 rounded-full bg-coffee px-3.5 text-xs font-medium text-cream hover:bg-coffee-deep"
                    >
                      <CornerDownRight className="h-3.5 w-3.5" /> Reply
                    </button>
                  </form>
                ) : null}

                {replies.length > 0 ? (
                  <div className="mt-3 space-y-3 border-l-2 border-parchment-deep/40 pl-4">
                    {replies.map((r) => (
                      <div key={r.id} className="flex items-start gap-3">
                        <Avatar label={r.authorAvatar} size="xs" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-espresso/55">
                            <span className="font-semibold text-espresso/85">{r.authorName}</span> · {timeAgo(r.createdAt)}
                          </div>
                          {r.spoiler ? (
                            <RevealOnClick>
                              <p className="mt-0.5 text-sm leading-relaxed text-espresso/70">{r.text}</p>
                            </RevealOnClick>
                          ) : (
                            <p className="mt-0.5 text-sm leading-relaxed text-espresso/70">{r.text}</p>
                          )}
                          {r.reactions.length > 0 ? (
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {r.reactions.map((rc) => (
                                <ReactionChip key={rc.emoji} emoji={rc.emoji} count={rc.count} active={rc.mine} />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevealOnClick({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) return <>{children}</>;
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-coffee/40 bg-coffee/10 px-2.5 py-1 text-xs font-medium text-coffee"
    >
      <Eye className="h-3.5 w-3.5" /> SPOILER — click to reveal
    </button>
  );
}