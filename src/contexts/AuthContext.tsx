import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = "finanza_auth_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile with access token
  const fetchUserProfile = useCallback(async (accessToken: string) => {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch Google profile");
    const profile = await res.json();
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      avatar: profile.picture,
      accessToken,
    };
  }, []);

  const signIn = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        setIsLoading(true);
        const userData = await fetchUserProfile(access_token);
        setUser(userData);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google OAuth error:", err);
      setIsLoading(false);
    },
  });

  const signOut = useCallback(() => {
    googleLogout();
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};