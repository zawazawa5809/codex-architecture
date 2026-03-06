import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docsSchema = z.object({
  title: z.string(),
  order: z.number(),
  description: z.string(),
});

const codexJa = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/ja/codex" }),
  schema: docsSchema,
});

const codexEn = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/en/codex" }),
  schema: docsSchema,
});

const claudeJa = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/ja/claude" }),
  schema: docsSchema,
});

const claudeEn = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/en/claude" }),
  schema: docsSchema,
});

export const collections = {
  codex_ja: codexJa,
  codex_en: codexEn,
  claude_ja: claudeJa,
  claude_en: claudeEn,
};
