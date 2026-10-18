"use client";

import { createContext, use, useCallback, useState, useTransition, type ReactNode } from "react";
import { addToCart } from "@/app/actions/cart";
import type { CompositionStatus } from "@/lib/composition";
import type { Money } from "@/lib/shopify";

// Purchase state shared by the buy panel and the sticky buy bar, so both buttons
// add the same variant with the same selected mode and show the same label.
//
// SUBSCRIBE & SAVE IS UI STATE ONLY. The store has no subscription app, so there
// is no selling plan to attach to the cart line. Selecting it shows the 10% price,
// the delivery frequency and the "Subscribe" button from the design, but the
// button stays disabled rather than adding a one-time line at full price. Once a
// subscription app exists, each frequency maps to one of its selling plans
// (cartLinesAdd sellingPlanId).
const SUBSCRIBE_DISCOUNT = 0.1;

export type PurchaseMode = "one-time" | "subscribe";

/** Delivery frequency in months. Figma preselects 3 for a 50 ml bottle. */
export const FREQUENCIES = [1, 2, 3] as const;
export type Frequency = (typeof FREQUENCIES)[number];
const DEFAULT_FREQUENCY: Frequency = 3;

/** 1 → "1 month", 3 → "3 months" */
export const frequencyLabel = (months: Frequency) =>
  `${months} ${months === 1 ? "month" : "months"}`;

type PurchaseState = {
  mode: PurchaseMode;
  setMode: (mode: PurchaseMode) => void;
  frequency: Frequency;
  setFrequency: (frequency: Frequency) => void;
  price: Money;
  subscribePrice: Money;
  /** Price for the selected mode. */
  selectedPrice: Money;
  buttonLabel: string;
  canBuy: boolean;
  pending: boolean;
  error: string | null;
  add: () => void;
  /** Ref for the buy panel's button; the sticky bar shows once it's scrolled past. */
  panelButtonRef: (el: HTMLElement | null) => () => void;
  panelButtonScrolledPast: boolean;
};

const PurchaseContext = createContext<PurchaseState | null>(null);

export function usePurchase(): PurchaseState {
  const value = use(PurchaseContext);
  if (!value) throw new Error("usePurchase must be used inside <PurchaseProvider>");
  return value;
}

export function PurchaseProvider({
  variantId,
  price,
  status,
  children,
}: {
  variantId: string | undefined;
  price: Money;
  status: CompositionStatus;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<PurchaseMode>("one-time");
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [panelButtonScrolledPast, setScrolledPast] = useState(false);

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

  const add = () => {
    if (!variantId || !canBuy) return;
    setError(null);
    startTransition(async () => {
      const result = await addToCart(variantId);
      if (!result.ok) setError(result.error);
    });
  };

  // "Scrolled past" means the button has gone up under the sticky site header,
  // so the bar doesn't show on first load when the button is still below the
  // fold. The header's height changes at the lg breakpoint, so it's measured and
  // the observer is rebuilt whenever it resizes.
  const panelButtonRef = useCallback((el: HTMLElement | null) => {
    if (!el) return () => {};
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    let observer: IntersectionObserver | undefined;
    let observedHeight: number | undefined;

    const observe = () => {
      const headerHeight = header?.offsetHeight ?? 0;
      if (headerHeight === observedHeight) return; // width-only resize
      observedHeight = headerHeight;
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => {
          setScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < headerHeight);
        },
        { rootMargin: `-${headerHeight}px 0px 0px 0px` },
      );
      observer.observe(el);
    };

    observe();
    const resizeObserver = new ResizeObserver(observe);
    if (header) resizeObserver.observe(header);

    return () => {
      observer?.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <PurchaseContext
      value={{
        mode,
        setMode,
        frequency,
        setFrequency,
        price,
        subscribePrice,
        selectedPrice: mode === "subscribe" ? subscribePrice : price,
        buttonLabel,
        canBuy,
        pending,
        error,
        add,
        panelButtonRef,
        panelButtonScrolledPast,
      }}
    >
      {children}
    </PurchaseContext>
  );
}
