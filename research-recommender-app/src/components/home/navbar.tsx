"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { BookOpenIcon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#0D1B2A] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center text-2xl font-extrabold text-background hover:text-[#2EC27E] transition duration-300"
        >
          {/* Icon */}
          <BookOpenIcon
            className="w-8 h-8 text-[#2EC27E] mr-2"
            strokeWidth={1.5}
          />
          {/* Logo Text */}
          <span>
            Research
            <span className="text-[#2EC27E]">Rec</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            href="/"
            className="hover:text-[#2EC27E] transition duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-[#2EC27E] transition duration-300 ease-in-out"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#2EC27E] transition duration-300 ease-in-out"
          >
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="text-[#3DCBB1] font-medium hover:text-[#2EC27E] transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="bg-[#2EC27E] hover:bg-[#26A17B] text-white px-4 py-2 rounded-lg shadow transition duration-300"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0D1B2A] text-white py-4 px-4 space-y-4">
          <Link
            href="/"
            className="block hover:text-[#2EC27E] transition duration-300"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block hover:text-[#2EC27E] transition duration-300"
            onClick={toggleMenu}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="block hover:text-[#2EC27E] transition duration-300"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <div className="flex flex-col space-y-2">
            <Link
              href="/auth/signin"
              className="block text-[#3DCBB1] hover:text-[#2EC27E] transition"
              onClick={toggleMenu}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="block bg-[#2EC27E] hover:bg-[#26A17B] text-white text-center px-4 py-2 rounded-lg shadow transition duration-300"
              onClick={toggleMenu}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
