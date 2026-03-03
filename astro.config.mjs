import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TODO: Set to your GitHub Pages URL (e.g., "https://<user>.github.io/<repo>")
  // site: "https://example.github.io/codex-architecture",
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
