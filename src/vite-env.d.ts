/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly APP_VERSION: string;
}

interface Window {
  __ENV__?: {
    VITE_GOOGLE_CLIENT_ID?: string;
    APP_VERSION?: string;
    ENVIRONMENT?: string;
  };
}