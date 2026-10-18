import Link from "next/link";
import { swatchColor, type Composition } from "@/lib/composition";
import { outlineClass } from "./outline";

// Scent selector (Figma Composition Tiles 14:3782): one tile per composition.
// Tiles are links to the composition's page; navigation is client-side and keeps
// the scroll position, so the page turns over in place. Unreleased (coming soon)
// and sold-out compositions aren't links.
export function ScentSelector({
  compositions,
  currentHandle,
}: {
  compositions: Composition[];
  currentHandle: string;
}) {
  const current = compositions.find((c) => c.handle === currentHandle);

  return (
    <div>
      <div className="flex justify-between text-caption">
        <p>Scent</p>
        {current && (
          <p>
            No.{current.number} {current.title}
          </p>
        )}
      </div>

      <ul className="mt-2 grid grid-cols-3 gap-2">
        {compositions.map((c) => (
          <li key={c.handle}>
            <Tile composition={c} selected={c.handle === currentHandle} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tile({ composition: c, selected }: { composition: Composition; selected: boolean }) {
  const unavailable = c.status !== "available";
  const state = selected ? "selected" : unavailable ? "unavailable" : "default";
  const className = `flex h-12 items-center gap-2.5 bg-bone px-3.5 text-label ${outlineClass(state)}`;

  // Mobile tiles show only the number; desktop adds the name, or "· Soon".
  const content = (
    <>
      <span
        className={`size-2.5 shrink-0 ${unavailable ? "opacity-40" : ""}`}
        style={{ background: swatchColor(c.number) }}
      />
      <span className="truncate">
        No.{c.number}
        <span className="hidden lg:inline">
          {c.status === "coming-soon" ? " · Soon" : ` ${c.shortName}`}
        </span>
        {c.status === "coming-soon" && <span className="sr-only lg:hidden">, coming soon</span>}
        {c.status === "sold-out" && <span className="sr-only">, sold out</span>}
      </span>
    </>
  );

  if (unavailable && !selected) {
    return (
      <span aria-disabled className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={`/products/${c.handle}`}
      scroll={false}
      aria-current={selected ? "page" : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}
