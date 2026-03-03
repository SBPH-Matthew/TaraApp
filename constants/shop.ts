/**
 * Shop categories aligned with companion_app shopCategoriesFallback.
 * Image paths match web /shop/*.png; use require() in app for local assets.
 */

export type ShopCategory = {
  id: string;
  label: string;
  /** Web path e.g. /shop/frg.png; map to require() or { uri } in app */
  imagePath: string;
};

/** Shop categories in display order */
export const SHOP_CATEGORY_IDS_AND_LABELS: Omit<ShopCategory, "imagePath">[] = [
  { id: "fragrance", label: "Fragrance & Perfume" },
  { id: "liquor", label: "Liquor & Wines" },
  { id: "gadgets", label: "Electronics & Gadgets" },
  { id: "fashion", label: "Fashion & Accessories" },
  { id: "snacks", label: "Confectionary and Snacks" },
  { id: "local", label: "Local Products" },
  { id: "toys", label: "Toys" },
  { id: "pasalubong", label: "Pasalubong Packs" },
];
