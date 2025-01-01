"use client";

import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-[#0D1B2A] text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Contact Section */}
      <main className="flex-1 py-16 px-6 lg:px-8 flex items-center justify-center">
        <section className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#0D1B2A]">
          {/* Left Side: Contact Info */}
          <div className="bg-[#1F3044] p-8 rounded-lg shadow-lg flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-extrabold text-[#2EC27E] mb-2">Let&apos;s Get in Touch</h2>
            <p className="text-gray-300 leading-relaxed">
              Feel free to reach out to us for any inquiries or collaboration opportunities. We’re here to help!
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-[#2EC27E] text-xl" />
                <p className="text-gray-300">92 Cherry Drive, Uniondale, NY 11553</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-[#2EC27E] text-xl" />
                <p className="text-gray-300">info@researchrec.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-[#2EC27E] text-xl" />
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#2EC27E] transition"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#2EC27E] transition"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#2EC27E] transition"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-[#1F3044] p-8 rounded-lg shadow-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Full Name"
                  className="w-full p-3 rounded-lg bg-[#0D1B2A] text-white focus:ring-2 focus:ring-[#2EC27E] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email Address"
                  className="w-full p-3 rounded-lg bg-[#0D1B2A] text-white focus:ring-2 focus:ring-[#2EC27E] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-200 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Write your message here..."
                  className="w-full p-3 rounded-lg bg-[#0D1B2A] text-white focus:ring-2 focus:ring-[#2EC27E] focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#2EC27E] text-white font-bold rounded-lg shadow-lg hover:bg-[#26A17B] transition-transform transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
