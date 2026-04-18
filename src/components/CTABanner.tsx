import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTABanner = () => (
  <section className="bg-primary">
    <div className="container mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
          Find Best Place For Living
        </h2>
        <p className="text-primary-foreground/80 mt-1">
          Spend less time searching and more time enjoying your new home.
        </p>
      </div>
      <Link to="/properties">
        <Button size="lg" variant="secondary">
          Get Started
        </Button>
      </Link>
    </div>
  </section>
);

export default CTABanner;
