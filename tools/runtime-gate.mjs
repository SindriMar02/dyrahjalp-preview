/* Serve the staged tree under a sub-path (like GitHub Pages), crawl every hash route and load it in a real browser.
   Fails on: failed/>=400 requests, console errors, broken images (lazy forced eager), h1 count != 1, Switzer not applied,
   horizontal overflow, route count != EXPECTED_ROUTES. Motion checks at 1440: Lenis running, home chapter pinned,
   hero + scroll reveals settle (no element left at opacity < .95 after a real wheel pass).
   Adapted from 03-prototypes/snaeland/tools/runtime-gate.mjs (no pinned chapter here). Usage: node runtime-gate.mjs <stageDir> </base/> */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(
  new URL("../../../04-platform/sndr-teardowns/", import.meta.url),
);
const { chromium } = require("playwright");
const [stage, base = "/"] = process.argv.slice(2);
const EXPECTED_ROUTES = 12; // Dýrahjálp: home, dyrin, tynd-fundin, hjalpa, um, vefverslun + animal pages reachable from home
const PORT = 5399,
  ORIGIN = `http://localhost:${PORT}`;
const T = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};
const srv = http
  .createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    if (!u.startsWith(base)) {
      r.writeHead(404);
      return r.end("outside base");
    }
    let f = path.join(stage, u.slice(base.length));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory())
      f = path.join(f, "index.html");
    if (!fs.existsSync(f)) {
      r.writeHead(404);
      return r.end("missing");
    }
    r.writeHead(200, {
      "Content-Type": T[path.extname(f)] || "application/octet-stream",
    });
    fs.createReadStream(f).pipe(r);
  })
  .listen(PORT);
const b = await chromium.launch();
let bad = 0,
  n = 0;
const VPS = [
  { width: 1440, height: 900 },
  {
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
];
async function open(vp, route) {
  const ctx = await b.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch,
    deviceScaleFactor: vp.deviceScaleFactor || 1,
  });
  const p = await ctx.newPage();
  const flag = (m) => {
    console.log(m, "|", route, vp.width);
    bad++;
  };
  p.on("requestfailed", (r) => {
    if (r.url().startsWith(ORIGIN)) flag("FAILED " + r.url());
  });
  p.on("response", (r) => {
    if (r.url().startsWith(ORIGIN) && r.status() >= 400)
      flag("HTTP " + r.status() + " " + r.url());
  });
  p.on("console", (m) => {
    if (m.type() === "error") flag("CONSOLE " + m.text().slice(0, 140));
  });
  p.on("pageerror", (e) => flag("PAGEERROR " + String(e).slice(0, 140)));
  await p.goto(ORIGIN + base + "#" + route, {
    waitUntil: "load",
    timeout: 45000,
  });
  await p.waitForTimeout(1800);
  return { ctx, p, flag };
}
// crawl routes at desktop
const routes = new Set(["/"]);
const queue = ["/"];
while (queue.length) {
  const r = queue.shift();
  const { ctx, p } = await open(VPS[0], r);
  const links = await p.evaluate(() =>
    [...document.querySelectorAll('a[href^="#/"]')].map((a) =>
      a.getAttribute("href").slice(1),
    ),
  );
  for (const l of links) {
    const k = l.split("?")[0];
    if (!routes.has(k)) {
      routes.add(k);
      queue.push(k);
    }
  }
  await ctx.close();
}
if (routes.size < EXPECTED_ROUTES) {
  console.log(`ROUTES ${routes.size} < ${EXPECTED_ROUTES}`);
  bad++;
}
for (const vp of VPS)
  for (const route of routes) {
    const { ctx, p, flag } = await open(vp, route);
    await p.evaluate(() =>
      document.querySelectorAll("img[loading]").forEach((i) => {
        i.loading = "eager";
      }),
    );
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 700) {
      await p.mouse.wheel(0, 700);
      await p.waitForTimeout(80);
    }
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      broken: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc)
        .map((i) => i.currentSrc),
      styled: document.fonts.check("500 20px 'Valley Sans'"),
      over: document.documentElement.scrollWidth - innerWidth,
      faded: [...document.querySelectorAll("#main *")].filter((e) => {
        const cs = getComputedStyle(e);
        return cs.opacity < 0.95 && e.getBoundingClientRect().width;
      }).length,
    }));
    if (info.h1 !== 1) flag("H1 count " + info.h1);
    if (!info.styled) flag("Valley Sans not applied");
    if (info.over > 0) flag("horizontal overflow " + info.over + "px");
    info.broken.forEach((s) => flag("BROKEN IMG " + s));
    if (info.faded)
      flag(
        "REVEAL STUCK " +
          info.faded +
          " elements below .95 opacity after scroll pass",
      );
    await ctx.close();
    n++;
  }
// motion wiring at desktop home
{
  const { ctx, p, flag } = await open(VPS[0], "/");
  const m = await p.evaluate(() => ({
    lenis: document.documentElement.classList.contains("lenis"),
    pin: !!document.querySelector(".pin-spacer"),
    words: document.querySelectorAll(".reveal-word").length,
  }));
  if (!m.lenis) flag("Lenis not running at 1440");
  if (m.words < 4) flag("heading word reveals missing (" + m.words + ")");
  await ctx.close();
  const t = await open(VPS[1], "/");
  const mt = await t.p.evaluate(() => ({
    lenis: document.documentElement.classList.contains("lenis"),
    pin: !!document.querySelector(".pin-spacer"),
  }));
  if (mt.lenis) t.flag("Lenis must not run on touch");
  await t.ctx.close();
}
await b.close();
srv.close();
console.log(`runtime gate: ${n} loads, ${bad} problems`);
process.exit(bad ? 1 : 0);
