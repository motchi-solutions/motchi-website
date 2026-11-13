import { expect, test } from "@playwright/test";
import { routes } from "./support.ts";

/* Search basics on every public page, checked from the server-rendered HTML
   (what a crawler receives before any JavaScript runs). Runs once. */
test.describe("SEO", () => {
  test.skip(({ isMobile }) => isMobile, "Server HTML is the same on phones.");

  test("each page has a unique title, description and absolute canonical URL", async ({
    request,
  }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of routes) {
      const html = await (await request.get(path)).text();
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
      const description =
        html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
      const canonical =
        html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";

      expect(title.length, `${path} title`).toBeGreaterThan(10);
      expect(title.length, `${path} title`).toBeLessThanOrEqual(65);
      expect(description.length, `${path} description`).toBeGreaterThan(70);
      expect(description.length, `${path} description`).toBeLessThanOrEqual(
        170,
      );
      expect(new URL(canonical).pathname, `${path} canonical`).toBe(path);
      titles.add(title);
      descriptions.add(description);
    }
    expect(titles.size).toBe(routes.length);
    expect(descriptions.size).toBe(routes.length);
  });

  test("each page has a social preview that matches the page", async ({
    request,
  }) => {
    for (const path of routes) {
      const html = await (await request.get(path)).text();
      const meta = (property: string) =>
        html.match(
          new RegExp(`<meta property="${property}" content="([^"]+)"`),
        )?.[1];
      expect(meta("og:image"), `${path} og:image`).toBeTruthy();
      expect(new URL(meta("og:url") ?? "").pathname, `${path} og:url`).toBe(
        path,
      );
      const image = await request.get(new URL(meta("og:image") ?? "").pathname);
      expect(image.headers()["content-type"]).toContain("image/png");
    }
  });

  test("structured data is valid JSON and describes the company and website", async ({
    request,
  }) => {
    const types = new Map<string, string[]>();
    for (const path of routes) {
      const html = await (await request.get(path)).text();
      const blocks = [
        ...html.matchAll(
          /<script type="application\/ld\+json">([^<]+)<\/script>/g,
        ),
      ].map((match) => JSON.parse(match[1]));
      types.set(
        path,
        blocks.map((block) => block["@type"]),
      );
    }
    for (const found of types.values())
      expect(found).toEqual(
        expect.arrayContaining(["Organization", "WebSite"]),
      );
    expect(types.get("/websites")).toContain("ProfessionalService");
    expect(types.get("/consulting")).toContain("ProfessionalService");
    expect(types.get("/websites/work")).toContain("BreadcrumbList");
  });

  test("main content is in the server HTML, without JavaScript", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator("main h1"), path).toHaveCount(1);
      expect(
        // biome-ignore lint/performance/useDomNodeTextContent: Rendered text is the point; hidden streamed copies must not count.
        (await page.locator("main").innerText()).length,
        path,
      ).toBeGreaterThan(400);
    }
    await context.close();
  });

  test("internal links resolve directly, without errors or redirects", async ({
    request,
  }) => {
    const links = new Set<string>();
    for (const path of routes) {
      const html = await (await request.get(path)).text();
      for (const match of html.matchAll(/<a [^>]*href="(\/[^"#]*)/g))
        links.add(match[1].replaceAll("&amp;", "&"));
    }
    for (const link of links) {
      const response = await request.get(link, { maxRedirects: 0 });
      expect(response.status(), link).toBe(200);
    }
  });

  test("link text says where it goes", async ({ request }) => {
    const vague = /^(click here|here|read more|learn more|more|link)$/i;
    for (const path of routes) {
      const html = await (await request.get(path)).text();
      for (const match of html.matchAll(/<a [^>]*>([\s\S]*?)<\/a>/g)) {
        const text = match[1].replace(/<[^>]+>/g, "").trim();
        expect(vague.test(text), `${path}: "${text}"`).toBe(false);
      }
    }
  });

  test("search engines stay out until launch", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"/>');
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    );
    expect(listed.sort()).toEqual([...routes].sort());
  });
});
