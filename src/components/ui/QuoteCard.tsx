import { Quote } from "lucide-react";
import type { Quote as QuoteType } from "../../data/quotes";

export function QuoteCard({ quote, compact }: { quote: QuoteType; compact?: boolean }) {
  return (
    <figure className="paper relative rounded-2xl border border-parchment-deep/40 p-6 shadow-paper sm:p-7">
      <Quote className="mb-3 h-6 w-6 rotate-180 text-gold" aria-hidden />
      <blockquote className={`font-quote italic text-espresso ${compact ? "text-lg leading-relaxed" : "text-xl leading-relaxed sm:text-2xl"}`}>
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-3 text-xs font-medium tracking-wide text-espresso/55">{quote.source}</figcaption>
    </figure>
  );
}