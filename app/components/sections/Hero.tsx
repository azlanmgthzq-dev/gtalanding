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
        style={{
          filter: "brightness(1.1)",
        }}
      >
        <source src="/videos/BgVid.mp4" type="video/mp4" />
      </video>

      {/* Fallback image (mobile & backup) */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{
          backgroundImage: "url('/aircraft_images/RMAFA4m.png')",
          filter: "brightness(1.1)",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.80),rgba(11,18,32,0.70))]" />

      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" />

      {/* Accent glows */}
      <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full bg-accent-500/15 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent-400/12 blur-[96px]" />

      {/* Content */}
      <div
        className="
          relative mx-auto max-w-[1280px] px-6
          pt-24 pb-20
          sm:pt-28 sm:pb-24
          lg:pt-30 lg:pb-28
        "
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT – Main message */}
          <div className="lg:col-span-6 animate-hero-fade">
            {/* Eyebrow */}
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-400)]">
              Malaysian-owned • Defense-grade MRO
            </p>

            {/* Headline (FIXED responsive wrap) */}
            <h1
              className="
                text-4xl font-semibold leading-tight text-white
                sm:text-4xl
                lg:text-4xl
              "
            >
              We are{" "}
              <span className="block sm:inline">
                Global Turbine Asia.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
              <strong className="text-white">GLOBAL TURBINE ASIA</strong> is an
              independent engine maintenance, repair and overhaul service
              provider supporting military and civil fleets across the Asia
              Pacific region.
              <br />
              <br />
              A Malaysian-born joint venture with <strong className="text-white">Safran Helicopter Engines</strong>, we
              represent true technical capability, disciplined governance, and
              long-term partnership—growing from a local industrial footprint
              into a regional aerospace authority.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#services"
                className="
                  rounded-md bg-[var(--color-accent-500)]
                  px-6 py-3 text-sm font-semibold text-white
                  shadow-[var(--shadow-card)]
                  hover:opacity-90 transition
                "
              >
                View Capability List
              </Link>

              <Link
                href="#partners"
                className="
                  rounded-md border border-white/20
                  px-6 py-3 text-sm font-medium text-white
                  hover:bg-white/5 transition
                "
              >
                Strategic Partnerships
              </Link>
            </div>
          </div>

          {/* RIGHT – Certification rail */}
          <div
            className="
              md:col-span-12 lg:col-span-5
              animate-hero-fade-delay
            "
          >
            {/* Mobile: Collapsible panel */}
            <details className="md:hidden mt-10">
              <summary
                className="
                  cursor-pointer rounded-md border border-white/15
                  bg-white/5 px-4 py-3 text-sm font-semibold text-white
                  backdrop-blur-sm
                  hover:bg-white/8 transition-colors
                "
              >
                Certifications & Authorizations
              </summary>

              <div
                className="
                  mt-4 rounded-lg border border-white/10
                  bg-white/5 p-5 backdrop-blur-sm
                "
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/70">
                  Certified & Authorized
                </p>

                <ul className="space-y-3 text-sm text-white/85">
                  <li>EASA Part-145 (TP400-D6)</li>
                  <li>CAAM & DGTA Approved</li>
                  <li>AS / EN 9110 Quality System</li>
                </ul>

                <div className="my-6 h-px bg-white/10" />

                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/70">
                  OEM & Partners
                </p>

                <ul className="space-y-3 text-sm text-white/85">
                  <li>Safran Certified Maintenance Centre</li>
                  <li>Europrop International (TP400 AMO)</li>
                  <li>Licensed Engineering – Safran eAPU60</li>
                </ul>

                <div className="mt-6 text-xs text-white/50">
                  Military & Civil Fleets • Asia-Pacific
                </div>
              </div>
            </details>

            {/* Desktop: Always visible card */}
            <div className="hidden md:block">
              <div
                className="
                  rounded-lg border border-white/10
                  bg-white/5 p-6 backdrop-blur-sm
                  transition-colors duration-300
                  hover:border-white/20 hover:bg-white/8
                "
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/70">
                  Certified & Authorized
                </p>

                <ul className="space-y-3 text-sm text-white/85">
                  <li>EASA Part-145 (TP400-D6)</li>
                  <li>CAAM & DGTA Approved</li>
                  <li>AS / EN 9110 Quality System</li>
                </ul>

                <div className="my-6 h-px bg-white/10" />

                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/70">
                  OEM & Partners
                </p>

                <ul className="space-y-3 text-sm text-white/85">
                  <li>Safran Certified Maintenance Centre</li>
                  <li>Europrop International (TP400 AMO)</li>
                  <li>Licensed Engineering – Safran eAPU60</li>
                </ul>

                <div className="mt-6 text-xs text-white/50">
                  Military & Civil Fleets • Asia-Pacific
                </div>
              </div>
            </div>
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
