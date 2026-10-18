import type { CSSProperties } from "react";

// A composition's scent-ID square, in its swatch color (--color-composition-N).
// Defaults to the 10px size used in the UI; pass a className to resize or fade it.
export function Swatch({
  number,
  className = "size-2.5",
  style,
}: {
  number: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{ background: `var(--color-composition-${number})`, ...style }}
    />
  );
}
