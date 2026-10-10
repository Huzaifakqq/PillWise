"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/home", icon: "🏠", label: "Home" },
  { href: "/search", icon: "🔍", label: "Search" },
  { href: "/checker", icon: "⚡", label: "Check" },
  { href: "/my-medicines", icon: "💊", label: "Meds" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const hideOnPages = ["/", "/login", "/register"];
  if (hideOnPages.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-card border-0 border-t border-slate-800/50 rounded-none">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? "text-blue-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform`}>
                <span className="text-xl">{item.icon}</span>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
