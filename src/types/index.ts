export type ThemeId = "light" | "sepia" | "dark" | "sage";
export type ShelfKind = "reading" | "want" | "finished" | "favorites" | "custom";
export type HighlightColor = "coffee" | "terracotta" | "sage" | "gold" | "lavender";

export interface User {
  id: string;
  username: string;
  handle: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  joined: string;
  readingMood: string;
  favoriteQuote: string;
  favoriteQuoteSource: string;
  following: string[];
  followers: number;
  booksRead: number;
  mood: string;
}

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  stories: number;
  totalReaders: number;
  favoriteQuote: string;
  genres: string[];
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  genres: string[];
  description: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  readers: number;
  bookmarkCount: number;
  publishedAt: string;
  pages: number;
  quote: string;
  cover: CoverSpec;
  isOriginal?: boolean;
}

export interface CoverSpec {
  palette: string[];
  motif: string;
  initial?: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  content: string[];
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  page?: string;
  label?: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  startIndex?: number;
  text: string;
  color: HighlightColor;
  note?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  text: string;
  createdAt: string;
}

export interface Sticker {
  id: string;
  name: string;
  category: StickerCategory;
  emoji: string;
  color: string;
  motif: string;
}

export type StickerCategory = "reading" | "cozy" | "reactions" | "nature" | "books";

export interface StickerPlacement {
  id: string;
  stickerId: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  createdAt: string;
}

export interface Shelf {
  id: string;
  name: string;
  description?: string;
  kind: ShelfKind;
  bookIds: string[];
  custom?: boolean;
}

export interface GenreTag {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface DiscussionReaction {
  emoji: string;
  count: number;
  mine?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  mine?: boolean;
}

export interface Discussion {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  body: string;
  excerpt?: string;
  pinned?: boolean;
  spoiler?: boolean;
  bookId?: string;
  reactions: DiscussionReaction[];
  commentCount: number;
  createdAt: string;
  tags?: string[];
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
  };
}

export interface Comment {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  reactions: DiscussionReaction[];
  createdAt: string;
  replies?: Comment[];
  spoiler?: boolean;
  bookId?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  online: number;
  cover: string;
  genres?: string[];
  isJoined?: boolean;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  reactions?: DiscussionReaction[];
  bookId?: string;
  isMine?: boolean;
  system?: boolean;
}

export type PublicationStatus = "draft" | "scheduled" | "published" | "review";

export interface Publication {
  id: string;
  status: PublicationStatus;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  authorNote: string;
  chapters: number;
  words: number;
  cover?: CoverSpec;
  createdAt: string;
  publishedAt?: string;
  stats?: {
    readers: number;
    bookmarks: number;
    comments: number;
    averageReadTime: string;
  };
}

export type NotificationKind =
  | "new_chapter"
  | "bookmark_story"
  | "discussion_reply"
  | "new_follower"
  | "group_activity"
  | "publishing_slot"
  | "new_recommendation";

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  avatar?: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface ReaderSettings {
  fontSize: number;
  fontFamily: "serif" | "sans";
  lineSpacing: 1.5 | 1.8 | 2.1;
  readingWidth: "narrow" | "medium" | "wide";
  theme: ThemeId;
  mode: "pages" | "scroll";
}

export interface HighlightColorInfo {
  id: HighlightColor;
  name: string;
  swatch: string;
}

export interface BookProgress {
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  progress: number;
  updatedAt: string;
}