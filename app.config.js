/** Expo config – loads .env and exposes EXPO_PUBLIC_* to the app via extra. */
require("dotenv").config();

module.exports = {
  expo: {
    ...require("./app.json").expo,
    extra: {
      EXPO_PUBLIC_SHOPIFY_STOREFRONT_URL:
        process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_URL,
      EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:
        process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
      EXPO_PUBLIC_DUTY_FREE_CDN_URL: process.env.EXPO_PUBLIC_DUTY_FREE_CDN_URL,
    },
  },
};
