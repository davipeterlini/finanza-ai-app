import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils/test-utils";
import { Header } from "../../src/components/layout/Header";

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders app name", () => {
    render(<Header />);
    expect(screen.getByText("Finanza AI")).toBeInTheDocument();
  });
});