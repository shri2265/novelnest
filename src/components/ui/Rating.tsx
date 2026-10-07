import { Star } from "lucide-react";

export function Rating({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4" };
  return (
    <span className="inline-flex items-center gap-1 text-coffee-deep" aria-label={`Rated ${value} out of 5`}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${sizes[size]} ${i <= Math.round(value) ? "fill-gold text-gold" : "fill-transparent text-parchment-deep"}`}
          />
        ))}
      </span>
      <span className="ml-0.5 text-xs font-medium tabular-nums text-espresso/70">{value.toFixed(1)}</span>
    </span>
  );
}