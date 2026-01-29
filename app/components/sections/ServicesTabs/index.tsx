"use client";

import { useState } from "react";
import Capabilities from "./Capabilities";
import Certifications from "./Certifications";
import KeyPrograms from "./KeyPrograms";

const TABS = [
  { id: "capabilities", label: "Capabilities" },
  { id: "certifications", label: "Certifications" },
  { id: "programs", label: "Customers" },
];

export default function ServicesTabs() {
  const [activeTab, setActiveTab] = useState("capabilities");

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(11,18,32,0.7), rgba(11,18,32,0.75)), url('/services_images/dato.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
      <div className="relative mx-auto max-w-[1280px] px-6">

        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-400)]">
            Capabilities & Credentials
        </p>

        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            GTA CAPABILITIES & CREDENTIALS
        </h2>

        <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
            Our technical services, certified approvals, and flagship programs
            supporting military, civil, and parapublic operations.
        </p>
        </div>


        {/* Tabs */}
        <div className="mb-14 flex gap-4 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 rounded-lg px-6 py-3 text-sm font-medium transition
                ${
                  activeTab === tab.id
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "capabilities" && <Capabilities />}
          {activeTab === "certifications" && <Certifications />}
          {activeTab === "programs" && <KeyPrograms />}
        </div>
      </div>
    </section>
  );
}
