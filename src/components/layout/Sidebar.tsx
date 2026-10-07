import { NavLink } from "react-router-dom";
import { useNest } from "../../store/NestContext";
import { Logo } from "./Logo";
import { Avatar } from "../ui/Avatar";
import { NAV_ITEMS } from "./nav";
import { getBook } from "../../data/books";
import { BookCover } from "../ui/BookCover";
import { ProgressBar } from "../ui/ProgressBar";

export function Sidebar() {
  const { user, progress } = useNest();
  const reading = Object.keys(progress)[0];
  const book = reading ? getBook(reading) : undefined;
  const p = reading ? progress[reading] : undefined;
  const dayNumber = Math.floor(Date.now() / 86400000);
  const streak = 5 + (dayNumber % 3);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-parchment-deep/40 bg-ivory/95 paper lg:flex">
      <div className="px-5 pb-2 pt-6">
        <Logo />
      </div>

      <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-coffee text-cream shadow-paper"
                  : "text-coffee-deep hover:bg-parchment/50 active:scale-[0.98]"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5">
        <div className="rounded-2xl border border-parchment-deep/40 bg-cream p-3.5">
          {book ? (
            <>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-espresso/45">Still reading</p>
              <div className="flex gap-3">
                <div className="w-12 shrink-0">
                  <BookCover cover={book.cover} title={book.title} className="rounded-md" />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-espresso">{book.title}</p>
                  <p className="text-[11px] text-espresso/55">{book.authorName}</p>
                  {p ? (
                    <div className="mt-2">
                      <ProgressBar progress={p.progress} />
                      <p className="mt-1 text-[10px] text-espresso/45">{Math.round(p.progress * 100)}% complete</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-espresso/55">Pick up a book and it will nest here.</p>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-full bg-parchment/50 px-4 py-2">
          <span className="text-[11px] font-medium text-coffee-deep">Reading streak</span>
          <span className="font-serif text-sm font-semibold text-terracotta">{streak} days</span>
        </div>
        <div className="mt-3 flex items-center gap-2.5 px-1.5">
          <Avatar label={user.avatar} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-espresso">{user.displayName}</p>
            <p className="truncate text-[11px] text-espresso/50">{user.readingMood}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}