export type NavigationItem = { label: string; href: string };

type ServiceBranch = "websites" | "consulting";

export function branchHref(branch: ServiceBranch, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, "https://motchi.invalid");
  if (url.pathname === "/contact") {
    url.searchParams.set("branch", branch);
    if (!url.searchParams.has("topic"))
      url.searchParams.set(
        "topic",
        branch === "websites" ? "Website" : "Consulting",
      );
  } else if (
    ["/services", "/process", "/about", "/capabilities", "/approach"].includes(
      url.pathname,
    )
  ) {
    url.hash ||= url.pathname.slice(1);
    url.pathname = `/${branch}`;
  } else if (url.pathname !== "/privacy") {
    url.pathname = `/${branch}${url.pathname === "/" ? "" : url.pathname}`;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export const mainNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Websites", href: "/websites" },
  { label: "Consulting", href: "/consulting" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const websiteSections = [
  { id: "overview", label: "Overview" },
  { id: "work", label: "Selected work" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing & maintenance" },
  { id: "process", label: "How we work" },
  { id: "faq", label: "FAQs" },
  { id: "enquiry", label: "Start a project" },
];
export const consultingSections = [
  { id: "overview", label: "Overview" },
  { id: "capabilities", label: "Services" },
  { id: "approach", label: "How we work" },
  { id: "about", label: "What to expect" },
  { id: "faq", label: "FAQs" },
  { id: "enquiry", label: "Let's talk" },
];

export function branchForPath(
  pathname: string,
): "solutions" | "websites" | "consulting" {
  for (const branch of ["websites", "consulting"] as const)
    if (pathname === `/${branch}` || pathname.startsWith(`/${branch}/`))
      return branch;
  return "solutions";
}

export const publicRoutes = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/privacy",
  "/websites",
  "/websites/work",
  "/consulting",
];
