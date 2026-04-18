import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import { useBlogs, imgUrl } from "@/hooks/useApi";
import { toPropertySlug } from "@/lib/utils";

const fallbackPosts = [
  { _id: "blog-interior-trends-001", image: blog1, title: "Top 10 Luxury Interior Design Trends Defining Indian Homes in 2026", createdAt: "2026-03-15", category: "Design & Lifestyle", description: "From japandi minimalism to biophilic design, discover the interior trends transforming India's most prestigious residences this year. Our design experts break down what's in, what's out, and how to achieve that coveted luxury aesthetic." },
  { _id: "blog-first-time-buyer-002", image: blog2, title: "The Ultimate Guide to Buying Your First Luxury Property in India", createdAt: "2026-03-10", category: "Buying Guide", description: "Navigating the luxury real estate market for the first time? From due diligence and RERA compliance to negotiation tactics and home loan strategies — this comprehensive guide covers everything you need to know before signing on the dotted line." },
  { _id: "blog-investment-hotspots-003", image: blog3, title: "India's Top 5 Real Estate Investment Hotspots for 2026", createdAt: "2026-03-05", category: "Investment Insights", description: "With infrastructure booming and demand surging, certain micro-markets are delivering extraordinary returns. Our analysts reveal the five cities and corridors offering the best capital appreciation and rental yields for savvy investors right now." },
];

const BlogSection = () => {
  const { data: apiBlogs } = useBlogs();
  const posts = apiBlogs?.length ? apiBlogs.slice(0, 3) : fallbackPosts;

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <span className="block text-primary text-sm font-medium text-center tracking-widest uppercase mb-2">
          Latest News
        </span>
        <h2 className="section-title">Recent Blog</h2>
        <p className="section-subtitle">
          Stay up to date with our latest articles and real estate insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: { _id: string; image?: string; title: string; createdAt: string; category: string; description?: string }, i: number) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${toPropertySlug(post.title, post._id)}`}
                className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all"
              >
                <div className="overflow-hidden aspect-[16/10]">
                  <img
                    src={imgUrl(post.image) || blog1}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="text-primary font-medium">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
