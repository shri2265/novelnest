import { Link } from "react-router-dom";
import { BookOpenText } from "lucide-react";

export function Logo({ dark, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="NovelNest home">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-paper transition-transform duration-200 group-hover:-rotate-6 ${
          dark ? "bg-espresso text-gold" : "bg-coffee text-cream"
        }`}
      >
        <BookOpenText className="h-5 w-5" />
      </span>
      <span className={`font-serif text-lg font-semibold tracking-wide ${dark ? "text-ivory" : "text-espresso"}`}>
        Novel<span className={dark ? "text-gold" : "text-terracotta"}>Nest</span>
      </span>
    </Link>
  );
}