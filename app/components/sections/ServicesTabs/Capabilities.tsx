"use client";

import { useState } from "react";
import Image from "next/image";

type EngineCapability = {
  id: string;
  name: string;
  variants: string[];
  maintenanceLevel: ("L1" | "L2" | "L3")[];
  description: string;
  image: string;
};


const ENGINE_CAPABILITIES: EngineCapability[] = [
    {
      id: "arrius",
      name: "Arrius",
      variants: ["1A", "2B2", "2F"],
      maintenanceLevel: ["L1", "L2"],
      description:
        "Maintenance and repair support for Safran Arrius engines covering line and intermediate level activities.",
      image: "/engine_images/Arrius.png",
    },
    {
      id: "arriel",
      name: "Arriel",
      variants: ["1D", "2B", "2E"],
      maintenanceLevel: ["L1", "L2", "L3"],
      description:
        "Comprehensive maintenance capability for Arriel engine family, including selected Level 3 activities.",
      image: "/engine_images/Arriel.png",
    },
    {
      id: "makila",
      name: "Makila",
      variants: ["1A1", "2A", "2A1"],
      maintenanceLevel: ["L1", "L2"],
      description:
        "Operational and scheduled maintenance support for Makila engines used in medium and heavy helicopters.",
      image: "/engine_images/Makila.png",
    },
    {
      id: "tp400",
      name: "TP400-D6",
      variants: ["A400M"],
      maintenanceLevel: ["L1", "L2"],
      description:
        "EPI AMO approved Level 1 and Level 2 maintenance support for TP400-D6 engines powering the A400M fleet.",
      image: "/engine_images/TP-400.png",
    },
  ];

  


  export default function Capabilities() {
    const [active, setActive] = useState(ENGINE_CAPABILITIES[0]);

    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Engine cards */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {ENGINE_CAPABILITIES.map((engine) => (
            <button
              key={engine.id}
              onClick={() => setActive(engine)}
              className={`rounded-xl border p-5 text-left transition
                ${
                  active.id === engine.id
                    ? "border-white/40 bg-white/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
            >
              <Image
                src={engine.image}
                alt={engine.name}
                width={240}
                height={160}
                className="mx-auto mb-4 object-contain"
              />
  
              <h3 className="text-sm font-semibold text-white text-center">
                {engine.name}
              </h3>
            </button>
          ))}
        </div>
  
        {/* Detail panel */}
        <div className="rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur">
          <h3 className="mb-2 text-2xl font-semibold text-white">
            {active.name} Engine Family
          </h3>
  
          <p className="mb-6 text-white/80">{active.description}</p>
  
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold text-white">
              Supported Variants
            </p>
            <div className="flex flex-wrap gap-2">
              {active.variants.map((v) => (
                <span
                  key={v}
                  className="rounded border border-white/20 px-3 py-1 text-xs text-white/70"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
  
          <div>
            <p className="mb-2 text-sm font-semibold text-white">
              Maintenance Capability
            </p>
            <div className="flex gap-2">
              {active.maintenanceLevel.map((lvl) => (
                <span
                  key={lvl}
                  className="rounded bg-white px-3 py-1 text-xs font-semibold text-[var(--color-navy-900)]"
                >
                  {lvl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }