"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/app/lib/constants";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full"
      style={{
        background: "rgba(11, 18, 32, 0.65)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo/GTAFullLogo.png"
              alt="Global Turbine Asia"
              width={220}
              height={60}
              className="h-12 w-auto transition-opacity sm:h-14"
              priority
            />
            <span className="sr-only">Global Turbine Asia</span>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 relative px-3 py-2 rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link
              href="#contact"
              className="rounded-md px-5 py-2.5 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 hover:border-white/30 transition-all duration-300 shadow-lg"
            >
              Get in Touch
            </Link>
          </div>

          {/* MOBILE MENU ICON */}
          <div className="lg:hidden">
            <button
              aria-label="Open menu"
              className="text-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 p-2 rounded-md"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          className="lg:hidden border-t border-white/15"
          style={{
            background: "rgba(11, 18, 32, 0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
          }}
        >
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-2 px-6 py-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md px-4 py-3 transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[var(--color-accent-500)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/30 hover:opacity-90 hover:shadow-xl hover:shadow-accent-500/40 transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
