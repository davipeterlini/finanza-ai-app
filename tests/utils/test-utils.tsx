import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { LanguageProvider } from "../../src/contexts/LanguageContext";
import { ToastProvider } from "../../src/contexts/ToastContext";

// Mock AuthContext before importing
vi.mock("../../src/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: { id: "1", name: "Test User", email: "test@example.com", avatar: "https://example.com/avatar.jpg" },
    isLoading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

// Providers that all components need
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </LanguageProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing-library for single imports
export * from "@testing-library/react";
export { customRender as render };

// Mock signed in user for tests
export const mockSignedInUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  avatar: "https://example.com/avatar.jpg",
  accessToken: "mock-token",
};