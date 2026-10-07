import { Bell, Compass, Feather, Home, Library, MessagesSquare, PenLine, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/shelf", label: "My Shelf", icon: Library },
  { to: "/highlights", label: "Highlights", icon: Feather },
  { to: "/community", label: "Community", icon: MessagesSquare },
  { to: "/publishing", label: "Publishing", icon: PenLine },
  { to: "/profile", label: "Profile", icon: User },
];

export const MOBILE_NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/shelf", label: "Shelf", icon: Library },
  { to: "/highlights", label: "Highlights", icon: Feather },
];

export const MORE_NAV: NavItem[] = [...NAV_ITEMS, { to: "/notifications", label: "Notifications", icon: Bell }]
  .filter((n) => !MOBILE_NAV.some((m) => m.to === n.to))
  .map((n) => (n.to === "/community" ? { ...n, label: "Community & Chat" } : n));