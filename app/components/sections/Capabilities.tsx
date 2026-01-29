export default function Capabilities() {
    return (
        <section
        id="services"
        className="relative overflow-hidden bg-[var(--color-navy-900)] py-20 sm:py-24"
        style={{
          backgroundImage: "url('/services_images/CapBg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.55),rgba(11,18,32,0.70))]" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6">
          {/* Section header */}
          <div className="mb-14 max-w-3xl animate-hero-fade">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-400)]">
              Capabilities
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Core MRO Services & Support Programs
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
              Comprehensive maintenance, repair, overhaul, and long-term support
              services designed to sustain mission-critical military, civil, and
              parapublic fleets across the Asia-Pacific region.
            </p>
          </div>
  
          {/* Capability cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="animate-hero-fade rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-white/20">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Engine Maintenance & Overhaul
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/75">
                Repair and overhaul services for multiple turboprop and turboshaft
                engine families, with technical capability developed up to Level 3
                for selected platforms.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded border border-white/15 px-2 py-1">
                  Makila
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  Arriel
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  Arrius
                </span>
              </div>
            </div>
  
            {/* Card 2 */}
            <div className="animate-hero-fade rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-white/20">
              <h3 className="mb-3 text-lg font-semibold text-white">
                TP400-D6 Turboprop Support
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/75">
                Approved Maintenance Organization (AMO) services for Europrop
                International, providing Level 1 and Level 2 maintenance for
                TP400-D6 engines powering the RMAF A400M fleet.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded border border-white/15 px-2 py-1">
                  TP400-D6
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  EPI AMO
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  RMAF A400M
                </span>
              </div>
            </div>
  
            {/* Card 3 */}
            <div className="animate-hero-fade rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-white/20">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Auxiliary Power Unit (APU) Services
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/75">
                Support services for the Safran eAPU60, supporting offshore oil and
                gas operations and helicopter fleets requiring high availability
                and rapid turnaround.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded border border-white/15 px-2 py-1">
                  Safran eAPU60
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  Offshore O&amp;G
                </span>
              </div>
            </div>
  
            {/* Card 4 */}
            <div className="animate-hero-fade rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-white/20">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Support-By-Hour (SBH®)
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/75">
                Predictable "pay-as-you-fly" programs offering fixed cost per
                engine flight hour, reducing unexpected maintenance expenses for
                civil and parapublic operators.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded border border-white/15 px-2 py-1">
                  Fixed Cost
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  Civil &amp; Parapublic
                </span>
              </div>
            </div>
  
            {/* Card 5 */}
            <div className="animate-hero-fade rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-white/20">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Global Support Package (GSP®)
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/75">
                A dedicated military support solution designed to ensure long-term
                engine availability and budget certainty through structured
                partnerships with the RMAF.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded border border-white/15 px-2 py-1">
                  Military Support
                </span>
                <span className="rounded border border-white/15 px-2 py-1">
                  Long-Term Planning
                </span>
              </div>
            </div>
  
            {/* Card 6 */}
            <div className="animate-hero-fade rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-white/20">
                 <h3 className="mb-3 text-lg font-semibold text-white">
                    Logistics, Standard Exchange & Training
                 </h3>

                <p className="mb-5 text-sm leading-relaxed text-white/75">
                 Around-the-clock technical assistance with AOG response coordination,
                spare parts and tooling management, training services, and standard
                exchange programs. Supported by a global repair network to ensure
                rapid turnaround for time-critical components.
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-white/60">
                    <span className="rounded border border-white/15 px-2 py-1">AOG 24/7</span>
                    <span className="rounded border border-white/15 px-2 py-1">Standard Exchange</span>
                    <span className="rounded border border-white/15 px-2 py-1">Tooling</span>
                    <span className="rounded border border-white/15 px-2 py-1">Training</span>
                </div>
            </div>
          </div>
        </div>
      </section>
    );
  }