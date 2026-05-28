import React from 'react';
import OnboardingForm from '@/components/forms/OnboardingForm';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans bg-gray-50">
      {/* Minimalist Gradient Background mimicking the reference image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-100/60 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-50/50 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      {/* Main Container */}
      <div className="relative w-full z-10 pt-10 pb-16">
        <OnboardingForm />
      </div>
    </div>
  );
}
