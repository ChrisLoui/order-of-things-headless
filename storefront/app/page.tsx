import { notFound } from "next/navigation";
import { formatMoney, getProduct } from "@/lib/shopify";

// Temporary connection check. Replaced by the product page in later tasks.
export default async function Home() {
  const product = await getProduct("no-1-woody-vetiver");
  if (!product) notFound();

  return (
    <main className="p-10">
      <h1 className="text-h1">{product.title}</h1>
      <p className="text-label mt-4">
        {formatMoney(product.priceRange.minVariantPrice)}
      </p>
    </main>
  );
}
