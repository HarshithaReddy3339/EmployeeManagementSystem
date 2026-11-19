"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { extractApiError, getApiUrl, type AuthUser } from "../lib/api";

type AuthContextType = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<string | null> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Session expired");
      }

      const data = (await response.json()) as {
        accessToken: string;
        user: AuthUser;
      };

      setAccessToken(data.accessToken);
      setUser(data.user);
      return data.accessToken;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  // Restore the session when the application loads.
  useEffect(() => {
    async function restoreSession() {
      await refreshSession();
      setLoading(false);
    }

    restoreSession();
  }, [refreshSession]);

  // Login using the backend API.
  const login = useCallback(async (email: string, password: string) => {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(extractApiError(data, "Login failed"));
    }

    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  // Logout and revoke the backend session.
  const logout = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue clearing the local session.
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Use this hook in components that need authentication data.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
