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
    "hero.cta": "解説を読む",
    "footer.licenseTitle": "ライセンス",
    "footer.licenseBody":
      "Codex CLI のコードスニペットは Apache License 2.0 に基づき使用しています。本サイトは独立した教育リソースであり、OpenAI との提携・推奨関係はありません。",
    "footer.noticeBody":
      "解析対象コードの一部には Ratatui および Meriyah のコンポーネントが含まれています。詳細な帰属表示は NOTICE ファイルをご覧ください。",
    "footer.copyright": "教育目的のみ",
    "footer.viewLicense": "Apache License 2.0",
    "footer.viewNotice": "NOTICE ファイルを見る",
    "index.status.available": "公開中",
    "index.status.comingSoon": "準備中",
    "index.codexDesc":
      "OpenAI のオープンソース AI コーディングエージェント。Rust + TypeScript ハイブリッドアーキテクチャ、マルチプラットフォームサンドボックス、SQ/EQ プロトコルを深掘り。",
    "index.cta.read": "解説を読む",
    "index.claudeDesc":
      "Anthropic の CLI ベース AI コーディングエージェント。Skills, Hooks, MCP, CLAUDE.md などの公開機能アーキテクチャを解説。",
    "nav.claude.overview": "概要",
    "nav.claude.claudeMd": "CLAUDE.md & Memory",
    "nav.claude.skills": "Skills",
    "nav.claude.hooks": "Hooks",
    "nav.claude.mcp": "MCP連携",
    "nav.claude.permissions": "権限 & セキュリティ",
    "nav.group.codex": "Codex CLI",
    "nav.group.claude": "Claude Code",
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
    "hero.cta": "Read the guide",
    "footer.licenseTitle": "License",
    "footer.licenseBody":
      "Code snippets from Codex CLI are used under the Apache License 2.0. This site is an independent educational resource and is not affiliated with or endorsed by OpenAI.",
    "footer.noticeBody":
      "Portions of analyzed code include components from Ratatui and Meriyah, used under their respective licenses. See the NOTICE file for full attribution.",
    "footer.copyright": "Educational use only",
    "footer.viewLicense": "Apache License 2.0",
    "footer.viewNotice": "View NOTICE file",
    "index.status.available": "Available",
    "index.status.comingSoon": "Coming Soon",
    "index.codexDesc":
      "OpenAI's open-source AI coding agent. Deep dive into the Rust + TypeScript hybrid architecture, multi-platform sandbox, and SQ/EQ protocol.",
    "index.cta.read": "Read the guide",
    "index.claudeDesc":
      "Anthropic's CLI-based AI coding agent. Explore the architecture of public features: Skills, Hooks, MCP, CLAUDE.md, and more.",
    "nav.claude.overview": "Overview",
    "nav.claude.claudeMd": "CLAUDE.md & Memory",
    "nav.claude.skills": "Skills",
    "nav.claude.hooks": "Hooks",
    "nav.claude.mcp": "MCP Integration",
    "nav.claude.permissions": "Permissions & Security",
    "nav.group.codex": "Codex CLI",
    "nav.group.claude": "Claude Code",
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

export function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

export function getLocalePath(lang: Lang, path: string): string {
  const basePath = getBasePath();
  if (lang === defaultLang) return `${basePath}${path}`;
  return `${basePath}/${lang}${path}`;
}
