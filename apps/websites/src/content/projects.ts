import type {
  GifAsset,
  ImageAsset,
  MediaAsset,
  VideoAsset,
} from "@motchi/brand";
export type Project = {
  id: string;
  title: string;
  industry: string;
  services: string[];
  description: string;
  url: string | null;
  caseStudyUrl?: string;
  technologies?: string[];
  details?: { heading: string; description: string }[];
  featured?: boolean;
  // These default treatments use Motchi colours, not claimed client brand palettes.
  treatment: "paper" | "burgundy" | "ink";
  colors?: { background: string; foreground: string };
  media: {
    desktop?: ImageAsset;
    mobile?: ImageAsset;
    logo?: ImageAsset;
    hero?: MediaAsset;
    motion?: VideoAsset | GifAsset;
  };
};
// Add approved media under public/media/projects/<id>/ and confirm URLs before publishing.
export const projects: Project[] = [
  {
    id: "vietbites",
    title: "VietBites",
    industry: "Restaurant / food",
    services: ["Brand Presentation", "Customer-Facing Website"],
    description:
      "A restaurant’s website should make its character clear and help customers find their next step. VietBites is one example of that direction.",
    url: null,
    media: {},
    treatment: "paper",
    featured: true,
  },
  {
    id: "vee-nails",
    title: "Vee’s Nails Studio",
    industry: "Beauty / services",
    services: ["Website", "Booking Experience"],
    description:
      "For a beauty studio, the customer journey continues beyond the homepage. This work brings the website and booking experience together.",
    url: null,
    media: {},
    treatment: "burgundy",
    featured: true,
  },
  {
    id: "lai-project",
    title: "Lai Project",
    industry: "Project showcase",
    services: ["Website Presentation"],
    description:
      "Another direction in the Motchi portfolio. Approved project details and imagery will be shared here.",
    url: null,
    media: {},
    treatment: "paper",
  },
  {
    id: "kamanda",
    title: "Kamanda",
    industry: "Professional / corporate",
    services: ["Website Design", "Development"],
    description:
      "A professional-business website with a more restrained, premium direction. A different business calls for a different visual language.",
    url: null,
    media: {},
    treatment: "ink",
  },
];
