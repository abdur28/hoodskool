"use client";

import { motion } from "framer-motion";

export default function Info() {
  return (
    <motion.section
      className="relative z-20 bg-background min-h-[150vh]"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl">
              WELCOME TO HOODSKOOL
            </h2>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/80">
              We're not just a brand, we're a movement. Born from the streets, 
              crafted with passion, and designed for those who dare to be different. 
              Each piece tells a story, your story.
            </p>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/80">
              From premium streetwear to handcrafted candles, we bring you a curated 
              collection that speaks to the culture. Quality over quantity, always.
            </p>
          </div>

          {/* Image/Visual */}
          <div className="relative h-[400px] md:h-[500px] bg-foreground/10 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading text-4xl text-foreground/20">
                IMAGE
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}