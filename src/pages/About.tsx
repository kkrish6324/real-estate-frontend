import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Award, Users, Home, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero2 from "@/assets/hero-2.jpg";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";

const stats = [
  { icon: Home, value: "500+", label: "Premium Listings" },
  { icon: Users, value: "2,800+", label: "Happy Families" },
  { icon: TrendingUp, value: "12+", label: "Years of Excellence" },
  { icon: Award, value: "98%", label: "Client Satisfaction" },
];

const team = [
  { name: "Arjun Malhotra", role: "Founder & CEO", image: agent1, bio: "With 15+ years in luxury real estate, Arjun has closed over ₹500 crore in transactions across Mumbai, Delhi, and Bangalore." },
  { name: "Priya Sharma", role: "Head of Investments", image: agent2, bio: "A former investment banker, Priya brings deep financial acumen to help clients maximise returns on their real estate portfolios." },
  { name: "Rahul Kapoor", role: "Director of Sales", image: agent3, bio: "Rahul's network spans India's top developers and HNI buyers, ensuring our clients always get exclusive access and the best deals." },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-20 md:pt-24 min-h-screen">
      {/* Hero */}
      <section className="bg-muted section-padding">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">About Us</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-5">
            India's Most Trusted Luxury Real Estate Partner
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Since 2012, BuilderFlooor has been curating India's finest properties for discerning buyers and investors. We don't just sell homes — we match people with addresses that define their legacy.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={hero2} alt="Our Story" className="rounded-2xl w-full h-80 object-cover shadow-xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary text-sm font-medium tracking-widest uppercase">Our Story</span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2 mb-4">Built on Trust, Driven by Excellence</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BuilderFlooor was founded with a singular vision — to bring transparency, expertise, and white-glove service to India's luxury real estate market. What began as a boutique consultancy in Mumbai has grown into a pan-India platform trusted by thousands of HNI buyers, NRIs, and institutional investors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our team of 50+ specialists across 8 cities brings unparalleled local knowledge and global perspective to every transaction. We are RERA-registered, ISO-certified, and proud members of the National Association of Realtors India.
              </p>
              <Link to="/properties">
                <Button size="lg">Explore Properties</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center border border-border">
                <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-display text-3xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <span className="block text-primary text-sm font-medium text-center tracking-widest uppercase mb-2">Our Leadership</span>
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-subtitle">The experts behind India's most trusted luxury real estate platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl border border-border overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full aspect-square object-cover" />
                <div className="p-5">
                  <h3 className="font-display font-semibold text-card-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default About;
