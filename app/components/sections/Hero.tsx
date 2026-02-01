"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background video (desktop only) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 hidden h-full w-full object-cover md:block animate-gradient-drift"
        style={{ filter: "brightness(1.1)" }}
      >
        <source src="/videos/BgVid.mp4" type="video/mp4" />
      </video>

      {/* Fallback image (mobile) */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{
          backgroundImage: "url('/aircraft_images/RMAFA4m.png')",
          filter: "brightness(1.1)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.78),rgba(11,18,32,0.70))]" />

      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

      {/* Accent glow (keep very subtle) */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent-500/12 blur-[120px]" />

      {/* Content */}
      <div
        className="
          relative mx-auto max-w-[1100px] px-6 md:pl-12
          pt-32 pb-24
          sm:pt-36
          lg:pt-44
        "
      >
        <div className="animate-hero-fade space-y-3 text-left">
          {/* Sub headline */}
          <p className="text-sm uppercase tracking-[0.35em] text-white/70 sm:text-base">
            Global Turbine Asia
          </p>

          {/* Main headline */}
          <h1
            className="
              font-semibold tracking-tight text-white
              text-5xl leading-tight
              sm:text-6xl
              lg:text-7xl
            "
            style={{
              fontFamily:
                "var(--font-display, 'DM Serif Display', 'Cormorant Garamond', 'Playfair Display', serif)",
            }}
          >
            We Keep You Flying .
          </h1>
        </div>
      </div>


      {/* Scroll indicator */}
      <div className="absolute bottom-8 start-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-white/60 animate-float-indicator">
        Scroll
      </div>
    </section>
  );
}
