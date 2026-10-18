"use client";

import type { ReactNode } from "react";
import { ArrowIcon, RadioIcon } from "@/components/icons";
import { formatMoney } from "@/lib/money";
import { BUTTON_CLASS } from "./buttonClass";
import { Collapsible } from "./Collapsible";
import { outlineClass } from "./outline";
import { PanelHeading } from "./PanelHeading";
import { FREQUENCIES, frequencyLabel, usePurchase } from "./PurchaseContext";

// Purchase options and Add to cart (Figma 14:3792–14:3803; subscribe selected
// 14:3546). State and the add action live in PurchaseContext, shared with the
// sticky buy bar.
export function PurchaseForm() {
  const {
    mode,
    setMode,
    frequency,
    setFrequency,
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
      <PanelHeading
        left="Purchase"
        right={
          mode === "one-time" ? "One-time" : `Subscription · every ${frequencyLabel(frequency)}`
        }
      />

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
        >
          <fieldset className="pt-2.5">
            <legend className="sr-only">Deliver every</legend>
            {/* The legend names the group for screen readers; the visible copy is hidden from them. */}
            <PanelHeading
              left={<span aria-hidden>Deliver every</span>}
              right="Skip, pause or cancel any time"
            />
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {FREQUENCIES.map((months) => (
                <label
                  key={months}
                  className={`flex h-9 cursor-pointer items-center justify-center bg-bone text-caption whitespace-nowrap has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${outlineClass(
                    months === frequency ? "checked" : "default",
                  )}`}
                >
                  <input
                    type="radio"
                    name="subscribe-frequency"
                    checked={months === frequency}
                    onChange={() => setFrequency(months)}
                    className="sr-only"
                  />
                  {frequencyLabel(months)}
                </label>
              ))}
            </div>
          </fieldset>
        </Option>
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

/** One purchase option: a radio row, plus optional content revealed while it's selected. */
function Option({
  label,
  badge,
  price,
  checked,
  onSelect,
  children,
}: {
  label: string;
  badge?: string;
  price: string;
  checked: boolean;
  onSelect: () => void;
  children?: ReactNode;
}) {
  return (
    <div
      className={`bg-bone px-3 lg:px-4 ${checked ? "pt-[14px] pb-3" : "py-[14px]"} ${outlineClass(
        checked ? "selected" : "default",
      )}`}
    >
      <label className="flex cursor-pointer items-center gap-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink lg:gap-3">
        <input
          type="radio"
          name="purchase-option"
          checked={checked}
          onChange={onSelect}
          className="sr-only"
        />
        <RadioIcon checked={checked} className="shrink-0" />
        {/* Archivo runs wider than Pilat, so on mobile the padding and gaps are
            tighter than Figma's to keep label, pill and price on one 390px line
            (measured: ~314px of 316, including an "A$" price). */}
        <span className="flex flex-1 items-center gap-1.5 text-label whitespace-nowrap lg:gap-2.5">
          {label}
          {badge && <span className="bg-butter px-1.5 py-[3px] text-caption lg:px-2">{badge}</span>}
        </span>
        <span className="text-product-meta whitespace-nowrap">{price}</span>
      </label>

      {/* Indented past the radio to line up with the label text. */}
      {children && (
        <Collapsible open={checked} className="pl-6 lg:pl-7">
          {children}
        </Collapsible>
      )}
    </div>
  );
}
