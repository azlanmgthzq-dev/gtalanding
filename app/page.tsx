import Capabilities from "./components/sections/ServicesTabs/Capabilities";
import Hero from "./components/sections/Hero";
import ServicesTabs from "./components/sections/ServicesTabs";

export default function Home() {
  return (
    <main className="relative">
      {/* HERO */}
      <Hero />
      <ServicesTabs />

      {/* ============================== */}
      {/* STATS / READINESS STRIP (NEXT) */}
      {/* ============================== */}
      {/* 
      <section id="stats">
        // coming next
      </section>
      */}

      {/* ============================== */}
      {/* SERVICES / CAPABILITIES */}
      {/* ============================== */}
      {/* 
      <section id="services">
        // MRO capabilities
      </section>
      */}

      {/* ============================== */}
      {/* ACHIEVEMENTS */}
      {/* ============================== */}
      {/* 
      <section id="achievements">
        // milestones, flight hours, certifications
      </section>
      */}

      {/* ============================== */}
      {/* LEADERSHIP */}
      {/* ============================== */}
      {/* 
      <section id="leadership">
        // CEO / COO
      </section>
      */}

      {/* ============================== */}
      {/* NEWS */}
      {/* ============================== */}
      {/* 
      <section id="news">
        // press, announcements
      </section>
      */}
    </main>
  );
}
