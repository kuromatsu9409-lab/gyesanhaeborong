type Tab<TabId extends string> = {
  id: TabId;
  label: string;
};

type TabBarProps<TabId extends string> = {
  tabs: Tab<TabId>[];
  activeId: TabId;
  onChange: (id: TabId) => void;
};

export function TabBar<TabId extends string>({ tabs, activeId, onChange }: TabBarProps<TabId>) {
  return (
    <div className="tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={`tab-pill${tab.id === activeId ? ' tab-pill--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
