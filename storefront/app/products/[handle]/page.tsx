import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BuyPanel } from "@/components/product/BuyPanel";
import { BrandGrid } from "@/components/product/BrandGrid";
import { DesktopGallery } from "@/components/product/DesktopGallery";
import { MobileGallery } from "@/components/product/MobileGallery";
import { PurchaseProvider } from "@/components/product/PurchaseContext";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import {
  compositionLabel,
  getCompositionNumber,
  getScentNotes,
  getSize,
  getStatus,
  toCompositions,
} from "@/lib/composition";
import { getProduct, getProducts } from "@/lib/shopify";

// One route for all six compositions. Each is prerendered, and the scent tiles
// link between them with client-side navigation, so switching composition
// swaps the page in place without a full reload.
export async function generateStaticParams() {
  return toCompositions(await getProducts()).map(({ handle }) => ({ handle }));
}

export async function generateMetadata(
  props: PageProps<"/products/[handle]">,
): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);
  return product
    ? { title: `${product.title} | Order of Things`, description: product.description }
    : {};
}

async function ProductHero({ params }: Pick<PageProps<"/products/[handle]">, "params">) {
  const { handle } = await params;
  const [product, products] = await Promise.all([getProduct(handle), getProducts()]);
  const number = product && getCompositionNumber(product);
  if (!product || !number) notFound();

  const notes = getScentNotes(product);
  const scentLabel = compositionLabel(number, product.title);
  const variant = product.variants[0];

  return (
    <PurchaseProvider
      variantId={variant?.id}
      price={variant?.price ?? product.priceRange.minVariantPrice}
      status={getStatus(product)}
    >
      <section className="relative mx-auto max-w-[1440px] lg:grid lg:grid-cols-[780fr_660fr] lg:items-start">
        <BrandGrid className="hidden lg:block" />
        <div className="relative">
          <DesktopGallery
            className="hidden lg:flex"
            compositionNumber={number}
            scentLabel={scentLabel}
            notes={notes}
          />
          <MobileGallery className="lg:hidden" />
        </div>
        <BuyPanel
          product={product}
          compositionNumber={number}
          scentLabel={scentLabel}
          compositions={toCompositions(products)}
          notes={notes}
        />
      </section>
      <StickyBuyBar
        compositionNumber={number}
        scentLabel={scentLabel}
        productType={product.productType}
        size={getSize(product)}
      />
    </PurchaseProvider>
  );
}

export default function ProductPage(props: PageProps<"/products/[handle]">) {
  return (
    // Bottom padding so the sticky buy bar never covers the end of the page.
    <main className="pb-[76px] lg:pb-20">
      <Suspense>
        <ProductHero params={props.params} />
      </Suspense>
    </main>
  );
}
