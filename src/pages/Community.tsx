import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, MessagesSquare, Sparkles, X } from "lucide-react";
import { DISCUSSIONS, COMMENTS, GROUPS } from "../data/community";
import type { Comment, Discussion } from "../types";
import { useNest } from "../store/NestContext";
import { DiscussionCard, ReactionChip } from "../components/community/DiscussionCard";
import { CommentThread } from "../components/community/CommentThread";
import { GroupCard } from "../components/community/GroupCard";
import { ChatWindow } from "../components/community/ChatWindow";
import { Avatar } from "../components/ui/Avatar";
import { EmptyState } from "../components/ui/EmptyState";
import { timeAgo } from "../lib/time";

type Tab = "discussions" | "groups" | "chat";

const TABS: { id: Tab; label: string }[] = [
  { id: "discussions", label: "Discussions" },
  { id: "groups", label: "Groups" },
  { id: "chat", label: "Chat" },
];

export function CommunityPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab | null) ?? "discussions";
  const chatId = params.get("chat");
  const { joinedGroups } = useNest();
  const [openDiscussion, setOpenDiscussion] = useState<Discussion | null>(null);
  const [groupFilter, setGroupFilter] = useState<"all" | "joined">("all");

  const myGroups = GROUPS.filter((g) => joinedGroups.includes(g.id));
  const discoverGroups = GROUPS.filter((g) => !joinedGroups.includes(g.id));
  const selectedGroup = chatId ? GROUPS.find((g) => g.id === chatId) : myGroups[0];

  const visibleDiscussions = useMemo(
    () =>
      DISCUSSIONS.filter((d) => (groupFilter === "all" ? true : joinedGroups.includes(d.groupId))).sort((a, b) =>
        a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
      ),
    [groupFilter, joinedGroups]
  );

  const setTab = (t: Tab) =>
    setParams((p) => {
      p.set("tab", t);
      return p;
    });

  return (
    <div className="space-y-8 pb-4">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-parchment/50 px-3 py-1 text-xs font-medium text-coffee-deep">
          <MessagesSquare className="h-3.5 w-3.5 text-terracotta" /> The reading room
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-espresso sm:text-4xl">Community</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-espresso/60">
          Groups of readers, million-word arguments, and the friendliest corner of the internet.
        </p>
      </header>

      <div className="flex gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-coffee text-cream shadow-paper" : "bg-ivory text-coffee-deep hover:bg-parchment/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ————— DISCUSSIONS ————— */}
      {tab === "discussions" ? (
        <section className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {visibleDiscussions.map((d) => (
              <DiscussionCard key={d.id} discussion={d} onOpen={() => setOpenDiscussion(d)} />
            ))}
            {visibleDiscussions.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="The room is quiet. For now."
                body="Join a group to see its discussions sprout in your feed. Every corner starts with one curious reader."
              />
            ) : null}
          </div>
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-parchment-deep/40 bg-ivory p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso/45">Feed</p>
              <div className="mt-2 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setGroupFilter("all")}
                  className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${groupFilter === "all" ? "bg-coffee text-cream" : "text-espresso hover:bg-parchment/50"}`}
                >
                  All groups
                </button>
                <button
                  type="button"
                  onClick={() => setGroupFilter("joined")}
                  className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${groupFilter === "joined" ? "bg-coffee text-cream" : "text-espresso hover:bg-parchment/50"}`}
                >
                  My groups ({myGroups.length})
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-parchment-deep/40 bg-parchment/30 p-4 font-quote text-[15px] italic leading-relaxed text-coffee">
              “Some corners of the internet are worth living in. This is one of them.”
              <span className="mt-1.5 block text-right text-xs not-italic text-espresso/50">— a group leader, probably</span>
            </div>
          </aside>
        </section>
      ) : null}

      {/* ————— GROUPS ————— */}
      {tab === "groups" ? (
        <div className="space-y-9">
          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-espresso">My Groups</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myGroups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-espresso">Discover Groups</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discoverGroups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* ————— CHAT ————— */}
      {tab === "chat" ? (
        <section className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="hidden space-y-1.5 lg:block">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-espresso/45">Your groups</p>
            {myGroups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() =>
                  setParams((p) => {
                    p.set("chat", g.id);
                    return p;
                  })
                }
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedGroup?.id === g.id ? "bg-coffee text-cream" : "text-espresso hover:bg-parchment/50"
                }`}
              >
                <span className="block font-serif font-semibold">{g.name}</span>
                <span className={`text-[11px] ${selectedGroup?.id === g.id ? "text-cream/70" : "text-espresso/45"}`}>
                  {g.online} online · {g.members.toLocaleString()} members
                </span>
              </button>
            ))}
          </aside>
          {selectedGroup ? (
            <ChatWindow
              key={selectedGroup.id}
              group={selectedGroup}
              full
              onBack={() =>
                setParams((p) => {
                  p.delete("chat");
                  return p;
                })
              }
            />
          ) : (
            <EmptyState
              icon={MessagesSquare}
              title="No chat yet."
              body="Join a group and its warm little chat room will be waiting. Tea's on."
            />
          )}
        </section>
      ) : null}

      {/* ————— DISCUSSION DETAIL MODAL ————— */}
      {openDiscussion ? (
        <DiscussionModal discussion={openDiscussion} onClose={() => setOpenDiscussion(null)} />
      ) : null}
    </div>
  );
}

function DiscussionModal({ discussion, onClose }: { discussion: Discussion; onClose: () => void }) {
  const [comments, setComments] = useState<Comment[]>(COMMENTS[discussion.id] ?? []);

  const addReply = (commentId: string, text: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...(c.replies ?? []),
                {
                  id: `cr-${Date.now()}`,
                  discussionId: discussion.id,
                  authorId: "u-me",
                  authorName: "You",
                  authorAvatar: "NN",
                  text,
                  reactions: [],
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
  };

  const addComment = (text: string) => {
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        discussionId: discussion.id,
        authorId: "u-me",
        authorName: "You",
        authorAvatar: "NN",
        text,
        reactions: [],
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-espresso/50" onClick={onClose} aria-label="Close discussion" tabIndex={-1} />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-ivory shadow-lift sm:rounded-3xl fade-in">
        <div className="flex items-center justify-between border-b border-parchment-deep/40 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Avatar label={discussion.authorAvatar} size="sm" />
            <div>
              <p className="text-sm font-semibold text-espresso">{discussion.authorName}</p>
              <p className="text-[11px] text-espresso/45">{timeAgo(discussion.createdAt)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-coffee hover:bg-parchment/50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h2 className="font-serif text-xl font-semibold leading-snug text-espresso">{discussion.title}</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-espresso/75">{discussion.body}</p>
          {discussion.reactions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {discussion.reactions.map((r) => (
                <ReactionChip key={r.emoji} emoji={r.emoji} count={r.count} active={r.mine} />
              ))}
            </div>
          ) : null}
          <div className="my-5 border-t border-parchment-deep/30" />
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso/45">
            <BookOpen className="h-3.5 w-3.5" /> {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
          <CommentThread comments={comments} onReply={addReply} />
          <div className="mt-4 border-t border-parchment-deep/30 pt-4">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem("comment") as HTMLInputElement;
                if (input.value.trim()) {
                  addComment(input.value.trim());
                  input.value = "";
                }
              }}
            >
              <input
                name="comment"
                placeholder="Add your voice to the thread…"
                className="h-10 flex-1 rounded-full border border-parchment-deep/50 bg-cream px-4 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/15"
              />
              <button type="submit" className="rounded-full bg-coffee px-4 py-2 text-xs font-medium text-cream hover:bg-coffee-deep">
                Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}