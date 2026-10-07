import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import type { Group } from "../../types";
import { useNest } from "../../store/NestContext";
import { StickerArt } from "../stickers/StickerArt";

const COVER_TONES: Record<string, string> = {
  rain_window: "#4C4E5A",
  candle: "#8A5A41",
  stars: "#3A3A50",
  openbook: "#60452F",
  quill: "#7D5A3C",
  teacup: "#A56F52",
  stack: "#6B5340",
  moon: "#39405E",
};

export function GroupCard({ group }: { group: Group }) {
  const { joinedGroups, toggleJoinGroup } = useNest();
  const joined = joinedGroups.includes(group.id);

  return (
    <article className="overflow-hidden rounded-2xl border border-parchment-deep/40 bg-ivory shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative h-24" style={{ backgroundColor: COVER_TONES[group.cover] ?? "#60452F" }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <StickerArt motif={group.cover} color="#F3EBDD" className="h-12 w-12" />
        </div>
        <span className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
        {group.online > 0 ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-espresso/60 px-2.5 py-1 text-[10px] font-medium text-cream backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {group.online} online
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-[17px] font-semibold leading-snug text-espresso">{group.name}</h3>
          <button
            type="button"
            onClick={() => toggleJoinGroup(group.id)}
            aria-pressed={joined}
            className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              joined ? "bg-parchment/70 text-coffee-deep" : "bg-coffee text-cream hover:bg-coffee-deep"
            }`}
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-espresso/60">{group.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-espresso/50">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-sage" /> {group.members.toLocaleString()} members
          </span>
          <Link to={`/community?chat=${group.id}`} className="font-medium text-terracotta hover:text-terracotta-deep">
            Open chat →
          </Link>
        </div>
      </div>
    </article>
  );
}