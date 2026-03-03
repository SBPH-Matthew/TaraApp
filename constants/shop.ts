/**
 * Shop categories aligned with companion_app shopCategoriesFallback.
 * Image paths match web /shop/*.png; use require() in app for local assets.
 */

import { DUTY_FREE_SHOP_URL } from "@/services/dutyFreeProducts";

export type ShopCategory = {
  id: string;
  label: string;
  /** Web path e.g. /shop/frg.png; map to require() or { uri } in app */
  imagePath: string;
  /** External URL to open when the card is tapped */
  href: string;
};

/** Shop categories in display order – href defaults to the Duty Free shop */
export const SHOP_CATEGORY_IDS_AND_LABELS: Omit<ShopCategory, "imagePath">[] = [
  { id: "fragrance", label: "Fragrance & Perfume", href: DUTY_FREE_SHOP_URL },
  { id: "liquor", label: "Liquor & Wines", href: DUTY_FREE_SHOP_URL },
  { id: "gadgets", label: "Electronics & Gadgets", href: DUTY_FREE_SHOP_URL },
  { id: "fashion", label: "Fashion & Accessories", href: DUTY_FREE_SHOP_URL },
  { id: "snacks", label: "Confectionary and Snacks", href: DUTY_FREE_SHOP_URL },
  { id: "local", label: "Local Products", href: DUTY_FREE_SHOP_URL },
  { id: "toys", label: "Toys", href: DUTY_FREE_SHOP_URL },
  { id: "pasalubong", label: "Pasalubong Packs", href: DUTY_FREE_SHOP_URL },
];
