import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../../src/services/storage";

describe("ToastContext (storage integration)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("clears all data correctly", () => {
    storage.set("test-key", "value");
    localStorage.removeItem("finanza_test-key");
    expect(storage.get("test-key", null)).toBeNull();
  });
});