import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Check, Copy, Heart, Library, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { Shelf, ShelfKind } from "../types";
import { useNest } from "../store/NestContext";
import { getBook } from "../data/books";
import { BookCover } from "../components/ui/BookCover";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ProgressBar } from "../components/ui/ProgressBar";
import { toast } from "../lib/toast";

const KIND_ICON: Record<ShelfKind, LucideIcon> = {
  reading: BookOpen,
  want: Copy,
  finished: Check,
  favorites: Heart,
  custom: Library,
};

const KIND_LABEL: Record<ShelfKind, string> = {
  reading: "Currently Reading",
  want: "Want to Read",
  finished: "Finished",
  favorites: "Favorites",
  custom: "Custom shelf",
};

export function ShelfSection({
  shelf,
  editable,
  onRename,
  onDelete,
  onRemove,
  onMove,
}: {
  shelf: Shelf;
  editable?: boolean;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  onRemove?: (shelfId: string, bookId: string) => void;
  onMove?: (shelfId: string, bookId: string, kind: ShelfKind) => void;
}) {
  const { progress } = useNest();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(shelf.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = KIND_ICON[shelf.kind];

  const books = shelf.bookIds.map(getBook).filter((b) => b !== undefined);

  return (
    <section className="rounded-3xl border border-parchment-deep/40 bg-ivory p-5 shadow-paper sm:p-6" aria-label={shelf.name}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-parchment/60 text-terracotta">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {editing && editable ? (
              <form
                className="flex items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name.trim()) {
                    onRename?.(name.trim());
                    setEditing(false);
                    toast("Shelf renamed.");
                  }
                }}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 w-44 rounded-lg border border-parchment-deep/60 bg-cream px-2 text-sm text-espresso focus:border-coffee focus:outline-none"
                  aria-label="Shelf name"
                />
                <button type="submit" className="rounded-md bg-coffee px-2 py-1 text-xs font-medium text-cream" aria-label="Save name">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => setEditing(false)} className="rounded-md p-1 text-espresso/50 hover:bg-parchment/50" aria-label="Cancel">
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <>
                <h2 className="truncate font-serif text-lg font-semibold text-espresso">{shelf.name}</h2>
                <p className="text-[11px] text-espresso/45">
                  {KIND_LABEL[shelf.kind]} · {shelf.bookIds.length} {shelf.bookIds.length === 1 ? "story" : "stories"}
                  {shelf.kind === "custom" && shelf.description ? ` · ${shelf.description}` : ""}
                </p>
              </>
            )}
          </div>
        </div>

        {editable ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-coffee hover:bg-parchment/60"
              aria-label={`Options for ${shelf.name}`}
            >
              <MoreHorizontal className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-parchment-deep/50 bg-ivory p-1.5 shadow-lift">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-espresso hover:bg-parchment/50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Rename
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.();
                    toast("Shelf put back on the pile.");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-terracotta-deep hover:bg-parchment/50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      {books.length === 0 ? (
        <EmptyState
          icon={Icon}
          title="This shelf is waiting for its first story."
          body={shelf.kind === "custom" ? "Add a book from Explore and it will roost here between chapters." : "Books from Explore can settle in whenever you're ready."}
        />
      ) : (
        <div className="no-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-1">
          {books.map((book) => {
            const p = progress[book.id];
            return (
              <div key={book.id} className="group/row relative w-32 shrink-0">
                <Link to={`/book/${book.id}`} className="block" aria-label={book.title}>
                  <BookCover cover={book.cover} title={book.title} className="rounded-lg" />
                </Link>
                {p && p.progress > 0 ? (
                  <div className="absolute bottom-1 left-1 right-1 rounded bg-espresso/30 p-1 backdrop-blur-sm">
                    <ProgressBar progress={p.progress} className="[&>div]:h-0.5" />
                  </div>
                ) : null}
                <p className="mt-1.5 line-clamp-2 text-center text-[11px] font-medium leading-snug text-espresso">{book.title}</p>
                <p className="text-center text-[10px] text-espresso/50">{book.authorName}</p>

                {onRemove || onMove ? (
                  <div className="absolute -right-2 -top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => onRemove?.(shelf.id, book.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso text-cream shadow-paper hover:bg-terracotta"
                      aria-label={`Remove ${book.title} from ${shelf.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {onMove ? (
                      <MoveMenu
                        currentKind={shelf.kind}
                        onMove={(kind) => onMove(shelf.id, book.id, kind)}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MoveMenu({ currentKind, onMove }: { currentKind: ShelfKind; onMove: (kind: ShelfKind) => void }) {
  const [open, setOpen] = useState(false);
  const kinds: ShelfKind[] = ["reading", "want", "finished", "favorites"];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso text-cream shadow-paper hover:bg-sage"
        aria-label="Move to another shelf"
        title="Move"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-parchment-deep/50 bg-ivory p-1.5 shadow-lift">
          {kinds.map((k) => {
            const Icon = KIND_ICON[k];
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  onMove(k);
                  setOpen(false);
                  toast(`Moved to ${KIND_LABEL[k]}.`);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-espresso hover:bg-parchment/50 disabled:opacity-40"
                disabled={k === currentKind}
              >
                <Icon className="h-3.5 w-3.5" /> {KIND_LABEL[k]}
              </button>
            );
          })}
          </div>
        ) : null}
      </div>
    );
  }

export function ShelfPage() {
  const { shelves, addShelf, renameShelf, removeShelf, removeFromShelf, moveBook } = useNest();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const main = shelves.filter((s) => s.kind !== "custom");
  const custom = shelves.filter((s) => s.kind === "custom");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addShelf(name.trim(), desc.trim() || undefined);
    setName("");
    setDesc("");
    setCreating(false);
    toast(`Created the “${name.trim()}” shelf.`);
  };

  return (
    <div className="space-y-10 pb-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-terracotta">My bookshelves</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-espresso sm:text-4xl">My Shelf</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-espresso/60">
            Orphaned books gather here. Keep them tidy, or let them sprawl — shelves forgive.
          </p>
        </div>
        <Button variant="secondary" icon={Plus} onClick={() => setCreating((c) => !c)}>
          New shelf
        </Button>
      </header>

      {creating ? (
        <form onSubmit={handleCreate} className="rounded-3xl border border-dashed border-parchment-deep/60 bg-parchment/20 p-5 sm:p-6 fade-in">
          <label className="block text-sm font-medium text-espresso">
            Shelf name
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rainy Day Reads"
              className="mt-1.5 block w-full rounded-xl border border-parchment-deep/60 bg-ivory px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
            />
          </label>
          <label className="mt-3 block text-sm font-medium text-espresso">
            A mood for this shelf (optional)
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Books for thunder and blankets…"
              className="mt-1.5 block w-full rounded-xl border border-parchment-deep/60 bg-ivory px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
            />
          </label>
          <div className="mt-4 flex gap-2">
            <Button type="submit" icon={Plus} disabled={!name.trim()}>
              Create shelf
            </Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Never mind
            </Button>
          </div>
        </form>
      ) : null}

      <div className="space-y-6">
        {main.map((shelf) => (
          <ShelfSection
            key={shelf.id}
            shelf={shelf}
            onRemove={removeFromShelf}
            onMove={(_, bookId, kind) => moveBook(bookId, kind)}
          />
        ))}
      </div>

      {custom.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">Your custom shelves</h2>
            <p className="mt-0.5 text-sm text-espresso/60">Built by hand, shelved with love</p>
          </div>
          {custom.map((shelf) => (
            <ShelfSection
              key={shelf.id}
              shelf={shelf}
              editable
              onRename={(n) => renameShelf(shelf.id, n)}
              onDelete={() => removeShelf(shelf.id)}
              onRemove={removeFromShelf}
              onMove={(_, bookId, kind) => moveBook(bookId, kind)}
            />
          ))}
        </div>
      ) : null}

      {custom.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No custom shelves — yet."
          body="Rainy Day Reads, Fantasy Favorites, Books to Read Again… a shelf with a soul starts with a name."
          action={
            <Button variant="secondary" icon={Plus} onClick={() => setCreating(true)}>
              Make your first shelf
            </Button>
          }
        />
      ) : null}
    </div>
  );
}