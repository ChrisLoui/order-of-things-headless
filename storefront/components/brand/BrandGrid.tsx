import type { CSSProperties } from "react";

// Figma Brand Grid (14:1663): six columns at fixed percentages of the width, plus
// baseline rows ("Fine" = 30px desktop / 22.5px mobile, "Medium" = 60px).
// "Ink over bone, Bone over imagery." Place it absolute; the host clips it.
const COLUMNS = [10.94, 26.56, 42.19, 57.81, 73.44, 89.06];

const TONES = {
  ink: { row: "rgb(56 51 49 / 0.08)", col: "bg-ink/14" },
  bone: { row: "rgb(242 237 230 / 0.12)", col: "bg-bone/24" },
};

export function BrandGrid({
  rows = 30,
  tone = "ink",
  className,
  style,
}: {
  /** Row spacing in px (rows start one spacing from the top), or false for columns only. */
  rows?: number | false;
  tone?: keyof typeof TONES;
  className?: string;
  style?: CSSProperties;
}) {
  const { row, col } = TONES[tone];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {rows && (
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            top: rows,
            backgroundImage: `linear-gradient(to bottom, ${row} 1px, transparent 1px)`,
            backgroundSize: `100% ${rows}px`,
          }}
        />
      )}
      {COLUMNS.map((left) => (
        <div key={left} className={`absolute inset-y-0 w-px ${col}`} style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}
