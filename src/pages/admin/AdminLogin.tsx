import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminLogin = () => {
  const [mode, setMode] = useState<"login" | "setup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const { login } = useAdmin();
  const navigate = useNavigate();

  // Check if first-time setup is needed
  useEffect(() => {
    fetch(`${BASE}/auth/setup-status`)
      .then((r) => r.json())
      .then((d) => { if (d.setupRequired) setMode("setup"); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "setup") {
        // First-time setup
        const res = await fetch(`${BASE}/auth/setup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem("admin_token", data.token);
        navigate("/admin");
        window.location.reload();
      } else {
        await login(form.email, form.password);
        navigate("/admin");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">BuilderFlooor Admin</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          {mode === "setup" ? (
            <>
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6">
                <p className="text-sm text-primary font-medium">First-time setup</p>
                <p className="text-xs text-muted-foreground mt-0.5">No admin exists yet. Create your admin account below.</p>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">Create Admin Account</h1>
              <p className="text-muted-foreground text-sm mb-6">This can only be done once from this screen.</p>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">Admin Sign In</h1>
              <p className="text-muted-foreground text-sm mb-6">Access the admin dashboard</p>
            </>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "setup" && (
              <div>
                <label htmlFor="admin-name" className="text-sm font-medium text-foreground mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="admin-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => f("name", e.target.value)}
                    required
                    placeholder="Admin Name"
                    className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="text-sm font-medium text-foreground mb-1.5 block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => f("email", e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="text-sm font-medium text-foreground mb-1.5 block">
                Password {mode === "setup" && <span className="text-muted-foreground font-normal">(min. 6 characters)</span>}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => f("password", e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading
                ? mode === "setup" ? "Creating account..." : "Signing in..."
                : mode === "setup" ? "Create Admin Account" : "Sign In"
              }
            </Button>
          </form>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          {mode === "setup"
            ? "After setup, use these credentials to log in at /admin/login"
            : "Forgot credentials? Contact your system administrator."
          }
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
