"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPasswordAction } from "@/lib/actions/auth-actions";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInWithPasswordAction(emailOrUsername, password);
      if (result.success) {
        // Redirect menggunakan location.href agar middleware mengevaluasi session baru
        window.location.href = result.isAdmin ? '/admin' : '/dashboard';
      } else {
        setError(result.error || "Terjadi kesalahan saat masuk.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Login client error:", err);
      setError("Gagal terhubung ke server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#bc151b] selection:text-white">
      {/* Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px] md:min-h-[600px]">

        {/* Left Column - Form */}
        <div className="col-span-1 md:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white">
          {/* Logo Header */}
          <div className="mb-8 md:mb-0 flex">
            <Logo size="sm" isLink={true} className="text-zinc-900" />
          </div>

          {/* Form Area */}
          <div className="my-auto max-w-sm w-full mx-auto md:mx-0">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-2 font-title">
              One Stage, <br />
              <span className="text-[#bc151b]">One Progress</span>
            </h2>
            <p className="text-xs text-gray-400 mb-8 font-medium">
              Welcome back, let's join our community
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#bc151b] flex items-center gap-2 font-medium animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="youremail@gmail.com"
                  className="w-full bg-[#f9fafb] border border-zinc-200/60 rounded-xl px-4 py-3.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#bc151b] focus:ring-1 focus:ring-[#bc151b] transition-all text-xs"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#f9fafb] border border-zinc-200/60 rounded-xl px-4 py-3.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#bc151b] focus:ring-1 focus:ring-[#bc151b] transition-all text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-zinc-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded text-[#bc151b] border-zinc-300 focus:ring-[#bc151b]"
                    defaultChecked
                  />
                  <span>Remember me</span>
                </label>
                <Link href="#" className="hover:text-zinc-900 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-24 py-3 bg-[#bc151b] hover:bg-[#bc151b]/90 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg shadow-[#bc151b]/10"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 8a4 4 0 014-4V0C3.58 0 0 3.58 0 8h4z"></path>
                    </svg>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Branding */}
          <div className="mt-8 md:mt-0 text-[10px] text-zinc-400 font-medium flex justify-between md:justify-start gap-4">
            <Link href="#" className="hover:text-zinc-700 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-700 transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Right Column - Illustration */}
        <div className="col-span-1 md:col-span-6 p-4 md:p-6 bg-white hidden md:block">
          <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-sm">
            <Image
              src="/wallpaper.png"
              alt="Dirgahayu Republik Indonesia"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}
