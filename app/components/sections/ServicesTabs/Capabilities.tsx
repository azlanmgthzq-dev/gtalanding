"use client";

import { useState } from "react";

type Service = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
};

const SERVICES: Service[] = [
  {
    id: "engine",
    title: "Engine Maintenance & Overhaul",
    description:
      "Repair and overhaul for multiple turboprop and turboshaft families with Level 3 capability on selected platforms.",
    tags: ["Makila", "Arriel", "Arrius"],
    image: "/services_images/maintenance1.jpg",
  },
  {
    id: "tp400",
    title: "TP400-D6 Turboprop Support",
    description:
      "EPI AMO services providing Level 1 and Level 2 maintenance for TP400-D6 engines supporting the RMAF A400M fleet.",
    tags: ["TP400-D6", "EPI AMO", "RMAF A400M"],
    image: "/services_images/serv2.jpg",
  },
  {
    id: "apu",
    title: "Auxiliary Power Unit (APU) Services",
    description:
      "Safran eAPU60 support for offshore O&G and helicopter fleets requiring high availability and rapid turnaround.",
    tags: ["Safran eAPU60", "Offshore O&G"],
    image: "/services_images/training1.jpg",
  },
  {
    id: "sbh",
    title: "Support-By-Hour (SBH®)",
    description:
      "Predictable pay-as-you-fly programs with fixed cost per engine flight hour to reduce budget exposure.",
    tags: ["Fixed Cost", "Civil & Parapublic"],
    image: "/services_images/CapBg.png",
  },
  {
    id: "gsp",
    title: "Global Support Package (GSP®)",
    description:
      "Dedicated military support solution securing long-term engine availability and cost certainty with RMAF.",
    tags: ["Military Support", "Long-Term Planning"],
    image: "/services_images/CapBg.png",
  },
  {
    id: "logistics",
    title: "Logistics, Standard Exchange & Training",
    description:
      "24/7 AOG response, spares, tooling, exchange programs, and training backed by a global repair network.",
    tags: ["AOG 24/7", "Standard Exchange", "Tooling", "Training"],
    image: "/services_images/CapBg.png",
  },
];

export default function Capabilities() {
  const [active, setActive] = useState<Service>(SERVICES[0]);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Service cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((service) => {
            const isOpen = openId === service.id;
            return (
              <div
                key={service.id}
                className={`rounded-xl border transition-all duration-300 ${
                  active.id === service.id
                    ? "border-white/40 bg-white/15"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Card header */}
                <button
                  onClick={() => {
                    setActive(service);
                    setOpenId(isOpen ? null : service.id);
                  }}
                  className="group w-full p-6 text-left transition hover:bg-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        {service.title}
                      </h3>
                      <p className="text-sm text-white/70 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-white/20 px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Mobile expand indicator */}
                    <span className="ml-4 text-white/50 lg:hidden">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {/* Mobile dropdown detail */}
                <div
                  className={`lg:hidden overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-white/10 bg-white/10 p-5">
                    <p className="mb-4 text-sm text-white/80">
                      {service.description}
                    </p>
                    <button className="rounded-md border border-white/30 px-4 py-2 text-xs font-medium text-white transition hover:bg-white hover:text-[var(--color-navy-900)]">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel - Desktop only */}
        <div className="hidden lg:block rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur">
          <h3 className="mb-3 text-2xl font-semibold text-white">
            {active.title}
          </h3>

          <p className="mb-6 text-white/80">{active.description}</p>

          <div className="mb-8 flex flex-wrap gap-2">
            {active.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-white/20 px-3 py-1 text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>

          <button className="rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-[var(--color-navy-900)]">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}