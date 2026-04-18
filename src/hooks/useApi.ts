import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  propertiesApi, agentsApi, blogsApi, testimonialsApi,
  statsApi, heroSlidesApi, settingsApi, inquiriesApi, categoriesApi
} from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// Only resolve to full URL if it's a backend upload path
// If backend is not set (production without backend), return empty so fallback kicks in
export function imgUrl(path?: string): string {
  if (!path) return "";
  // Already a full URL
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  // Backend upload path — only resolve if backend is configured and reachable
  if (path.startsWith("/uploads/")) {
    const isLocalhost = API_URL.includes("localhost") || API_URL.includes("127.0.0.1");
    if (isLocalhost && import.meta.env.PROD) return ""; // don't try localhost in production
    return `${API_URL}${path}`;
  }
  // Everything else (Vite bundled assets, /assets/..., etc.) — return as-is
  return path;
}

// Shared query options — fail fast, use fallback data
const publicQueryOpts = {
  retry: false,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
};

export const useProperties = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["properties", params], queryFn: () => propertiesApi.getAll(params), ...publicQueryOpts });

export const useProperty = (id: string) =>
  useQuery({ queryKey: ["property", id], queryFn: () => propertiesApi.getOne(id), enabled: !!id, ...publicQueryOpts });

export const useAgents = () =>
  useQuery({ queryKey: ["agents"], queryFn: agentsApi.getAll, ...publicQueryOpts });

export const useBlogs = () =>
  useQuery({ queryKey: ["blogs"], queryFn: blogsApi.getAll, ...publicQueryOpts });

export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: testimonialsApi.getAll, ...publicQueryOpts });

export const useStats = () =>
  useQuery({ queryKey: ["stats"], queryFn: statsApi.getAll, ...publicQueryOpts });

export const useHeroSlides = () =>
  useQuery({ queryKey: ["heroSlides"], queryFn: heroSlidesApi.getAll, ...publicQueryOpts });

export const useSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: settingsApi.get, ...publicQueryOpts });

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: categoriesApi.getAll, ...publicQueryOpts });

// Admin hooks — these need retries
export const useAdminProperties = () =>
  useQuery({ queryKey: ["admin-properties"], queryFn: () => propertiesApi.getAll() });

export const useAdminAgents = () =>
  useQuery({ queryKey: ["admin-agents"], queryFn: agentsApi.getAllAdmin });

export const useAdminBlogs = () =>
  useQuery({ queryKey: ["admin-blogs"], queryFn: blogsApi.getAllAdmin });

export const useAdminTestimonials = () =>
  useQuery({ queryKey: ["admin-testimonials"], queryFn: testimonialsApi.getAllAdmin });

export const useAdminHeroSlides = () =>
  useQuery({ queryKey: ["admin-hero-slides"], queryFn: heroSlidesApi.getAllAdmin });

export const useAdminInquiries = () =>
  useQuery({ queryKey: ["admin-inquiries"], queryFn: inquiriesApi.getAll });

export function useDeleteMutation(key: string, deleteFn: (id: string) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
