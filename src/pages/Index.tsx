import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import VideoSection from "@/components/VideoSection";
import StatsSection from "@/components/StatsSection";
import CTABanner from "@/components/CTABanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import AgentsSection from "@/components/AgentsSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroCarousel />
      <CategoriesSection />
      <FeaturedProperties />
      <VideoSection />
      <StatsSection />
      <CTABanner />
      <TestimonialsSection />
      <AgentsSection />
      <BlogSection />
    </main>
    <Footer />
  </>
);

export default Index;
