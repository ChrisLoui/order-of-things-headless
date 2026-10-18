"use client";

import { swatchColor, withFluidOunces } from "@/lib/composition";
import { formatMoney } from "@/lib/money";
import { BUTTON_CLASS } from "./buttonClass";
import { Carton } from "./Carton";
import { usePurchase } from "./PurchaseContext";

// Figma Sticky Buy Bar (14:3239 desktop 1440×80, 14:3370 mobile 390×76).
// Slides up once the buy panel's button has scrolled out of view, and back down
// when it returns. Same state and action as the panel (PurchaseContext).
export function StickyBuyBar({
  compositionNumber,
  scentLabel,
  productType,
  size,
}: {
  compositionNumber: number;
  scentLabel: string;
  productType: string;
  /** e.g. "50 ml" */
  size: string | undefined;
}) {
  const { buttonLabel, canBuy, pending, error, add, selectedPrice, panelButtonScrolledPast } =
    usePurchase();
  const price = formatMoney(selectedPrice);
  const visible = panelButtonScrolledPast;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 bg-bone transition-transform duration-300 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-6 px-5 lg:h-20 lg:px-10">
        <Carton
          compositionNumber={compositionNumber}
          scentLabel={scentLabel}
          size={size}
          className="hidden w-[25px] shrink-0 lg:block"
        />

        <div className="min-w-0 flex-1 lg:-ml-2">
          <p className="flex items-center gap-2.5 text-label">
            <span className="size-2.5 shrink-0" style={{ background: swatchColor(compositionNumber) }} />
            <span className="truncate">{scentLabel}</span>
          </p>
          <p role="status" className="mt-1 truncate text-body-s opacity-70 lg:text-body-m">
            {error ?? (
              <>
                <span className="lg:hidden">
                  {price}
                  {size && ` · ${size}`}
                </span>
                <span className="hidden lg:inline">
                  {productType}
                  {size && ` · ${withFluidOunces(size)}`}
                </span>
              </>
            )}
          </p>
        </div>

        <p className="hidden text-body-m opacity-70 lg:block">
          Complimentary shipping · Wrapped by hand
        </p>

        <button
          type="button"
          onClick={add}
          disabled={!canBuy || pending}
          aria-busy={pending}
          className={`${BUTTON_CLASS} h-11 w-[140px] shrink-0 justify-center px-4 text-button-m lg:w-[300px] lg:justify-between`}
        >
          {buttonLabel}
          <span className="hidden lg:inline">{price}</span>
        </button>
      </div>
    </div>
  );
}
