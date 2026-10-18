import { getImageProps } from "next/image";
import type { GalleryImage } from "@/lib/gallery";

// The first gallery photo (the LCP image) exists twice: once in the desktop grid
// and once as mobile slide 1, and CSS hides one of them. A <picture> whose
// <source> serves a blank pixel at the other breakpoint means each device
// downloads only the copy it shows, so the high-priority request isn't wasted.
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
const DESKTOP = "(min-width: 1024px)"; // Tailwind's lg breakpoint
const MOBILE = "(max-width: 1023.98px)";

export function HeroImage({
  image,
  sizes,
  shownOn,
}: {
  image: GalleryImage;
  sizes: string;
  shownOn: "mobile" | "desktop";
}) {
  const { props } = getImageProps({
    src: image.src,
    alt: image.alt,
    fill: true,
    sizes,
    loading: "eager",
    fetchPriority: "high",
    className: "object-cover",
  });

  return (
    <picture>
      <source media={shownOn === "mobile" ? DESKTOP : MOBILE} srcSet={BLANK} />
      <img {...props} alt={image.alt} />
    </picture>
  );
}
