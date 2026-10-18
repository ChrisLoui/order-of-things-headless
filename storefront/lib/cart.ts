import "server-only";
import { cookies } from "next/headers";
import { getCart, type Cart } from "./shopify";

// The visitor's cart id lives in an httpOnly cookie, set by the cart actions.
export const CART_COOKIE = "cartId";

export async function getCartFromCookie(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  return cartId ? getCart(cartId) : null;
}
