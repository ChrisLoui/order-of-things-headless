import "server-only";
import { cacheLife, cacheTag } from "next/cache";

// All Shopify Storefront API access lives in this file.

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-10";

// ---------- Types ----------

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

type Connection<T> = { nodes: T[] };

type ShopifyProduct = Omit<Product, "variants"> & {
  variants: Connection<ProductVariant>;
};

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

// ---------- Fetch helper ----------

export class ShopifyError extends Error {
  name = "ShopifyError";
}

export async function shopifyFetch<TData, TVariables = Record<string, never>>({
  query,
  variables,
}: {
  query: string;
  variables?: TVariables;
}): Promise<TData> {
  if (!domain || !token) {
    throw new ShopifyError(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local",
    );
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Storefront API responded ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new ShopifyError("Storefront API returned no data");
  }

  return json.data;
}

// ---------- Queries ----------

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

function reshapeProduct(product: ShopifyProduct): Product {
  return { ...product, variants: product.variants.nodes };
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products", `product:${handle}`);

  const data = await shopifyFetch<
    { product: ShopifyProduct | null },
    { handle: string }
  >({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return data.product ? reshapeProduct(data.product) : null;
}

export async function getProducts(first = 50): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const data = await shopifyFetch<
    { products: Connection<ShopifyProduct> },
    { first: number }
  >({
    query: PRODUCTS_QUERY,
    variables: { first },
  });

  return data.products.nodes.map(reshapeProduct);
}

// ---------- Cart ----------
// Carts are per-visitor, so none of these are cached.

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
  }
`;

const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

type CartMutationResult = {
  cart: Cart | null;
  userErrors: { message: string }[];
};

function unwrapCart({ cart, userErrors }: CartMutationResult): Cart {
  if (userErrors.length) {
    throw new ShopifyError(userErrors.map((e) => e.message).join("; "));
  }
  if (!cart) {
    throw new ShopifyError("Cart mutation returned no cart");
  }
  return cart;
}

/** Returns null when the cart no longer exists (expired or completed). */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }, { cartId: string }>({
    query: CART_QUERY,
    variables: { cartId },
  });
  return data.cart;
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<
    { cartCreate: CartMutationResult },
    { lines: CartLineInput[] }
  >({
    query: CART_CREATE_MUTATION,
    variables: { lines },
  });
  return unwrapCart(data.cartCreate);
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[],
): Promise<Cart> {
  const data = await shopifyFetch<
    { cartLinesAdd: CartMutationResult },
    { cartId: string; lines: CartLineInput[] }
  >({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  });
  return unwrapCart(data.cartLinesAdd);
}
