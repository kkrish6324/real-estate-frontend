import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { UserProvider, useUser, hasExplicitUserSession } from "@/context/UserContext";
import Index from "./pages/Index.tsx";
import Properties from "./pages/Properties.tsx";
import PropertyDetails from "./pages/PropertyDetails.tsx";
import BlogDetails from "./pages/BlogDetails.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProperties from "./pages/admin/AdminProperties.tsx";
import AdminAgents from "./pages/admin/AdminAgents.tsx";
import AdminBlogs from "./pages/admin/AdminBlogs.tsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.tsx";
import AdminHeroSlides from "./pages/admin/AdminHeroSlides.tsx";
import AdminStats from "./pages/admin/AdminStats.tsx";
import AdminInquiries from "./pages/admin/AdminInquiries.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } });

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading } = useAdmin();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  // Block cookie-only sessions (e.g. old refresh token on production) until user signs in again this tab.
  if (!hasExplicitUserSession()) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname + window.location.search }} />;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: window.location.pathname + window.location.search }} />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <AdminProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<UserProtectedRoute><PropertyDetails /></UserProtectedRoute>} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute><AdminProperties /></ProtectedRoute>} />
            <Route path="/admin/agents" element={<ProtectedRoute><AdminAgents /></ProtectedRoute>} />
            <Route path="/admin/blogs" element={<ProtectedRoute><AdminBlogs /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/admin/hero-slides" element={<ProtectedRoute><AdminHeroSlides /></ProtectedRoute>} />
            <Route path="/admin/stats" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminProvider>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
