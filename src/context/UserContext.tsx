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
  };

  const register = async (formData: { name: string; email: string; password: string; phone?: string }) => {
    const data = await userAuthApi.register(formData) as { token: string; user: UserType };
    tokenStore.setUser(data.token);
    setUser(data.user);
  };

  const logout = () => {
    userAuthApi.logout();
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
