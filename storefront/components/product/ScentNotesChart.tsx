import { SCENT_STAGES, type ScentNotes, type ScentStage } from "@/lib/composition";
import { PanelHeading } from "./PanelHeading";

// Figma Scent Notes (14:2701): top, heart and base as staggered bars on a wear
// timeline. "Bar proportions are fixed; only note names change per composition."
// Positions are Figma px over the 524px desktop module, as percentages.
const GRID_LINES = [30.53, 47.14, 70.8, 100];

const BARS: Record<ScentStage, { left: number; width: number; opacity: number }> = {
  top: { left: 30.53, width: 16.6, opacity: 0.55 },
  heart: { left: 38.93, width: 31.87, opacity: 0.78 },
  base: { left: 55.34, width: 44.66, opacity: 1 },
};

export function ScentNotesChart({ notes }: { notes: ScentNotes }) {
  return (
    <div className="border-y border-ink py-4">
      <PanelHeading left="Notes" right="How it wears over a day" className="pb-2.5 opacity-60" />

      <div className="relative border-t border-hairline">
        {GRID_LINES.map((left) => (
          <div
            key={left}
            aria-hidden
            className="absolute inset-y-0 w-px -translate-x-px bg-hairline"
            style={{ left: `${left}%` }}
          />
        ))}
        <dl>
          {SCENT_STAGES.map(({ key, label }) => {
            const bar = BARS[key];
            return (
              <div key={key} className="relative h-11 border-b border-hairline pt-[5px]">
                <dt className="text-caption opacity-60">{label}</dt>
                <dd className="text-label">{notes[key]}</dd>
                <span
                  aria-hidden
                  className="absolute top-[18px] h-2 bg-ink"
                  style={{ left: `${bar.left}%`, width: `${bar.width}%`, opacity: bar.opacity }}
                />
              </div>
            );
          })}
        </dl>
      </div>

      <div aria-hidden className="relative h-[26px] text-caption opacity-60">
        <span className="absolute top-2" style={{ left: `${GRID_LINES[0]}%` }}>
          <span className="lg:hidden">0</span>
          <span className="hidden lg:inline">Spray</span>
        </span>
        {(["1 h", "4 h"] as const).map((label, i) => (
          <span
            key={label}
            className="absolute top-2 -translate-x-1/2"
            style={{ left: `${GRID_LINES[i + 1]}%` }}
          >
            {label}
          </span>
        ))}
        <span className="absolute top-2 right-0">8 h +</span>
      </div>

      <p className="mt-2 text-body-m opacity-75">
        Timings are a guide. Skin, season and how much you wear change everything.
      </p>
    </div>
  );
}
