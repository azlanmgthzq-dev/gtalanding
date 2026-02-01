"use client";

import { Department } from "./teams.data";

type Props = {
    departments: {
      id: string;
      name: string;
    }[];
    activeId: string;
    onSelect: (id: string) => void;
  };
  
  
export default function VerticalTabs({
  departments,
  activeId,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-2 pr-2 custom-scrollbar">
      {departments.map((dept) => {
        const isActive = dept.id === activeId;
        const isTopLevel = dept.id === "board" || dept.id === "executive";

        return (
          <button
            key={dept.id}
            onClick={() => onSelect(dept.id)}
            className={`
              relative w-full rounded-xl px-4 py-3 pl-7
              text-left text-sm
              transition-all duration-300
              border
              ${
                isActive
                  ? "border-white/30 bg-white/12 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/8"
              }
              ${isTopLevel ? "font-semibold" : "font-medium"}
            `}
          >
            {isActive && (
              <span
                className="
                  absolute left-3 top-1/2 -translate-y-1/2
                  h-6 w-[2px] rounded-full
                  bg-[var(--color-accent-400)]
                "
              />
            )}
            {dept.name}
          </button>
        );
      })}
    </div>
  );
}
  
