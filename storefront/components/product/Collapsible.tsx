import type { ReactNode } from "react";

// Height-animated disclosure shared by the details accordion and the subscribe
// options (Figma Accordion Row: "Body eases open 200ms"). Animates grid rows
// from 0fr to 1fr, so no height is measured; closed content is inert.
export function Collapsible({
  open,
  id,
  className,
  children,
  ...aria
}: {
  open: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
  role?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      id={id}
      inert={!open}
      {...aria}
      className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className={`overflow-hidden ${className ?? ""}`}>{children}</div>
    </div>
  );
}
