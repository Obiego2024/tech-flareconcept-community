import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// --- Types ---
export type User = {
  name: string;
  email: string;
};

export type StudentAccount = {
  name: string;
  email: string;
  joinedAt: string;
  lastLoginAt: string;
  status: "active" | "suspended";
};

type AuthContextType = {
  user: User | null;
  students: StudentAccount[];
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  setStudentSuspended: (email: string, suspended: boolean) => string | null;
  deleteStudent: (email: string) => string | null;
  logout: () => void;
};

// --- Constants & Helpers ---
const LOCAL_STORAGE_KEY = "tf-academy-demo-user";
const STUDENT_DIRECTORY_KEY = "tf-academy-student-directory-v1";
const ADMIN_EMAILS = new Set(["admin@techflareconcept.com", "comunity@comunity"]);

type StudentDirectory = {
  students: StudentAccount[];
  deletedEmails: string[];
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Checks if the provided email matches a supported admin email.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return ADMIN_EMAILS.has(email ? normalizeEmail(email) : "");
}

function readStudentDirectory(): StudentDirectory {
  try {
    const raw = localStorage.getItem(STUDENT_DIRECTORY_KEY);
    if (!raw) return { students: [], deletedEmails: [] };
    const parsed = JSON.parse(raw) as Partial<StudentDirectory>;
    return {
      students: Array.isArray(parsed.students)
        ? parsed.students.filter(
            (student): student is StudentAccount =>
              typeof student?.name === "string" &&
              typeof student.email === "string" &&
              typeof student.joinedAt === "string" &&
              typeof student.lastLoginAt === "string" &&
              (student.status === "active" || student.status === "suspended")
          )
        : [],
      deletedEmails: Array.isArray(parsed.deletedEmails)
        ? parsed.deletedEmails.filter((email): email is string => typeof email === "string")
        : [],
    };
  } catch {
    return { students: [], deletedEmails: [] };
  }
}

function writeStudentDirectory(directory: StudentDirectory): void {
  localStorage.setItem(STUDENT_DIRECTORY_KEY, JSON.stringify(directory));
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

function loadInitialStudents(): StudentAccount[] {
  const directory = readStudentDirectory();
  const currentUser = readUserFromStorage();
  if (
    !currentUser ||
    isAdminEmail(currentUser.email) ||
    directory.deletedEmails.includes(normalizeEmail(currentUser.email)) ||
    directory.students.some(
      (student) => normalizeEmail(student.email) === normalizeEmail(currentUser.email)
    )
  ) {
    return directory.students;
  }

  const now = new Date().toISOString();
  const nextDirectory: StudentDirectory = {
    ...directory,
    students: [
      ...directory.students,
      {
        ...currentUser,
        joinedAt: now,
        lastLoginAt: now,
        status: "active",
      },
    ],
  };
  try {
    writeStudentDirectory(nextDirectory);
  } catch {
    return nextDirectory.students;
  }
  return nextDirectory.students;
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
  const [students, setStudents] = useState<StudentAccount[]>(loadInitialStudents);

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

    const normalizedEmail = normalizeEmail(email);
    const directory = readStudentDirectory();
    if (directory.deletedEmails.includes(normalizedEmail)) {
      return "This account was removed. Contact an administrator for help.";
    }

    const student = directory.students.find(
      (account) => normalizeEmail(account.email) === normalizedEmail
    );
    if (student?.status === "suspended") {
      return "This account is suspended. Contact an administrator for help.";
    }

    const savedUser = readUserFromStorage();
    const isMatchingSavedUser =
      savedUser && normalizeEmail(savedUser.email) === normalizedEmail;

    const nextUser: User = isMatchingSavedUser
      ? savedUser
      : {
          name: student?.name ?? formatNameFromEmail(email),
          email: email.trim(),
        };

    if (!isAdminEmail(normalizedEmail)) {
      const now = new Date().toISOString();
      const nextDirectory: StudentDirectory = {
        ...directory,
        students: [
          ...directory.students.filter(
            (account) => normalizeEmail(account.email) !== normalizedEmail
          ),
          {
            name: nextUser.name,
            email: nextUser.email,
            joinedAt: student?.joinedAt ?? now,
            lastLoginAt: now,
            status: "active",
          },
        ],
      };
      try {
        writeStudentDirectory(nextDirectory);
      } catch {
        return "Could not save your account. Check browser storage and try again.";
      }
      setStudents(nextDirectory.students);
    }

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

    const normalizedEmail = normalizeEmail(email);
    const directory = readStudentDirectory();
    if (directory.deletedEmails.includes(normalizedEmail)) {
      return "This account was removed. Contact an administrator for help.";
    }
    if (directory.students.some((student) => normalizeEmail(student.email) === normalizedEmail)) {
      return "An account with this email already exists. Sign in instead.";
    }

    const nextUser = {
      name: name.trim(),
      email: email.trim(),
    };
    if (!isAdminEmail(normalizedEmail)) {
      const now = new Date().toISOString();
      const nextDirectory: StudentDirectory = {
        ...directory,
        students: [
          ...directory.students,
          { ...nextUser, joinedAt: now, lastLoginAt: now, status: "active" },
        ],
      };
      try {
        writeStudentDirectory(nextDirectory);
      } catch {
        return "Could not save your account. Check browser storage and try again.";
      }
      setStudents(nextDirectory.students);
    }
    persistUser(nextUser);

    return null; // Null indicates successful signup
  };

  const setStudentSuspended = (email: string, suspended: boolean): string | null => {
    const directory = readStudentDirectory();
    const normalizedEmail = normalizeEmail(email);
    const account = directory.students.find(
      (student) => normalizeEmail(student.email) === normalizedEmail
    );
    if (!account) return "Student account not found.";

    const nextDirectory: StudentDirectory = {
      ...directory,
      students: directory.students.map((student) =>
        normalizeEmail(student.email) === normalizedEmail
          ? { ...student, status: suspended ? "suspended" : "active" }
          : student
      ),
    };
    try {
      writeStudentDirectory(nextDirectory);
    } catch {
      return "Could not update this student. Check browser storage and try again.";
    }
    setStudents(nextDirectory.students);
    return null;
  };

  const deleteStudent = (email: string): string | null => {
    const directory = readStudentDirectory();
    const normalizedEmail = normalizeEmail(email);
    if (!directory.students.some((student) => normalizeEmail(student.email) === normalizedEmail)) {
      return "Student account not found.";
    }

    const nextDirectory: StudentDirectory = {
      students: directory.students.filter(
        (student) => normalizeEmail(student.email) !== normalizedEmail
      ),
      deletedEmails: [...new Set([...directory.deletedEmails, normalizedEmail])],
    };
    try {
      writeStudentDirectory(nextDirectory);
    } catch {
      return "Could not delete this student. Check browser storage and try again.";
    }
    setStudents(nextDirectory.students);
    return null;
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
    <AuthContext.Provider
      value={{ user, students, login, signup, setStudentSuspended, deleteStudent, logout }}
    >
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