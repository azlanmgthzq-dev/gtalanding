"use client";

import { useState } from "react";
import DepartmentPanel from "./DepartmentPanel";
import VerticalTabs from "./VerticalTabs";
import { DEPARTMENTS } from "./teams.data";

export default function TeamsTabs() {
  const [activeId, setActiveId] = useState<string>(DEPARTMENTS[0].id);
  const activeDepartment =
    DEPARTMENTS.find((dept) => dept.id === activeId) ?? DEPARTMENTS[0];

  return (
    <section
      id="leadership"
      className="relative overflow-hidden py-24"
      style={{
        backgroundImage: `
            linear-gradient(
              180deg,
              rgba(11,18,32,0.92),
              rgba(11,18,32,0.88)
            ),
            url('/services_images/serv2.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
    >
      <div className="mx-auto max-w-[1280px] px-6 space-y-12">
        <header className="space-y-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-400)]">
            Governance
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Our Governance & Leadership
          </h2>
          <p className="max-w-3xl text-base text-white/70">
            Meet the teams that steer Global Turbine Asia's strategy,
            operations, and customer commitments across the region.
          </p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="w-full lg:w-[280px] lg:flex-shrink-0">
            <div className="sticky top-[120px]">
              <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur custom-scrollbar">
                <VerticalTabs
                  departments={DEPARTMENTS}
                  activeId={activeId}
                  onSelect={setActiveId}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex-1 min-w-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur">
              <DepartmentPanel department={activeDepartment} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
