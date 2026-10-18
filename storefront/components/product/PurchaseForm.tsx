"use client";

import { ArrowIcon, RadioIcon } from "@/components/icons";
import { formatMoney } from "@/lib/money";
import { BUTTON_CLASS } from "./buttonClass";
import { outlineClass } from "./outline";
import { PanelHeading } from "./PanelHeading";
import { usePurchase } from "./PurchaseContext";

// Purchase options and Add to cart (Figma 14:3792–14:3803). State and the add
// action live in PurchaseContext, shared with the sticky buy bar.
export function PurchaseForm() {
  const {
    mode,
    setMode,
    price,
    subscribePrice,
    buttonLabel,
    canBuy,
    pending,
    error,
    add,
    panelButtonRef,
  } = usePurchase();

  return (
    <div>
      <PanelHeading left="Purchase" right={mode === "one-time" ? "One-time" : "Subscribe & save"} />

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Purchase option</legend>
        <Option
          label="One-time purchase"
          price={formatMoney(price)}
          checked={mode === "one-time"}
          onSelect={() => setMode("one-time")}
        />
        <Option
          label="Subscribe & save"
          badge="Save 10%"
          price={formatMoney(subscribePrice)}
          checked={mode === "subscribe"}
          onSelect={() => setMode("subscribe")}
        />
      </fieldset>

      <button
        ref={panelButtonRef}
        type="button"
        onClick={add}
        disabled={!canBuy || pending}
        aria-busy={pending}
        className={`${BUTTON_CLASS} mt-5 h-14 w-full px-6 text-button-l lg:mt-4`}
      >
        {buttonLabel}
        <ArrowIcon className="transition-transform duration-150 ease-out group-hover:translate-x-1" />
      </button>

      {error && (
        <p role="alert" className="mt-3 text-caption">
          {error}
        </p>
      )}

      <p className="mt-3 text-caption opacity-55">
        Presented in its butter carton. Each order is wrapped by hand.
      </p>
    </div>
  );
}

function Option({
  label,
  badge,
  price,
  checked,
  onSelect,
}: {
  label: string;
  badge?: string;
  price: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 bg-bone px-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
        checked ? "pt-[14px] pb-3" : "py-[14px]"
      } ${outlineClass(checked ? "selected" : "default")}`}
    >
      <input
        type="radio"
        name="purchase-option"
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <RadioIcon checked={checked} className="shrink-0" />
      <span className="flex flex-1 items-center gap-2.5 text-label">
        {label}
        {badge && <span className="bg-butter px-2 py-[3px] text-caption whitespace-nowrap">{badge}</span>}
      </span>
      <span className="text-product-meta">{price}</span>
    </label>
  );
}
