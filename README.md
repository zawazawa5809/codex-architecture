# Codex Architecture

AI コーディングエージェントの内部アーキテクチャを解説する教育サイト。現在は [OpenAI Codex CLI](https://github.com/openai/codex) を対象に、エージェントループ・ツールシステム・サンドボックスなどの仕組みをインタラクティブなダイアグラムとともに解説しています。

🌐 **Live Site:** [https://zawazawa5809.github.io/codex-architecture](https://zawazawa5809.github.io/codex-architecture)

## Features

- **8 セクションの詳細解説** — 概要、エージェントループ、ツールシステム、サンドボックス、承認フロー、設定、比較、まとめ
- **インタラクティブ SVG ダイアグラム** — React Islands として遅延読み込み（6 種類）
- **日本語 / 英語対応** — Astro built-in i18n routing
- **Lighthouse 全カテゴリ 100** — Performance, Accessibility, Best Practices, SEO
- **ダークテーマ固定** — CSS custom properties によるカラーパレット

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Astro 5](https://astro.build/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Interactive | [React 19](https://react.dev/) (Islands Architecture) |
| Content | MDX |
| Testing | Vitest + Playwright + axe-core |
| Deploy | GitHub Pages (GitHub Actions) |

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Setup

```bash
git clone https://github.com/zawazawa5809/codex-architecture.git
cd codex-architecture
pnpm install
```

### Development

```bash
pnpm run dev        # Start dev server at localhost:4321
```

### Build

```bash
pnpm run build      # Static build to dist/
pnpm run preview    # Preview the build
```

### Test

```bash
pnpm run test       # Vitest unit tests
pnpm run test:e2e   # Playwright E2E tests (33 tests)
```

## Project Structure

```
src/
├── pages/
│   ├── index.astro              # Landing page
│   ├── codex/[slug].astro       # Section pages (dynamic)
│   └── en/                      # English pages
├── content/
│   ├── ja/codex/                # Japanese MDX (01-08)
│   └── en/codex/                # English MDX (01-08)
├── diagrams/                    # React SVG diagram components
│   ├── ArchitectureOverview.tsx
│   ├── AgentLoop.tsx
│   ├── ToolSystem.tsx
│   ├── SandboxFlow.tsx
│   ├── ApprovalFlow.tsx
│   └── SqEqAnimation.tsx
├── components/                  # Astro/React components
├── layouts/                     # Page layouts
└── i18n/                        # Translation utilities
```

## Content Sections

| # | Section | Description |
|---|---------|-------------|
| 01 | Overview | Codex CLI の全体像 |
| 02 | Agent Loop | エージェントループの仕組み |
| 03 | Tool System | ツールシステムの設計 |
| 04 | Sandbox | サンドボックス実行環境 |
| 05 | Approval Flow | ユーザー承認フロー |
| 06 | Configuration | 設定とカスタマイズ |
| 07 | Comparison | 他のエージェントとの比較 |
| 08 | Takeaways | まとめと学び |

## License

MIT
