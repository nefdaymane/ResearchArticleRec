"use client";

import { useToast } from "@/context/ToastContext";
import { register } from "@/services/auth.service";
import { AxiosErrorWithResponse } from "@/types/error.types";
import { useRouter } from "next/navigation";
import { FormEvent, lazy, Suspense, useState } from "react";

const FaGithub = lazy(() => import("react-icons/fa").then((mod) => ({ default: mod.FaGithub })));
const FcGoogle = lazy(() => import("react-icons/fc").then((mod) => ({ default: mod.FcGoogle })));

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    let hasErrors = false;
    const newErrors = {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    };
  
    // Form validation
    if (!firstName) {
      newErrors.firstName = true;
      hasErrors = true;
    }
    if (!lastName) {
      newErrors.lastName = true;
      hasErrors = true;
    }
    if (!email) {
      newErrors.email = true;
      hasErrors = true;
    }
    if (!password) {
      newErrors.password = true;
      hasErrors = true;
    }
    if (!confirmPassword || confirmPassword !== password) {
      newErrors.confirmPassword = true;
      hasErrors = true;
    }
  
    setErrors(newErrors);
  
    if (!hasErrors) {
      setLoading(true);
      try {
        const data = {
          firstName,
          lastName,
          email,
          password,
        };
  
        await register(data);
  
        addToast(
          "Registration Successful",
          "You have successfully registered.",
          "success"
        );
  
        router.push("/auth/login");
      } catch (error: unknown) {
        const axiosError = error as AxiosErrorWithResponse;
  
        if (axiosError.response && axiosError.response.data) {
          const apiError = axiosError.response.data;
  
          addToast(
            `Registration Failed `,
            `${apiError.message}`,
            "error"
          );
        } else {
          addToast(
            "Registration Failed",
            "An unexpected error occurred. Please try again.",
            "error"
          );
        }
      }
        finally {
        setLoading(false);
      }
    }
  };
  
  
  
  

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#F8F9FA]">
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-10 bg-[#F8F9FA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0D1B2A] to-[#3DCBB1] mb-5 relative inline-block">
              Register
              <span className="absolute left-1/2 -bottom-2 w-16 h-1 bg-[#2EC27E] transform -translate-x-1/2 rounded-full animate-pulse"></span>
            </h2>
            <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">
              Create your account to get started.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className={`block w-full px-4 py-3 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none placeholder-gray-400 transition duration-300`}
                />

                {errors.firstName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    First name is required
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className={`block w-full px-4 py-3 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none placeholder-gray-400 transition duration-300`}
                />

                {errors.lastName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Last name is required
                  </span>
                )}

                
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`block w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none placeholder-gray-400 transition duration-300`}
              />

              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  Email is required
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className={`block w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none placeholder-gray-400 transition duration-300`}
              />

              {errors.password && (
                <span className="text-red-500 text-sm mt-1 block">
                  Password is required
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`block w-full px-4 py-3 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-1 focus:ring-[#2EC27E] focus:border-[#2EC27E] focus:outline-none placeholder-gray-400 transition duration-300`}
              />

              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  Passwords do not match
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#2EC27E] to-[#26A17B] text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:from-[#26A17B]"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<div>Loading...</div>}>
              <button className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300">
                <FaGithub className="mr-3 w-5 h-5" />
                Continue with GitHub
              </button>
              <button className="flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-md border border-gray-300 transition duration-300">
                <FcGoogle className="mr-3 w-5 h-5" />
                Continue with Google
              </button>
            </Suspense>
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center relative">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-[#2EC27E] font-semibold hover:underline hover:text-[#26A17B] transition duration-300 ease-in-out"
            >
              Sign in here
            </a>
            <span className="block w-16 h-0.5 bg-[#2EC27E] rounded-full mx-auto mt-2 animate-pulse"></span>
          </p>
        </div>
      </div>
    </div>
  );
}
