import { useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppLayout() {
  const location = useLocation();
  const isReader = location.pathname.startsWith("/read/");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  if (isReader) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-60">
        <TopHeader />
        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}