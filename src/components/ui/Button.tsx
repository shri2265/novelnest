import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  full?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-coffee text-cream hover:bg-coffee-deep active:bg-espresso shadow-paper focus-visible:ring-coffee/40",
  secondary:
    "bg-transparent text-coffee border border-parchment-deep hover:border-coffee hover:bg-cream active:bg-parchment focus-visible:ring-coffee/40",
  ghost: "bg-transparent text-coffee hover:bg-parchment/50 active:bg-parchment focus-visible:ring-coffee/20",
  soft: "bg-parchment/60 text-coffee-deep hover:bg-parchment active:bg-parchment-deep focus-visible:ring-coffee/30",
  gold: "bg-gold text-espresso hover:bg-gold-deep active:bg-coffee active:text-cream focus-visible:ring-gold-deep/50",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({ variant = "primary", size = "md", icon: Icon, full, className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {children}
    </button>
  );
}