import Image from "next/image";
import { BrandGrid } from "@/components/brand/BrandGrid";
import { Wordmark } from "@/components/icons";
import type { ScentNotes } from "@/lib/composition";
import { swatchColor } from "@/lib/composition";

// Figma 14:3841 (desktop, panel | photo, 1440×720) and 14:3997 (mobile, photo
// over panel). The panel is bone with the brand grid showing through gaps
// between bone "plates"; the photo has the bone grid over it and a scent label bar.

// Desktop plates in the 720×720 panel: [left%, top px, width%, height px].
const DESKTOP_PLATES = [
  [0, 0, 53.19, 180],
  [53.33, 0, 46.67, 144],
  [0, 361, 53.19, 119],
  [0, 601, 53.19, 119],
  [84.58, 601, 15.42, 119],
];

// Mobile: the grid only shows inside these regions of the 390×520 panel
// (Figma "Brand Grid (masked around text)"): [x, y, width, height] in px.
const MOBILE_REGIONS = [
  [0, 90, 390, 1],
  [347, 91, 43, 89],
  [0, 180, 390, 46],
  [286, 226, 104, 134],
  [225, 360, 165, 90],
  [0, 450, 390, 1],
  [225, 451, 62, 69],
];
const MOBILE_W = 390;
const MOBILE_H = 520;

function MobileGrid() {
  return (
    <div aria-hidden className="absolute inset-0 lg:hidden">
      {MOBILE_REGIONS.map(([x, y, w, h]) => (
        <div
          key={`${x}-${y}`}
          className="absolute overflow-hidden"
          style={{ left: `${(x / MOBILE_W) * 100}%`, width: `${(w / MOBILE_W) * 100}%`, top: y, height: h }}
        >
          {/* The grid is laid out over the whole panel, then clipped to the region. */}
          <BrandGrid
            rows={45}
            style={{
              left: `${(-x / w) * 100}%`,
              width: `${(MOBILE_W / w) * 100}%`,
              top: -y,
              height: MOBILE_H,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DesktopGrid() {
  return (
    <div aria-hidden className="absolute inset-0 hidden overflow-hidden lg:block">
      {/* The Brand Grid spans the whole 1440 section; this panel is its left half. */}
      <BrandGrid rows={60} className="right-[-100%]" />
      {DESKTOP_PLATES.map(([left, top, width, height]) => (
        <div
          key={`${left}-${top}`}
          className="absolute bg-bone"
          style={{ left: `${left}%`, top, width: `${width}%`, height }}
        />
      ))}
      {/* Strong rules: the top edge, the middle row and the column at 383px. */}
      <div className="absolute inset-x-0 top-0 h-px bg-ink/50" />
      <div className="absolute inset-x-0 top-[360px] h-px bg-ink/50" />
      <div className="absolute inset-y-0 left-[53.19%] w-px bg-ink/50" />
    </div>
  );
}

export function BrandStory({
  compositionNumber,
  title,
  notes,
}: {
  compositionNumber: number;
  title: string;
  notes: ScentNotes | null;
}) {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col-reverse lg:grid lg:h-[720px] lg:grid-cols-2">
      <div className="relative flex min-h-[520px] flex-col bg-bone px-5 pt-6 pb-[27px] lg:block lg:min-h-0 lg:p-0">
        <MobileGrid />
        <DesktopGrid />

        <h2 className="relative text-h2 uppercase lg:absolute lg:top-8 lg:left-8 lg:w-[46.5%]">
          A fragrance that wears close to the skin.
        </h2>
        <p className="relative mt-4 text-body-m lg:absolute lg:top-8 lg:left-[55.42%] lg:mt-0 lg:w-[40.28%]">
          Every composition is written complete first, then adapted to sit in its format. Fragrance
          is the reason the carton exists, not a finishing note.
        </p>
        <ul className="relative mt-[66px] flex flex-col gap-1 text-label lg:absolute lg:top-[392px] lg:left-8 lg:mt-0">
          <li>— Composed in France &amp; Italy</li>
          <li>— Fine-fragrance standard</li>
          <li>— Six compositions</li>
        </ul>
        {notes && (
          <ul className="relative mt-7 flex flex-col gap-1 text-label lg:hidden">
            <li>Top: {notes.top}</li>
            <li>Heart: {notes.heart}</li>
            <li>Base: {notes.base}</li>
          </ul>
        )}
        <div className="relative mt-auto pt-[76px] lg:absolute lg:top-[653px] lg:left-[26px] lg:mt-0 lg:pt-0">
          <Wordmark className="w-[150px] lg:w-[240px]" />
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden lg:h-auto">
        <Image
          src="/images/section-brand-hand.jpg"
          alt="A hand raised to the lips"
          fill
          sizes="(min-width: 1440px) 720px, (min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {/* Bone grid over the photo: this is the right half of the 1440 grid. */}
        <BrandGrid tone="bone" className="left-[-100%] hidden lg:block" />
        <p className="absolute top-[197px] right-[30px] left-[30px] flex h-7 items-center justify-between bg-bone px-2.5 text-label lg:top-[331px] lg:right-auto lg:left-[15.69%] lg:h-[30px] lg:w-[62.5%]">
          <span>Scent No.{compositionNumber}</span>
          <span className="flex items-center gap-2">
            {title}
            <span className="size-2.5" style={{ background: swatchColor(compositionNumber) }} />
          </span>
        </p>
      </div>
    </section>
  );
}
