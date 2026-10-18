import type { Product, ProductSummary } from "./shopify";

// Helpers that read the composition conventions out of product tags:
// `composition-N`, `coming-soon`, and scent notes as `top:` / `heart:` / `base:`.

/**
 * `coming-soon` is a tagged, unreleased composition. `sold-out` is a released
 * one that's temporarily out of stock. Both can't be bought.
 */
export type CompositionStatus = "available" | "sold-out" | "coming-soon";

/** The three stages of a scent, in wear order. */
export const SCENT_STAGES = [
  { key: "top", label: "Top" },
  { key: "heart", label: "Heart" },
  { key: "base", label: "Base" },
] as const;

export type ScentStage = (typeof SCENT_STAGES)[number]["key"];
export type ScentNotes = Record<ScentStage, string>;

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

/** The variant's Size option, e.g. "50 ml". */
export function getSize(product: Product): string | undefined {
  return product.variants[0]?.selectedOptions.find((o) => o.name === "Size")?.value;
}

const ML_PER_FL_OZ = 29.5735;

/** "50 ml" → "50 ml / 1.7 fl oz", as printed on the carton. */
export function withFluidOunces(size: string): string {
  const ml = Number.parseFloat(size);
  return Number.isNaN(ml) ? size : `${size} / ${(ml / ML_PER_FL_OZ).toFixed(1)} fl oz`;
}

export type Composition = {
  number: number;
  handle: string;
  title: string;
  shortName: string;
  status: CompositionStatus;
};

/** Products that carry a composition-N tag, with that number, in composition order. */
export function sortByComposition<P extends ProductSummary>(
  products: P[],
): { product: P; number: number }[] {
  return products
    .flatMap((product) => {
      const number = getCompositionNumber(product);
      return number === null ? [] : [{ product, number }];
    })
    .sort((a, b) => a.number - b.number);
}

/** The six compositions in order, for the scent selector. */
export function toCompositions(products: ProductSummary[]): Composition[] {
  return sortByComposition(products).map(({ product, number }) => ({
    number,
    handle: product.handle,
    title: product.title,
    shortName: getShortName(product),
    status: getStatus(product),
  }));
}
