/**
 * Shopify Storefront API (GraphQL) – mirrors companion-app gifts fetching.
 * Config from app.config.js extra (Expo injects .env there) or process.env.
 * Restart dev server after changing .env.
 */

import Constants from "expo-constants";
import { useQuery } from "@tanstack/react-query";

const PLACEHOLDER_TOKEN = "your_storefront_access_token_here";
const DEFAULT_STOREFRONT_URL =
  "https://speedregalo.myshopify.com/api/2026-01/graphql.json";

function getStorefrontConfig(): { url: string; token: string } | null {
  const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;
  const urlRaw =
    extra?.EXPO_PUBLIC_SHOPIFY_STOREFRONT_URL ??
    (typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_SHOPIFY_STOREFRONT_URL : undefined) ??
    DEFAULT_STOREFRONT_URL;
  const token =
    extra?.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ??
    (typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN : undefined) ??
    "";
  const url = String(urlRaw).replace(/\/$/, "");
  const hasValidToken =
    token && token !== PLACEHOLDER_TOKEN && String(token).trim().length > 0;
  if (!url || !hasValidToken) return null;
  return { url, token };
}

export const GIFT_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80";

export function isShopifyStorefrontConfigured(): boolean {
  return getStorefrontConfig() !== null;
}

export type StorefrontProduct = {
  id: string;
  name: string;
  price: string;
  image: string | null;
  handle: string | null;
};

const PRODUCTS_QUERY = `
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type ProductsQueryVariables = {
  first: number;
  sortKey?: "TITLE" | "CREATED_AT" | "PRICE" | "BEST_SELLING" | "ID";
  reverse?: boolean;
};

type ProductsQueryResponse = {
  data?: {
    products: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        featuredImage: { url: string } | null;
        priceRange?: {
          minVariantPrice?: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
  errors?: Array<{ message: string }>;
};

function formatPrice(amount: string, currencyCode: string): string {
  const value = Number.parseFloat(amount);
  if (Number.isNaN(value)) return amount;
  if (currencyCode === "PHP") {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value);
}

export async function fetchStorefrontProducts(options: {
  first?: number;
  sortKey?: ProductsQueryVariables["sortKey"];
  reverse?: boolean;
} = {}): Promise<StorefrontProduct[]> {
  const config = getStorefrontConfig();
  if (!config) {
    return [];
  }

  const { first = 24, sortKey, reverse } = options;

  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.token,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: {
        first,
        sortKey: sortKey ?? "TITLE",
        reverse: reverse ?? false,
      },
    }),
  });

  const text = await res.text();
  let json: ProductsQueryResponse;
  try {
    json = JSON.parse(text) as ProductsQueryResponse;
  } catch {
    throw new Error(
      `Storefront API error: ${res.status} ${res.statusText}. Body: ${text.slice(0, 200)}`
    );
  }

  if (!res.ok) {
    const msg =
      json.errors?.map((e) => e.message).join(", ") ||
      (json as unknown as { message?: string }).message ||
      text.slice(0, 200);
    throw new Error(`Storefront API ${res.status}: ${msg}`);
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  const nodes = json.data?.products?.nodes ?? [];
  return nodes.map((node) => {
    const price = node.priceRange?.minVariantPrice;
    return {
      id: node.id,
      name: node.title,
      price: price ? formatPrice(price.amount, price.currencyCode) : "",
      image: node.featuredImage?.url ?? null,
      handle: node.handle ?? null,
    };
  });
}

export type ProductsSort = "az" | "za" | "new";

function mapSortToStorefront(sort: ProductsSort): {
  sortKey: ProductsQueryVariables["sortKey"];
  reverse: boolean;
} {
  switch (sort) {
    case "az":
      return { sortKey: "TITLE", reverse: false };
    case "za":
      return { sortKey: "TITLE", reverse: true };
    case "new":
      return { sortKey: "CREATED_AT", reverse: true };
    default:
      return { sortKey: "TITLE", reverse: false };
  }
}

export function useStorefrontProducts(sort: ProductsSort, first = 24) {
  const { sortKey, reverse } = mapSortToStorefront(sort);
  return useQuery({
    queryKey: ["shopify", "products", first, sortKey, reverse],
    queryFn: () => fetchStorefrontProducts({ first, sortKey, reverse }),
    enabled: isShopifyStorefrontConfigured(),
    staleTime: 60 * 1000,
  });
}
