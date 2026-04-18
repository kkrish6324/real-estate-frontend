import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Building2, Users, FileText, Star, BarChart2,
  Settings, MessageSquare, Image, Menu, X, LogOut, Layers, UserCheck
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: BarChart2, exact: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/agents", label: "Agents", icon: Users },
  { to: "/admin/users", label: "Users", icon: UserCheck },
  { to: "/admin/blogs", label: "Blog Posts", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/hero-slides", label: "Hero Slides", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/stats", label: "Stats", icon: BarChart2 },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const isActive = (item: { to: string; exact?: boolean }) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">BuilderFlooor Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 text-xs text-muted-foreground mb-1">{admin?.name} · {admin?.email}</div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="lg:hidden p-2 text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-foreground">
            {navItems.find((n) => isActive(n))?.label || "Admin"}
          </span>
          <Link to="/" className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
            <Home className="w-3 h-3" /> View Site
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
