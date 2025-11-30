"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-12 w-full grow hover:text-blue-400 items-center justify-center gap-2 rounded-md bg-custom-muted p-3 text-sm font-medium hover:bg-sky-100 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
      {theme === "light" ? <Moon className="w-6" /> : <Sun className="w-6" />}
      <div className="hidden  md:block">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </div>
    </button>
  );
}
