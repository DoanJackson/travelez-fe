"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const LOADING_PHRASES = [
  "Analyzing your travel preferences...",
  "Discovering the best destinations in Vietnam...",
  "Optimizing your travel route...",
  "Handpicking local experiences...",
  "Almost there...",
];

export function ItineraryLoadingBackground() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* YouTube iframe background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          className="absolute top-1/2 left-1/2 w-[200vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 border-0"
          src="https://www.youtube.com/embed/04Kf_0kppPM?autoplay=1&mute=1&controls=0&loop=1&playlist=04Kf_0kppPM&playsinline=1&rel=0&modestbranding=1"
          allow="autoplay"
          allowFullScreen={false}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Loader2 className="w-12 h-12 text-pink-500" />
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          TravelEZ is crafting your journey
        </motion.h2>

        <div className="h-8 min-w-96 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              className="text-lg text-white/90 font-medium text-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.8, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.4, ease: "easeIn" },
              }}
            >
              {LOADING_PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
