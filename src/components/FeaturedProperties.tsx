import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProperties } from "@/hooks/useApi";
import { sampleProperties } from "@/data/properties";

const FeaturedProperties = () => {
  const { data: apiProperties } = useProperties();
  const properties = apiProperties?.length ? apiProperties.slice(0, 6) : sampleProperties.slice(0, 6);

  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto">
        <span className="block text-primary text-sm font-medium text-center tracking-widest uppercase mb-2">
          Best Choices
        </span>
        <h2 className="section-title">Featured Properties</h2>
        <p className="section-subtitle">
          Handpicked properties offering the best value, location, and lifestyle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: { id: string; _id?: string }, i: number) => (
            <motion.div
              key={property._id || property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PropertyCard property={{ ...property, id: property._id || property.id }} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/properties">
            <Button size="lg" variant="outline">View All Properties</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
