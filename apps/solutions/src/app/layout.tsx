import { navigation } from "@motchi/config/navigation";
import {
  organizationSchema,
  siteMetadata,
  siteViewport,
} from "@motchi/config/metadata";
import { Footer, Header, MotionEnhancements } from "@motchi/ui";
import { fontVariables } from "@motchi/ui/fonts";
import type { ReactNode } from "react";
import "./globals.css";
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
      <body>
        <MotionEnhancements />
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-50 bg-primary px-5 py-3 text-inverse focus:not-sr-only"
        >
          Skip to content
        </a>
        <Header branch="solutions" items={navigation.solutions} />
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
