import { mainNavigation } from "../lib/config/navigation.ts";
import {
  organizationSchema,
  siteMetadata,
  siteViewport,
  websiteSchema,
} from "../lib/config/metadata.ts";
import { JsonLd } from "../components/ui/json-ld.tsx";
import { ServiceWorker } from "../components/ui/service-worker.tsx";
import {
  Footer,
  Header,
  Introduction,
  MotionEnhancements,
} from "../components/ui/index.ts";
import { fontVariables } from "../components/ui/fonts.ts";
import type { ReactNode } from "react";
import "./globals.css";
// Indexing follows indexingAllowed(): production origin plus ALLOW_INDEXING.
export const metadata = siteMetadata("solutions");
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
        <Introduction />
        <MotionEnhancements />
        <ServiceWorker />
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
        <JsonLd data={organizationSchema("solutions")} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
