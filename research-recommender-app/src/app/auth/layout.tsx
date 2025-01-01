"use client";

import LoadingScreen from "@/components/ui/loading";
import { ArrowRightIcon, BookOpenIcon, GlobeIcon, HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push("/home");
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white">
      {/* Left Panel with Gradient */}
      <div className="relative lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 text-white bg-gradient-to-br from-[#0D1B2A] to-[#1F3044] overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#2EC27E]/10 rounded-full blur-3xl"></div>
        </div>

        <a
          href="/home"
          onClick={handleClick}
          className="absolute top-6 left-6 flex items-center text-[#2EC27E] hover:text-[#26A17B] transition duration-300 mb-5"
          aria-label="Go to Home"
        >
          <HomeIcon className="w-8 h-8" strokeWidth={1.5} />
          <span className="ml-2 text-lg font-semibold text-white">Home</span>
        </a>

        <div className="relative z-10 max-w-md w-full mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <BookOpenIcon className="w-10 h-10 text-[#2EC27E]" strokeWidth={1.5} />
              <h1 className="text-4xl lg:text-5xl font-bold">
                Research <span className="text-[#2EC27E]">Rec</span>
              </h1>
            </div>

            <p className="text-lg lg:text-xl font-light text-gray-300 text-center">
              Unlock a world of knowledge. Discover, explore, and innovate with the latest research.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center space-x-4 bg-[#1F3044] bg-opacity-50 p-4 rounded-lg">
              <GlobeIcon className="w-7 h-7 text-[#2EC27E] flex-shrink-0" strokeWidth={1.5} />
              <span className="text-base lg:text-lg">
                Explore a curated collection of cutting-edge research articles.
              </span>
            </div>
            <div className="flex items-center space-x-4 bg-[#1F3044] bg-opacity-50 p-4 rounded-lg">
              <ArrowRightIcon className="w-7 h-7 text-[#2EC27E] flex-shrink-0" strokeWidth={1.5} />
              <span className="text-base lg:text-lg">
                Collaborate with global researchers to bring ideas to life.
              </span>
            </div>
          </div>

          <blockquote className="text-center border-l-4 border-[#2EC27E] pl-4 italic text-gray-400 text-base py-4">
            &quot;Fuel your passion for knowledge and innovation. Every discovery begins here.&quot;
          </blockquote>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white text-[#0D1B2A]">
        {children}
      </div>
    </div>
  );
}
