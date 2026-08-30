import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatCoach from "./ChatCoach";

const mockUseChat = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useChat: () => mockUseChat(),
}));

describe("ChatCoach", () => {
  beforeEach(() => {
    mockUseChat.mockReset();
  });

  it("shows clickable starter prompts when there are no messages yet", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
      clearError: vi.fn(),
    });

    render(<ChatCoach />);

    expect(
      screen.getByRole("button", { name: /how is my morning run streak/i })
    ).toBeInTheDocument();
  });

  it("shows a loading skeleton while a response is pending", () => {
    mockUseChat.mockReturnValue({
      messages: [
        { id: "1", role: "user", parts: [{ type: "text", text: "hi" }] },
      ],
      sendMessage: vi.fn(),
      status: "submitted",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
      clearError: vi.fn(),
    });

    const { container } = render(<ChatCoach />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders assistant text once streaming completes", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "assistant",
          parts: [{ type: "text", text: "Here's a tip for your morning run." }],
        },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
      clearError: vi.fn(),
    });

    render(<ChatCoach />);
    expect(
      screen.getByText(/here's a tip for your morning run/i)
    ).toBeInTheDocument();
  });

  it("shows a designed error message with a retry button on failure", async () => {
    const regenerate = vi.fn();
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: new Error("network error"),
      regenerate,
      clearError: vi.fn(),
    });

    const user = userEvent.setup();
    render(<ChatCoach />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /retry last message/i })
    );
    expect(regenerate).toHaveBeenCalled();
  });
});