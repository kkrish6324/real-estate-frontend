import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Short display: 4500000 → "₹45L", 25000000 → "₹2.5Cr"
export function formatINRShort(amount: number): string {
  if (!amount) return "₹0";
  if (amount >= 1_00_00_000) return `₹${+(amount / 1_00_00_000).toFixed(2)}Cr`;
  if (amount >= 1_00_000) return `₹${+(amount / 1_00_000).toFixed(2)}L`;
  if (amount >= 1_000) return `₹${+(amount / 1_000).toFixed(1)}K`;
  return `₹${amount}`;
}

// Parse short input: "4L" → 400000, "2.5Cr" → 25000000, "50000" → 50000
export function parseINRShort(input: string): number {
  const s = input.trim().replace(/,/g, "").replace(/₹/g, "");
  const lower = s.toLowerCase();
  if (lower.endsWith("cr")) return Math.round(parseFloat(lower) * 1_00_00_000);
  if (lower.endsWith("c")) return Math.round(parseFloat(lower) * 1_00_00_000);
  if (lower.endsWith("l")) return Math.round(parseFloat(lower) * 1_00_000);
  if (lower.endsWith("k")) return Math.round(parseFloat(lower) * 1_000);
  return Math.round(parseFloat(s)) || 0;
}

// Generate SEO slug: "4 BHK Flat in Gurgaon" + id → "4-BHK-Flat-in-Gurgaon--abc123"
export function toPropertySlug(title: string, id: string): string {
  const slug = title
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "")   // remove special chars
    .replace(/\s+/g, "-")              // spaces to hyphens
    .substring(0, 80);                 // max length
  return `${slug}--${id}`;
}

// Extract MongoDB id from slug
export function idFromSlug(slug: string): string {
  const parts = slug.split("--");
  return parts[parts.length - 1];
}
