import Hero from "./components/sections/Hero";
import ServicesTabs from "./components/sections/ServicesTabs";
import TeamsTabs from "./components/sections/TeamsTabs";
import FloatingChat from "./components/chat/FloatingChat";

export default function Home() {
  return (
    <main className="relative">
      {/* HERO */}
      <Hero />
      <FloatingChat />

      {/* CAPABILITIES & SERVICES */}
      <ServicesTabs />

      {/* OUR TEAMS – BOARD (PROPOSAL PHASE) */}
      <TeamsTabs />

      {/* ============================== */}
      {/* STATS / READINESS STRIP (NEXT) */}
      {/* ============================== */}
      {/* 
      <section id="stats">
        // coming next
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
