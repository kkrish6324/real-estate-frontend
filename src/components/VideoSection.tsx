import { Play } from "lucide-react";
import { useState } from "react";
import hero1 from "@/assets/hero-1.jpg";

const VideoSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <img src={hero1} alt="Modern house" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-dark-surface/70 flex flex-col items-center justify-center">
        <button
          onClick={() => setPlaying(true)}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform mb-6"
          aria-label="Play video"
        >
          <Play className="w-8 h-8 text-primary-foreground ml-1" />
        </button>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-surface-foreground text-center">
          Modern House Video
        </h2>
        <p className="text-dark-surface-foreground/70 mt-2">Take a virtual tour of our premium properties</p>
      </div>
      {playing && (
        <div className="absolute inset-0 z-20 bg-dark-surface flex items-center justify-center" onClick={() => setPlaying(false)}>
          <div className="text-dark-surface-foreground text-center">
            <p className="text-lg mb-2">Video Player Placeholder</p>
            <p className="text-sm text-dark-surface-foreground/60">Click to close</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
