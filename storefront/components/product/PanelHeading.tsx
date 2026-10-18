import type { ReactNode } from "react";

// The caption row that heads each buy-panel block: a label on the left, the
// current value or a note on the right ("Scent / No.1 Woody Vetiver").
export function PanelHeading({
  left,
  right,
  className,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex justify-between gap-4 text-caption ${className ?? ""}`}>
      <p>{left}</p>
      <p className="text-right">{right}</p>
    </div>
  );
}
