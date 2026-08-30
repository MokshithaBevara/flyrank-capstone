"use client";

import { useState } from "react";

export default function AddHabitForm({
  onAdd,
}: {
  onAdd?: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Habit name is required");
      return;
    }
    setError(null);
    onAdd?.(trimmed);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <label htmlFor="habit-name" className="block text-sm font-medium">
        Habit name
      </label>
      <input
        id="habit-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? "habit-name-error" : undefined}
        className="border rounded-md px-3 py-2 text-sm w-full"
      />
      {error && (
        <p id="habit-name-error" role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white text-sm rounded-md px-4 py-2"
      >
        Add habit
      </button>
    </form>
  );
}