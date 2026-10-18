// The heavy horizontal rule used across the page (Figma "Bar"): 8px on mobile
// and 12px from lg, or 10px / 12px for section headings like The collection.
const TONES = { ink: "bg-ink", butter: "bg-butter" };
const SIZES = { panel: "h-2 lg:h-3", section: "h-2.5 lg:h-3" };

export function Rule({
  tone = "ink",
  size = "panel",
}: {
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
}) {
  return <div aria-hidden className={`${SIZES[size]} ${TONES[tone]}`} />;
}
