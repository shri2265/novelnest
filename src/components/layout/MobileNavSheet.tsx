import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useNest } from "../../store/NestContext";
import { Logo } from "./Logo";
import { Avatar } from "../ui/Avatar";
import { MOBILE_NAV, MORE_NAV } from "./nav";

interface MobileNavSheetProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavSheet({ open, onClose }: MobileNavSheetProps) {
  const { user } = useNest();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" className="absolute inset-0 bg-espresso/40" onClick={onClose} aria-label="Close menu" tabIndex={-1} />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto paper bg-ivory shadow-lift fade-in">
        <div className="flex items-center justify-between px-5 pb-2 pt-6">
          <Logo />
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-coffee hover:bg-parchment/50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-3 space-y-0.5 px-3" aria-label="Mobile menu">
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-coffee text-cream" : "text-coffee-deep hover:bg-parchment/60"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          <div className="my-2 border-t border-parchment-deep/40" />
          {MORE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-coffee text-cream" : "text-coffee-deep hover:bg-parchment/60"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-parchment-deep/40 p-5">
          <Avatar label={user.avatar} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-espresso">{user.displayName}</p>
            <p className="truncate text-xs text-espresso/55">@{user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}