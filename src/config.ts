// API configuration
export const CONFIG = {
  // Gemini API (via backend or proxy)
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",

  // Pluggy API (Brazilian Open Finance)
  PLUGGY_API_URL: "https://api.pluggy.com.br",
  PLUGGY_CLIENT_ID: import.meta.env.VITE_PLUGGY_CLIENT_ID || "",
  PLUGGY_REDIRECT_URI: window.location.origin + "/openfinance/callback",

  // Google OAuth
  GOOGLE_CLIENT_ID:
    (window as any).__ENV__?.VITE_GOOGLE_CLIENT_ID ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "",

  // App settings
  ENABLE_AI_FEATURES: true,
  ENABLE_OPEN_FINANCE: true,
} as const;

// Feature flags
export const FEATURES = {
  AI_ADVISOR: true,
  OPEN_FINANCE: true,
  GOOGLE_DRIVE_BACKUP: true,
  BUDGET_ALERTS: true,
} as const;