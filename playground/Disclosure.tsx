import { useState } from "react";

interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
}

export default function Disclosure({ summary, children }: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = `disclosure-content-${summary.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <button
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "0.5rem 0",
        }}
      >
        {/* Visual indicator of state; aria-expanded on the button already conveys this to AT */}
        <span aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
        {summary}
      </button>

      {/* Content is only rendered in the DOM when expanded, and focusable content
          inside it is naturally removed from the tab order when hidden */}
      {isExpanded && (
        <div id={contentId} style={{ padding: "0.5rem 1rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}