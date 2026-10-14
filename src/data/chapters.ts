import type { Book, Chapter } from "../types";
import { getBook } from "./books";

/**
 * Real-world titles are under copyright, so the catalog does not ship their
 * prose. Every book instead gets a generated "reading sample" assembled from
 * its own description and epigraph, keeping the reader experience honest.
 */
export const CHAPTERS: Chapter[] = [];

export function buildSampleChapter(book: Book): Chapter {
  return {
    id: `ch-sample-${book.id}`,
    bookId: book.id,
    number: 1,
    title: "A Reading Sample",
    content: [
      book.description,
      `This is a reading sample from “${book.title}” by ${book.authorName}, and like every good sample it should leave you wanting the full volume.`,
      book.quote,
      "The full story waits on a shelf. When you're ready, a warm lamp, a good cup of something, and a chair are all the directions you'll need.",
    ],
  };
}

export function getChapters(bookId: string): Chapter[] {
  const real = CHAPTERS.filter((c) => c.bookId === bookId);
  if (real.length > 0) return real;
  const book = getBook(bookId);
  return book ? [buildSampleChapter(book)] : [];
}

export function getChapter(chapterId: string): Chapter | undefined {
  const found = CHAPTERS.find((c) => c.id === chapterId);
  if (found) return found;
  const prefix = "ch-sample-";
  if (!chapterId.startsWith(prefix)) return undefined;
  const book = getBook(chapterId.slice(prefix.length));
  return book ? buildSampleChapter(book) : undefined;
}

export function sampleChapterFor(bookId: string): Chapter | undefined {
  const book = getBook(bookId);
  return book ? buildSampleChapter(book) : undefined;
}

export function chaptersFor(book: Book): Chapter[] {
  const real = CHAPTERS.filter((c) => c.bookId === book.id);
  if (real.length > 0) return real;
  return [buildSampleChapter(book)];
}
