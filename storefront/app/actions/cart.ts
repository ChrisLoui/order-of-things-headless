"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { CART_COOKIE, getCartFromCookie } from "@/lib/cart";
import { addCartLines, createCart } from "@/lib/shopify";

export type AddToCartResult = { ok: true } | { ok: false; error: string };

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

export async function addToCart(variantId: string): Promise<AddToCartResult> {
  if (!VARIANT_GID.test(variantId)) {
    return { ok: false, error: "Unknown product variant." };
  }

  const lines = [{ merchandiseId: variantId, quantity: 1 }];

  try {
    // Reuse the visitor's cart while Shopify still has it; otherwise start a new one.
    const existing = await getCartFromCookie();
    const cart = existing
      ? await addCartLines(existing.id, lines)
      : await createCart(lines);

    (await cookies()).set(CART_COOKIE, cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 10, // Shopify keeps an inactive cart for 10 days.
    });
  } catch (error) {
    console.error("addToCart failed", error);
    return { ok: false, error: "Couldn't add to cart. Please try again." };
  }

  // Re-render the header so its cart count picks up the new quantity.
  refresh();
  return { ok: true };
}
