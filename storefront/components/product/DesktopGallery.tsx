import Image from "next/image";
import type { ScentNotes } from "@/lib/composition";
import {
  CHARCOAL_BLOCK,
  IN_HAND,
  ON_THE_LEDGE,
  STUDIO_FRONT,
  type GalleryImage,
} from "@/lib/gallery";
import { Carton } from "./Carton";
import { HeroImage } from "./HeroImage";

// Figma 14:3708: the desktop gallery, an editorial stack in the left column.
// Tiles are numbered 01–06; the scent-notes panel is tile 04.
const FULL = "(min-width: 1440px) 780px, 54vw";
const HALF = "(min-width: 1440px) 390px, 27vw";

function Caption({
  index,
  text,
  tone = "ink",
}: {
  index: string;
  text: string;
  tone?: "ink" | "bone";
}) {
  return (
    <figcaption
      className={`absolute bottom-6 left-6 text-label whitespace-pre ${
        tone === "bone" ? "text-bone" : "text-ink"
      }`}
    >
      {`${index}   ${text}`}
    </figcaption>
  );
}

function Photo({
  image,
  index,
  sizes,
  tone,
  hero,
}: {
  image: GalleryImage;
  index: string;
  sizes: string;
  tone?: "ink" | "bone";
  hero?: boolean;
}) {
  return (
    <figure className="relative aspect-square overflow-hidden">
      {hero ? (
        <HeroImage image={image} sizes={sizes} shownOn="desktop" />
      ) : (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
      )}
      <Caption index={index} text={image.caption} tone={tone} />
    </figure>
  );
}

// Scent notes as type on charcoal, with bone rules under each line (Figma 14:3721).
// Figma has a clay texture fill here, fully covered by the charcoal layer, so it's left out.
function NotesPanel({ notes }: { notes: ScentNotes }) {
  const rows: [string, string][] = [
    ["Top", notes.top],
    ["Heart", notes.heart],
    ["Base", notes.base],
  ];
  return (
    <div className="relative h-[500px] overflow-hidden bg-charcoal pt-[100px] pl-[21.28%] text-label text-bone">
      {[126, 246, 366, 486].map((top) => (
        <div
          key={top}
          className="absolute inset-x-0 h-px bg-bone/36"
          style={{ top }}
        />
      ))}
      <p>Scent notes</p>
      <dl className="mt-[102px] flex flex-col gap-[102px]">
        {rows.map(([stage, note]) => (
          <div key={stage} className="grid grid-cols-[228px_auto]">
            <dt>{stage}</dt>
            <dd>{note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function DesktopGallery({
  compositionNumber,
  scentLabel,
  size,
  notes,
  className,
}: {
  compositionNumber: number;
  scentLabel: string;
  size: string | undefined;
  notes: ScentNotes | null;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <Photo image={STUDIO_FRONT} index="01" sizes={FULL} hero />
      <div className="grid grid-cols-2">
        <figure className="relative aspect-square bg-bone">
          <Carton
            compositionNumber={compositionNumber}
            scentLabel={scentLabel}
            size={size}
            className="absolute top-[13.08%] left-[30.41%] w-[37.14%]"
          />
          <Caption index="02" text="Butter carton" />
        </figure>
        <Photo image={IN_HAND} index="03" sizes={HALF} />
      </div>
      {notes && <NotesPanel notes={notes} />}
      <div className="grid grid-cols-2">
        <Photo image={ON_THE_LEDGE} index="05" sizes={HALF} tone="bone" />
        <Photo image={CHARCOAL_BLOCK} index="06" sizes={HALF} tone="bone" />
      </div>
    </div>
  );
}
