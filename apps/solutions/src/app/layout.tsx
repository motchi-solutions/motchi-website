import { organizationSchema, siteMetadata } from "@motchi/config/metadata";
import { Footer, Header } from "@motchi/ui";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata = siteMetadata("solutions");
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-branch="solutions">
      <body>
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-50 bg-primary px-5 py-3 text-inverse focus:not-sr-only"
        >
          Skip to content
        </a>
        <Header
          branch="solutions"
          items={[
            { label: "Home", href: "/" },
            { label: "What we do", href: "/#what-we-do" },
            { label: "Businesses", href: "/#businesses" },
            { label: "Products", href: "/#products" },
            { label: "About", href: "/#about" },
            { label: "Contact", href: "/contact" },
          ]}
        />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer branch="solutions" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema is serialized and less-than characters are escaped.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema("solutions")).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      </body>
    </html>
  );
}
