"use client";

import React, { useEffect } from "react";
import Loading from "@/components/ui/loading"; // Path to your loading component
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
}
