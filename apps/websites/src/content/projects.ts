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
      "Warm orange branding, food illustrations, and clear menu and ordering links give VietBites a welcoming, customer-focused website.",
    url: null,
    media: {
      desktop: {
        kind: "image",
        src: "/media/projects/vietbites/desktop.png",
        alt: "VietBites desktop website with menu and ordering links, warm orange branding, and food illustrations.",
        width: 2626,
        height: 1502,
      },
      mobile: {
        kind: "image",
        src: "/media/projects/vietbites/mobile.png",
        alt: "VietBites mobile website with restaurant information and prominent menu and ordering buttons.",
        width: 780,
        height: 1380,
      },
      logo: {
        kind: "image",
        src: "/media/projects/vietbites/logo.png",
        alt: "",
        width: 324,
        height: 324,
      },
    },
    featured: true,
  },
  {
    id: "vee-nails",
    title: "Vee's Nails Studio",
    industry: "Beauty / services",
    services: ["Website", "Booking Experience"],
    description:
      "For a beauty studio, the customer journey continues beyond the homepage. This work brings the website and booking experience together.",
    url: null,
    media: {
      desktop: {
        kind: "image",
        src: "/media/projects/vee-nails/desktop.png",
        alt: "Vee's Nails Studio desktop website with pink branding, booking links, and a personal studio introduction.",
        width: 2320,
        height: 1540,
      },
      mobile: {
        kind: "image",
        src: "/media/projects/vee-nails/mobile.png",
        alt: "Vee's Nails Studio mobile website with booking and pricing buttons and a studio introduction.",
        width: 972,
        height: 1514,
      },
      logo: {
        kind: "image",
        src: "/media/projects/vee-nails/logo.png",
        alt: "",
        width: 812,
        height: 812,
      },
    },
    featured: true,
  },
  {
    id: "lai-project",
    title: "Lai Project",
    industry: "Drinks / event catering",
    services: ["Website Presentation", "Event Enquiries"],
    description:
      "Blue script lettering and drink photography give Lai a distinct identity, with a clear path for visitors to enquire about their event.",
    url: null,
    media: {
      desktop: {
        kind: "image",
        src: "/media/projects/lai-project/desktop.png",
        alt: "Lai desktop website with blue script lettering, event enquiry button, and a photograph of tea, matcha, and coffee drinks.",
        width: 2720,
        height: 1516,
      },
      mobile: {
        kind: "image",
        src: "/media/projects/lai-project/mobile.png",
        alt: "Lai mobile website with an event enquiry button and drink photography beneath the introduction.",
        width: 992,
        height: 1516,
      },
      logo: {
        kind: "image",
        src: "/media/projects/lai-project/logo.png",
        alt: "",
        width: 1419,
        height: 1434,
      },
    },
  },
  {
    id: "kamanda",
    title: "Kamanda",
    industry: "Professional / corporate",
    services: ["Website Design", "Development"],
    description:
      "A restrained navy and gold presentation introduces Kamanda's management, technology, and business services, with clear routes to explore services or get in touch.",
    url: null,
    media: {
      desktop: {
        kind: "image",
        src: "/media/projects/kamanda/desktop.png",
        alt: "Kamanda desktop website with a navy and gold business introduction over a city skyline and services and contact links.",
        width: 2672,
        height: 1460,
      },
      mobile: {
        kind: "image",
        src: "/media/projects/kamanda/mobile.png",
        alt: "Kamanda mobile website with its business introduction over architectural photography and prominent contact and services buttons.",
        width: 976,
        height: 1510,
      },
      logo: {
        kind: "image",
        src: "/media/projects/kamanda/logo.svg",
        alt: "",
        width: 1024,
        height: 1024,
      },
    },
  },
];
