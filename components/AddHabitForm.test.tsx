import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddHabitForm from "./AddHabitForm";

describe("AddHabitForm", () => {
  it("shows a validation error when submitted empty", async () => {
    const user = userEvent.setup();
    render(<AddHabitForm />);

    await user.click(screen.getByRole("button", { name: /add habit/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
  });

  it("calls onAdd with the trimmed habit name on valid submit", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddHabitForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText(/habit name/i), "  Morning run  ");
    await user.click(screen.getByRole("button", { name: /add habit/i }));

    expect(onAdd).toHaveBeenCalledWith("Morning run");
  });

  it("clears the input after a successful submit", async () => {
    const user = userEvent.setup();
    render(<AddHabitForm />);

    const input = screen.getByLabelText(/habit name/i) as HTMLInputElement;
    await user.type(input, "Read 20 minutes");
    await user.click(screen.getByRole("button", { name: /add habit/i }));

    expect(input.value).toBe("");
  });
});