"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { login } from "@/services/auth.service"; // Replace with your actual service
import { AxiosErrorWithResponse } from "@/types/error.types"; // Type for Axios errors
import { FormEvent, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { User } from "@/models/users/user.model";
import { ApiResponse } from "@/types/api.types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    if (!email || !password) {
      addToast("Validation Error", "Email and password are required.", "error");
      return;
    }
  
    setLoading(true);
    try {
      const data = {
        email,
        password,
      };
  
      // Call login service
      const response = await login(data) as ApiResponse<{
        user: User;
        access_token: string;
      }>;
  
      // Access the token in response.data
      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
  
        addToast(
          "Login Successful",
          "You have successfully logged in.",
          "success"
        );
  
        router.push("/user");
      } else {
        addToast(
          "Login Failed",
          "No access token received. Please try again.",
          "error"
        );
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorWithResponse;
  
      if (axiosError.response && axiosError.response.data) {
        const apiError = axiosError.response.data as ApiResponse<null>;
  
        addToast(
          `Login Failed`,
          `${apiError.message}`,
          "error"
        );
      } else {
        addToast(
          "Login Failed",
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#F8F9FA]">
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-10 bg-[#F8F9FA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0D1B2A] to-[#3DCBB1] mb-5 relative inline-block">
              Sign In
              <span className="absolute left-1/2 -bottom-2 w-16 h-1 bg-[#2EC27E] transform -translate-x-1/2 rounded-full animate-pulse"></span>
            </h2>
            <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">
              Start exploring endless possibilities today.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0D1B2A] mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none text-gray-700 placeholder-gray-400 transition duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#0D1B2A] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none text-gray-700 placeholder-gray-400 transition duration-300"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#2EC27E] to-[#26A17B] hover:from-[#26A17B] hover:to-[#1E8D68] text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-4">
            <button className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300">
              <FaGithub className="mr-3 w-5 h-5" />
              Continue with GitHub
            </button>
            <button className="flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-md border border-gray-300 transition duration-300">
              <FcGoogle className="mr-3 w-5 h-5" />
              Continue with Google
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center relative">
            Not a member yet?{" "}
            <a
              href="/auth/register"
              className="text-[#2EC27E] font-semibold hover:underline hover:text-[#26A17B] transition duration-300 ease-in-out"
            >
              Sign up here
            </a>
            <span className="block w-16 h-0.5 bg-[#2EC27E] rounded-full mx-auto mt-2 animate-pulse"></span>
          </p>
        </div>
      </div>
    </div>
  );
}
