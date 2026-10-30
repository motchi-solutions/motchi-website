export type NavigationItem = { label: string; href: string };
export const navigation = {
  solutions: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  websites: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "How We Work", href: "/process" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  consulting: [
    { label: "Home", href: "/" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "How We Work", href: "/approach" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} satisfies Record<string, NavigationItem[]>;

export const publicRoutes = {
  solutions: ["/", "/services", "/products", "/about", "/contact", "/privacy"],
  websites: [
    "/",
    "/work",
    "/services",
    "/process",
    "/about",
    "/contact",
    "/privacy",
  ],
  consulting: [
    "/",
    "/capabilities",
    "/approach",
    "/about",
    "/contact",
    "/privacy",
  ],
};
