import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { MOBILE_NAV } from "./nav";
import { MobileNavSheet } from "./MobileNavSheet";

export function MobileBottomNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-parchment-deep/40 bg-ivory/95 backdrop-blur-sm lg:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-w-[60px] flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-terracotta" : "text-espresso/55 hover:text-coffee"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-w-[60px] flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-espresso/55 transition-colors hover:text-coffee"
            aria-label="More menu"
          >
            <MoreHorizontal className="h-5 w-5" />
            More
          </button>
        </div>
      </nav>
      <MobileNavSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}