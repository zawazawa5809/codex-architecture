# AI Agent Architecture Atlas

## Handover [2026-03-09]
- [ ] [High] OpenCode の全変更をコミットする
  - Why: pnpm build / test / codex-review が全て ok だが未コミット
  - Context: 33ファイル新規 + 7ファイル変更。`git status` で確認。Conventional Commits: `feat: add OpenCode architecture section (7 sections, ja/en)`
  - Skills: `/fast-commit`
- [ ] [Med] OpenCode 用 E2E テストを追加する
  - Why: 計画の Phase 5 で `pnpm run test:e2e` + OpenCode テスト追加が予定されていたが未実施
  - Context: 既存 E2E は `pnpm run test:e2e` (Playwright, 33 tests)。`tests/` 以下を参照してパターン確認。OpenCode の /opencode, /en/opencode, 各 7 slug ページをカバー
- [ ] [Low] [slug].astro ページテンプレートを統一する
  - Why: codex/claude/opencode の `[slug].astro` が near-duplicate (simplify レビューで Medium 指摘)。今回スコープ外判断
  - Context: `src/pages/codex/[slug].astro`, `src/pages/claude/[slug].astro`, `src/pages/opencode/[slug].astro`, `src/pages/en/claude/[slug].astro`, `src/pages/en/opencode/[slug].astro` が同一構造。共通化オプション: (A) `src/pages/[agent]/[slug].astro` 統一ルート、(B) DocsPageLayout コンポーネント化
