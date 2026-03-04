import { type Lang, getLocalePath, getBasePath } from "../i18n/utils";

interface Props {
  lang: Lang;
}

export default function LanguageToggle({ lang }: Props) {
  function toggle() {
    const next: Lang = lang === "ja" ? "en" : "ja";
    const basePath = getBasePath();
    const withoutBase = window.location.pathname.startsWith(basePath)
      ? window.location.pathname.slice(basePath.length)
      : window.location.pathname;
    const path = withoutBase.replace(/^\/(en|ja)/, "") || "/";
    window.location.href = getLocalePath(next, path);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-indigo)] hover:text-[var(--color-text-primary)]"
      aria-label="Toggle language"
    >
      <span className={lang === "ja" ? "text-[var(--color-accent-cyan)]" : ""}>JP</span>
      <span className="text-[var(--color-text-muted)]">/</span>
      <span className={lang === "en" ? "text-[var(--color-accent-cyan)]" : ""}>EN</span>
    </button>
  );
}
