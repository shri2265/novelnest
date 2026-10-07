import { AlignJustify, BookOpen, Columns3, Minus, Plus, X } from "lucide-react";
import { useNest } from "../../store/NestContext";
import type { ThemeId } from "../../types";

const THEMES: { id: ThemeId; label: string; preview: string }[] = [
  { id: "light", label: "Light", preview: "bg-ivory text-espresso" },
  { id: "sepia", label: "Sepia", preview: "bg-cream text-coffee" },
  { id: "dark", label: "Dark", preview: "bg-[#241b15] text-[#e8dcc8]" },
  { id: "sage", label: "Sage", preview: "bg-[#e7e6d4] text-[#3f4438]" },
];

const WIDTHS = [
  { id: "narrow", label: "Narrow" },
  { id: "medium", label: "Medium" },
  { id: "wide", label: "Wide" },
] as const;

const SPACINGS = [
  { id: 1.5, label: "Tight" },
  { id: 1.8, label: "Cozy" },
  { id: 2.1, label: "Breezy" },
] as const;

interface ReaderSettingsPanelProps {
  onClose: () => void;
}

export function ReaderSettingsPanel({ onClose }: ReaderSettingsPanelProps) {
  const { readerSettings, updateReaderSettings } = useNest();

  return (
    <div className="border-b border-parchment-deep/40 bg-cream fade-in">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {/* Font size */}
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso/45">
            <BookOpen className="h-3.5 w-3.5" /> Font size
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease font size"
              onClick={() => updateReaderSettings({ fontSize: Math.max(88, readerSettings.fontSize - 6) })}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-parchment-deep/60 hover:bg-parchment/50"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-12 text-center text-sm tabular-nums text-coffee-deep">{readerSettings.fontSize}%</span>
            <button
              type="button"
              aria-label="Increase font size"
              onClick={() => updateReaderSettings({ fontSize: Math.min(144, readerSettings.fontSize + 6) })}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-parchment-deep/60 hover:bg-parchment/50"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-espresso/40">Aa — comfortable for long evenings</p>
        </div>

        {/* Font family + spacing */}
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso/45">
            <AlignJustify className="h-3.5 w-3.5" /> Font & spacing
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateReaderSettings({ fontFamily: "serif" })}
              className={`rounded-lg border px-2 py-1.5 font-serif text-sm ${readerSettings.fontFamily === "serif" ? "border-coffee bg-coffee text-cream" : "border-parchment-deep/60 hover:bg-parchment/40"}`}
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => updateReaderSettings({ fontFamily: "sans" })}
              className={`rounded-lg border px-2 py-1.5 text-sm ${readerSettings.fontFamily === "sans" ? "border-coffee bg-coffee text-cream" : "border-parchment-deep/60 hover:bg-parchment/40"}`}
            >
              Sans
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            {SPACINGS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateReaderSettings({ lineSpacing: s.id })}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium ${readerSettings.lineSpacing === s.id ? "border-coffee bg-coffee text-cream" : "border-parchment-deep/60 hover:bg-parchment/40"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso/45">Theme</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updateReaderSettings({ theme: t.id })}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${
                  readerSettings.theme === t.id ? "border-coffee bg-coffee text-cream" : "border-parchment-deep/60 hover:bg-parchment/40"
                }`}
              >
                <span className={`h-4 w-4 rounded-md border border-espresso/20 ${t.preview.split(" ")[0]}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Width + mode */}
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso/45">
            <Columns3 className="h-3.5 w-3.5" /> Reading width
          </p>
          <div className="mt-2 flex gap-2">
            {WIDTHS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => updateReaderSettings({ readingWidth: w.id })}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium ${readerSettings.readingWidth === w.id ? "border-coffee bg-coffee text-cream" : "border-parchment-deep/60 hover:bg-parchment/40"}`}
              >
                {w.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-espresso/45">View mode</p>
          <div className="mt-2 flex gap-2">
            {(["pages", "scroll"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => updateReaderSettings({ mode: m })}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium capitalize ${readerSettings.mode === m ? "border-coffee bg-coffee text-cream" : "border-parchment-deep/60 hover:bg-parchment/40"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl items-center justify-between pb-4 px-4 sm:px-8">
        <p className="text-[11px] italic text-espresso/45">“Reading is a partnership between the book and the lamp.”</p>
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-full bg-coffee px-3.5 py-1.5 text-xs font-medium text-cream hover:bg-coffee-deep">
          <X className="h-3.5 w-3.5" /> Done
        </button>
      </div>
    </div>
  );
}