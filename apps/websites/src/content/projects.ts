export type Project = {
  title: string;
  industry: string;
  services: string[];
  description: string;
  url: string | null;
  images: { src: string; alt: string; width: number; height: number }[];
  technologies?: string[];
  featured?: boolean;
};
// URLs, screenshots, and any technology details await owner confirmation.
export const projects: Project[] = [
  {
    title: "VietBites",
    industry: "Restaurant / food",
    services: ["Brand presentation", "Customer-facing website"],
    description:
      "A restaurant example focused on presenting the brand and helping customers explore the business.",
    url: null,
    images: [],
    featured: true,
  },
  {
    title: "Vee’s Nails Studio",
    industry: "Beauty / services",
    services: ["Website", "Booking experience"],
    description:
      "A service-business example bringing the website and booking journey together.",
    url: null,
    images: [],
    featured: true,
  },
  {
    title: "Lai Project",
    industry: "Project showcase",
    services: ["Website presentation"],
    description:
      "Another example of our website work. Project details and approved imagery will be added here.",
    url: null,
    images: [],
  },
  {
    title: "Kamanda",
    industry: "Professional / corporate",
    services: ["Website design", "Development"],
    description:
      "A professional-business example with a distinct, premium design direction.",
    url: null,
    images: [],
  },
];
