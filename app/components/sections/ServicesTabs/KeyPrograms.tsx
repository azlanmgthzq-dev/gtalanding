"use client";

import Image from "next/image";
import { useState } from "react";

type Customer = {
    id: string;
    name: string;
    logo: string;
    description: string;
    engines: {
      name: string;
      image: string;
    }[];
  };
  
const CUSTOMERS: Customer[] = [
  {
    id: "rmaf",
    name: "Royal Malaysian Air Force",
    logo: "/customers_logos/RMAF.png",
    description:
      "Supporting fixed-wing and rotary assets through long-term engine maintenance, availability programs, and AOG readiness.",
    engines: [
      { name: "TP400-D6", image: "/engine_images/TP-400.png" },
      { name: "Makila", image: "/engine_images/Makila.png" },
    ],
  },
  {
    id: "navy",
    name: "Royal Malaysian Navy",
    logo: "/customers_logos/Navy.png",
    description:
      "Providing rotary wing engine support and availability programs for naval aviation operations.",
    engines: [
      { name: "Arriel", image: "/engine_images/Arriel.png" },
    ],
  },
  {
    id: "police",
    name: "Malaysian Army Aviation",
    logo: "/customers_logos/Police.png",
    description:
      "Supporting helicopter fleets with reliable engine maintenance and rapid exchange support.",
    engines: [
      { name: "Arrius", image: "/engine_images/Arrius.png" },
    ],
  },
];

export default function Customers() {
  const [active, setActive] = useState(CUSTOMERS[0]);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">

        {/* Customer cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CUSTOMERS.map((customer) => {
            const isOpen = openId === customer.id;
            return (
              <div
                key={customer.id}
                className={`rounded-xl border transition-all duration-300 ${
                  active.id === customer.id
                    ? "border-white/40 bg-white/15"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Card header */}
                <button
                  onClick={() => {
                    setActive(customer);
                    setOpenId(isOpen ? null : customer.id);
                  }}
                  className="group w-full p-6 text-left transition hover:bg-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="relative h-12 w-12">
                          <Image
                            src={customer.logo}
                            alt={customer.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          {customer.name}
                        </h4>
                      </div>

                      <p className="text-sm text-white/70 line-clamp-2">
                        {customer.description}
                      </p>
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
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-white/10 bg-white/10 p-5">
                    <p className="mb-4 text-sm text-white/80">
                      {customer.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {customer.engines.map((engine) => (
                        <div
                          key={engine.name}
                          className="rounded-lg border border-white/15 bg-white/5 p-3"
                        >
                          <div className="relative h-20 w-full">
                            <Image
                              src={engine.image}
                              alt={engine.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="mt-2 text-center text-xs font-semibold text-white">
                            {engine.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel - Desktop only */}
        <div className="hidden lg:block rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur">
          <h3 className="mb-3 text-2xl font-semibold text-white">
            {active.name}
          </h3>

          <p className="mb-6 text-white/80">
            {active.description}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {active.engines.map((engine) => (
              <div
                key={engine.name}
                className="rounded-lg border border-white/15 bg-white/5 p-4"
              >
                <div className="relative h-24 w-full">
                  <Image
                    src={engine.image}
                    alt={engine.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-semibold text-white">
                  {engine.name}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}