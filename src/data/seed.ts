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
  { id: "sh-finished", name: "Finished", kind: "finished", bookIds: ["b-the-seamstress-of-tides", "b-letters-from-the-border", "b-hollow-as-thunder", "b-the-weight-of-july", "b-house-of-cartwheels"] },
  { id: "sh-favorites", name: "Favorites", kind: "favorites", bookIds: ["b-the-seamstress-of-tides", "b-the-lightkeepers-daughter"] },
  { id: "sh-rainy", name: "Rainy Day Reads", kind: "custom", bookIds: ["b-hollow-as-thunder", "b-coversong"], custom: true },
  { id: "sh-magic", name: "Fantasy Favorites", kind: "custom", bookIds: ["b-the-garden-between-stars"], custom: true },
  { id: "sh-reread", name: "Books to Read Again", kind: "custom", bookIds: ["b-bread-and-other-miracles"], custom: true },
];

/** When each finished book was completed, so the "Books read" list can sort by recency. */
export const INITIAL_COMPLETED: Record<string, string> = {
  "b-the-seamstress-of-tides": "2026-09-14T20:15:00Z",
  "b-letters-from-the-border": "2026-08-30T22:40:00Z",
  "b-hollow-as-thunder": "2026-08-08T18:05:00Z",
  "b-the-weight-of-july": "2026-07-19T21:30:00Z",
  "b-house-of-cartwheels": "2026-06-28T23:10:00Z",
};

export const INITIAL_PROGRESS: BookProgress[] = [
  { bookId: "b-the-lightkeepers-daughter", chapterId: "ch-sample-b-the-lightkeepers-daughter", paragraphIndex: 2, progress: 0.32, updatedAt: "2026-09-23T21:12:00Z" },
  { bookId: "b-the-cartographers-lie", chapterId: "ch-sample-b-the-cartographers-lie", paragraphIndex: 2, progress: 0.18, updatedAt: "2026-09-24T08:40:00Z" },
];

export const INITIAL_HIGHLIGHTS: Highlight[] = [
  {
    id: "h-1",
    bookId: "b-the-lightkeepers-daughter",
    chapterId: "ch-sample-b-the-lightkeepers-daughter",
    paragraphIndex: 2,
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    color: "gold",
    note: "The opening line of the whole novel. Ruthless, perfect, and funnier every time.",
    createdAt: "2026-09-22T19:30:00Z",
  },
  {
    id: "h-2",
    bookId: "b-the-lightkeepers-daughter",
    chapterId: "ch-sample-b-the-lightkeepers-daughter",
    paragraphIndex: 2,
    text: "I could easily forgive his pride, if he had not mortified mine.",
    color: "terracotta",
    createdAt: "2026-09-23T21:40:00Z",
  },
  {
    id: "h-3",
    bookId: "b-the-cartographers-lie",
    chapterId: "ch-sample-b-the-cartographers-lie",
    paragraphIndex: 2,
    text: "The impossible cannot have happened, therefore the impossible must be possible in spite of appearances.",
    color: "coffee",
    note: "Poirot's entire method in one patient sentence.",
    createdAt: "2026-09-24T08:55:00Z",
  },
  {
    id: "h-4",
    bookId: "b-the-weight-of-july",
    chapterId: "ch-sample-b-the-weight-of-july",
    paragraphIndex: 2,
    text: "For now she need not think about anybody. She could be herself, by herself.",
    color: "sage",
    createdAt: "2026-08-14T11:20:00Z",
  },
];

export const INITIAL_STICKER_PLACEMENTS: StickerPlacement[] = [
  { id: "sp-1", stickerId: "s-moon", bookId: "b-the-lightkeepers-daughter", chapterId: "ch-sample-b-the-lightkeepers-daughter", paragraphIndex: 0, createdAt: "2026-09-22T19:35:00Z" },
  { id: "sp-2", stickerId: "s-coffee", bookId: "b-the-cartographers-lie", chapterId: "ch-sample-b-the-cartographers-lie", paragraphIndex: 3, createdAt: "2026-09-24T09:00:00Z" },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    kind: "new_recommendation",
    title: "New in the Nest: Jane Austen",
    body: "'Pride and Prejudice' is waiting on your shelf — the enduring comedy of Elizabeth Bennet and Mr Darcy.",
    avatar: "JA",
    createdAt: "2026-09-24T07:20:00Z",
    read: false,
    href: "/book/b-the-lightkeepers-daughter",
  },
  {
    id: "n-2",
    kind: "discussion_reply",
    title: "Luna replied to your reaction",
    body: "Luna Marsh replied to 'Y E S. The letter is the second confession…' in The Slow Burn Hollow.",
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
    body: "Because you loved 'To the Lighthouse' — try 'Mrs Dalloway' by Virginia Woolf.",
    avatar: "VW",
    createdAt: "2026-09-22T12:40:00Z",
    read: true,
    href: "/book/b-house-of-cartwheels",
  },
  {
    id: "n-5",
    kind: "group_activity",
    title: "Stormy Pages is buzzing",
    body: "142 new messages about the group read of 'Murder on the Orient Express' tonight at 8pm.",
    avatar: "SP",
    createdAt: "2026-09-22T08:10:00Z",
    read: true,
    href: "/community",
  },
  {
    id: "n-6",
    kind: "new_follower",
    title: "Ursula K. Le Guin followed you",
    body: "The author of 'A Wizard of Earthsea' is now following your reading adventures.",
    avatar: "UL",
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