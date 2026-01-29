"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Cert = {
  id: string;
  title: string;
  image: string;
  blurb?: string;
};

const CERTS: Cert[] = [
  { id: "easa", title: "EASA Part-145 Approval", image: "/Cert_images/easa.png" },
  { id: "dgta", title: "DGTA Approved Maintenance Organization", image: "/Cert_images/dGTA.png" },
  { id: "gapprove", title: "DGTA Approved Maintenance Organization [page 2]", image: "/Cert_images/gApprove.png" },
];

export default function Certifications() {
  const [open, setOpen] = useState<Cert | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <div className="mb-8">
        <h3 className="mb-3 text-2xl font-semibold text-white">
          Certifications & Approvals
        </h3>
        <p className="text-white/75">
          OEM approvals and regulator certificates underpinning our defense-grade MRO governance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((cert) => (
          <button
            key={cert.id}
            onClick={() => setOpen(cert)}
            className="group relative overflow-hidden rounded-xl border border-white/12 bg-white/5 p-4 text-left transition hover:border-white/30 hover:bg-white/10"
          >
            <div className="relative h-36 w-full overflow-hidden rounded-lg bg-navy-900/60">
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className="object-contain transition duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 320px, 50vw"
                priority={cert.id === "easa"}
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">{cert.title}</p>
            <p className="text-xs text-white/60">Tap to view full certificate</p>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
          <div className="relative w-full max-w-4xl rounded-2xl border border-white/20 bg-[#0b1220] p-4 shadow-2xl">
            <button
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/20"
              onClick={() => setOpen(null)}
            >
              ✕
            </button>
            <div className="relative mt-6 h-[60vh] min-h-[320px] w-full overflow-hidden rounded-lg bg-black/50">
              <Image
                src={open.image}
                alt={open.title}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 800px, 90vw"
              />
            </div>
            <p className="mt-4 text-center text-base font-semibold text-white">
              {open.title}
            </p>
            <p className="text-center text-sm text-white/60">
              Press Esc or close to return to the tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
