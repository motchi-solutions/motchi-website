import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  branchHref,
  branchForPath,
  mainNavigation,
  publicRoutes,
} from "../src/lib/config/navigation.ts";

test("service links preserve paths, contact topics, query strings and fragments", () => {
  assert.equal(branchHref("websites", "/"), "/websites");
  assert.equal(branchHref("websites", "/services"), "/websites#services");
  assert.equal(branchHref("websites", "/process"), "/websites#process");
  assert.equal(
    branchHref("consulting", "/capabilities"),
    "/consulting#capabilities",
  );
  assert.equal(branchHref("consulting", "/about"), "/consulting#about");
  assert.equal(
    branchHref("websites", "/work?view=all#project-vietbites"),
    "/websites/work?view=all#project-vietbites",
  );
  assert.equal(
    branchHref("consulting", "/contact"),
    "/contact?topic=Consulting",
  );
  assert.equal(
    branchHref("websites", "/contact?topic=Maintenance#form"),
    "/contact?topic=Maintenance#form",
  );
  assert.equal(branchHref("websites", "/privacy"), "/privacy");
  for (const href of [
    "https://example.com/work",
    "//example.com/work",
    "#work",
    "mailto:contact@motchi.ca",
  ])
    assert.equal(branchHref("websites", href), href);
});

test("company navigation targets valid sitemap pages", () => {
  assert.equal(new Set(publicRoutes).size, publicRoutes.length);
  for (const item of mainNavigation) {
    for (const { href } of [item]) assert.ok(publicRoutes.includes(href));
  }
  for (const route of publicRoutes)
    assert.ok(existsSync(resolve(`src/app/${route}/page.tsx`)), route);
});

test("header identity follows service route boundaries and resets on company pages", () => {
  for (const [path, expected] of [
    ["/", "solutions"],
    ["/services", "solutions"],
    ["/websites", "websites"],
    ["/websites/work", "websites"],
    ["/consulting", "consulting"],
    ["/consulting-other", "solutions"],
    ["/contact", "solutions"],
  ])
    assert.equal(branchForPath(path), expected);
});
