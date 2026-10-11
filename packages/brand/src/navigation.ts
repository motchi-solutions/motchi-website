export type NavigationItem = { label: string; href: string };
export const navigation = {
  solutions: [
    { label: "Home", href: "/" },
    { label: "Businesses", href: "/#businesses" },
    { label: "Products", href: "/#products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  websites: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ],
  consulting: [
    { label: "Home", href: "/" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Approach", href: "/approach" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ],
} satisfies Record<string, NavigationItem[]>;

export const publicRoutes = {
  solutions: ["/", "/about", "/contact", "/privacy"],
  websites: ["/", "/work", "/services", "/process", "/contact", "/privacy"],
  consulting: ["/", "/capabilities", "/approach", "/contact", "/privacy"],
};
