"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("pillwise-theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("pillwise-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("pillwise-theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      className="glass-card w-10 h-10 rounded-xl flex items-center justify-center text-lg hover:bg-slate-800/60 transition-all"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
