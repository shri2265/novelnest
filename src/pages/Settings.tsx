import { useState } from "react";
import { Accessibility, Bell, Contrast, Eye, Palette, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNest } from "../store/NestContext";
import { themeClass } from "../store/NestContext";
import { READING_MOODS } from "../data/seed";
import { Button } from "../components/ui/Button";
import { toast } from "../lib/toast";

type Tab = "account" | "appearance" | "reading" | "notifications" | "privacy" | "accessibility";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "account", label: "Account", icon: Eye },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "reading", label: "Reading preferences", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Contrast },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
];

function Toggle({ label, desc, on, onToggle }: { label: string; desc?: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-espresso">{label}</p>
        {desc ? <p className="text-xs text-espresso/50">{desc}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-sage" : "bg-parchment-deep/50"}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-ivory shadow-paper transition-all ${on ? "left-[1.375rem]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

const THEME_PREVIEWS = ["light", "sepia", "dark", "sage"] as const;

export function SettingsPage() {
  const { user, updateUser, readerSettings, updateReaderSettings, readingMood, setReadingMood } = useNest();
  const [tab, setTab] = useState<Tab>("account");
  const [form, setForm] = useState({ displayName: user.displayName, username: user.username, location: user.location, bio: user.bio });
  const [notifPrefs, setNotifPrefs] = useState({ newChapters: true, replies: true, followers: true, groupActivity: true, publishing: true, recommendations: true });
  const [privacyPrefs, setPrivacyPrefs] = useState({ publicProfile: true, showActivity: true, showReadingMood: true });
  const [a11yPrefs, setA11yPrefs] = useState({ reducedMotion: false, highContrast: false, underlineLinks: false });

  const saveAccount = () => {
    const username = form.username.trim() || user.username;
    updateUser({
      displayName: form.displayName.trim() || user.displayName,
      username,
      handle: `@${username.replace(/^@/, "")}`,
      location: form.location,
      bio: form.bio,
    });
    toast("Profile updated. The shelf looks lovely.");
  };

  return (
    <div className="max-w-4xl space-y-6 pb-4">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-espresso">Settings</h1>
        <p className="mt-1 text-sm text-espresso/60">Tend your account, your lamp's glow, and how the nest behaves.</p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-coffee text-cream" : "bg-ivory text-coffee-deep hover:bg-parchment/50"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-parchment-deep/40 bg-ivory p-6 shadow-paper sm:p-8">
        {tab === "account" ? (
          <div className="space-y-4 max-w-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-espresso">
                Display name
                <input value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20" />
              </label>
              <label className="block text-sm font-semibold text-espresso">
                Username
                <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20" />
              </label>
            </div>
            <label className="block text-sm font-semibold text-espresso">
              Location
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20" />
            </label>
            <label className="block text-sm font-semibold text-espresso">
              Bio
              <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20" />
            </label>
            <Button variant="primary" onClick={saveAccount}>Save changes</Button>
          </div>
        ) : null}

        {tab === "appearance" ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso/45">Reader theme</p>
              <p className="mt-1 text-sm text-espresso/60 mb-3">The lamp you read by. Applied across books in the reader.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {THEME_PREVIEWS.map((t) => (
                  <button key={t} type="button" onClick={() => updateReaderSettings({ theme: t })} className={`rounded-2xl border-2 p-3 text-left transition-all ${readerSettings.theme === t ? "border-coffee shadow-lift" : "border-parchment-deep/40 hover:border-parchment"}`}>
                    <div className={`flex h-20 items-center justify-center rounded-xl px-3 ${themeClass(t)}`}>
                      <div className="w-full space-y-1">
                        <div className="h-1.5 w-3/4 rounded-full bg-current opacity-40" />
                        <div className="h-1.5 w-full rounded-full bg-current opacity-25" />
                        <div className="h-1.5 w-2/3 rounded-full bg-current opacity-25" />
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium capitalize text-espresso">{t}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-parchment-deep/30 pt-4">
              <div>
                <p className="text-sm font-medium text-espresso">Default serif in the reader</p>
                <p className="text-xs text-espresso/50">When a book doesn't set its own typeface</p>
              </div>
              {/* placeholder — typeface per book handled in reader */}
              <span className="rounded-full bg-parchment/60 px-3 py-1 text-xs text-coffee-deep">Book-defined</span>
            </div>
          </div>
        ) : null}

        {tab === "reading" ? (
          <div className="space-y-6 max-w-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso/45">Reading mood</p>
              <p className="mt-0.5 text-sm text-espresso/60">Shown on your profile, like weather for bookish feelings.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {READING_MOODS.map((m) => (
                  <button key={m} type="button" onClick={() => setReadingMood(m)} className={`rounded-full px-3 py-1.5 text-xs transition-colors ${readingMood === m ? "bg-coffee text-cream" : "bg-parchment/50 text-coffee-deep hover:bg-parchment"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-espresso">
                Default font
                <select value={readerSettings.fontFamily} onChange={(e) => updateReaderSettings({ fontFamily: e.target.value as "serif" | "sans" })} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none">
                  <option value="serif">Serif — Playfair Display</option>
                  <option value="sans">Sans — Inter</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-espresso">
                Page or parchment width
                <select value={readerSettings.readingWidth} onChange={(e) => updateReaderSettings({ readingWidth: e.target.value as "narrow" | "medium" | "wide" })} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none">
                  <option value="narrow">Narrow</option>
                  <option value="medium">Medium</option>
                  <option value="wide">Wide</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-espresso">
                Line spacing
                <select value={readerSettings.lineSpacing} onChange={(e) => updateReaderSettings({ lineSpacing: Number(e.target.value) as 1.5 | 1.8 | 2.1 })} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none">
                  <option value={1.5}>Loosened · 1.5</option>
                  <option value={1.8}>Comfy · 1.8</option>
                  <option value={2.1}>Airy · 2.1</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-espresso">
                Reading mode
                <select value={readerSettings.mode} onChange={(e) => updateReaderSettings({ mode: e.target.value as "pages" | "scroll" })} className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none">
                  <option value="pages">Pages</option>
                  <option value="scroll">Continuous scroll</option>
                </select>
              </label>
            </div>
            <Button variant="primary" onClick={() => toast("Reader preferences saved. The lamp glows a little warmer.")}>Save preferences</Button>
          </div>
        ) : null}

        {tab === "notifications" ? (
          <div className="max-w-xl divide-y divide-parchment-deep/30">
            <Toggle label="New chapters & updates" desc="Authors you follow extend their stories" on={notifPrefs.newChapters} onToggle={() => setNotifPrefs((p) => ({ ...p, newChapters: !p.newChapters }))} />
            <Toggle label="Replies & reactions" desc="On your comments and discussion threads" on={notifPrefs.replies} onToggle={() => setNotifPrefs((p) => ({ ...p, replies: !p.replies }))} />
            <Toggle label="New followers" desc="When someone begins following your nest" on={notifPrefs.followers} onToggle={() => setNotifPrefs((p) => ({ ...p, followers: !p.followers }))} />
            <Toggle label="Group activity" desc="Your groups' chats and events" on={notifPrefs.groupActivity} onToggle={() => setNotifPrefs((p) => ({ ...p, groupActivity: !p.groupActivity }))} />
            <Toggle label="Publishing slots" desc="Reminders when The Nest for Authors opens" on={notifPrefs.publishing} onToggle={() => setNotifPrefs((p) => ({ ...p, publishing: !p.publishing }))} />
            <Toggle label="Recommendations" desc="Quiet suggestions written for your shelf" on={notifPrefs.recommendations} onToggle={() => setNotifPrefs((p) => ({ ...p, recommendations: !p.recommendations }))} />
          </div>
        ) : null}

        {tab === "privacy" ? (
          <div className="max-w-xl divide-y divide-parchment-deep/30">
            <Toggle label="Public profile" desc="Anyone on NovelNest can see your reading" on={privacyPrefs.publicProfile} onToggle={() => setPrivacyPrefs((p) => ({ ...p, publicProfile: !p.publicProfile }))} />
            <Toggle label="Show reading activity" desc="Highlights and notes appear on your profile" on={privacyPrefs.showActivity} onToggle={() => setPrivacyPrefs((p) => ({ ...p, showActivity: !p.showActivity }))} />
            <Toggle label="Show reading mood" desc="Your current mood is written under your name" on={privacyPrefs.showReadingMood} onToggle={() => setPrivacyPrefs((p) => ({ ...p, showReadingMood: !p.showReadingMood }))} />
          </div>
        ) : null}

        {tab === "accessibility" ? (
          <div className="max-w-xl divide-y divide-parchment-deep/30">
            <Toggle label="Reduce motion" desc="Gentler transitions while you read" on={a11yPrefs.reducedMotion} onToggle={() => setA11yPrefs((p) => ({ ...p, reducedMotion: !p.reducedMotion }))} />
            <Toggle label="High contrast reader" desc="Sharper ink, dimmer paper" on={a11yPrefs.highContrast} onToggle={() => setA11yPrefs((p) => ({ ...p, highContrast: !p.highContrast }))} />
            <Toggle label="Underline links" desc="Draw attention to navigate-able text" on={a11yPrefs.underlineLinks} onToggle={() => setA11yPrefs((p) => ({ ...p, underlineLinks: !p.underlineLinks }))} />
          </div>
        ) : null}
      </div>
    </div>
  );
}