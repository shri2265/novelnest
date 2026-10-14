import { useMemo, useState } from "react";
import type { CoverSpec } from "../../types";
import { buildCoverSvg, DEFAULT_PALETTE } from "../../lib/coverArt";

interface BookCoverProps {
  title: string;
  author?: string;
  /** Stable cover image reference stored on the book (data URI or remote URL). */
  src?: string;
  /** Palette/motif used to render the built-in cover if no image is available or it fails. */
  cover?: CoverSpec;
  className?: string;
  /** Gentle image zoom on hover, used inside interactive cards. */
  hoverZoom?: boolean;
  /** Load eagerly for above-the-fold covers. */
  eager?: boolean;
}

export function BookCover({ title, author, src, cover, className = "", hoverZoom, eager }: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const palette = cover?.palette ?? DEFAULT_PALETTE;
  const motif = cover?.motif ?? "openbook";
  const alt = author ? `Cover of ${title} by ${author}` : `Cover of ${title}`;

  const fallback = useMemo(
    () => buildCoverSvg({ id: `${title}-${motif}`, title, author, palette, motif }),
    [title, author, palette, motif]
  );

  const wrapper = `relative aspect-[2/3] w-full overflow-hidden bg-parchment/40 ${className}`;

  if (!src || failed) {
    return (
      <div className={`${wrapper} [&_svg]:block [&_svg]:h-full [&_svg]:w-full`}>
        <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: fallback }} />
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-[transform,opacity] duration-500 ease-out ${
          hoverZoom ? "group-hover:scale-[1.06]" : ""
        } ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      {!loaded ? (
        <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-b from-parchment/50 to-parchment/80" />
      ) : null}
    </div>
  );
}
