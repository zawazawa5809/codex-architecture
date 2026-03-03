export const languages = {
  ja: "日本語",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "ja";

const translations = {
  ja: {
    "site.title": "AI Agent Architecture Atlas",
    "site.description": "AIコーディングエージェントのアーキテクチャを深く理解するための教育サイト",
    "nav.home": "ホーム",
    "nav.overview": "概要",
    "nav.agentLoop": "エージェントループ",
    "nav.toolSystem": "ツールシステム",
    "nav.sandbox": "サンドボックス",
    "nav.approval": "承認システム",
    "nav.config": "設定",
    "nav.comparison": "比較",
    "nav.takeaways": "まとめ",
    "hero.title": "Inside Codex CLI",
    "hero.subtitle": "AIコーディングエージェントの解剖学",
    "hero.stats": "60+ Rust crates | Multi-platform Sandbox | SQ/EQ Architecture",
    "footer.license": "コードスニペットの出典: OpenAI Codex CLI (Apache-2.0)",
    "section.whyStudy": "なぜエージェントアーキテクチャを学ぶのか？",
    "card.security": "Security Engineering",
    "card.securityDesc": "サンドボックスパターンは任意の不信頼コード実行に応用可能",
    "card.design": "System Design Patterns",
    "card.designDesc": "SQ/EQ, コンテキスト管理, ツールオーケストレーションは汎用設計パターン",
    "card.builder": "From User to Builder",
    "card.builderDesc": "内部を理解すれば自分のエージェントを構築できる",
  },
  en: {
    "site.title": "AI Agent Architecture Atlas",
    "site.description": "An educational site for deeply understanding AI coding agent architecture",
    "nav.home": "Home",
    "nav.overview": "Overview",
    "nav.agentLoop": "Agent Loop",
    "nav.toolSystem": "Tool System",
    "nav.sandbox": "Sandbox",
    "nav.approval": "Approval",
    "nav.config": "Config",
    "nav.comparison": "Comparison",
    "nav.takeaways": "Takeaways",
    "hero.title": "Inside Codex CLI",
    "hero.subtitle": "Anatomy of an AI Coding Agent",
    "hero.stats": "60+ Rust crates | Multi-platform Sandbox | SQ/EQ Architecture",
    "footer.license": "Code snippets sourced from: OpenAI Codex CLI (Apache-2.0)",
    "section.whyStudy": "Why Study Agent Architecture?",
    "card.security": "Security Engineering",
    "card.securityDesc": "Sandbox patterns are applicable to any untrusted code execution",
    "card.design": "System Design Patterns",
    "card.designDesc": "SQ/EQ, context management, tool orchestration are universal design patterns",
    "card.builder": "From User to Builder",
    "card.builderDesc": "Understanding internals enables building your own agents",
  },
} as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslation(lang: Lang) {
  return function t(key: keyof (typeof translations)["ja"]): string {
    return translations[lang][key] ?? translations[defaultLang][key] ?? key;
  };
}

export function getLocalePath(lang: Lang, path: string): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}
