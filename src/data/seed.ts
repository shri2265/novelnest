import type { BookProgress, Highlight, Notification, Publication, Shelf, StickerPlacement } from "../types";

export const CURRENT_USER = {
  id: "u-me",
  username: "reader",
  displayName: "Shristi Rai",
  handle: "@shristirai",
  avatar: "SR",
  bio: "Reading my way through quiet evenings, one bookmark at a time. Keeper of too many bookshelves and always looking for the next story to get lost in.",
  location: "Somewhere between chapters",
  joined: "March 2024",
  readingMood: "Rainy and re-reading",
  favoriteQuote: "A reader lives a thousand lives before he dies.",
  favoriteQuoteSource: "the margins of a very loved paperback",
  following: ["a-1", "a-2"],
  followers: 128,
  booksRead: 64,
  mood: "bookish",
};

export const INITIAL_SHELVES: Shelf[] = [
  { id: "sh-reading", name: "Currently Reading", kind: "reading", bookIds: ["b-the-lightkeepers-daughter", "b-the-cartographers-lie"] },
  { id: "sh-want", name: "Want to Read", kind: "want", bookIds: ["b-the-garden-between-stars", "b-letters-from-the-border", "b-the-map-to-nowhere", "b-on-the-light-of-distant-gardens"] },
  { id: "sh-finished", name: "Finished", kind: "finished", bookIds: ["b-the-seamstress-of-tides", "b-letters-from-the-border", "b-hollow-as-thunder"] },
  { id: "sh-favorites", name: "Favorites", kind: "favorites", bookIds: ["b-the-seamstress-of-tides", "b-the-lightkeepers-daughter"] },
  { id: "sh-rainy", name: "Rainy Day Reads", kind: "custom", bookIds: ["b-hollow-as-thunder", "b-coversong"], custom: true },
  { id: "sh-magic", name: "Fantasy Favorites", kind: "custom", bookIds: ["b-the-seamstress-of-tides"], custom: true },
  { id: "sh-reread", name: "Books to Read Again", kind: "custom", bookIds: ["b-bread-and-other-miracles"], custom: true },
];

export const INITIAL_PROGRESS: BookProgress[] = [
  { bookId: "b-the-lightkeepers-daughter", chapterId: "ch-lkd-1", paragraphIndex: 6, progress: 0.32, updatedAt: "2026-09-23T21:12:00Z" },
  { bookId: "b-the-cartographers-lie", chapterId: "ch-tcl-1", paragraphIndex: 3, progress: 0.18, updatedAt: "2026-09-24T08:40:00Z" },
];

export const INITIAL_HIGHLIGHTS: Highlight[] = [
  {
    id: "h-1",
    bookId: "b-the-lightkeepers-daughter",
    chapterId: "ch-lkd-1",
    paragraphIndex: 2,
    text: "the heart keeps its own drafts, and Fenna's had been a private one for so long that she mistook the light for silence",
    color: "gold",
    note: "This is the sentence that made me fall in love with her. 'Mistook the light for silence.'",
    createdAt: "2026-09-22T19:30:00Z",
  },
  {
    id: "h-2",
    bookId: "b-the-lightkeepers-daughter",
    chapterId: "ch-lkd-2",
    paragraphIndex: 1,
    text: "a story assembles itself out of such small gears",
    color: "terracotta",
    createdAt: "2026-09-23T21:40:00Z",
  },
  {
    id: "h-3",
    bookId: "b-the-cartographers-lie",
    chapterId: "ch-tcl-1",
    paragraphIndex: 9,
    text: "It was always the flood. We just pointed it at the water.",
    color: "coffee",
    note: "Put the book down. Chills.",
    createdAt: "2026-09-24T08:55:00Z",
  },
  {
    id: "h-4",
    bookId: "b-the-seamstress-of-tides",
    chapterId: "ch-sot-1",
    paragraphIndex: 0,
    text: "Every tide is a seam mended and let go",
    color: "sage",
    createdAt: "2026-08-14T11:20:00Z",
  },
];

export const INITIAL_STICKER_PLACEMENTS: StickerPlacement[] = [
  { id: "sp-1", stickerId: "s-moon", bookId: "b-the-lightkeepers-daughter", chapterId: "ch-lkd-1", paragraphIndex: 5, createdAt: "2026-09-22T19:35:00Z" },
  { id: "sp-2", stickerId: "s-coffee", bookId: "b-the-cartographers-lie", chapterId: "ch-tcl-1", paragraphIndex: 2, createdAt: "2026-09-24T09:00:00Z" },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    kind: "new_chapter",
    title: "New chapter from Elara Whitfield",
    body: "The Lightkeeper's Daughter, Chapter 5 — 'The Door in the Map' — is now on your shelf.",
    avatar: "EW",
    createdAt: "2026-09-24T07:20:00Z",
    read: false,
    href: "/book/b-the-lightkeepers-daughter",
  },
  {
    id: "n-2",
    kind: "discussion_reply",
    title: "Luna replied to your reaction",
    body: "Luna Marsh replied to 'Y E S. The pocket is an archive…' in The Slow Burn Hollow.",
    avatar: "LM",
    createdAt: "2026-09-23T17:05:00Z",
    read: false,
    href: "/community",
  },
  {
    id: "n-3",
    kind: "publishing_slot",
    title: "Your publishing slot opens soon",
    body: "Your next slot in The Nest for Authors opens in 4 days. Your draft is ready.",
    avatar: "NN",
    createdAt: "2026-09-23T09:00:00Z",
    read: false,
    href: "/publishing",
  },
  {
    id: "n-4",
    kind: "new_recommendation",
    title: "Recommended for you",
    body: "Because you loved 'The Seamstress of Tides' — try 'The Garden Between Stars' by Jun Park.",
    avatar: "JP",
    createdAt: "2026-09-22T12:40:00Z",
    read: true,
    href: "/book/b-the-garden-between-stars",
  },
  {
    id: "n-5",
    kind: "group_activity",
    title: "Stormy Pages is buzzing",
    body: "142 new messages about the group read of 'The Cartographer's Lie' tonight at 8pm.",
    avatar: "SP",
    createdAt: "2026-09-22T08:10:00Z",
    read: true,
    href: "/community",
  },
  {
    id: "n-6",
    kind: "new_follower",
    title: "Jun Park followed you",
    body: "The author of 'The Garden Between Stars' is now following your reading adventures.",
    avatar: "JP",
    createdAt: "2026-09-20T15:30:00Z",
    read: true,
    href: "/authors/a-2",
  },
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    status: "published",
    title: "The Kettle That Sang",
    description:
      "A short story about a lighthouse keeper's kitchen, a stranger's knock, and the weather a small island keeps in its cupboards.",
    genre: "literary-fiction",
    tags: ["lighthouse", "short", "cosy"],
    authorNote: "Written during a week of rain. Dedicated to every kettle that has ever kept someone company.",
    chapters: 2,
    words: 4800,
    cover: { palette: ["#60452f", "#dcc9a7", "#c7a86b", "#30251e"], motif: "lighthouse" },
    createdAt: "2026-06-11T10:00:00Z",
    publishedAt: "2026-06-18T10:00:00Z",
    stats: { readers: 1274, bookmarks: 386, comments: 74, averageReadTime: "9 min" },
  },
  {
    id: "pub-2",
    status: "published",
    title: "Glass Salt",
    description:
      "Six microfictions about a coastal town where the sea occasionally returns what it has taken, careful not to apologise.",
    genre: "short-stories",
    tags: ["microfiction", "coast", "poetic"],
    authorNote: "Each piece is exactly ninety-nine words. I wanted the length to feel like holding your breath.",
    chapters: 1,
    words: 590,
    cover: { palette: ["#7d8b72", "#f3ebdd", "#a56f52", "#30251e"], motif: "waves" },
    createdAt: "2026-04-02T10:00:00Z",
    publishedAt: "2026-04-09T10:00:00Z",
    stats: { readers: 892, bookmarks: 210, comments: 43, averageReadTime: "3 min" },
  },
  {
    id: "pub-3",
    status: "draft",
    title: "The Orchard of Lost Things",
    description: "A novel about a map of a town that only appears in the margins of other maps.",
    genre: "fantasy",
    tags: ["maps", "lost places", "slow"],
    authorNote: "Chapter drafts: 4 of 12. The map keeps rearranging itself when I'm not looking.",
    chapters: 4,
    words: 14200,
    cover: { palette: ["#7d8b72", "#c7a86b", "#30251e", "#f3ebdd"], motif: "tree" },
    createdAt: "2026-08-21T10:00:00Z",
    stats: undefined,
  },
];

export const READING_MOODS = [
  "Rainy and re-reading",
  "Sleepless in a good way",
  "Cozy, tea'd, and sequestered",
  "Holding my breath",
  "Plot-twisted",
  "Under the blankets",
  "Reading like it's a hiding place",
  "In a garden, in a book",
];