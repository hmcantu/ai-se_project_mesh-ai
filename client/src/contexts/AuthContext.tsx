import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!currentUser;

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      getCurrentUser()
        .then((res) => {
          // If the utility helper returned the user object directly inside the data envelope layer
          if (res && res.data) {
            setCurrentUser(res.data);
          } else if (res && (res as Record<string, unknown>).user) {
            setCurrentUser((res as Record<string, unknown>).user as CurrentUser);
          }
        })
        .catch(() => {
          localStorage.removeItem("auth-token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    checkSession();
  }, []);

  const login = (token: string, user: CurrentUser) => {
    localStorage.setItem("auth-token", token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}