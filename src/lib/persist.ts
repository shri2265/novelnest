/**
 * Tiny localStorage persistence helpers.
 *
 * NovelNest has no remote backend — the browser's localStorage is the app's
 * existing durable store (the reader already keeps its settings there). Profile
 * information, following relationships and reading data ride on the same layer
 * so a signed-in reader keeps everything after a refresh.
 */

export const STORAGE_KEYS = {
  profile: "novelnest.user.profile",
  following: "novelnest.user.following",
  highlights: "novelnest.user.highlights",
  passageBookmarks: "novelnest.user.passageBookmarks",
  shelves: "novelnest.user.shelves",
  bookmarks: "novelnest.user.bookmarks",
  completedAt: "novelnest.user.completedAt",
} as const;

export function loadPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw != null) return JSON.parse(raw) as T;
  } catch {
    // Corrupt or unavailable storage — fall back to the seed value.
  }
  return fallback;
}

export function savePersisted<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (e.g. private mode) — the in-memory state still works.
  }
}
