"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { BookOpenIcon, Menu, X, TrendingUpIcon, UserIcon, Settings, LogOut } from "lucide-react";
import { JwtPayload } from "@/types/jwt.types";
import { useRouter } from "next/navigation";

export default function UserNavbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (!isTokenExpired) {
          setFirstName(decodedToken.firstName);
          setLastName(decodedToken.lastName);
          setUserEmail(decodedToken.email);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : null;

  console.log(firstName, lastName, userEmail);

  return (
    <nav className="bg-[#0D1B2A] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/user" className="flex items-center space-x-3 group">
            <div className="bg-[#2EC27E]/10 p-2 rounded-lg group-hover:bg-[#2EC27E]/20 transition-all duration-300">
              <BookOpenIcon className="w-6 h-6 text-[#2EC27E]" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-white">
              Research<span className="text-[#2EC27E]">Rec</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Trending Link */}
            <Link 
              href="/user/trending" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#2EC27E]/10 hover:bg-[#2EC27E]/20 transition-all duration-300"
            >
              <TrendingUpIcon className="w-5 h-5 text-[#2EC27E]" />
              <span className="font-medium">Trending</span>
            </Link>

            {/* User Profile */}
            <div className="relative">
            <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2EC27E]/10 flex items-center justify-center text-[#2EC27E] hover:bg-[#2EC27E]/20 transition-all duration-300">
                    {firstName ? firstName.charAt(0).toUpperCase() : "G"}
                  </div>
                  <span className="text-gray-300 group-hover:text-[#2EC27E] transition-colors duration-300">
                    {fullName || "Guest"}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 bg-[#1B2B3A] text-white shadow-xl rounded-lg w-64 py-2 border border-gray-700"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="font-medium">{fullName}</p>
                    <p className="text-sm text-gray-400">{userEmail}</p>
                  </div>
                  
                  <Link
                    href="/user/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-[#2EC27E]/10 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  
                  <Link
                    href="/user/settings"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-[#2EC27E]/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      setFirstName(null);
                      setLastName(null);
                      setUserEmail(null);
                      router.push("/auth/login");
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-[#2EC27E]/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[60px] bg-[#0D1B2A] z-40">
            <div className="p-4">
              {/* User Profile Section */}
              <div className="mb-6 p-4 bg-[#1B2B3A] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-[#2EC27E]/10 flex items-center justify-center text-[#2EC27E]">
                    {firstName ? firstName.charAt(0).toUpperCase() : "G"}
                  </div>
                  <div>
                    <div className="font-medium">{fullName || "Guest"}</div>
                    <div className="text-sm text-gray-400">{userEmail || ""}</div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/user/trending"
                  className="flex items-center space-x-3 px-4 py-3 bg-[#2EC27E]/10 hover:bg-[#2EC27E]/20 rounded-lg transition-colors"
                >
                  <TrendingUpIcon className="w-5 h-5 text-[#2EC27E]" />
                  <span>Trending</span>
                </Link>

                <div className="my-4 border-t border-gray-700" />

                <Link
                  href="/user/profile"
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-[#2EC27E]/10 rounded-lg transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>My Profile</span>
                </Link>
                
                <Link
                  href="/user/settings"
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-[#2EC27E]/10 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    setFirstName(null);
                    setLastName(null);
                    setUserEmail(null);
                    router.push("/auth/login");
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}