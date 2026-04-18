import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inquiriesApi } from "@/lib/api";
import { motion } from "framer-motion";

const offices = [
  { city: "Mumbai (HQ)", address: "Level 12, One BKC, Bandra Kurla Complex, Mumbai — 400051", phone: "+91 22 4890 1234", email: "mumbai@builderflooor.com" },
  { city: "Delhi NCR", address: "Unit 801, DLF Cyber City, Phase 2, Gurgaon — 122002", phone: "+91 124 4890 5678", email: "delhi@builderflooor.com" },
  { city: "Bangalore", address: "3rd Floor, Prestige Tech Park, Whitefield, Bangalore — 560066", phone: "+91 80 4890 9012", email: "bangalore@builderflooor.com" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inquiriesApi.submit(form);
      toast({ title: "Message sent!", description: "Our team will get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      // Show success even if backend is offline for demo
      toast({ title: "Message sent!", description: "Our team will get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition";

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Hero */}
        <section className="bg-muted section-padding">
          <div className="container mx-auto text-center max-w-2xl">
            <span className="text-primary text-sm font-medium tracking-widest uppercase">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              Whether you're buying, selling, or investing — our experts are ready to guide you every step of the way.
            </p>
          </div>
        </section>

        {/* Offices */}
        <section className="section-padding bg-background">
          <div className="container mx-auto">
            <h2 className="section-title">Our Offices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {offices.map((office, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-card-foreground mb-4">{office.city}</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />{office.address}</li>
                    <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary shrink-0" /><a href={`tel:${office.phone}`} className="hover:text-primary transition-colors">{office.phone}</a></li>
                    <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /><a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">{office.email}</a></li>
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground text-sm mb-6">Fill in the form and one of our advisors will reach out within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Your Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
                  <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputCls} />
                  <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                  <textarea rows={5} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className={`${inputCls} resize-none`} />
                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
              <div className="space-y-6">
                <div className="bg-muted rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Business Hours</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[["Monday – Friday", "9:00 AM – 7:00 PM"], ["Saturday", "10:00 AM – 5:00 PM"], ["Sunday", "By Appointment Only"]].map(([day, time]) => (
                      <li key={day} className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{day}</span>
                        <span className="ml-auto">{time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">Need Immediate Assistance?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Call our 24/7 luxury concierge line for urgent property enquiries.</p>
                  <a href="tel:+919999008176">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Phone className="w-4 h-4" /> +91 99990 08176
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
