"use client";

import { useState } from "react";
import Modal from "../../playground/Modal";
import Tabs from "../../playground/Tabs";
import Disclosure from "../../playground/Disclosure";

export default function PlaygroundTest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Modal Test</h2>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Modal">
        <p>This is the modal content.</p>
        <input type="text" placeholder="Try tabbing here" />
      </Modal>

      <h2 style={{ marginTop: "2rem" }}>Tabs Test</h2>
      <Tabs
        tabs={[
          { id: "one", label: "Tab One", content: <p>Content for tab one.</p> },
          { id: "two", label: "Tab Two", content: <p>Content for tab two.</p> },
          { id: "three", label: "Tab Three", content: <p>Content for tab three.</p> },
        ]}
      />

      <h2 style={{ marginTop: "2rem" }}>Disclosure Test</h2>
      <Disclosure summary="Click to expand">
        <p>This is the hidden content that appears when expanded.</p>
      </Disclosure>
    </div>
  );
}