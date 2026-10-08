// Studio motion engine (Snæland/Hópbílar recipe), re-aimed at Dýrahjálp.
// Appearance runs everywhere motion is allowed; Lenis only on fine pointers.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(ScrollTrigger, Flip);
let lenis, cleanup, enteredSite = false;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;

export function stopScroll() { lenis?.stop(); }
export function startScroll() { lenis?.start(); }
export function restoreScroll(y) {
  if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); }
  else window.scrollTo({ top: y, behavior: "instant" });
}
export function moveTo(element) {
  if (lenis) lenis.scrollTo(element, { duration: 0.8, offset: -90 });
  else element.scrollIntoView({ behavior: reduced() ? "instant" : "smooth" });
}
export function resetMotion() { cleanup?.(); cleanup = undefined; }

// Filter reflow: capture before the DOM swap, animate after. Instant under reduced motion.
export function captureGrid(grid) {
  if (!grid || reduced()) return null;
  return Flip.getState(grid.querySelectorAll(".tile"));
}
export function playGrid(grid, state) {
  if (!grid || !state) return;
  gsap.killTweensOf(grid.querySelectorAll(".tile"));
  Flip.from(state, {
    targets: grid.querySelectorAll(".tile"),
    duration: 0.5,
    ease: "power3.inOut",
    absolute: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power3.out" }),
    onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }),
  });
}
export function tweenCount(el, to) {
  if (!el) return;
  if (reduced()) { el.textContent = to; return; }
  const from = Number(el.textContent) || 0;
  const o = { n: from };
  gsap.to(o, { n: to, duration: 0.45, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.n)) });
}

export function initMotion() {
  resetMotion();
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const originals = [];
    const touch = isTouch();
    const travel = touch ? 12 : 22;
    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (!enteredSite) {
      entrance.from(".header .logo, .desktop-nav, .header-actions", { y: -8, opacity: 0, duration: 0.28, stagger: 0.05 }, 0);
      enteredSite = true;
    }
    const hero = document.querySelector(".hero");
    if (hero) {
      entrance
        .from(".hero-line-inner", { yPercent: 110, duration: 0.72, stagger: 0.08 }, 0.16)
        .from(".hero-copy > p, .hero-copy .hero-actions", { y: travel, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.42)
        .from(".map-plate", { yPercent: 10, opacity: 0, duration: 0.85 }, 0.2)
        .from(".map-pin", { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.045, transformOrigin: "50% 50%" }, 0.62);
    }
    // Masked word reveals on non-interactive headings outside the hero.
    for (const heading of document.querySelectorAll("#main h2.reveal")) {
      const html = heading.innerHTML;
      const label = heading.getAttribute("aria-label");
      heading.setAttribute("aria-label", heading.textContent.replace(/\s+/g, " ").trim());
      originals.push(() => { heading.innerHTML = html; label === null ? heading.removeAttribute("aria-label") : heading.setAttribute("aria-label", label); });
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const frag = document.createDocumentFragment();
        for (const part of node.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) frag.append(part);
          else {
            const mask = document.createElement("span"); mask.className = "reveal-word"; mask.setAttribute("aria-hidden", "true");
            const inner = document.createElement("span"); inner.className = "reveal-word-inner"; inner.textContent = part;
            mask.append(inner); frag.append(mask);
          }
        }
        node.replaceWith(frag);
      }
      const words = heading.querySelectorAll(".reveal-word-inner");
      gsap.from(words, {
        yPercent: 110, duration: touch ? 0.5 : 0.65,
        stagger: { each: 0.035, amount: Math.min(0.24, (words.length - 1) * 0.035) },
        ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 90%", once: true },
      });
    }
    for (const el of document.querySelectorAll("#main .rise")) {
      if (el.closest(".hero")) continue;
      gsap.from(el, { y: travel, opacity: 0, duration: touch ? 0.4 : 0.55, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    }
    const tiles = document.querySelectorAll("#main .tile-photo");
    for (const img of tiles)
      gsap.from(img, { yPercent: 12, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: img.parentElement, start: "top 92%", once: true } });
    const revealFocused = (e) => {
      const tile = e.target.closest(".tile");
      if (tile) gsap.getTweensOf(tile.querySelectorAll(".tile-photo, .rise")).forEach((t) => t.progress(1));
    };
    const finishEntrance = (e) => { if (e.key === "Tab") entrance.progress(1); };
    document.addEventListener("focusin", revealFocused);
    document.addEventListener("keydown", finishEntrance);
    return () => {
      document.removeEventListener("focusin", revealFocused);
      document.removeEventListener("keydown", finishEntrance);
      originals.forEach((r) => r());
    };
  });
  mm.add("(min-width: 992px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    let active = true, localLenis, ticker;
    if (!isTouch())
      import("lenis").then(({ default: Lenis }) => {
        if (!active || isTouch()) return;
        localLenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis = localLenis;
        localLenis.on("scroll", ScrollTrigger.update);
        ticker = (t) => localLenis.raf(t * 1000);
        gsap.ticker.add(ticker);
        if (document.querySelector("dialog[open]")) localLenis.stop();
      });
    const hero = document.querySelector(".hero");
    if (hero) {
      gsap.to(".hero-copy", { yPercent: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "+=600", scrub: true } });
      gsap.to(".map-plate", { yPercent: 7, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "+=600", scrub: true } });
    }
    return () => { active = false; if (ticker) gsap.ticker.remove(ticker); localLenis?.destroy(); if (lenis === localLenis) lenis = undefined; };
  });
  let active = true;
  cleanup = () => { active = false; mm.revert(); };
  document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
}
