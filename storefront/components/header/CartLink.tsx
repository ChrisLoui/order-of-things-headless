import { getCartFromCookie } from "@/lib/cart";

// Placeholder until there's a cart page: links to Shopify checkout once the cart has items.
export function CartLinkView({
  count,
  href,
}: {
  count: number;
  href?: string;
}) {
  const label = `Cart (${count})`;
  return href ? <a href={href}>{label}</a> : <span>{label}</span>;
}

export async function CartLink() {
  const cart = await getCartFromCookie().catch(() => null);
  const count = cart?.totalQuantity ?? 0;
  return <CartLinkView count={count} href={count > 0 ? cart?.checkoutUrl : undefined} />;
}
