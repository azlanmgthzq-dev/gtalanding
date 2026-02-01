import Image from "next/image";

type TeamMemberCardProps = {
  name: string;
  role: string;
  image: string;
};

export default function TeamMemberCard({
  name,
  role,
  image,
}: TeamMemberCardProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* Image */}
      <div
        className="
            relative h-72 w-56
            rounded-2xl
            bg-gradient-to-b from-white/10 to-white/0
            border border-white/10
            shadow-lg
            overflow-hidden
        "
        >
        <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-5"
            priority
        />
        </div>

      {/* Text */}
      <div>
        <p className="text-base font-semibold text-white leading-tight">
          {name}
        </p>
        <p className="mt-1 text-sm text-white/70">
          {role}
        </p>
      </div>
    </div>
  );
}
