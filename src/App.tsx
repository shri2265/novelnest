import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/Home";
import { ExplorePage } from "./pages/Explore";
import { BookDetailPage } from "./pages/BookDetail";
import { ReaderPage } from "./pages/Reader";
import { ShelfPage } from "./pages/Shelf";
import { HighlightsPage } from "./pages/Highlights";
import { CommunityPage } from "./pages/Community";
import { PublishingPage } from "./pages/Publishing";
import { AuthorProfilePage } from "./pages/AuthorProfile";
import { ProfilePage } from "./pages/Profile";
import { NotificationsPage } from "./pages/Notifications";
import { SettingsPage } from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/book/:bookId" element={<BookDetailPage />} />
        <Route path="/shelf" element={<ShelfPage />} />
        <Route path="/highlights" element={<HighlightsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/publishing" element={<PublishingPage />} />
        <Route path="/authors/:authorId" element={<AuthorProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/read/:bookId" element={<ReaderPage />} />
    </Routes>
  );
}