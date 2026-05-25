import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(`finanza_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      localStorage.setItem(`finanza_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("useLocalStorage write failed:", e);
    }
  };

  return [storedValue, setValue];
}