import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
}

export default function TabSwitcher({ tabs, defaultTab }: Props) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div className="my-6">
      <div className="flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[var(--color-accent-indigo)] text-white shadow-lg shadow-[var(--color-accent-indigo)]/20"
                : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
