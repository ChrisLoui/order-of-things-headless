// Figma Brand Grid (14:1663): baseline rows every 30px (ink 8%) and six columns
// at fixed percentages of the width (ink 14%). Sits behind the hero; the host clips it.
const COLUMNS = [10.94, 26.56, 42.19, 57.81, 73.44, 89.06];

export function BrandGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <div className="absolute inset-x-0 top-[30px] bottom-0 bg-[linear-gradient(to_bottom,rgb(56_51_49/0.08)_1px,transparent_1px)] bg-size-[100%_30px]" />
      {COLUMNS.map((left) => (
        <div key={left} className="absolute inset-y-0 w-px bg-ink/14" style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}
