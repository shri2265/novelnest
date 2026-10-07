import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useNest } from "../../store/NestContext";

interface BookmarkButtonProps extends HTMLAttributes<HTMLButtonElement> {
  bookId: string;
  count?: number;
  size?: "sm" | "md";
}

export function BookmarkButton({ bookId, count, size = "sm", className = "", ...rest }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useNest();
  const saved = isBookmarked(bookId);

  const [toggling, setToggling] = useState(false);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setToggling(true);
    toggleBookmark(bookId);
    window.setTimeout(() => setToggling(false), 200);
  };

  const btn = (
    <button
      type="button"
      aria-label={saved ? "Remove bookmark" : "Bookmark this book"}
      aria-pressed={saved}
      onClick={handle}
      className={`group/book inline-flex items-center gap-1 rounded-full font-medium transition-all duration-150 active:scale-95 ${
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm"
      } ${
        saved
          ? "bg-terracotta text-cream shadow-paper"
          : "bg-ivory/85 text-coffee shadow-paper backdrop-blur-sm hover:bg-ivory"
      } ${className}`}
      {...rest}
    >
      <span className="relative inline-flex">
        <BookmarkCheck className={`h-3.5 w-3.5 transition-all duration-150 ${saved ? "scale-100 opacity-100" : "scale-90 opacity-0"}`} />
        <Bookmark
          className={`absolute inset-0 h-3.5 w-3.5 transition-all duration-150 ${toggling ? "scale-125" : ""} ${
            saved ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
          strokeWidth={2.2}
        />
      </span>
      {count !== undefined ? <span className="tabular-nums">{saved ? count + 1 : count}</span> : null}
    </button>
  );

  if (!count) return btn;
  return btn;
}