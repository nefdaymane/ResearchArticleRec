"use client";

import { useEffect, useState } from "react";
import { BookOpenIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const [dots, setDots] = useState(".");

  // Dot Animation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0D1B2A] text-white">
      {/* Animated Book Icon */}
      <motion.div
        className="flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <BookOpenIcon className="w-20 h-20 text-[#2EC27E]" strokeWidth={1.5} />
      </motion.div>

      {/* Loading Text */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2EC27E] to-[#26A17B]"
      >
        Loading Knowledge{dots}
      </motion.h2>
    </div>
  );
}
