interface AvatarProps {
  label: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  /** Uploaded profile picture. When present it fills the circle; otherwise the initials show. */
  src?: string;
  alt?: string;
  className?: string;
}

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-24 w-24 text-3xl",
};

const TONES = [
  "bg-terracotta text-cream",
  "bg-sage text-ivory",
  "bg-coffee text-cream",
  "bg-gold text-espresso",
  "bg-coffee-deep text-parchment",
];

function tone(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i += 1) h = (h + label.charCodeAt(i)) % TONES.length;
  return TONES[h];
}

export function Avatar({ label, size = "md", online, src, alt, className = "" }: AvatarProps) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <span className={`inline-flex ${SIZES[size]} overflow-hidden rounded-full shadow-paper`}>
          <img src={src} alt={alt ?? "Profile picture"} className="h-full w-full rounded-full object-cover" />
        </span>
      ) : (
        <span
          className={`inline-flex ${SIZES[size]} ${tone(label)} items-center justify-center rounded-full font-serif font-semibold shadow-paper`}
          aria-hidden
        >
          {label}
        </span>
      )}
      {online !== undefined ? (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-cream ${
            online ? "bg-sage" : "bg-parchment-deep"
          }`}
          title={online ? "Online" : "Away"}
        />
      ) : null}
    </span>
  );
}