"use client";

import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

export default function AboutUs() {
  return (
    <div className="bg-white text-[#0D1B2A] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 px-6 lg:px-20">
        <section className="relative text-center mb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2EC27E]/10 to-gray-200/20 blur-3xl rounded-full opacity-40 w-72 h-72 mx-auto -z-10"></div>

          <h2 className="text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2EC27E] to-[#0D1B2A] mb-6">
            About Us
          </h2>

          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover who we are and what drives us. Our mission is to
            <span className="text-[#2EC27E] font-semibold"> empower</span>{" "}
            world-class researchers,
            <span className="text-[#2EC27E] font-semibold"> connect</span>{" "}
            innovative institutions, and foster groundbreaking ideas. We believe
            in
            <span className="text-[#2EC27E] font-semibold"> collaboration</span>
            ,<span className="text-[#2EC27E] font-semibold"> transparency</span>
            , and pushing the boundaries of what’s possible to make a real
            impact globally.
          </p>
        </section>

        {/* Team Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#2EC27E] to-[#0D1B2A]">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#1F3044] p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-[#2EC27E] mb-2">
                Aymane Nefdaoui
              </h3>
              <p className="text-gray-300 mb-4">Co-Founder & Lead Innovator</p>
              <blockquote className="italic text-gray-400">
              &quot;Innovation is at the heart of everything we build.&quot;
              </blockquote>
            </div>
            <div className="bg-[#1F3044] p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-[#2EC27E] mb-2">
                Abdessamad Imider
              </h3>
              <p className="text-gray-300 mb-4">Co-Founder & Lead Developer</p>
              <blockquote className="italic text-gray-400">
              &quot;Code with purpose, build with passion.&quot;
              </blockquote>
            </div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Our core values are what drive us:{" "}
            <span className="text-[#2EC27E] font-bold">Innovation</span>,
            <span className="text-[#2EC27E] font-bold"> Collaboration</span>,
            and <span className="text-[#2EC27E] font-bold">Impact</span>. We
            encourage creativity, foster teamwork, and focus on making a real
            difference globally.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
