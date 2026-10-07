interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  book?: string;
  className?: string;
}

export function ProgressBar({ progress, showLabel, book, className = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));
  return (
    <div className={className}>
      <div className="h-1 w-full overflow-hidden rounded-full bg-parchment/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-terracotta transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? (
        <div className="mt-1.5 text-[11px] text-espresso/55">
          {pct}% complete{book ? ` — ${book}` : ""}
        </div>
      ) : null}
    </div>
  );
}