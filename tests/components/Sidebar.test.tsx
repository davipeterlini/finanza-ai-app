import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils/test-utils";
import { Sidebar } from "../../src/components/layout/Sidebar";

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation items", () => {
    render(<Sidebar currentView="dashboard" onViewChange={vi.fn()} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Transacoes")).toBeInTheDocument();
  });

  it("calls onViewChange when clicking nav item", async () => {
    const mockOnViewChange = vi.fn();
    render(<Sidebar currentView="dashboard" onViewChange={mockOnViewChange} />);

    // Click on transactions
    const transactionsBtn = screen.getByText("Transacoes");
    transactionsBtn.click();

    expect(mockOnViewChange).toHaveBeenCalledWith("transactions");
  });
});