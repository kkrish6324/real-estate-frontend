import { useParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sampleProperties } from "@/data/properties";
import { useState } from "react";
import { useProperty, imgUrl } from "@/hooks/useApi";
import { inquiriesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatINRShort, idFromSlug } from "@/lib/utils";

const PropertyDetails = () => {
  const { id: slug } = useParams();
  const id = slug ? idFromSlug(slug) : "";
  const { data: apiProperty, isLoading } = useProperty(id || "");
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const fallback = sampleProperties.find((p) => p.id === id);
  const property = apiProperty || fallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inquiriesApi.submit({ ...form, property: property?._id || property?.id });
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-20 text-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-20 text-center min-h-screen">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <Link to="/properties"><Button>Back to Listings</Button></Link>
        </div>
        <Footer />
      </>
    );
  }

  const images = property.images || [];

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4 py-8">
          <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden">
                <img
                  src={imgUrl(images[activeImage]) || images[activeImage]}
                  alt={property.title}
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? "border-primary" : "border-transparent"}`}
                    >
                      <img src={imgUrl(img) || img} alt="" className="w-20 h-16 object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2 capitalize">{property.type}</Badge>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-card-foreground">{property.title}</h1>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" /> {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-primary">{formatINRShort(property.price)}</div>
                  </div>
                </div>

                <div className="flex gap-6 py-4 border-y border-border my-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bed className="w-5 h-5" />
                      <div><div className="font-semibold text-card-foreground">{property.bedrooms}</div><div className="text-xs">Bedrooms</div></div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bath className="w-5 h-5" />
                      <div><div className="font-semibold text-card-foreground">{property.bathrooms}</div><div className="text-xs">Bathrooms</div></div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize className="w-5 h-5" />
                    <div><div className="font-semibold text-card-foreground">{property.area}</div><div className="text-xs">Sq Ft</div></div>
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{property.description}</p>

                <h3 className="font-display font-semibold text-lg text-card-foreground mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(property.amenities || []).map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" /> {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-28">
                <h3 className="font-display font-semibold text-lg text-card-foreground mb-4">Interested in this property?</h3>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                  <input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                  <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                  <textarea rows={4} placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  <Button className="w-full" size="lg" type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full flex items-center gap-2" type="button">
                    <Phone className="w-4 h-4" /> Call Agent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PropertyDetails;
