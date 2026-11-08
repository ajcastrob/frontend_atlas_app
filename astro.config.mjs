// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import supersvgPlugin from "vite-plugin-supersvg";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [supersvgPlugin()],
  },

  fonts: [
    {
      name: "Playfair Display",
      cssVariable: "--font-display",
      provider: fontProviders.google(),
      weights: ["400 800"],
      styles: ["normal", "italic"],
      fallbacks: ["serif"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-ui",
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      fallbacks: ["serif"],
    },
    {
      name: "Inter",
      cssVariable: "--font-sans",
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ["normal"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
