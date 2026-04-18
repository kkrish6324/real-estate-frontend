import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useSettings } from "@/hooks/useApi";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Blog", to: "/#blog" },
];

const categoryLinks = [
  { label: "Residential", to: "/properties?type=residential" },
  { label: "Commercial", to: "/properties?type=commercial" },
  { label: "Plot / Land", to: "/properties?type=land" },
  { label: "Industrial", to: "/properties?type=industrial" },
  { label: "All Listings", to: "/properties" },
];

const Footer = () => {
  const { data: rawSettings } = useSettings();
  const settings = rawSettings as Record<string, string> | undefined;

  return (
    <footer className="bg-dark-surface text-dark-surface-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/image.png" alt="BuilderFlooor" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-dark-surface-foreground/60 text-sm leading-relaxed mb-4">
              {settings?.tagline || "India's most trusted luxury real estate platform. Curating premium properties across Mumbai, Delhi, Bangalore & Hyderabad since 2012."}
            </p>
            <div className="flex gap-3">
              <a href={settings?.socialFacebook || "#"} aria-label="Facebook" className="w-9 h-9 rounded-full bg-dark-surface-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings?.socialTwitter || "#"} aria-label="Twitter" className="w-9 h-9 rounded-full bg-dark-surface-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={settings?.socialInstagram || "#"} aria-label="Instagram" className="w-9 h-9 rounded-full bg-dark-surface-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings?.socialLinkedin || "#"} aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-dark-surface-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-dark-surface-foreground/60">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-display font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-sm text-dark-surface-foreground/60">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Have a Question?</h4>
            <ul className="space-y-3 text-sm text-dark-surface-foreground/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                {settings?.address || "Level 12, One BKC, Bandra Kurla Complex, Mumbai — 400051"}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <a href={`tel:${settings?.phone || "+919999008176"}`} className="hover:text-primary transition-colors">
                  {settings?.phone || "+91 99990 08176"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <a href={`mailto:${settings?.email || "info@builderflooor.com"}`} className="hover:text-primary transition-colors">
                  {settings?.email || "info@builderflooor.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-dark-surface-foreground/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-dark-surface-foreground/40">
          <span>© 2026 BuilderFlooor. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/properties" className="hover:text-primary transition-colors">Listings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
