"use client";

import { formatMoney } from "@/lib/money";
import { frequencyLabel, usePurchase } from "./PurchaseContext";

// The buy panel's price, which follows the purchase option: "A$369 incl. GST",
// or "A$332.10 every 3 months, incl. GST" with Subscribe & save (Figma 14:3546).
export function PanelPrice() {
  const { mode, frequency, selectedPrice } = usePurchase();
  return (
    <p className="flex items-baseline gap-3">
      <span className="text-price">{formatMoney(selectedPrice)}</span>
      {/* Copy from the design (AU store). Revisit if the store stays on USD. */}
      <span className="text-body-m opacity-60">
        {mode === "subscribe" && `every ${frequencyLabel(frequency)}, `}incl. GST
      </span>
    </p>
  );
}
