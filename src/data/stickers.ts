import type { Sticker, HighlightColorInfo } from "../types";

export const STICKERS: Sticker[] = [
  // Reading
  { id: "s-coffee", name: "Coffee", category: "reading", emoji: "☕", color: "#8a5a41", motif: "coffee" },
  { id: "s-open-book", name: "Open Book", category: "reading", emoji: "📖", color: "#60452f", motif: "openbook" },
  { id: "s-closed-book", name: "Closed Book", category: "reading", emoji: "📕", color: "#a56f52", motif: "closedbook" },
  { id: "s-bookmark", name: "Bookmark", category: "reading", emoji: "🔖", color: "#c7a86b", motif: "bookmark" },
  { id: "s-glasses", name: "Spectacles", category: "reading", emoji: "👓", color: "#7d8b72", motif: "glasses" },
  // Cozy
  { id: "s-candle", name: "Candle", category: "cozy", emoji: "🕯️", color: "#b08d4e", motif: "candle" },
  { id: "s-blanket", name: "Cozy Blanket", category: "cozy", emoji: "🧶", color: "#a56f52", motif: "blanket" },
  { id: "s-tea", name: "Teacup", category: "cozy", emoji: "🍵", color: "#8a5a41", motif: "teacup" },
  { id: "s-rain", name: "Rainy Window", category: "cozy", emoji: "🌧️", color: "#7d8b72", motif: "rain" },
  { id: "s-armchair", name: "Reading Chair", category: "cozy", emoji: "🪑", color: "#60452f", motif: "armchair" },
  // Reactions
  { id: "s-heart", name: "Heart", category: "reactions", emoji: "❤️", color: "#a56f52", motif: "heart" },
  { id: "s-sparkles", name: "Sparkles", category: "reactions", emoji: "✨", color: "#c7a86b", motif: "sparkles" },
  { id: "s-happy", name: "Gleeful", category: "reactions", emoji: "😊", color: "#b08d4e", motif: "happy" },
  { id: "s-cry", name: "Touched", category: "reactions", emoji: "🥹", color: "#a99bc0", motif: "tear" },
  { id: "s-gasp", name: "Gasp", category: "reactions", emoji: "😮", color: "#c7a86b", motif: "gasp" },
  { id: "s-plot", name: "Plot Twist", category: "reactions", emoji: "🌀", color: "#a56f52", motif: "twist" },
  // Nature
  { id: "s-moon", name: "Moon", category: "nature", emoji: "🌙", color: "#c7a86b", motif: "moon" },
  { id: "s-stars", name: "Stars", category: "nature", emoji: "⭐", color: "#b08d4e", motif: "stars" },
  { id: "s-flower", name: "Wildflower", category: "nature", emoji: "🌸", color: "#a99bc0", motif: "flower" },
  { id: "s-plant", name: "Potted Plant", category: "nature", emoji: "🪴", color: "#7d8b72", motif: "plant" },
  { id: "s-leaf", name: "Leaf", category: "nature", emoji: "🍃", color: "#7d8b72", motif: "leaf" },
  { id: "s-snail", name: "Snail", category: "nature", emoji: "🐌", color: "#a56f52", motif: "snail" },
  // Books
  { id: "s-stack", name: "Book Stack", category: "books", emoji: "📚", color: "#60452f", motif: "stack" },
  { id: "s-quill", name: "Quill", category: "books", emoji: "🪶", color: "#8a5a41", motif: "quill" },
  { id: "s-lamp", name: "Study Lamp", category: "books", emoji: "💡", color: "#b08d4e", motif: "lamp" },
  { id: "s-owl", name: "Night Owl", category: "books", emoji: "🦉", color: "#7d8b72", motif: "owl" },
  { id: "s-script", name: "Manuscript", category: "books", emoji: "📜", color: "#dcc9a7", motif: "script" },
  { id: "s-micro", name: "Microphone", category: "books", emoji: "🎤", color: "#60452f", motif: "mic" },
];

export const STICKER_MAP = new Map(STICKERS.map((s) => [s.id, s]));

export const HIGHLIGHT_COLORS: HighlightColorInfo[] = [
  { id: "coffee", name: "Coffee", swatch: "#60452F" },
  { id: "terracotta", name: "Terracotta", swatch: "#A56F52" },
  { id: "sage", name: "Sage", swatch: "#7D8B72" },
  { id: "gold", name: "Gold", swatch: "#C7A86B" },
  { id: "lavender", name: "Lavender", swatch: "#A99BC0" },
];

export const HIGHLIGHT_HEX: Record<HighlightColorInfo["id"], string> = {
  coffee: "#60452F",
  terracotta: "#A56F52",
  sage: "#7D8B72",
  gold: "#C7A86B",
  lavender: "#A99BC0",
};

export function stickerById(id: string): Sticker | undefined {
  return STICKER_MAP.get(id);
}