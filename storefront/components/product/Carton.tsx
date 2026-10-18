import type { CSSProperties } from "react";
import { LogoSymbol, Wordmark } from "@/components/icons";
import { swatchColor, withFluidOunces } from "@/lib/composition";

// Figma Packaging/Carton (14:2458): the butter carton drawn in code, used in
// gallery tile 02 until photography exists. Every measurement is in Figma px at
// a 144.828px-wide carton, converted to container units so it scales with
// whatever width the parent gives it.
const CARTON_WIDTH = 144.828;
const u = (px: number) => `calc(${px} * 100cqw / ${CARTON_WIDTH})`;

const text: CSSProperties = { fontSize: u(6.03), lineHeight: 1.25 };

export function Carton({
  compositionNumber,
  scentLabel,
  size,
  className,
}: {
  compositionNumber: number;
  /** e.g. "No.1 Woody Vetiver" */
  scentLabel: string;
  /** Variant size, e.g. "50 ml" */
  size: string | undefined;
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
        <LogoSymbol className="block w-full" />

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
            {size && <p>{withFluidOunces(size)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
