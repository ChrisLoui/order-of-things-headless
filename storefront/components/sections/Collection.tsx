import Image from "next/image";
import Link from "next/link";
import { Rule } from "@/components/brand/Rule";
import { ArrowIcon } from "@/components/icons";
import { compositionLabel, getStatus, sortByComposition } from "@/lib/composition";
import { formatMoney } from "@/lib/money";
import type { ProductSummary } from "@/lib/shopify";

// Figma "The collection" (14:3871 desktop / 14:4043 mobile): "then the rest of
// the collection, offered and never pushed" (journey note 14:3371), so the
// first three compositions other than the current one, as Product Card / R2. Cards use the product's Shopify image once
// one is uploaded; until then, a local studio shot of the carton.
const PLACEHOLDER_IMAGE = "/images/collection-card-placeholder.jpg";
const CARD_COUNT = 3;

/** "Eau de Parfum" → "EDP", for the short mobile card label. */
const abbreviate = (text: string) =>
  text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

function Card({ product, number }: { product: ProductSummary; number: number }) {
  const label = compositionLabel(number, product.title);
  const price = formatMoney(product.priceRange.minVariantPrice);
  const image = product.featuredImage;
  const available = getStatus(product) === "available";

  const content = (
    <>
      <p className="flex h-[26px] items-center justify-between gap-2 bg-charcoal px-2 text-button-m text-bone">
        <span className="truncate">
          <span className="lg:hidden">
            No.{number} {abbreviate(product.productType)}
          </span>
          <span className="hidden lg:inline">
            {label} — {product.productType}
          </span>
        </span>
        <span>{price}</span>
      </p>
      <div className="relative aspect-[169/240] lg:aspect-[449/470]">
        <Image
          src={image?.url ?? PLACEHOLDER_IMAGE}
          // Shopify returns "" or null when an image has no alt text.
          alt={image?.altText || label}
          fill
          sizes="(min-width: 1440px) 449px, (min-width: 1024px) 31vw, 169px"
          className="object-cover"
        />
      </div>
    </>
  );

  return available ? (
    <Link href={`/products/${product.handle}`} className="block">
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  );
}

export function Collection({
  products,
  currentHandle,
}: {
  products: ProductSummary[];
  currentHandle: string;
}) {
  const cards = sortByComposition(products)
    .filter(({ product }) => product.handle !== currentHandle)
    .slice(0, CARD_COUNT);

  const allFragrance = (
    <a
      href="#"
      className="group flex h-11 items-center justify-between border border-ink px-4 text-button-m focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:w-60"
    >
      All fragrance
      <ArrowIcon className="transition-transform duration-150 ease-out group-hover:translate-x-1" />
    </a>
  );

  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-[41px] pb-10 lg:px-[30px] lg:pt-[61px] lg:pb-[60px]">
      <Rule size="section" />
      <div className="mt-8 flex items-center justify-between lg:mt-10">
        <h2 className="text-h2 uppercase">The collection</h2>
        <div className="hidden lg:block">{allFragrance}</div>
      </div>

      {/* Mobile: a horizontal scroller that bleeds to the screen edge. */}
      <ul className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0">
        {cards.map(({ product, number }) => (
          <li key={product.handle} className="w-[169px] shrink-0 snap-start lg:w-auto">
            <Card product={product} number={number} />
          </li>
        ))}
      </ul>

      <div className="mt-8 lg:hidden">{allFragrance}</div>
    </section>
  );
}
