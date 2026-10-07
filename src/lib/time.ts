export function daypart(iso?: string): string {
  const h = new Date(iso ?? Date.now()).getHours();
  if (h < 5) return "The quiet hours — the story's all yours";
  if (h < 12) return "Good morning — a fresh page for a fresh day";
  if (h < 18) return "Good afternoon — tea and chapters";
  if (h < 22) return "Good evening — find your reading corner";
  return "Late night — the best chapters live here";
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString();
}