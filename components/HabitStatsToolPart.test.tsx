import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HabitStatsToolPart from "./HabitStatsToolPart";

describe("HabitStatsToolPart", () => {
  it("shows a loading message while input is streaming", () => {
    render(<HabitStatsToolPart part={{ state: "input-streaming" }} />);
    expect(screen.getByText(/looking up habit/i)).toBeInTheDocument();
  });

  it("shows which habit is being checked once input is available", () => {
    render(
      <HabitStatsToolPart
        part={{ state: "input-available", input: { habitName: "morning run" } }}
      />
    );
    expect(screen.getByText(/checking stats for/i)).toBeInTheDocument();
    expect(screen.getByText(/morning run/i)).toBeInTheDocument();
  });

  it("renders the stat numbers when the tool succeeds", () => {
    render(
      <HabitStatsToolPart
        part={{
          state: "output-available",
          input: { habitName: "morning run" },
          output: {
            habitName: "morning run",
            streak: 12,
            completionRate: 0.8,
            totalDays: 15,
          },
        }}
      />
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("renders a designed error message when the tool fails", () => {
    render(<HabitStatsToolPart part={{ state: "output-error" }} />);
    expect(screen.getByText(/couldn.t find that habit/i)).toBeInTheDocument();
  });
});