import { mainNavigation } from "../lib/config/navigation.ts";
import {
  organizationSchema,
  siteMetadata,
  siteViewport,
} from "../lib/config/metadata.ts";
import {
  Footer,
  Header,
  Introduction,
  MotionEnhancements,
} from "../components/ui/index.ts";
import { fontVariables } from "../components/ui/fonts.ts";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata = {
  ...siteMetadata("solutions"),
  robots: { index: false, follow: false },
};
export const viewport = siteViewport;
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      data-branch="solutions"
      className={fontVariables}
    >
      <body id="page-top">
        <Introduction branch="solutions" />
        <MotionEnhancements />
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-50 bg-primary px-5 py-3 text-inverse focus:not-sr-only"
        >
          Skip to content
        </a>
        <Header items={mainNavigation} />
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
