import { useState } from "react";
import { Bird, Feather, Plus, Send, Sparkles } from "lucide-react";
import { useNest } from "../store/NestContext";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { AuthorDashboard } from "../components/publishing/AuthorDashboard";
import { PublicationForm, type PublicationDraft } from "../components/publishing/PublicationForm";
import { toast } from "../lib/toast";

export function PublishingPage() {
  const { publications, createDraft, daysUntilPublish, user } = useNest();
  const [composerOpen, setComposerOpen] = useState(false);
  const published = publications.filter((p) => p.status === "published");
  const drafts = publications.filter((p) => p.status === "draft").length;

  const handleSubmit = (draft: PublicationDraft, publish: boolean) => {
    createDraft({
      title: draft.title,
      description: draft.description,
      genre: draft.genre,
      tags: draft.tags,
      authorNote: draft.authorNote,
      cover: draft.cover,
      chapters: draft.chapters,
      words: draft.words,
    });
    toast(publish ? "Published to the Nest. The birds will spread the word." : "Saved safely in your nest.");
    setComposerOpen(false);
    if (publish) window.setTimeout(() => window.location.reload(), 400);
  };

  return (
    <div className="space-y-10 pb-4">
      {/* Brand block */}
      <section className="paper overflow-hidden rounded-3xl border border-parchment-deep/40 p-7 sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-parchment/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-coffee-deep">
          <Feather className="h-3.5 w-3.5" /> The Nest for Authors
        </p>
        <h1 className="mt-4 max-w-xl font-serif text-3xl font-semibold leading-tight text-espresso sm:text-5xl">
          A little space for your stories to find their readers.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-espresso/65">
          Write. Shelve a draft. Publish when the lamp light feels right — one new work every seven days, so your nest
          always has room to breathe. Welcome, {user.displayName.split(" ")[0]}.
        </p>

        {/* Slot status card */}
        <SlotStatusCard days={daysUntilPublish} />
      </section>

      {/* Dashboard */}
      <section aria-label="Author dashboard">
        <AuthorDashboard />
      </section>

      {/* Composer */}
      <section aria-label="Write a new story">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">A new manuscript</h2>
            <p className="mt-0.5 text-sm text-espresso/60">
              {drafts} {drafts === 1 ? "draft" : "drafts"} resting in the nest · {published.length} published
            </p>
          </div>
          <Button variant="secondary" icon={composerOpen ? Send : Plus} onClick={() => setComposerOpen((o) => !o)}>
            {composerOpen ? "Close composer" : "New story"}
          </Button>
        </div>

        {composerOpen ? (
          <PublicationForm onSubmit={handleSubmit} slotAvailable={daysUntilPublish === 0} />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Your next page is waiting to be written."
            body="Drafts rest here safely until you're ready. Publishing happens once a week, like a well-tended rhythm."
            action={
              <Button variant="primary" icon={Plus} onClick={() => setComposerOpen(true)}>
                Begin a manuscript
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}

function SlotStatusCard({ days }: { days: number }) {
  const available = days === 0;
  return (
    <div
      className={`mt-7 max-w-md rounded-2xl border p-5 shadow-paper ${
        available ? "border-sage/50 bg-sage/15" : "border-gold/50 bg-gold/15"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${available ? "bg-sage text-ivory" : "bg-coffee text-gold"}`}>
          <Bird className="h-6 w-6" />
        </span>
        <div>
          {available ? (
            <>
              <p className="font-serif text-lg font-semibold text-espresso">Your publishing window is open.</p>
              <p className="mt-0.5 text-sm leading-relaxed text-espresso/65">
                Take your time — pick the story that's ready, or let one more page settle first.
              </p>
            </>
          ) : (
            <>
              <p className="font-serif text-lg font-semibold text-espresso">Your next publishing slot opens in {days} {days === 1 ? "day" : "days"}.</p>
              <p className="mt-0.5 text-sm leading-relaxed text-espresso/65">
                One work every seven days keeps the nest from bursting at the seams. Drafts are welcome anytime.
              </p>
            </>
          )}
        </div>
      </div>
      {!available ? (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-espresso/10">
          <div className="h-full rounded-full bg-gold" style={{ width: `${((7 - days) / 7) * 100}%` }} />
        </div>
      ) : null}
    </div>
  );
}