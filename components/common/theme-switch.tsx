"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so we can avoid hydration mismatch
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const current = resolvedTheme === "light" ? "dark" : "light";
    setTheme(current);
  };

  // Always render the same structure on server and client initially
  if (!mounted) {
    return (
      <button
        className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-custom-muted p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 transition-colors cursor-pointer"
        aria-label="Switch theme">
        <div className="w-6 h-6" />
        <div className="hidden md:block">Theme</div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-12 w-full grow hover:text-blue-400 items-center justify-center gap-2 rounded-md bg-custom-muted p-3 text-sm font-medium hover:bg-sky-100 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors cursor-pointer"
      aria-label={`Switch to ${
        resolvedTheme === "light" ? "dark" : "light"
      } mode`}>
      {resolvedTheme === "light" ? (
        <Image src="/icons/moon.svg" alt="Moon icon" width={20} height={20} />
      ) : (
        <Image src="/icons/sun.svg" alt="Sun icon" width={20} height={20} />
      )}
      <div className="hidden md:block">
        {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
      </div>
    </button>
  );
}