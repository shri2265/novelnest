import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { useNest } from "../../store/NestContext";
import { Logo } from "./Logo";
import { Avatar } from "../ui/Avatar";
import { MobileNavSheet } from "./MobileNavSheet";

export function TopHeader() {
  const { user, unreadCount, readingMood } = useNest();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-parchment-deep/40 bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-coffee transition-colors hover:bg-parchment/50 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="relative hidden flex-1 max-w-md lg:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              placeholder="Search books, authors, genres…"
              className="h-10 w-full rounded-full border border-parchment-deep/50 bg-ivory pl-10 pr-4 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
            />
          </div>

          <div className="ms-auto flex items-center gap-1.5 lg:ms-6">
            <Link
              to="/notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-coffee transition-colors hover:bg-parchment/50"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold text-cream">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
            <Link to="/profile" className="hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-parchment/50 sm:flex" aria-label="Profile">
              <Avatar label={user.avatar} src={user.avatarImage} size="sm" alt={user.displayName} />
              <span className="hidden text-xs text-espresso/60 md:block">{readingMood}</span>
            </Link>
            <Link to="/profile" className="inline-flex h-10 w-10 items-center justify-center rounded-xl sm:hidden" aria-label="Profile">
              <Avatar label={user.avatar} src={user.avatarImage} size="sm" alt={user.displayName} />
            </Link>
          </div>
        </div>
      </header>
      <MobileNavSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}