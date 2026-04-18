import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import agent1 from "@/assets/agent-1.jpg";
import { useTestimonials, imgUrl } from "@/hooks/useApi";

const fallbackTestimonials = [
  { _id: "1", name: "Vikram Singhania", role: "Luxury Home Buyer, Mumbai", avatar: agent1, text: "BuilderFlooor helped us find our dream penthouse in Bandra. Their team's knowledge of the luxury segment is unmatched — they understood exactly what we were looking for and delivered beyond expectations.", rating: 5 },
  { _id: "2", name: "Ananya Reddy", role: "Real Estate Investor, Hyderabad", avatar: agent1, text: "I've invested in three premium properties through BuilderFlooor and every transaction has been seamless. Their market insights and negotiation skills have consistently delivered exceptional returns.", rating: 5 },
  { _id: "3", name: "Rohit & Meera Gupta", role: "First-time Luxury Buyers, Gurgaon", avatar: agent1, text: "As first-time buyers in the luxury segment, we were overwhelmed. BuilderFlooor's advisors guided us with patience and expertise, making the entire journey enjoyable and stress-free.", rating: 5 },
];

const TestimonialsSection = () => {
  const { data: apiTestimonials } = useTestimonials();
  const testimonials = apiTestimonials?.length ? apiTestimonials : fallbackTestimonials;

  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto">
        <span className="block text-primary text-sm font-medium text-center tracking-widest uppercase mb-2">
          Testimonials
        </span>
        <h2 className="section-title">Clients We Help</h2>
        <p className="section-subtitle">
          Don't just take our word for it — hear from our satisfied clients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t: { _id: string; name: string; role: string; avatar?: string; text: string; rating: number }, i: number) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <img src={imgUrl(t.avatar) || agent1} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-semibold text-card-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
