"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";


import { toast } from "sonner"; // ✅ import Sonner

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      const ok = await login(email, password, true);
      if (!ok) throw new Error("Login failed");
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Login failed.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[1024px] items-center relative bg-white">
      <div className="flex flex-col w-[967px] h-[963px] items-start px-0 py-5 relative mb-[-4px]">

        {/* Header */}
        <div className="flex flex-col h-[67px] items-center pt-5 pb-3 px-4 relative self-stretch w-full">
          <p className="flex-1 self-stretch font-bold text-[#0c141c] text-[28px] text-center leading-[35px]">
            Log in to your account
          </p>
        </div>

        {/* Email */}
        <div className="relative self-stretch w-full h-28">
          <div className="flex-col w-[935px] h-[88px] items-start top-3 left-4 flex relative">
            <div className="flex flex-col items-start pt-0 pb-2 relative self-stretch w-full">
              <Label htmlFor="email" className="font-medium text-[#0c141c] text-base leading-6">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full p-4 bg-[#f7f9fc] rounded-lg border border-[#d1dbe8] mt-4"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-3 self-stretch w-full mt-3">
          <div className="flex-col w-[933px] items-start flex relative">
            <Label htmlFor="password" className="font-medium text-[#0c141c] text-base leading-6">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 w-full p-4 bg-[#f7f9fc] rounded-lg border border-[#d1dbe8] mt-4"
            />
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex w-[400px] items-center justify-end pt-1 pb-3 px-4">
          <div className="text-[#4f7296] text-sm cursor-pointer">Forgot Password?</div>
        </div>

        {/* Login Button */}
        <div className="flex items-center justify-center px-4 py-3 self-stretch w-full">
          <button
            onClick={handleLogin}
            className="min-w-[84px] max-w-[480px] h-12 w-full bg-black rounded-lg text-white font-bold"
          >
            Log In
          </button>
        </div>

        {/* Signup link */}
        <div className="flex flex-col items-center pt-1 pb-3 px-4 self-stretch w-full mt-3">
          <p className="text-black text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/" className="text-blue-600 underline">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
