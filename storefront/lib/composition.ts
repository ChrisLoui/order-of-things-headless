import type { Product } from "./shopify";

// Helpers that read the composition conventions out of product tags:
// `composition-N`, `coming-soon`, and scent notes as `top:` / `heart:` / `base:`.

export type ScentNotes = { top: string; heart: string; base: string };

export function getCompositionNumber(product: Product): number | null {
  for (const tag of product.tags) {
    const match = /^composition-(\d+)$/.exec(tag);
    if (match) return Number(match[1]);
  }
  return null;
}

export function isComingSoon(product: Product): boolean {
  return !product.availableForSale || product.tags.includes("coming-soon");
}

export function getScentNotes(product: Product): ScentNotes | null {
  const note = (stage: keyof ScentNotes) =>
    product.tags.find((tag) => tag.startsWith(`${stage}:`))?.slice(stage.length + 1);

  const top = note("top");
  const heart = note("heart");
  const base = note("base");
  return top && heart && base ? { top, heart, base } : null;
}

/** "Woody Vetiver" → "Vetiver", as the scent tiles show it. */
export function getShortName(product: Product): string {
  return product.title.split(" ").at(-1) ?? product.title;
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
  comingSoon: boolean;
};

/** The six compositions in order, for the scent selector. */
export function toCompositions(products: Product[]): Composition[] {
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
              comingSoon: isComingSoon(product),
            },
          ];
    })
    .sort((a, b) => a.number - b.number);
}
