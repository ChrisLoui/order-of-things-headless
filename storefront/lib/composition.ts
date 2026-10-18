import type { ProductSummary } from "./shopify";

// Helpers that read the composition conventions out of product tags:
// `composition-N`, `coming-soon`, and scent notes as `top:` / `heart:` / `base:`.

/**
 * `coming-soon` is a tagged, unreleased composition. `sold-out` is a released
 * one that's temporarily out of stock. Both can't be bought.
 */
export type CompositionStatus = "available" | "sold-out" | "coming-soon";

export type ScentNotes = { top: string; heart: string; base: string };

export function getCompositionNumber(product: ProductSummary): number | null {
  for (const tag of product.tags) {
    const match = /^composition-(\d+)$/.exec(tag);
    if (match) return Number(match[1]);
  }
  return null;
}

export function getStatus(product: ProductSummary): CompositionStatus {
  if (product.tags.includes("coming-soon")) return "coming-soon";
  return product.availableForSale ? "available" : "sold-out";
}

export function getScentNotes(product: ProductSummary): ScentNotes | null {
  const note = (stage: keyof ScentNotes) =>
    product.tags.find((tag) => tag.startsWith(`${stage}:`))?.slice(stage.length + 1);

  const top = note("top");
  const heart = note("heart");
  const base = note("base");
  return top && heart && base ? { top, heart, base } : null;
}

/** "Woody Vetiver" → "Vetiver", as the scent tiles show it. */
export function getShortName(product: ProductSummary): string {
  return product.title.split(" ").at(-1) ?? product.title;
}

/** "No.1 Woody Vetiver", as the scent header and the carton print it. */
export function compositionLabel(number: number, title: string): string {
  return `No.${number} ${title}`;
}

/** Swatch color token from globals.css (`--color-composition-N`). */
export function swatchColor(number: number): string {
  return `var(--color-composition-${number})`;
}

export type Composition = {
  number: number;
  handle: string;
  title: string;
  shortName: string;
  status: CompositionStatus;
};

/** The six compositions in order, for the scent selector. */
export function toCompositions(products: ProductSummary[]): Composition[] {
  return products
    .flatMap((product) => {
      const number = getCompositionNumber(product);
      return number === null
        ? []
        : [
            {
              number,
              handle: product.handle,
              title: product.title,
              shortName: getShortName(product),
              status: getStatus(product),
            },
          ];
    })
    .sort((a, b) => a.number - b.number);
}
