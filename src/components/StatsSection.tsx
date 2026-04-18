import { motion } from "framer-motion";
import hero2 from "@/assets/hero-2.jpg";
import { useStats, useSettings } from "@/hooks/useApi";

const fallbackStats = [
  { _id: "1", value: "500", label: "Premium Listings", suffix: "+" },
  { _id: "2", value: "12", label: "Years of Excellence", suffix: "+" },
  { _id: "3", value: "2800", label: "Happy Families", suffix: "+" },
  { _id: "4", value: "98", label: "Client Satisfaction", suffix: "%" },
];

const StatsSection = () => {
  const { data: apiStats } = useStats();
  const { data: settings } = useSettings();
  const stats = apiStats?.length ? apiStats : fallbackStats;

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary text-sm font-medium tracking-widest uppercase">About Us</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              {settings?.siteName || "BuilderFlooor"} A Real Estate Company
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {settings?.aboutText || "With over a decade of expertise in India's premium real estate market, BuilderFlooor has curated some of the most coveted addresses across Mumbai, Delhi, Bangalore, and Hyderabad. We don't just sell properties — we match discerning clients with homes that reflect their aspirations. Our commitment to transparency, trust, and white-glove service has made us the preferred choice for luxury home buyers and investors alike."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat: { _id: string; value: string; label: string; suffix: string }, i: number) => (
                <motion.div
                  key={stat._id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl font-bold text-primary">
                    {stat.value}<span className="text-lg">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img src={hero2} alt="About BuilderFlooor" className="w-full h-80 md:h-96 object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
