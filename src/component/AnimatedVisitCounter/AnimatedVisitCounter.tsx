"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedVisitCounter({ count }: { count: number | null }) {
  const [displayCount, setDisplayCount] = useState<number | null>(count);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    if (count === null) return;

    if (displayCount !== null && count > displayCount) {
      // Trigger subtle spring count-up animation when count increases (+1)
      setIsIncrementing(true);
      const timer = setTimeout(() => setIsIncrementing(false), 1500);
      setDisplayCount(count);
      return () => clearTimeout(timer);
    } else {
      setDisplayCount(count);
    }
  }, [count, displayCount]);

  if (displayCount === null) {
    return null;
  }

  return (
    <span className="relative inline-flex items-center font-bold">
      <motion.span
        key={displayCount}
        initial={{ y: -6, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: isIncrementing ? [1, 1.15, 1] : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 20 }}
        className="inline-block text-darkHeadingColor font-bold"
      >
        {displayCount}
      </motion.span>
    </span>
  );
}
