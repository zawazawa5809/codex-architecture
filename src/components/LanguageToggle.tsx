import { useState } from "react";
import { type Lang, getLocalePath } from "../i18n/utils";

interface Props {
  lang: Lang;
}

export default function LanguageToggle({ lang }: Props) {
  const [currentLang, setCurrentLang] = useState<Lang>(lang);

  function toggle() {
    const next: Lang = currentLang === "ja" ? "en" : "ja";
    setCurrentLang(next);
    const path = window.location.pathname.replace(/^\/(en|ja)/, "") || "/";
    window.location.href = getLocalePath(next, path);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-indigo)] hover:text-[var(--color-text-primary)]"
      aria-label="Toggle language"
    >
      <span className={currentLang === "ja" ? "text-[var(--color-accent-cyan)]" : ""}>JP</span>
      <span className="text-[var(--color-text-muted)]">/</span>
      <span className={currentLang === "en" ? "text-[var(--color-accent-cyan)]" : ""}>EN</span>
    </button>
  );
}
