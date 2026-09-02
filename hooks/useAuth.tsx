"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  User,
  LoginInput,
  RegisterInput,
  AuthResponse,
} from "@/types/type";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------
  // Fetch current user
  // --------------------------------

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------
  // Initial load
  // --------------------------------

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // --------------------------------
  // Login
  // --------------------------------

  const login = async (input: LoginInput): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }

      setError(data.error || "Login failed.");
      return false;
    } catch {
      setError("An unexpected error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Register
  // --------------------------------

  const register = async (input: RegisterInput): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }

      setError(data.error || "Registration failed.");
      return false;
    } catch {
      setError("An unexpected error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Logout
  // --------------------------------

  const logout = async () => {
    try {
      setError(null);

      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
