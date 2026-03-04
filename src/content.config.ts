import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const codexJa = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/ja/codex" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string(),
  }),
});

const codexEn = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/en/codex" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string(),
  }),
});

export const collections = { codex_ja: codexJa, codex_en: codexEn };
