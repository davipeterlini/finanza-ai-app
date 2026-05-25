import { describe, it, expect, vi, act } from "vitest";
import { render, screen } from "../utils/test-utils";
import { useToast } from "../../src/contexts/ToastContext";
import React from "react";

// Test consumer component
const TestConsumer: React.FC = () => {
  const { showToast } = useToast();
  return <button onClick={() => showToast("Test message", "success")}>Show Toast</button>;
};

describe("ToastContext", () => {
  it("displays toast when showToast is called", async () => {
    render(<TestConsumer />);
    const button = screen.getByText("Show Toast");

    await act(async () => {
      button.click();
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });
});