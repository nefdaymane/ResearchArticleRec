"use client";

import { FaGithub, FaInstagram, FaLinkedin, FaEnvelope, FaBookOpen } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-white py-20 px-8 lg:px-20 w-full overflow-hidden">
      {/* Decorative Background */}
      <div className="w-64 h-64 bg-[#2EC27E] opacity-20 rounded-full blur-3xl absolute -top-10 left-10 pointer-events-none"></div>
      <div className="w-72 h-72 bg-[#2EC27E] opacity-10 rounded-full blur-3xl absolute -bottom-10 right-10 pointer-events-none"></div>

      {/* CTA Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2EC27E] to-gray-400">
          Ready to Elevate Your Research?
        </h2>
        <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Start collaborating with world-class researchers and unlock innovation like never before.
        </p>
        <a
          href="/auth/register"
          className="inline-block bg-[#2EC27E] hover:bg-[#26A17B] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-110"
        >
          Join Us Now
        </a>
      </div>

      {/* Footer Content */}
      <div className="border-t border-gray-700 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <FaBookOpen className="text-[#2EC27E] text-3xl" />
              <h3 className="text-2xl font-bold">
                Research<span className="text-[#2EC27E]">Rec</span>
              </h3>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center md:text-left">
              &copy; {new Date().getFullYear()} Research Rec. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center space-x-6 mb-6 md:mb-0">
            <a
              href="/about"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              Privacy Policy
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="mailto:support@researchrec.com"
              className="text-gray-400 hover:text-[#2EC27E] transition duration-300"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
