import { Landmark, Home, Building2, Factory } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useApi";

const iconMap: Record<string, React.ElementType> = { Landmark, Home, Building2, Factory };

const fallbackCategories = [
  { _id: "1", icon: "Landmark", label: "Plot", count: 48, type: "land" },
  { _id: "2", icon: "Home", label: "Residential", count: 214, type: "residential" },
  { _id: "3", icon: "Building2", label: "Commercial", count: 93, type: "commercial" },
  { _id: "4", icon: "Factory", label: "Industrial", count: 37, type: "industrial" },
];

const CategoriesSection = () => {
  const { data: apiCategories } = useCategories();
  const categories = apiCategories?.length ? apiCategories : fallbackCategories;

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <span className="block text-primary text-sm font-medium text-center tracking-widest uppercase mb-2">
          Our Categories
        </span>
        <h2 className="section-title">Explore Our Categories & Places</h2>
        <p className="section-subtitle">
          Discover the perfect property type that fits your needs and investment goals.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {categories.map((cat: { _id: string; icon: string; label: string; count: number; type: string }, i: number) => {
            const Icon = iconMap[cat.icon] || Home;
            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/properties?type=${cat.type}`}
                  className="flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <Icon className="w-7 h-7 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="font-display font-semibold text-card-foreground">{cat.label}</span>
                  {cat.count > 0 && (
                    <span className="text-sm text-muted-foreground">{cat.count} Listings</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
