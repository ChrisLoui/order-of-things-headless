import type { CSSProperties } from "react";
import { Wordmark } from "@/components/icons";
import { swatchColor } from "@/lib/composition";

// Figma Packaging/Carton (14:2458): the butter carton drawn in code, used in
// gallery tile 02 until photography exists. Every measurement is in Figma px at
// a 144.828px-wide carton, converted to container units so it scales with
// whatever width the parent gives it.
const CARTON_WIDTH = 144.828;
const u = (px: number) => `calc(${px} * 100cqw / ${CARTON_WIDTH})`;

// The stacked-bar symbol (Logo/Symbol): [top, right, bottom, left] insets in %.
const SYMBOL_BLOCKS = [
  [0, 0, 88.11, 0],
  [17.62, 66.67, 70.48, 0],
  [17.62, 0, 70.48, 66.67],
  [35.24, 0, 52.86, 0],
  [52.86, 0, 35.24, 0],
  [70.48, 33.33, 17.62, 33.33],
  [88.11, 33.33, 0, 33.33],
];

const text: CSSProperties = { fontSize: u(6.03), lineHeight: 1.25 };

export function Carton({
  compositionNumber,
  scentLabel,
  className,
}: {
  compositionNumber: number;
  /** e.g. "No.1 Woody Vetiver" */
  scentLabel: string;
  className?: string;
}) {
  return (
    <div className={`@container ${className ?? ""}`} aria-hidden>
      <div
        className="flex aspect-[144.828/280] w-full flex-col bg-butter text-ink"
        style={{
          padding: `${u(9.655)} ${u(9.655)} 0`,
          gap: u(117.955),
          filter: `drop-shadow(${u(11.2)} ${u(13.067)} ${u(11.2)} rgb(23 20 18 / 0.28))`,
        }}
      >
        <div className="relative" style={{ height: u(94.975) }}>
          {SYMBOL_BLOCKS.map(([top, right, bottom, left]) => (
            <div
              key={`${top}-${left}`}
              className="absolute bg-ink"
              style={{
                inset: `${top}% ${right}% ${bottom}% ${left}%`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col" style={{ gap: u(4.023) }}>
          <Wordmark style={{ width: u(62.759) }} />
          <div className="flex flex-col" style={{ gap: u(0.805), ...text }}>
            <p>Eau de Parfum</p>
            <p className="flex items-center" style={{ gap: u(2.414) }}>
              <span
                className="shrink-0"
                style={{
                  width: u(4.828),
                  height: u(4.828),
                  background: swatchColor(compositionNumber),
                }}
              />
              {scentLabel}
            </p>
          </div>
          <div className="flex flex-col" style={{ gap: u(0.805), ...text }}>
            <p>Natural Spray</p>
            <p>50 ml / 1.7 fl oz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
