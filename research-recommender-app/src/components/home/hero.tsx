"use client";

import { BookOpenIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-b from-[#2EC27E]/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-t from-[#2EC27E]/20 to-transparent blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Logo Icon + Title */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
          <BookOpenIcon
            className="w-12 h-12 sm:w-16 sm:h-16 text-[#2EC27E] mb-4 sm:mb-0 sm:mr-3 animate-bounce"
            strokeWidth={1.5}
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2EC27E] to-[#0D1B2A] leading-tight">
            <span className="block sm:inline">Explore Research</span>{" "}
            <span className="block sm:inline">Like Never Before</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-[#0D1B2A] max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
          Discover groundbreaking research, collaborate with global innovators, and elevate your knowledge to new heights.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4 sm:px-0">
          <a
            href="/auth/register"
            className="w-full sm:w-auto bg-[#2EC27E] hover:bg-[#26A17B] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Register Now
          </a>
          <a
            href="/features"
            className="w-full sm:w-auto bg-transparent border-2 border-[#2EC27E] text-[#0D1B2A] hover:bg-[#2EC27E] hover:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}