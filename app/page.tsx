import Capabilities from "./components/sections/Capabilities";
import Hero from "./components/sections/Hero";

export default function Home() {
  return (
    <main className="relative">
      {/* HERO */}
      <Hero />
      <Capabilities />

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
