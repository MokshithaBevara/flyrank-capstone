import { useState, useRef, KeyboardEvent } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let newIndex: number | null = null;

    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    }

    if (newIndex !== null) {
      e.preventDefault();
      setActiveIndex(newIndex);
      // Move actual keyboard focus to the newly selected tab
      tabRefs.current[newIndex]?.focus();
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Example Tabs" style={{ display: "flex", gap: "0.5rem" }}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`panel-${tab.id}`}
            // Only the active tab is in the normal tab order; others are reached via arrow keys
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              padding: "0.5rem 1rem",
              fontWeight: activeIndex === index ? "bold" : "normal",
              borderBottom: activeIndex === index ? "2px solid blue" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          style={{ padding: "1rem" }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}