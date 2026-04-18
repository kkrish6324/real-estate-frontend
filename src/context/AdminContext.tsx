import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, tokenStore } from "@/lib/api";

interface AdminUser { id: string; name: string; email: string; }
interface AdminContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Avoid admin auth probe on public/user pages.
    if (!window.location.pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    // Try to restore session via refresh token cookie (no localStorage token needed)
    authApi.me()
      .then((data) => setAdmin(data as AdminUser))
      .catch(() => tokenStore.clearAdmin())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password) as { token: string; admin: AdminUser };
    tokenStore.setAdmin(data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    authApi.logout();
    setAdmin(null);
  };

  return <AdminContext.Provider value={{ admin, login, logout, loading }}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
