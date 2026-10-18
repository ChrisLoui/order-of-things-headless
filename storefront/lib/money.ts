import type { Money } from "./shopify";

// "A$369", "A$332.10": en-US prefixes non-USD dollars (A$) and whole amounts
// drop their decimals, as in the design.
export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    trailingZeroDisplay: "stripIfInteger",
  }).format(Number(amount));
}
