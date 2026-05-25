import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { LanguageProvider } from "../../src/contexts/LanguageContext";
import { ToastProvider } from "../../src/contexts/ToastContext";
import { AuthProvider } from "../../src/contexts/AuthContext";

// Providers that all components need
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
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

export const mockAuthContext = (overrides = {}) => {
  vi.spyOn(AuthModule, "useAuth").mockReturnValue({
    user: mockSignedInUser,
    isLoading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  });
};