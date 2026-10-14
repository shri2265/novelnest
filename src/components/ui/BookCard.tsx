import { Link } from "react-router-dom";
import type { Book } from "../../types";
import { useNest } from "../../store/NestContext";
import { BookCover } from "./BookCover";
import { Rating } from "./Rating";
import { BookmarkButton } from "./BookmarkButton";
import { ProgressBar } from "./ProgressBar";

interface BookCardProps {
  book: Book;
  compact?: boolean;
  className?: string;
}

export function BookCard({ book, compact, className = "" }: BookCardProps) {
  const { progress } = useNest();
  const p = progress[book.id];
  const prog = p ? p.progress : undefined;

  return (
    <div className={`group relative flex flex-col ${className}`}>
      <div className="relative overflow-hidden rounded-xl shadow-paper transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lift">
        <Link to={`/book/${book.id}`} aria-label={`Open ${book.title}`}>
          <BookCover cover={book.cover} title={book.title} author={book.authorName} src={book.coverImage} hoverZoom />
        </Link>
        <div className="absolute right-2 top-2">
          <BookmarkButton bookId={book.id} />
        </div>
        {prog !== undefined && prog > 0 ? <ProgressBar progress={prog} className="absolute bottom-0 left-0 right-0" /> : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-2.5">
        <Link to={`/book/${book.id}`} className="line-clamp-2 font-serif text-[15px] font-semibold leading-snug text-espresso transition-colors hover:text-coffee">
          {book.title}
        </Link>
        <Link to={`/authors/${book.authorId}`} className="text-xs text-espresso/60 transition-colors hover:text-terracotta">
          {book.authorName}
        </Link>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <Rating value={book.rating} />
          <span className="rounded-full bg-parchment/60 px-2 py-0.5 text-[10px] font-medium text-coffee-deep">{book.genres[0]}</span>
        </div>
        {compact ? null : (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-espresso/55">{book.description.slice(0, 140)}</p>
        )}
      </div>
    </div>
  );
}