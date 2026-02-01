"use client";

import Image from "next/image";
import { useState } from "react";

type SupportService = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
};

  
const SUPPORT_SERVICES: SupportService[] = [
  {
    id: "aog",
    title: "AOG & 24/7 Operational Support",
    description:
      "Round-the-clock technical and logistical support to restore aircraft availability during Aircraft On Ground (AOG) situations.",
    highlights: [
      "24/7 technical helpline",
      "Privileged channels with Safran Helicopter Engines",
      "Rapid logistics coordination",
    ],
  },
  {
    id: "spares",
    title: "Spare Parts & Tooling Distribution",
    description:
      "Sole distributor in Malaysia for Safran helicopter engine spare parts and specialised tooling.",
    highlights: [
      "OEM-approved parts",
      "Specialised engine tooling",
      "Local availability & reduced lead time",
    ],
  },
  {
    id: "field",
    title: "Technical Assistance & Field Service",
    description:
      "On-site technical support and troubleshooting by qualified field representatives and technicians.",
    highlights: [
      "On-site deployment",
      "Operational troubleshooting",
      "Daily maintenance support",
    ],
  },
  {
    id: "training",
    title: "Training Services",
    description:
      "Structured training programmes to transfer GTA’s technical knowledge and operational experience to customer personnel.",
    highlights: [
      "Maintenance training",
      "Operational best practices",
      "Capability development",
    ],
  },
  {
    id: "ehm",
    title: "Engine Health Monitoring (EHM)",
    description:
      "Predictive monitoring of engine parameters to support proactive maintenance decisions and fleet reliability.",
    highlights: [
      "Torque & temperature margin tracking",
      "Predictive maintenance insights",
      "Lifecycle optimisation",
    ],
  },
  {
    id: "contracts",
    title: "Operational Support Contracts",
    description:
      "Long-term support solutions providing cost predictability and assured engine availability.",
    highlights: [
      "Support By The Hour (SBH®)",
      "Global Support Package (GSP®)",
      "Budget and availability assurance",
    ],
  },
];


export default function BeyondEngineMaintenance() {
  const [active, setActive] = useState(SUPPORT_SERVICES[0]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      {/* Service list */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SUPPORT_SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => setActive(service)}
            className={`rounded-xl border p-6 text-left transition
              ${
                active.id === service.id
                  ? "border-white/40 bg-white/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
          >
            <h3 className="mb-2 text-lg font-semibold text-white">
              {service.title}
            </h3>
            <p className="text-sm text-white/70 line-clamp-3">
              {service.description}
            </p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur">
        <h3 className="mb-3 text-2xl font-semibold text-white">
          {active.title}
        </h3>

        <p className="mb-6 text-white/80">{active.description}</p>

        <ul className="space-y-2 text-sm text-white/75">
          {active.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}