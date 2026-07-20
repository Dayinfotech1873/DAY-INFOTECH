import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1920&q=80', // Bamboo/green steps
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80', // Green-yellow winding road
  'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1920&q=80', // Tulip fields
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80', // Rolling hills, storm sky
  'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&w=1920&q=80', // Cherry blossoms & lake
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80', // Hills, blue sky, clouds
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80', // Pathway through green forest
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80'  // Single oak tree field
];

interface BackgroundSlideshowProps {
  active: boolean;
}

export function BackgroundSlideshow({ active }: BackgroundSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000); // Rotate every 6 seconds with a beautiful smooth cross-fade
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none no-print">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.12)), url("${BACKGROUND_IMAGES[index]}")`,
            backgroundAttachment: 'fixed'
          }}
        />
      </AnimatePresence>
      {/* Soft translucent ambient overlay for pristine content readability without any glass blur */}
      <div className="absolute inset-0 bg-white/5" />
    </div>
  );
}
