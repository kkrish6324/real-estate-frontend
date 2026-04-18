import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";
import { useAgents, imgUrl } from "@/hooks/useApi";

const fallbackAgents = [
  { _id: "1", name: "Arjun Malhotra", role: "Luxury Property Specialist", image: agent1, phone: "+91 98100 11223", email: "arjun@builderflooor.com" },
  { _id: "2", name: "Priya Sharma", role: "Senior Investment Advisor", image: agent2, phone: "+91 98200 44556", email: "priya@builderflooor.com" },
  { _id: "3", name: "Rahul Kapoor", role: "Head of Premium Sales", image: agent3, phone: "+91 99300 77889", email: "rahul@builderflooor.com" },
];

const AgentsSection = () => {
  const { data: apiAgents } = useAgents();
  const agents = apiAgents?.length ? apiAgents : fallbackAgents;

  return (
    <section className="section-padding bg-dark-surface">
      <div className="container mx-auto">
        <span className="block text-primary text-sm font-medium text-center tracking-widest uppercase mb-2">
          Our Team
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-surface-foreground text-center mb-4">
          Our Agents
        </h2>
        <p className="text-dark-surface-foreground/60 text-center mb-12 max-w-2xl mx-auto">
          Meet the professionals dedicated to helping you find your perfect property.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {agents.map((agent: { _id: string; name: string; role: string; image?: string; phone?: string; email?: string }, i: number) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group text-center"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={imgUrl(agent.image) || agent1}
                  alt={agent.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-center gap-3">
                    {agent.phone && (
                      <a href={`tel:${agent.phone}`} aria-label={`Call ${agent.name}`} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary-foreground" />
                      </a>
                    )}
                    {agent.email && (
                      <a href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="font-display font-semibold text-dark-surface-foreground">{agent.name}</h3>
              <p className="text-sm text-dark-surface-foreground/60">{agent.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
