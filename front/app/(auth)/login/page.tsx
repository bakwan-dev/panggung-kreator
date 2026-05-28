"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { GoogleButton } from '@/components/auth/GoogleButton';
import { signInWithGoogle } from "@/lib/actions/auth-actions";
import { useState } from "react";


export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#1a1a1a] flex overflow-hidden">
      {/* Main Container */}
      <div className="w-full flex-1 overflow-hidden flex relative">

        {/* Left Side - Image/Visual */}
        <div className="hidden md:block flex-1 relative bg-gradient-to-br from-yellow-400 to-cyan-400">
          <Image
            src="/wallpaper1.png"
            alt="Panggung Kreator"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-cyan-500/20 mix-blend-overlay"></div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full md:w-[400px] lg:w-[450px] p-8 md:p-12 lg:p-16 flex flex-col relative z-10 shrink-0 overflow-y-auto bg-white">
          <div className="flex-1 flex flex-col justify-center items-center md:items-start">
            <h1 className="font-title text-4xl font-bold text-gray-800 mb-1 text-center md:text-left">PANGGUNG KREATOR</h1>

            <p className="font-sans text-[13px] text-gray-500 mb-10 text-center md:text-left">#OneStageOneProgress</p>

            <div className="flex flex-col gap-1 w-full max-w-sm">
              <GoogleButton
                isLoading={isGoogleLoading}
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-12 bg-white border border-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-50 transition-all duration-200 text-sm font-semibold shadow-sm"
              />
            </div>

            <div className="mt-6 text-center md:text-left w-full max-w-sm">
              <Link href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                Need help?
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-8 w-full max-w-sm mx-auto md:mx-0">
            <div className="flex justify-center md:justify-between gap-6 md:gap-0 px-2 text-[11px] text-gray-500 font-medium">
              <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
