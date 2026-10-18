import type { ComponentType, SVGProps } from "react";

// Figma Detail Tile (14:2798), stacked: icon over an uppercase label, with an
// optional supporting line. Used three-up by the assurances row and the details
// accordion.
export type Detail = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text?: string;
};

export function DetailGrid({ items, rule = false }: { items: Detail[]; rule?: boolean }) {
  return (
    <ul className={`grid grid-cols-3 gap-4 ${rule ? "border-t border-hairline pt-4" : ""}`}>
      {items.map(({ Icon, title, text }) => (
        <li key={title} className="flex flex-col gap-3">
          <Icon />
          <div>
            <p className="text-label">{title}</p>
            {text && <p className="mt-1 text-body-s opacity-75">{text}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
