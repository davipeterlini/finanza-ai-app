import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../../src/services/storage";

describe("storage service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and retrieves value", () => {
    storage.set("test-key", { data: "value" });
    expect(storage.get("test-key", null)).toEqual({ data: "value" });
  });

  it("returns defaultValue when key does not exist", () => {
    expect(storage.get("inexistent", "fallback")).toBe("fallback");
  });

  it("removes item correctly", () => {
    storage.set("key", "value");
    storage.remove("key");
    expect(storage.get("key", null)).toBeNull();
  });

  it("handles transactions", () => {
    const tx = { id: "1", description: "Test", amount: 100, type: "expense" as const, category: "Alimentacao", date: "2024-01-01" };
    storage.addTransaction(tx);
    const txs = storage.getTransactions();
    expect(txs).toHaveLength(1);
    expect(txs[0].description).toBe("Test");
  });
});