"use client";

import UserNavbar from "@/components/user/user-navbar";
import { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Navbar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
