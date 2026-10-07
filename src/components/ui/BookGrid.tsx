import type { Book } from "../../types";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
  columns?: 2 | 3 | 4 | 5;
  compact?: boolean;
}

const COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

export function BookGrid({ books, columns = 4, compact }: BookGridProps) {
  return (
    <div className={`grid gap-x-4 gap-y-6 ${COLS[columns]}`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} compact={compact} />
      ))}
    </div>
  );
}