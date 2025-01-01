"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ArticlesPage from "@/components/user/articles-section";

const UserPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div>
      <ArticlesPage />
    </div>
  );
};

export default UserPage;
