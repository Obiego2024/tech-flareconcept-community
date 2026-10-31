import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// --- Types ---
export type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  logout: () => void;
};

// --- Constants & Helpers ---
const LOCAL_STORAGE_KEY = "tf-academy-demo-user";
const ADMIN_EMAIL = "comunity@comunity";

/**
 * Checks if the provided email matches the hardcoded Admin email.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}

/**
 * Helper function to safely retrieve the current user from localStorage.
 */
function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/**
 * Helper to generate a display name from an email address
 * e.g. "john.doe@example.com" -> "John Doe"
 */
function formatNameFromEmail(email: string): string {
  const username = email.trim().split("@")[0];
  return username
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// --- Context Setup ---
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readUserFromStorage);

  // Helper to persist user state in localStorage and component state
  const persistUser = (nextUser: User) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  /**
   * Demo Login Function:
   * Validates non-empty fields and stores either existing stored user or a dynamically generated profile.
   */
  const login = (email: string, password: string): string | null => {
    if (!email.trim() || !password.trim()) {
      return "Enter your email and password.";
    }

    const savedUser = readUserFromStorage();
    const isMatchingSavedUser =
      savedUser && savedUser.email.toLowerCase() === email.trim().toLowerCase();

    const nextUser: User = isMatchingSavedUser
      ? savedUser
      : {
          name: formatNameFromEmail(email),
          email: email.trim(),
        };

    persistUser(nextUser);
    return null; // Null indicates successful login with no error message
  };

  /**
   * Demo Signup Function:
   * Validates fields, checks basic email format and password length, then stores user.
   */
  const signup = (
    name: string,
    email: string,
    password: string
  ): string | null => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return "Complete all fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Enter a valid email address.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    persistUser({
      name: name.trim(),
      email: email.trim(),
    });

    return null; // Null indicates successful signup
  };

  /**
   * Logout Function:
   * Clears saved user from local storage and state.
   */
  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Custom Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}