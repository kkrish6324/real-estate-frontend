import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { blogsApi } from "@/lib/api";
import { imgUrl } from "@/hooks/useApi";
import { idFromSlug } from "@/lib/utils";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

interface BlogData {
  _id?: string;
  title: string;
  category?: string;
  createdAt: string;
  image?: string;
  content?: string;
  description?: string;
}

const staticBlogs: Record<string, BlogData & { image: string }> = {
  "blog-interior-trends-001": {
    title: "Top 10 Luxury Interior Design Trends Defining Indian Homes in 2026",
    category: "Design & Lifestyle",
    createdAt: "2026-03-15",
    image: blog1,
    description: `India's luxury homes are undergoing a quiet revolution. The ultra-wealthy are no longer content with imported European aesthetics — they want spaces that feel globally refined yet deeply rooted in Indian sensibility.

1. Japandi Minimalism with Indian Accents
The fusion of Japanese wabi-sabi and Scandinavian simplicity, layered with handcrafted Indian textiles and brass accents, is dominating luxury interiors this year.

2. Biophilic Design
Floor-to-ceiling living walls, indoor water features, and natural stone surfaces are bringing the outdoors in — creating a sense of calm and connection with nature.

3. Bespoke Joinery & Millwork
Mass-produced furniture is out. Clients are commissioning custom cabinetry, hand-carved wooden panels, and artisanal shelving that tell a story.

4. Warm Neutral Palettes
Ivory, warm taupe, terracotta, and deep sage are replacing stark whites and greys, creating interiors that feel inviting and timeless.

5. Statement Ceilings
Coffered ceilings, hand-painted murals, and dramatic chandeliers are turning the fifth wall into a focal point.

6. Integrated Smart Home Technology
Invisible tech — hidden speakers, motorised blinds, and AI-controlled lighting — seamlessly woven into the design without disrupting aesthetics.

7. Spa-Inspired Bathrooms
Rainfall showers, freestanding soaking tubs, heated floors, and steam rooms are now standard in luxury master suites.

8. Curated Art Collections
Homeowners are investing in original Indian contemporary art, with dedicated gallery walls and museum-quality lighting.

9. Outdoor Living Spaces
Landscaped terraces, outdoor kitchens, and poolside lounges treated as extensions of the interior.

10. Sustainable Luxury
Reclaimed wood, recycled glass, and locally sourced stone — beauty with a conscience.`,
  },
  "blog-first-time-buyer-002": {
    title: "The Ultimate Guide to Buying Your First Luxury Property in India",
    category: "Buying Guide",
    createdAt: "2026-03-10",
    image: blog2,
    description: `Buying your first luxury property is one of the most significant financial decisions you will ever make. The premium segment comes with its own set of rules, nuances, and opportunities.

Understanding the Luxury Market
Luxury real estate in India is defined not just by price, but by location, exclusivity, design quality, and amenities. Properties above 5 crore in Tier-1 cities typically fall into this bracket.

RERA Compliance is Non-Negotiable
Always verify that the project is registered under RERA. This protects your investment and ensures the developer is accountable for timelines and quality.

Due Diligence Checklist
- Verify title deed and encumbrance certificate
- Check approved building plans and occupancy certificate
- Confirm FSI utilisation and any pending litigation
- Review the developer's track record and delivery history

Home Loan Strategies
Most banks offer home loans up to 10 crore for luxury properties. Keep your CIBIL score above 750 for the best terms.

Negotiation Tips
Luxury sellers often have more flexibility. A well-researched offer backed by comparable sales data can yield 5 to 15 percent below the asking price.

Working with a Specialist Advisor
The luxury market is relationship-driven. A specialist advisor like BuilderFlooor gives you access to off-market listings, developer relationships, and negotiation expertise.`,
  },
  "blog-investment-hotspots-003": {
    title: "India's Top 5 Real Estate Investment Hotspots for 2026",
    category: "Investment Insights",
    createdAt: "2026-03-05",
    image: blog3,
    description: `India's real estate market is experiencing a structural bull run, driven by infrastructure investment, urbanisation, and a growing affluent class.

1. Whitefield & Sarjapur Road, Bangalore
The tech corridor continues to attract global MNCs. With Namma Metro Phase 2 nearing completion, residential values are expected to appreciate 18 to 22 percent over the next 24 months.

2. Dwarka Expressway, Gurgaon
Now fully operational, this corridor is seeing 15 to 20 percent year-on-year appreciation with significant upside remaining.

3. Bandra-Kurla Complex, Mumbai
BKC remains India's most sought-after commercial address. Commercial yields here consistently outperform other markets at 6 to 8 percent.

4. Hyderabad's Financial District
Lower entry prices, superior infrastructure, and a business-friendly government make this one of the best risk-adjusted bets in India right now.

5. Aerocity & New Gurgaon, Delhi NCR
The upcoming Jewar International Airport is a game-changer. Land and residential values are still at early-stage pricing, offering significant upside for patient investors.

Our Recommendation
Diversify across at least two micro-markets. Combine a high-yield commercial asset with a capital-appreciation-focused residential play for a balanced portfolio.`,
  },
};

const BlogDetails = () => {
  const { slug } = useParams();
  const id = slug ? idFromSlug(slug) : "";
  const staticBlog = staticBlogs[id];

  const { data: apiBlog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogsApi.getOne(id),
    enabled: !!id && !staticBlog,
    retry: false,
  });

  const blog = (apiBlog as BlogData) || staticBlog;

  if (isLoading && !staticBlog) return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 text-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
      <Footer />
    </>
  );

  if (!blog) return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 text-center min-h-screen">
        <h1 className="font-display text-2xl font-bold mb-4">Blog not found</h1>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
      <Footer />
    </>
  );

  const coverImage = staticBlog?.image || imgUrl((blog as BlogData).image) || blog1;

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="rounded-xl overflow-hidden mb-6">
            <img src={coverImage} alt={blog.title} className="w-full aspect-[16/8] object-cover" />
          </div>
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
              {blog.category && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Tag className="w-3 h-3" /> {blog.category}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-card-foreground mb-6 leading-snug">
              {blog.title}
            </h1>
            <div className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
              {blog.content || blog.description || ""}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetails;
