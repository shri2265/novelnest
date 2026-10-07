import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, CornerUpLeft, Paperclip, Send, Smile } from "lucide-react";
import type { ChatMessage, Group } from "../../types";
import { useNest } from "../../store/NestContext";
import { getBook } from "../../data/books";
import { stickerById } from "../../data/stickers";
import { Avatar } from "../ui/Avatar";
import { StickerArt } from "../stickers/StickerArt";
import { StickerPicker } from "../stickers/StickerPicker";
import { timeAgo } from "../../lib/time";
import { toast } from "../../lib/toast";

const QUICK_EMOJI = ["❤️", "💬", "😂", "🔥", "🥹", "📖", "☕", "🌧️"];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const book = msg.bookId ? getBook(msg.bookId) : undefined;
  if (msg.system) {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-parchment/60 px-3 py-1 text-[11px] font-medium text-coffee-deep">{msg.text}</span>
      </div>
    );
  }
  return (
    <div className={`flex gap-2.5 ${msg.isMine ? "flex-row-reverse" : ""}`}>
      {msg.isMine ? null : <Avatar label={msg.authorAvatar} size="sm" />}
      <div className={`max-w-[78%] sm:max-w-[65%] ${msg.isMine ? "items-end" : ""} flex flex-col`}>
        {!msg.isMine ? (
          <span className="mb-0.5 px-1 text-[11px] font-medium text-espresso/55">{msg.authorName}</span>
        ) : null}
        <div
          className={`rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed shadow-paper ${
            msg.isMine
              ? "rounded-tl-2xl rounded-br-sm bg-coffee text-cream"
              : "rounded-tl-sm rounded-tr-2xl rounded-br-2xl bg-ivory text-espresso"
          }`}
        >
          {book ? (
            <span className={`mb-1.5 flex items-center gap-1.5 text-xs font-medium ${msg.isMine ? "text-gold" : "text-terracotta"}`}>
              <BookOpen className="h-3.5 w-3.5" /> {book.title}
            </span>
          ) : null}
          {msg.text}
        </div>
        <div className={`mt-1 flex ${msg.isMine ? "justify-end" : "justify-start"} items-center gap-2 px-1`}>
          <span className="text-[10px] text-espresso/40">{timeAgo(msg.createdAt)}</span>
          {msg.reactions && msg.reactions.length > 0 ? (
            <span className="rounded-full border border-parchment-deep/40 bg-parchment/40 px-1.5 py-0.5 text-[10px]">
              {msg.reactions.map((r) => r.emoji).join(" ")} {msg.reactions.reduce((a, r) => a + r.count, 0)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({
  group,
  onBack,
  full,
}: {
  group: Group;
  onBack?: () => void;
  full?: boolean;
}) {
  const { messagesByGroup, sendMessage, passageBookmarks } = useNest();
  const [text, setText] = useState("");
  const [stickerOpen, setStickerOpen] = useState(false);
  const [replying, setReplying] = useState<ChatMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = messagesByGroup[group.id] ?? [];
  const bookRefCount = Math.min(messages.filter((m) => m.bookId).length, 3);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const send = (msgText?: string) => {
    const value = msgText ?? text.trim();
    if (!value) return;
    sendMessage(group.id, value);
    setText("");
    setReplying(null);
  };

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-parchment-deep/40 bg-cream/60 shadow-paper ${full ? "h-[calc(100vh-9.5rem)]" : "h-[28rem]"} sm:${full ? "h-[calc(100vh-9rem)]" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-parchment-deep/40 bg-ivory px-3.5 py-2.5">
        {onBack ? (
          <button type="button" onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-parchment/50 lg:hidden" aria-label="Back to groups">
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-parchment/60 text-terracotta">
          <StickerArt motif={group.cover} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-serif text-[15px] font-semibold text-espresso">{group.name}</h2>
          <p className="flex items-center gap-1.5 text-[11px] text-espresso/55">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {group.online} online · {group.members.toLocaleString()} members
          </p>
        </div>
        <div className="flex -space-x-2">
          {["LM", "RA", "KN"].map((a) => (
            <Avatar key={a} label={a} size="sm" className="ring-2 ring-ivory" />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-4 sm:px-5">
        <div className="flex justify-center">
          <span className="rounded-full bg-parchment/50 px-3 py-1 text-[11px] text-espresso/55">
            The cozy corner of {group.name} · say hello and bring a snack
          </span>
        </div>
        {messages.map((m) => (
          <div key={m.id} className="group/msg relative">
            <MessageBubble msg={m} />
            {!m.isMine && !m.system ? (
              <button
                type="button"
                onClick={() => setReplying(m)}
                className="absolute -bottom-1 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-parchment text-coffee opacity-0 shadow-paper transition-opacity group-hover/msg:opacity-100"
                aria-label="Reply to this message"
              >
                <CornerUpLeft className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Reply indicator */}
      {replying ? (
        <div className="mx-3 mb-1.5 flex items-center gap-2 rounded-lg bg-parchment/60 px-3 py-1.5 text-xs text-coffee-deep">
          <CornerUpLeft className="h-3.5 w-3.5" />
          Replying to <strong className="truncate">{replying.authorName}: “{replying.text.slice(0, 40)}”</strong>
          <button type="button" onClick={() => setReplying(null)} className="ml-auto font-medium text-coffee hover:text-terracotta">
            Cancel
          </button>
        </div>
      ) : null}

      {/* Composer */}
      <div className="border-t border-parchment-deep/40 bg-ivory p-2.5">
        <form
          className="flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <div className="relative">
            <button type="button" onClick={() => setStickerOpen((o) => !o)} className="flex h-10 w-10 items-center justify-center rounded-xl text-coffee hover:bg-parchment/50" aria-label="Stickers and emoji">
              <Smile className="h-5 w-5" />
            </button>
            {stickerOpen ? (
              <div className="absolute bottom-12 left-0 z-30">
                <StickerPicker
                  compact
                  onClose={() => setStickerOpen(false)}
                  onPick={(id) => {
                    const st = stickerById(id);
                    send(`sent the ${st?.name ?? "sticker"} sticker`);
                    toast("Sticker sent. Absolutely adorable.");
                  }}
                />
              </div>
            ) : null}
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${group.name}…`}
            className="h-10 min-w-0 flex-1 rounded-full border border-parchment-deep/50 bg-cream px-4 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/15"
            aria-label="Message"
          />
          <div className="hidden gap-1 sm:flex">
            {QUICK_EMOJI.map((e) => (
              <button key={e} type="button" onClick={() => setText((t) => t + e)} className="rounded-lg px-1 text-base transition-transform hover:scale-125" aria-label={`Add ${e}`}>
                {e}
              </button>
            ))}
          </div>
          <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl text-coffee hover:bg-parchment/50 sm:flex" aria-label="Attach a book" title="Attach a book">
            <Paperclip className="h-5 w-5" />
          </button>
          <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee text-cream transition-colors hover:bg-coffee-deep" aria-label="Send">
            <Send className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          </button>
        </form>
        {bookRefCount > 0 ? (
          <p className="px-2 pt-1 text-[10px] text-espresso/40">
            {bookRefCount} book {bookRefCount === 1 ? "reference" : "references"} in this thread · {passageBookmarks.length} passage bookmark{passageBookmarks.length === 1 ? "" : "s"} you've made
          </p>
        ) : null}
      </div>
    </div>
  );
}