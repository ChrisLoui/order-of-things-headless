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
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
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

// ---------- Formatting ----------

export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}
