import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { CanvaButton } from '@/components/auth/CanvaButton';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AppleButton } from '@/components/auth/AppleButton';
import { MicrosoftButton } from '@/components/auth/MicrosoftButton';
import { EmailButton } from '@/components/auth/EmailButton';
import { AppStoreButton } from '@/components/auth/AppStoreButton';
import { PlayStoreButton } from '@/components/auth/PlayStoreButton';

export default function LoginPage() {
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
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-title text-4xl font-bold text-gray-800 mb-1 ">PANGGUNG KREATOR</h1>

            <p className="font-sans text-[13px] text-gray-500 mb-10">#OneStageOneProgress</p>

            <div className="flex flex-col gap-1 w-full max-w-sm">
              <GoogleButton />
            </div>

            <div className="mt-6 text-center max-w-sm">
              <Link href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                Need help?
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-8 max-w-sm">
            <div className="flex justify-between px-2 text-[11px] text-gray-500 font-medium">
              <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
