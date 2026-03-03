/**
 * Duty-free featured products – mirrors companion-app dutyFreeProductsService.
 * Fetches from the same backend API and maps to display shape (title, image, price).
 * Uses TanStack Query for caching and stale/fresh data.
 */

import { useQuery } from "@tanstack/react-query";

const BASE_URL =
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_BACKEND_URL?.replace?.(/\/$/, "")) ||
  "https://www.dfp.springboard.com.ph";

const CDN_URL =
  typeof process !== "undefined" &&
  process.env?.EXPO_PUBLIC_DUTY_FREE_CDN_URL?.replace?.(/\/$/, "");

export type FeaturedProductApi = {
  id: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_special_price?: number;
  default_img?: string | null;
  images?: Array<{ image_path?: string }>;
};

export type DutyFreeProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  slug: string;
};

type FeaturedResponse = {
  status?: string;
  data?: FeaturedProductApi[];
};

function buildUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return BASE_URL ? `${BASE_URL}${normalized}` : normalized;
}

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";

function resolveImageUrl(path?: string | null): string {
  if (!path || typeof path !== "string" || !path.trim()) return FALLBACK_IMAGE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (CDN_URL) return `${CDN_URL}/${path.replace(/^\//, "")}`;
  return buildUrl(path);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function mapApiToDisplay(p: FeaturedProductApi): DutyFreeProduct {
  const price =
    p.product_special_price != null && p.product_special_price > 0
      ? p.product_special_price
      : p.product_price;
  const rawImage =
    p.default_img ?? p.images?.[0]?.image_path ?? "";
  const image = resolveImageUrl(rawImage || null);
  return {
    id: String(p.id),
    name: p.product_name,
    price: formatPrice(price),
    image: image || FALLBACK_IMAGE_URL,
    slug: p.product_slug,
  };
}

function extractProductList(payload: unknown): FeaturedProductApi[] {
  if (Array.isArray(payload)) return payload as FeaturedProductApi[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const inner = obj.data;
    if (Array.isArray(inner)) return inner as FeaturedProductApi[];
    if (
      inner &&
      typeof inner === "object" &&
      Array.isArray((inner as Record<string, unknown>).data)
    ) {
      return (inner as { data: FeaturedProductApi[] }).data;
    }
  }
  return [];
}

export async function fetchFeaturedProducts(): Promise<DutyFreeProduct[]> {
  if (!BASE_URL) return [];
  try {
    const res = await fetch(buildUrl("/api/products/featured"));
    if (!res.ok) return [];
    const json = (await res.json()) as FeaturedResponse;
    const raw = json.data ?? json;
    const list = extractProductList(raw);
    return list.map((item) => mapApiToDisplay(item));
  } catch {
    return [];
  }
}

/** TanStack Query hook: cached featured products with 1min staleTime. */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["duty-free", "featured-products"],
    queryFn: fetchFeaturedProducts,
    enabled: Boolean(BASE_URL),
    staleTime: 60 * 1000,
  });
}

const DUTY_FREE_STORE_BASE =
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_DUTY_FREE_STORE_URL?.replace?.(/\/$/, "")) ||
  BASE_URL;

export const DUTY_FREE_SHOP_URL = "https://shop.dutyfree.gov.ph/";

export function getDutyFreeShopUrl(): string {
  return `${DUTY_FREE_STORE_BASE}/shop`;
}

export function getDutyFreeProductUrl(slug: string): string {
  return `${DUTY_FREE_STORE_BASE}/shop/${encodeURIComponent(slug)}`;
}
