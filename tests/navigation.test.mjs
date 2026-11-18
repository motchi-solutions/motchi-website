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
    "/contact?branch=consulting&topic=Consulting",
  );
  assert.equal(
    branchHref("websites", "/contact?topic=Maintenance#form"),
    "/contact?topic=Maintenance&branch=websites#form",
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

test("route identity follows service boundaries and defaults to the company", () => {
  for (const [path, expected] of [
    ["/", "solutions"],
    ["/about", "solutions"],
    ["/products", "solutions"],
    ["/privacy", "solutions"],
    ["/websites", "websites"],
    ["/websites/work", "websites"],
    ["/consulting", "consulting"],
    ["/consulting/capabilities", "consulting"],
    ["/consulting-other", "solutions"],
    ["/websites-other", "solutions"],
    ["/contact", "solutions"],
  ])
    assert.equal(branchForPath(path), expected);
});
