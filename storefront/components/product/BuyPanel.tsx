import type { Composition, CompositionStatus, ScentNotes } from "@/lib/composition";
import { swatchColor } from "@/lib/composition";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/shopify";
import { PurchaseForm } from "./PurchaseForm";
import { ScentSelector } from "./ScentSelector";

// Figma 14:3744 (desktop) / 14:3909 (mobile): the buy panel beside the gallery.
// On desktop a bone "plate" covers the brand grid from the breadcrumb down to the
// details accordion, which sits on the grid (Figma Grid Plate 14:3707).

function Bar() {
  return <div className="h-2 bg-ink lg:h-3" />;
}

export function BuyPanel({
  product,
  compositionNumber,
  scentLabel,
  status,
  compositions,
}: {
  product: Product;
  compositionNumber: number;
  scentLabel: string;
  status: CompositionStatus;
  compositions: Composition[];
  notes: ScentNotes | null;
}) {
  const variant = product.variants[0];
  const size = variant?.selectedOptions.find((o) => o.name === "Size")?.value;
  const productType = product.productType;

  return (
    <div className="relative px-5 pt-7 pb-12 lg:pt-[31px] lg:pr-[67px] lg:pb-24 lg:pl-[69px]">
      <div className="lg:-mr-[67px] lg:-ml-[15px] lg:bg-bone lg:pr-[67px] lg:pb-6 lg:pl-[15px]">
        <nav aria-label="Breadcrumb" className="text-caption whitespace-pre opacity-55">
          {`Fragrance  /  ${productType}  /  No.${compositionNumber}`}
        </nav>

        <div className="mt-4 mb-4 lg:mb-5">
          <Bar />
        </div>

        <div className="flex flex-col gap-3 lg:gap-4">
          <p className="flex items-center gap-2.5 text-label">
            <span className="size-2.5 shrink-0" style={{ background: swatchColor(compositionNumber) }} />
            Composition No.{compositionNumber} — {productType}
          </p>
          <h1 className="text-h1 uppercase">{product.title}</h1>
        </div>

        <div className="mt-5 flex items-center justify-between border-y border-ink py-2 lg:mt-4">
          <p className="flex items-baseline gap-3">
            <span className="text-price">{formatMoney(product.priceRange.minVariantPrice)}</span>
            {/* Copy from the design (AU store). Revisit if the store stays on USD. */}
            <span className="text-body-m opacity-60">incl. GST</span>
          </p>
          <p className="text-label opacity-70">
            {productType}
            {size && ` · ${size}`}
          </p>
        </div>

        <p className="mt-5 text-body-m lg:mt-4">{product.description}</p>

        <div className="mt-4">
          <Bar />
        </div>

        <div className="mt-4">
          <ScentSelector
            compositions={compositions}
            currentHandle={product.handle}
            currentLabel={scentLabel}
          />
        </div>

        <div className="mt-5 lg:mt-4">
          <PurchaseForm
            variantId={variant?.id}
            price={variant?.price ?? product.priceRange.minVariantPrice}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}
