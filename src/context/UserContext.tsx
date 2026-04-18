import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { userAuthApi, tokenStore } from "@/lib/api";

interface UserType {
  id: string; name: string; email: string; phone?: string; savedProperties?: string[];
}
interface UserContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

/** Set only after explicit login/register in this tab — not when /users/me succeeds via cookie alone. */
const EXPLICIT_SESSION_KEY = "bf_explicit_user_session";

export function hasExplicitUserSession(): boolean {
  try {
    return sessionStorage.getItem(EXPLICIT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markExplicitSession() {
  try {
    sessionStorage.setItem(EXPLICIT_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function clearExplicitSession() {
  try {
    sessionStorage.removeItem(EXPLICIT_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await userAuthApi.me();
      setUser(data as UserType);
    } catch {
      tokenStore.clearUser();
      setUser(null);
    }
  };

  useEffect(() => {
    // Avoid session probe on pages that don't need user auth.
    const needsUserAuth = window.location.pathname.startsWith("/properties/");
    if (!needsUserAuth) {
      setLoading(false);
      return;
    }

    // Restore session via HTTP-only refresh token cookie
    userAuthApi.me()
      .then((data) => setUser(data as UserType))
      .catch(() => tokenStore.clearUser())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await userAuthApi.login(email, password) as { token: string; user: UserType };
    tokenStore.setUser(data.token);
    setUser(data.user);
    markExplicitSession();
  };

  const register = async (formData: { name: string; email: string; password: string; phone?: string }) => {
    const data = await userAuthApi.register(formData) as { token: string; user: UserType };
    tokenStore.setUser(data.token);
    setUser(data.user);
    markExplicitSession();
  };

  const logout = () => {
    userAuthApi.logout();
    clearExplicitSession();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
