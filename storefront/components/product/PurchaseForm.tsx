"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { ArrowIcon, RadioIcon } from "@/components/icons";
import type { CompositionStatus } from "@/lib/composition";
import { formatMoney } from "@/lib/money";
import type { Money } from "@/lib/shopify";
import { outlineClass } from "./outline";
import { PanelHeading } from "./PanelHeading";

// Purchase options and Add to cart (Figma 14:3792–14:3803).
//
// SUBSCRIBE & SAVE IS UI STATE ONLY. The store has no subscription app, so there
// is no selling plan to attach to the cart line. Selecting it shows the 10% price
// and the "Subscribe" button from the design, but the button stays disabled
// rather than adding a one-time line at full price. Wire it to a selling plan
// (cartLinesAdd sellingPlanId) once one exists.
const SUBSCRIBE_DISCOUNT = 0.1;

type Mode = "one-time" | "subscribe";

export function PurchaseForm({
  variantId,
  price,
  status,
}: {
  variantId: string | undefined;
  price: Money;
  status: CompositionStatus;
}) {
  const [mode, setMode] = useState<Mode>("one-time");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const subscribePrice: Money = {
    amount: (Number(price.amount) * (1 - SUBSCRIBE_DISCOUNT)).toFixed(2),
    currencyCode: price.currencyCode,
  };

  const buttonLabel =
    status === "coming-soon"
      ? "Coming soon"
      : status === "sold-out"
        ? "Sold out"
        : mode === "subscribe"
          ? "Subscribe"
          : "Add to cart";
  const canBuy = status === "available" && mode === "one-time" && !!variantId;

  const onAdd = () => {
    if (!variantId) return;
    setError(null);
    startTransition(async () => {
      const result = await addToCart(variantId);
      if (!result.ok) setError(result.error);
    });
  };

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
        type="button"
        onClick={onAdd}
        disabled={!canBuy || pending}
        aria-busy={pending}
        className="group mt-5 flex h-14 w-full items-center justify-between bg-charcoal px-6 text-button-l text-bone transition-colors duration-150 ease-out hover:bg-charcoal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-40 lg:mt-4"
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
