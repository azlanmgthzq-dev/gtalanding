import TeamMemberCard from "./TeamMemberCard";
import { Department } from "./teams.data";

type Props = {
    department: Department;
  };
  
  export default function DepartmentPanel({ department }: Props) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h3 className="text-2xl font-semibold text-white">
            {department.name}
          </h3>
          <p className="text-white/70">
            {department.description}
          </p>
        </header>
  
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {department.members.map((member) => (
            <div
              key={member.name}
              className="rounded-xl bg-white/5 border border-white/10 p-4 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto mb-3 h-40 w-36 rounded-lg border border-white/15 bg-white/5 object-contain"
              />
              <p className="font-medium text-white">{member.name}</p>
              <p className="text-sm text-white/60">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
