export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
};

const makePlaceholders = (count: number, prefix: string): TeamMember[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `TBD ${prefix} ${i + 1}`,
    role: "TBD",
    image: "/team_images/placeholders/person.svg",
  }));

export const DEPARTMENTS: Department[] = [
  {
    id: "board",
    name: "Board of Directors",
    description:
      "The Board of Directors provides strategic oversight, governance, and leadership to ensure Global Turbine Asia's long-term sustainability, compliance, and growth in the aerospace sector.",
    members: [
      {
        name: "Dato' Nonee Ashirin Dato Mohd Radzi",
        role: "Executive Chairman",
        image: "/team_images/board_teams/board-1.png",
      },
      {
        name: "Phillipe Lubrano",
        role: "Director",
        image: "/team_images/board_teams/board-2.png",
      },
      {
        name: "Tuan Syed Abdul Rahman Alhadad",
        role: "Director",
        image: "/team_images/board_teams/board-3.png",
      },
      {
        name: "Zain Puteh",
        role: "Director",
        image: "/team_images/board_teams/board-4.png",
      },
    ],
  },
  {
    id: "executive",
    name: "Executive Department",
    description:
      "Leads enterprise direction, aligning strategic priorities with operational execution across the organization.",
    members: makePlaceholders(3, "executive"),
  },
  {
    id: "ceo",
    name: "CEO Department",
    description:
      "Provides visionary leadership, stakeholder engagement, and performance stewardship for the business.",
    members: makePlaceholders(2, "ceo"),
  },
  {
    id: "coo",
    name: "COO Department",
    description:
      "Oversees day-to-day operations, resource allocation, and process excellence to deliver on strategy.",
    members: makePlaceholders(2, "coo"),
  },
  {
    id: "hr",
    name: "HR Department",
    description:
      "Supports workforce planning, talent development, and employee experience to enable high performance.",
    members: makePlaceholders(3, "hr"),
  },
  {
    id: "finance",
    name: "Finance Department",
    description:
      "Manages financial planning, stewardship, and reporting to ensure transparency and fiscal discipline.",
    members: makePlaceholders(2, "finance"),
  },
  {
    id: "operations",
    name: "Operational Services Department",
    description:
      "Delivers maintenance and service operations that keep customers' assets mission-ready.",
    members: makePlaceholders(3, "operations"),
  },
  {
    id: "innovation-facilities",
    name: "Business Innovation & Facilities Management",
    description:
      "Drives continuous improvement, innovation initiatives, and facility readiness to support growth.",
    members: makePlaceholders(2, "innovation"),
  },
  {
    id: "icp",
    name: "ICP Department",
    description:
      "Coordinates industrial collaboration programs and partner engagements to expand capabilities.",
    members: makePlaceholders(2, "icp"),
  },
  {
    id: "business-development",
    name: "Business and Development Department",
    description:
      "Pursues new markets, partnerships, and offerings to build a resilient growth pipeline.",
    members: makePlaceholders(3, "business-dev"),
  },
  {
    id: "customer-support",
    name: "Customer Support Department",
    description:
      "Provides responsive customer assistance, technical support, and service continuity.",
    members: makePlaceholders(3, "customer-support"),
  },
  {
    id: "quality",
    name: "Quality Management",
    description:
      "Ensures compliance, safety, and quality assurance across products, services, and processes.",
    members: makePlaceholders(2, "quality"),
  },
  {
    id: "it",
    name: "IT Department",
    description:
      "Delivers secure, reliable technology services and digital enablement for the business.",
    members: makePlaceholders(3, "it"),
  },
];
