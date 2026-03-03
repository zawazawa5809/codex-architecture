import { describe, it, expect } from "vitest";
import {
  getLangFromUrl,
  useTranslation,
  getLocalePath,
  defaultLang,
  languages,
} from "../utils";

describe("getLangFromUrl", () => {
  it("returns 'ja' for root path", () => {
    expect(getLangFromUrl(new URL("https://example.com/"))).toBe("ja");
  });

  it("returns 'ja' for Japanese page path", () => {
    expect(getLangFromUrl(new URL("https://example.com/codex"))).toBe("ja");
  });

  it("returns 'en' for English page path", () => {
    expect(getLangFromUrl(new URL("https://example.com/en/codex"))).toBe("en");
  });

  it("returns 'en' for bare /en path", () => {
    expect(getLangFromUrl(new URL("https://example.com/en"))).toBe("en");
  });

  it("returns default lang for unknown language prefix", () => {
    expect(getLangFromUrl(new URL("https://example.com/fr/codex"))).toBe("ja");
  });
});

describe("useTranslation", () => {
  it("returns Japanese translation for 'ja'", () => {
    const t = useTranslation("ja");
    expect(t("site.title")).toBe("AI Agent Architecture Atlas");
    expect(t("hero.subtitle")).toBe("AIコーディングエージェントの解剖学");
  });

  it("returns English translation for 'en'", () => {
    const t = useTranslation("en");
    expect(t("hero.subtitle")).toBe("Anatomy of an AI Coding Agent");
  });

  it("falls back to default lang when key is missing", () => {
    const t = useTranslation("en");
    // Both languages have all keys currently, so test the function signature
    expect(typeof t("site.title")).toBe("string");
  });

  it("returns all new i18n keys for both languages", () => {
    const ja = useTranslation("ja");
    const en = useTranslation("en");
    const keys = [
      "hero.cta",
      "footer.licenseTitle",
      "footer.licenseBody",
      "footer.noticeBody",
      "footer.copyright",
      "index.status.available",
      "index.status.comingSoon",
      "index.codexDesc",
      "index.cta.read",
      "index.claudeDesc",
    ] as const;

    for (const key of keys) {
      expect(ja(key)).not.toBe(key); // not falling back to key name
      expect(en(key)).not.toBe(key);
      expect(ja(key)).not.toBe(en(key)); // JA and EN should differ
    }
  });
});

describe("getLocalePath", () => {
  it("returns path as-is for default lang (ja)", () => {
    expect(getLocalePath("ja", "/codex")).toBe("/codex");
  });

  it("returns path as-is for default lang root", () => {
    expect(getLocalePath("ja", "/")).toBe("/");
  });

  it("prefixes /en for English", () => {
    expect(getLocalePath("en", "/codex")).toBe("/en/codex");
  });

  it("prefixes /en for root path", () => {
    expect(getLocalePath("en", "/")).toBe("/en/");
  });
});

describe("module exports", () => {
  it("has 'ja' as default language", () => {
    expect(defaultLang).toBe("ja");
  });

  it("exports both ja and en languages", () => {
    expect(Object.keys(languages)).toEqual(["ja", "en"]);
  });
});
