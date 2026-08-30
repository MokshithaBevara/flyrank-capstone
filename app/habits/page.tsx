"use client";

import { useState } from "react";
import AddHabitForm from "../../components/AddHabitForm";

export default function HabitsPage() {
  const [habits, setHabits] = useState<string[]>([]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Habits</h1>
      <p>Manage your habits here.</p>
      <AddHabitForm onAdd={(name) => setHabits((prev) => [...prev, name])} />
      <ul style={{ marginTop: "1rem" }}>
        {habits.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}