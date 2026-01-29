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
          relative mx-auto max-w-[1100px] px-6
          pt-32 pb-24
          sm:pt-36
          lg:pt-44
        "
      >
        <div className="animate-hero-fade max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-400)]">
            Malaysian-owned • Defense-grade MRO
          </p>

          {/* Headline */}
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Global Turbine Asia
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg">
            <strong className="text-white">GTA</strong> is an
            independent engine maintenance, repair and overhaul service provider
            supporting mission-critical military and civil fleets across the
            Asia-Pacific region.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            A Malaysian-born joint venture with{" "}
            <strong className="text-white">
              Safran Helicopter Engines
            </strong>
            , built on technical capability, disciplined governance, and
            long-term partnership.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="#services"
              className="
                rounded-md bg-[var(--color-accent-500)]
                px-7 py-3 text-sm font-semibold text-white
                shadow-[var(--shadow-card)]
                hover:opacity-90 transition
              "
            >
              View Capabilities
            </Link>

            <Link
              href="#about"
              className="
                rounded-md border border-white/20
                px-7 py-3 text-sm font-medium text-white
                hover:bg-white/5 transition
              "
            >
              About GTA
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-white/60 animate-float-indicator">
        Scroll
      </div>
    </section>
  );
}
