import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  Bookmark,
  ChatMessage,
  Highlight,
  HighlightColor,
  Note,
  Notification,
  Publication,
  PublicationStatus,
  ReaderSettings,
  Shelf,
  ShelfKind,
  StickerPlacement,
  ThemeId,
  User,
} from "../types";
import { CURRENT_USER, INITIAL_COMPLETED, INITIAL_HIGHLIGHTS, INITIAL_NOTIFICATIONS, INITIAL_PROGRESS, INITIAL_PUBLICATIONS, INITIAL_SHELVES, INITIAL_STICKER_PLACEMENTS } from "../data/seed";
import { CHAT_MESSAGES, GROUPS } from "../data/community";
import { BOOKS } from "../data/books";
import { loadPersisted, savePersisted, STORAGE_KEYS } from "../lib/persist";

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 112,
  fontFamily: "serif",
  lineSpacing: 1.8,
  readingWidth: "medium",
  theme: "sepia",
  mode: "pages",
};

const SAVED_SETTINGS_KEY = "novelnest.reader.settings";

function loadSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SAVED_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_READER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_READER_SETTINGS;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function lastPublishedAt(publications: Publication[]): string | undefined {
  const published = publications
    .filter((p) => p.status === "published" && p.publishedAt)
    .sort((a, b) => (a.publishedAt! < b.publishedAt! ? 1 : -1));
  return published[0]?.publishedAt;
}

export function daysUntilSlot(publications: Publication[]): number {
  const last = lastPublishedAt(publications);
  if (!last) return 0;
  const lastDate = new Date(last).getTime();
  const next = lastDate + 7 * 86400000;
  const remaining = Math.ceil((next - Date.now()) / 86400000);
  return Math.max(0, remaining || 0);
}

interface NestValue {
  user: User;
  updateUser: (patch: Partial<User>) => void;
  bookmarks: string[];
  toggleBookmark: (bookId: string) => void;
  isBookmarked: (bookId: string) => boolean;
  shelves: Shelf[];
  addShelf: (name: string, description?: string) => void;
  renameShelf: (id: string, name: string) => void;
  removeShelf: (id: string) => void;
  addToShelf: (shelfId: string, bookId: string) => void;
  removeFromShelf: (shelfId: string, bookId: string) => void;
  moveBook: (bookId: string, kind: ShelfKind) => void;
  shelfOf: (bookId: string) => Shelf | undefined;
  highlights: Highlight[];
  addHighlight: (h: Omit<Highlight, "id" | "createdAt">) => string;
  removeHighlight: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  notes: Note[];
  passageBookmarks: Bookmark[];
  addPassageBookmark: (b: Omit<Bookmark, "id" | "createdAt">) => void;
  removePassageBookmark: (id: string) => void;
  stickerPlacements: StickerPlacement[];
  addStickerPlacement: (p: Omit<StickerPlacement, "id" | "createdAt">) => void;
  removeStickerPlacement: (id: string) => void;
  progress: Record<string, { chapterId: string; paragraphIndex: number; progress: number; updatedAt: string }>;
  setProgressForBook: (bookId: string, chapterId: string, paragraphIndex: number, progress: number) => void;
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  publications: Publication[];
  setPublicationStatus: (id: string, status: PublicationStatus) => void;
  createDraft: (draft: Omit<Publication, "id" | "createdAt" | "status">) => void;
  publishDraft: (id: string) => void;
  daysUntilPublish: number;
  following: string[];
  toggleFollow: (authorId: string) => void;
  isFollowing: (authorId: string) => boolean;
  /** ISO timestamps of when each finished book was completed, keyed by book id. */
  completedAt: Record<string, string>;
  joinedGroups: string[];
  toggleJoinGroup: (groupId: string) => void;
  messagesByGroup: Record<string, ChatMessage[]>;
  sendMessage: (groupId: string, text: string, bookId?: string) => void;
  readerSettings: ReaderSettings;
  updateReaderSettings: (patch: Partial<ReaderSettings>) => void;
  readingMood: string;
  setReadingMood: (mood: string) => void;
}

const NestContext = createContext<NestValue | null>(null);

export function NestProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => loadPersisted(STORAGE_KEYS.profile, CURRENT_USER));
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    loadPersisted(STORAGE_KEYS.bookmarks, ["b-the-seamstress-of-tides", "b-on-the-light-of-distant-gardens"])
  );
  const [shelves, setShelves] = useState<Shelf[]>(() => loadPersisted(STORAGE_KEYS.shelves, INITIAL_SHELVES));
  const [highlights, setHighlights] = useState<Highlight[]>(() => loadPersisted(STORAGE_KEYS.highlights, INITIAL_HIGHLIGHTS));
  const [notes, setNotes] = useState<Note[]>([]);
  const [passageBookmarks, setPassageBookmarks] = useState<Bookmark[]>(() =>
    loadPersisted(STORAGE_KEYS.passageBookmarks, [
      { id: "pb-1", bookId: "b-the-lightkeepers-daughter", chapterId: "ch-sample-b-the-lightkeepers-daughter", paragraphIndex: 0, createdAt: "2026-09-20T19:02:00Z" },
    ])
  );
  const [stickerPlacements, setStickerPlacements] = useState<StickerPlacement[]>(INITIAL_STICKER_PLACEMENTS);
  const [progress, setProgress] = useState<Record<string, { chapterId: string; paragraphIndex: number; progress: number; updatedAt: string }>>(
    Object.fromEntries(INITIAL_PROGRESS.map((p) => [p.bookId, p]))
  );
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [publications, setPublications] = useState<Publication[]>(INITIAL_PUBLICATIONS);
  const [following, setFollowing] = useState<string[]>(() => loadPersisted(STORAGE_KEYS.following, ["a-1", "a-2"]));
  const [completedAt, setCompletedAt] = useState<Record<string, string>>(() => loadPersisted(STORAGE_KEYS.completedAt, INITIAL_COMPLETED));
  const [joinedGroups, setJoinedGroups] = useState<string[]>(GROUPS.filter((g) => g.isJoined).map((g) => g.id));
  const [messagesByGroup, setMessagesByGroup] = useState<Record<string, ChatMessage[]>>(() =>
    CHAT_MESSAGES.reduce<Record<string, ChatMessage[]>>((acc, m) => {
      acc[m.groupId] = [...(acc[m.groupId] ?? []), m];
      return acc;
    }, {})
  );
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(loadSettings);
  const [readingMood, setReadingMoodState] = useState<string>("Rainy and re-reading");

  useEffect(() => {
    localStorage.setItem(SAVED_SETTINGS_KEY, JSON.stringify(readerSettings));
  }, [readerSettings]);

  // Persist the reader's own profile and reading data so it survives refreshes.
  useEffect(() => savePersisted(STORAGE_KEYS.profile, user), [user]);
  useEffect(() => savePersisted(STORAGE_KEYS.bookmarks, bookmarks), [bookmarks]);
  useEffect(() => savePersisted(STORAGE_KEYS.shelves, shelves), [shelves]);
  useEffect(() => savePersisted(STORAGE_KEYS.highlights, highlights), [highlights]);
  useEffect(() => savePersisted(STORAGE_KEYS.passageBookmarks, passageBookmarks), [passageBookmarks]);
  useEffect(() => savePersisted(STORAGE_KEYS.following, following), [following]);
  useEffect(() => savePersisted(STORAGE_KEYS.completedAt, completedAt), [completedAt]);

  // Completion dates follow the "Finished" shelf: recorded when a book joins, dropped when it leaves.
  const markCompleted = useCallback((bookId: string) => {
    setCompletedAt((prev) => (prev[bookId] ? prev : { ...prev, [bookId]: new Date().toISOString() }));
  }, []);

  const unmarkCompleted = useCallback((bookId: string) => {
    setCompletedAt((prev) => {
      if (!prev[bookId]) return prev;
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((bookId: string) => {
    setBookmarks((prev) => (prev.includes(bookId) ? prev.filter((b) => b !== bookId) : [...prev, bookId]));
  }, []);

  const addShelf = useCallback((name: string, description?: string) => {
    setShelves((prev) => [...prev, { id: `sh-${slugify(name)}-${uid()}`, name, description, kind: "custom", bookIds: [], custom: true }]);
  }, []);

  const renameShelf = useCallback((id: string, name: string) => {
    setShelves((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }, []);

  const removeShelf = useCallback((id: string) => {
    setShelves((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addToShelf = useCallback(
    (shelfId: string, bookId: string) => {
      const kind = shelves.find((s) => s.id === shelfId)?.kind;
      setShelves((prev) => prev.map((s) => (s.id === shelfId && !s.bookIds.includes(bookId) ? { ...s, bookIds: [...s.bookIds, bookId] } : s)));
      if (kind === "finished") markCompleted(bookId);
    },
    [shelves, markCompleted]
  );

  const removeFromShelf = useCallback(
    (shelfId: string, bookId: string) => {
      const kind = shelves.find((s) => s.id === shelfId)?.kind;
      setShelves((prev) => prev.map((s) => (s.id === shelfId ? { ...s, bookIds: s.bookIds.filter((b) => b !== bookId) } : s)));
      if (kind === "finished") unmarkCompleted(bookId);
    },
    [shelves, unmarkCompleted]
  );

  const moveBook = useCallback(
    (bookId: string, kind: ShelfKind) => {
      setShelves((prev) =>
        prev.map((s) => {
          if (s.bookIds.includes(bookId)) return { ...s, bookIds: s.bookIds.filter((b) => b !== bookId) };
          if (s.kind === kind && !s.bookIds.includes(bookId)) return { ...s, bookIds: [...s.bookIds, bookId] };
          return s;
        })
      );
      if (kind === "finished") markCompleted(bookId);
      else unmarkCompleted(bookId);
    },
    [markCompleted, unmarkCompleted]
  );

  const shelfOf = useCallback(
    (bookId: string) => shelves.find((s) => s.bookIds.includes(bookId)),
    [shelves]
  );

  const addHighlight = useCallback((h: Omit<Highlight, "id" | "createdAt">) => {
    const id = `h-${uid()}`;
    setHighlights((prev) => [{ ...h, id, createdAt: new Date().toISOString() }, ...prev]);
    return id;
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const addNote = useCallback((note: Omit<Note, "id" | "createdAt">) => {
    setNotes((prev) => [{ ...note, id: `n-${uid()}`, createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const addPassageBookmark = useCallback((b: Omit<Bookmark, "id" | "createdAt">) => {
    setPassageBookmarks((prev) => [
      ...prev.filter((x) => !(x.bookId === b.bookId && x.chapterId === b.chapterId && x.paragraphIndex === b.paragraphIndex)),
      { ...b, id: `pb-${uid()}`, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const removePassageBookmark = useCallback((id: string) => {
    setPassageBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addStickerPlacement = useCallback((p: Omit<StickerPlacement, "id" | "createdAt">) => {
    setStickerPlacements((prev) => [...prev, { ...p, id: `sp-${uid()}`, createdAt: new Date().toISOString() }]);
  }, []);

  const removeStickerPlacement = useCallback((id: string) => {
    setStickerPlacements((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setProgressForBook = useCallback((bookId: string, chapterId: string, paragraphIndex: number, p: number) => {
    setProgress((prev) => ({
      ...prev,
      [bookId]: { chapterId, paragraphIndex, progress: p, updatedAt: new Date().toISOString() },
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const createDraft = useCallback((draft: Omit<Publication, "id" | "createdAt" | "status">) => {
    setPublications((prev) => [...prev, { ...draft, id: `pub-${uid()}`, status: "draft", createdAt: new Date().toISOString(), stats: undefined }]);
  }, []);

  const setPublicationStatus = useCallback((id: string, status: PublicationStatus) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, ...(status === "published" ? { publishedAt: new Date().toISOString() } : {}) } : p))
    );
  }, []);

  const publishDraft = useCallback((id: string) => setPublicationStatus(id, "published"), [setPublicationStatus]);

  const toggleFollow = useCallback((authorId: string) => {
    setFollowing((prev) => (prev.includes(authorId) ? prev.filter((f) => f !== authorId) : [...prev, authorId]));
  }, []);

  const toggleJoinGroup = useCallback((groupId: string) => {
    setJoinedGroups((prev) => (prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]));
  }, []);

  const sendMessage = useCallback((groupId: string, text: string, bookId?: string) => {
    const msg: ChatMessage = {
      id: `m-${uid()}`,
      groupId,
      authorId: CURRENT_USER.id,
      authorName: "You",
      authorAvatar: "NN",
      text,
      createdAt: new Date().toISOString(),
      isMine: true,
      bookId,
    };
    setMessagesByGroup((prev) => ({ ...prev, [groupId]: [...(prev[groupId] ?? []), msg] }));
  }, []);

  const updateReaderSettings = useCallback((patch: Partial<ReaderSettings>) => {
    setReaderSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const setReadingMood = useCallback((mood: string) => {
    setReadingMoodState(mood);
    setUser((u) => ({ ...u, readingMood: mood }));
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => ({ ...u, ...patch }));
  }, []);

  const value = useMemo<NestValue>(
    () => ({
      user,
      updateUser,
      bookmarks,
      toggleBookmark,
      isBookmarked: (bookId: string) => bookmarks.includes(bookId),
      shelves,
      addShelf,
      renameShelf,
      removeShelf,
      addToShelf,
      removeFromShelf,
      moveBook,
      shelfOf,
      highlights,
      addHighlight,
      removeHighlight,
      notes,
      addNote,
      passageBookmarks,
      addPassageBookmark,
      removePassageBookmark,
      stickerPlacements,
      addStickerPlacement,
      removeStickerPlacement,
      progress,
      setProgressForBook,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markNotificationRead,
      markAllNotificationsRead,
      publications,
      setPublicationStatus,
      createDraft,
      publishDraft,
      daysUntilPublish: daysUntilSlot(publications),
      following,
      toggleFollow,
      isFollowing: (authorId: string) => following.includes(authorId),
      completedAt,
      joinedGroups,
      toggleJoinGroup,
      messagesByGroup,
      sendMessage,
      readerSettings,
      updateReaderSettings,
      readingMood,
      setReadingMood,
    }),
    [user, bookmarks, toggleBookmark, shelves, addShelf, renameShelf, removeShelf, addToShelf, removeFromShelf, moveBook, shelfOf, highlights, addHighlight, removeHighlight, notes, addNote, passageBookmarks, addPassageBookmark, removePassageBookmark, stickerPlacements, addStickerPlacement, removeStickerPlacement, progress, setProgressForBook, notifications, markNotificationRead, markAllNotificationsRead, publications, setPublicationStatus, createDraft, publishDraft, following, toggleFollow, completedAt, joinedGroups, toggleJoinGroup, messagesByGroup, sendMessage, readerSettings, updateReaderSettings, readingMood, setReadingMood, updateUser]
  );

  return <NestContext.Provider value={value}>{children}</NestContext.Provider>;
}

export function useNest(): NestValue {
  const ctx = useContext(NestContext);
  if (!ctx) throw new Error("useNest must be used within NestProvider");
  return ctx;
}

export function highlightHex(color: HighlightColor): string {
  switch (color) {
    case "coffee":
      return "#60452F";
    case "terracotta":
      return "#A56F52";
    case "sage":
      return "#7D8B72";
    case "gold":
      return "#C7A86B";
    case "lavender":
      return "#A99BC0";
  }
}

export function themeClass(theme: ThemeId): string {
  switch (theme) {
    case "light":
      return "bg-ivory text-espresso";
    case "sepia":
      return "bg-cream text-coffee";
    case "dark":
      return "bg-[#241b15] text-[#e8dcc8]";
    case "sage":
      return "bg-[#e7e6d4] text-[#3f4438]";
  }
}

export const BOOKS_MAP = new Map(BOOKS.map((b) => [b.id, b]));