"use client";

import { createContext, use, useCallback, useState, useTransition, type ReactNode } from "react";
import { addToCart } from "@/app/actions/cart";
import type { CompositionStatus } from "@/lib/composition";
import type { Money } from "@/lib/shopify";

// Purchase state shared by the buy panel and the sticky buy bar, so both buttons
// add the same variant with the same selected mode and show the same label.
//
// SUBSCRIBE & SAVE IS UI STATE ONLY. The store has no subscription app, so there
// is no selling plan to attach to the cart line. Selecting it shows the 10% price
// and the "Subscribe" button from the design, but the button stays disabled
// rather than adding a one-time line at full price. Wire it to a selling plan
// (cartLinesAdd sellingPlanId) once one exists.
const SUBSCRIBE_DISCOUNT = 0.1;

export type PurchaseMode = "one-time" | "subscribe";

type PurchaseState = {
  mode: PurchaseMode;
  setMode: (mode: PurchaseMode) => void;
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

    const observe = () => {
      observer?.disconnect();
      const headerHeight = header?.offsetHeight ?? 0;
      observer = new IntersectionObserver(
        ([entry]) => {
          setScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < headerHeight);
        },
        { rootMargin: `-${headerHeight}px 0px 0px 0px` },
      );
      observer.observe(el);
    };

    observe();
    const resizeObserver = header ? new ResizeObserver(observe) : undefined;
    if (header) resizeObserver?.observe(header);

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <PurchaseContext
      value={{
        mode,
        setMode,
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
