<<<<<<< Updated upstream
import Hero from "./components/sections/Hero";
=======
import Capabilities from "./components/sections/ServicesTabs/Capabilities";
import ChatHero from "./components/sections/ChatHero";
>>>>>>> Stashed changes
import ServicesTabs from "./components/sections/ServicesTabs";
import TeamsTabs from "./components/sections/TeamsTabs";

export default function Home() {
  return (
    <main className="relative">
      {/* HERO */}
<<<<<<< Updated upstream
      <Hero />

      {/* CAPABILITIES & SERVICES */}
=======
      <ChatHero />
>>>>>>> Stashed changes
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
