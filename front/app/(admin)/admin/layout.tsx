"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import { signout } from "@/lib/actions/auth-actions";
import { Sun, Moon } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Gagal keluar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100 font-sans transition-colors duration-300 flex flex-col selection:bg-[#bc151b] selection:text-white">
      {/* Header Admin */}
      <header className="px-6 py-4 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Logo size="sm" isLink={false} />
          <span className="bg-red-500/10 text-[#bc151b] text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-red-500/20">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mounted ? (
            <button
              onClick={toggleTheme}
              className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all rounded-lg border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer flex items-center justify-center"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 animate-pulse" />
          )}
          <button
            onClick={handleSignOut}
            className="text-xs text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-500 font-semibold transition-all border border-zinc-200 dark:border-white/10 hover:border-red-500/30 rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-900/50 hover:bg-red-500/10 dark:hover:bg-red-500/10 cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
