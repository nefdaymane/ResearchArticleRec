"use client";

import { FaUniversity, FaGithub, FaMicrosoft } from "react-icons/fa";

export default function TrustedBySection() {
  return (
    <section className="bg-[#0D1B2A] py-24 px-8 lg:px-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2EC27E] to-gray-400">
          Trusted by Leading Institutions
        </h2>
      </div>

      {/* Trusted By Content */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-y-12 gap-x-10 justify-items-center items-center">
        {/* Harvard */}
        <div className="flex items-center space-x-4 hover:scale-110 transition-transform duration-300">
          <FaUniversity className="text-[#2EC27E] text-6xl" />
          <h3 className="text-2xl lg:text-2xl font-bold text-white">
            Harvard
          </h3>
        </div>

        {/* Stanford */}
        <div className="flex items-center space-x-4 hover:scale-110 transition-transform duration-300">
          <FaUniversity className="text-[#2EC27E] text-6xl" />
          <h3 className="text-2xl lg:text-2xl font-bold text-white">
            Stanford
          </h3>
        </div>

        {/* UCA */}
        <div className="flex items-center space-x-4 hover:scale-110 transition-transform duration-300">
          <FaUniversity className="text-[#2EC27E] text-6xl" />
          <h3 className="text-2xl lg:text-2xl font-bold text-white">
            UCA
          </h3>
        </div>

        {/* GitHub */}
        <div className="flex items-center space-x-4 hover:scale-110 transition-transform duration-300">
          <FaGithub className="text-[#2EC27E] text-6xl" />
          <h3 className="text-2xl lg:text-2xl font-bold text-white">
            GitHub
          </h3>
        </div>

        {/* Microsoft */}
        <div className="flex items-center space-x-4 hover:scale-110 transition-transform duration-300">
          <FaMicrosoft className="text-[#2EC27E] text-6xl" />
          <h3 className="text-2xl lg:text-2xl font-bold text-white">
            Microsoft
          </h3>
        </div>
      </div>
    </section>
  );
}
