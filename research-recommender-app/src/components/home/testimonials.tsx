"use client";

import { FaQuoteLeft } from "react-icons/fa";

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-16 px-6 lg:px-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0D1B2A] to-[#2EC27E]">
          What Our Users Say
        </h2>
        <p className="text-gray-600 mt-2">
          Hear from researchers and innovators who use Research Rec every day.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Testimonial 1 */}
        <div className="p-6 shadow-lg rounded-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
          <FaQuoteLeft className="text-[#2EC27E] text-3xl mb-4" />
          <p className="text-gray-700 italic">
          &quot;Research Rec has transformed how we discover and collaborate on
            groundbreaking research. It&apos;s a must-have for any institution!&quot;
          </p>
          <div className="mt-4">
            <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#0D1B2A] to-[#2EC27E]">
              Dr. Emily Johnson
            </h4>
            <p className="text-gray-500 text-sm">Professor, Harvard University</p>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="p-6 shadow-lg rounded-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
          <FaQuoteLeft className="text-[#2EC27E] text-3xl mb-4" />
          <p className="text-gray-700 italic">
          &quot;An amazing platform for researchers to collaborate globally. It has
            streamlined our research workflow significantly.&quot;
          </p>
          <div className="mt-4">
            <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#0D1B2A] to-[#2EC27E]">
              Dr. Mark Anderson
            </h4>
            <p className="text-gray-500 text-sm">Lead Researcher, Stanford University</p>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className="p-6 shadow-lg rounded-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
          <FaQuoteLeft className="text-[#2EC27E] text-3xl mb-4" />
          <p className="text-gray-700 italic">
          &quot;With Research Rec, we can focus more on innovation rather than
            searching for the right information. It&apos;s brilliant!&quot;
          </p>
          <div className="mt-4">
            <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#0D1B2A] to-[#2EC27E]">
              Dr. Aymane Nefdaoui
            </h4>
            <p className="text-gray-500 text-sm">Head of Research, UCA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
