import { useState } from "react";
import { Check, Eye, FileUp, Palette, Send } from "lucide-react";
import { GENRES } from "../../data/genres";
import { Button } from "../ui/Button";
import { BookCover } from "../ui/BookCover";
import type { CoverSpec } from "../../types";

const PALETTES: CoverSpec["palette"][] = [
  ["#60452f", "#dcc9a7", "#c7a86b", "#30251e"],
  ["#7d8b72", "#f3ebdd", "#a56f52", "#30251e"],
  ["#a56f52", "#f3ebdd", "#7d8b72", "#30251e"],
  ["#30251e", "#60452f", "#a56f52", "#f3ebdd"],
  ["#dcc9a7", "#60452f", "#a56f52", "#30251e"],
];

const MOTIFS = ["lighthouse", "tree", "map", "star", "compass", "letter", "moon", "thread", "wheat", "house", "waves", "openbook"];

export interface PublicationDraft {
  title: string;
  description: string;
  genre: string;
  tags: string[];
  authorNote: string;
  cover: CoverSpec;
  chapters: number;
  words: number;
  manuscript: string;
}

interface PublicationFormProps {
  onSubmit: (draft: PublicationDraft, publish: boolean) => void;
  slotAvailable: boolean;
  compact?: boolean;
}

export function PublicationForm({ onSubmit, slotAvailable, compact }: PublicationFormProps) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("fantasy");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [authorNote, setAuthorNote] = useState("");
  const [chapters, setChapters] = useState(1);
  const [words, setWords] = useState(800);
  const [manuscript, setManuscript] = useState("");
  const [palette, setPalette] = useState(0);
  const [motif, setMotif] = useState("lighthouse");
  const [previewing, setPreviewing] = useState(false);

  const cover: CoverSpec = { palette: PALETTES[palette], motif, initial: title ? title[0] : "N" };

  const saveAs = (publish: boolean) => {
    onSubmit(
      {
        title: title.trim() || "Untitled Story",
        description: description.trim() || "A story with no description yet — the words will have to speak for themselves.",
        genre,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        authorNote: authorNote.trim() || "Written by hand, offered with the door open.",
        cover,
        chapters: Math.max(1, chapters),
        words: Math.max(1, words),
        manuscript,
      },
      publish
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveAs(false);
      }}
      className="grid gap-6 lg:grid-cols-[1fr_240px]"
    >
      <div className={`space-y-5 rounded-3xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper sm:p-6 ${compact ? "lg:max-w-2xl" : ""}`}>
        <div>
          <label className="text-sm font-semibold text-espresso">Story title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The name it will keep on the shelf…"
            className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 font-serif text-lg text-espresso placeholder:font-sans placeholder:text-base placeholder:text-espresso/35 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-espresso">
            Genre
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none"
            >
              {GENRES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-espresso">
            Tags
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="lighthouse, slow-burn, cosy"
              className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-coffee focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-espresso">
            Chapters
            <input
              type="number"
              min={1}
              max={99}
              value={chapters}
              onChange={(e) => setChapters(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-espresso">
            Approx. word count
            <input
              type="number"
              min={1}
              value={words}
              onChange={(e) => setWords(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-espresso">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What should the reader expect at the door?"
            className="mt-1.5 w-full resize-none rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
          />
        </label>

        <label className="block text-sm font-semibold text-espresso">
          Author's note
          <textarea
            value={authorNote}
            onChange={(e) => setAuthorNote(e.target.value)}
            rows={2}
            placeholder="A note to the people who picked up your story…"
            className="mt-1.5 w-full resize-none rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
          />
        </label>

        <label className="block text-sm font-semibold text-espresso">
          Manuscript
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-parchment-deep/70 bg-parchment/30 px-4 py-3.5 text-sm text-coffee-deep transition-colors hover:bg-parchment/50">
              <FileUp className="h-5 w-5 text-terracotta" />
              <input
                type="file"
                accept=".txt,.md,.epub,.pdf"
                className="hidden"
                onChange={(e) => setManuscript(e.target.files?.[0]?.name ?? "")}
              />
              <span className="truncate">{manuscript || "Upload your manuscript — .txt, .md, .epub or .pdf"}</span>
            </label>
            <span className="text-[11px] text-espresso/45">Drafts are saved to your nest, not shipped anywhere.</span>
          </div>
        </label>
      </div>

      <aside className="space-y-5">
        <div className="rounded-3xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso/45">
            <Palette className="h-3.5 w-3.5 text-terracotta" /> Cover
          </p>
          <div className="mx-auto mt-3 w-36">
            <BookCover cover={cover} title={title || "Untitled Story"} className="rounded-xl shadow-paper" />
          </div>
          <p className="mt-3 text-[11px] font-medium text-espresso/50">Palette</p>
          <div className="mt-1.5 flex gap-2">
            {PALETTES.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPalette(i)}
                aria-label={`Palette ${i + 1}`}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${palette === i ? "scale-110 border-espresso" : "border-transparent hover:scale-105"}`}
                style={{ backgroundColor: p[0] }}
              />
            ))}
          </div>
          <p className="mt-3 text-[11px] font-medium text-espresso/50">Motif</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MOTIFS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMotif(m)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-medium capitalize transition-colors ${
                  motif === m ? "bg-coffee text-cream" : "bg-parchment/50 text-coffee-deep hover:bg-parchment"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button type="button" variant="secondary" icon={Eye} onClick={() => setPreviewing((p) => !p)} full>
            {previewing ? "Close preview" : "Preview"}
          </Button>
          <Button type="submit" variant="soft" icon={Check} full>
            Save as draft
          </Button>
          <Button
            type="button"
            variant="gold"
            icon={Send}
            full
            disabled={!slotAvailable}
            onClick={() => saveAs(true)}
            title={slotAvailable ? "Publish to the Nest" : "Your publishing slot opens soon"}
          >
            {slotAvailable ? "Publish now" : "Slot opening soon"}
          </Button>
          {!slotAvailable ? (
            <p className="text-center text-[11px] leading-relaxed text-espresso/50">
              One publication per week, kept gently. You'll be able to publish as soon as your slot opens.
            </p>
          ) : null}
        </div>

        {previewing ? (
          <div className="rounded-3xl border border-parchment-deep/40 bg-cream/70 p-5 fade-in">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-espresso/45">How the nest will introduce it</p>
            <p className="mt-2 font-serif text-lg font-semibold text-espresso">{title || "Untitled Story"}</p>
            <p className="mt-1 text-xs text-espresso/60">{description || "The words will have to speak for themselves."}</p>
            <p className="mt-2 text-xs italic text-espresso/50">“{authorNote || "Written by hand, offered with the door open."}”</p>
          </div>
        ) : null}
      </aside>
    </form>
  );
}