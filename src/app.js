import "./styles.css";
import { home, listPage, animalPage, applyPage, lostPage, helpPage, aboutPage, shopPage, notFound, renderGrid, renderChips } from "./pages.js";
import { parseRoute, filterAnimals, toggleParam, activeCount, validateForm } from "./model.js";
import { initMotion, resetMotion, stopScroll, startScroll, restoreScroll, moveTo, captureGrid, playGrid, tweenCount } from "./motion.js";

const main = document.querySelector("main");
const menu = document.querySelector("#menu");
let lockedY;
history.scrollRestoration = "manual";
let saveTimer;
window.addEventListener("scroll", () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { if (lockedY === undefined) history.replaceState({ y: Math.round(window.scrollY) }, ""); }, 120);
}, { passive: true });

function lock() {
  stopScroll();
  if (lockedY !== undefined) return;
  lockedY = window.scrollY;
  Object.assign(document.body.style, { position: "fixed", top: `-${lockedY}px`, width: "100%" });
}
function unlock() {
  if (lockedY === undefined) return;
  const y = lockedY;
  lockedY = undefined;
  for (const p of ["position", "top", "width"]) document.body.style.removeProperty(p);
  restoreScroll(y);
  startScroll();
  document.querySelector(".menu-toggle").classList.remove("menu-open");
}
menu.addEventListener("close", unlock);
menu.addEventListener("click", (e) => { if (e.target === menu) menu.close(); });
document.querySelector(".menu-toggle").addEventListener("click", (e) => {
  lock();
  e.currentTarget.classList.add("menu-open");
  menu.showModal();
  // Pointer-opened: no focus ring on the close button; keyboard-opened keeps it.
  if (e.detail) document.activeElement?.blur();
});

const titles = { "": "Dýr í heimilisleit", dyrin: "Dýr í heimilisleit", "tynd-fundin": "Týnd og fundin dýr", hjalpa: "Vilt þú hjálpa?", um: "Um Dýrahjálp", vefverslun: "Vefverslun" };
let current = "";

function render() {
  const r = parseRoute(location.hash);
  if (menu.open) menu.close();
  resetMotion();
  let html;
  if (r.path === "/") html = home();
  else if (r.section === "dyrin" && r.slug && r.path.endsWith("/umsokn")) html = applyPage(r.slug);
  else if (r.section === "dyrin" && r.slug) html = animalPage(r.slug);
  else if (r.section === "dyrin") html = listPage(r.params);
  else if (r.section === "tynd-fundin") html = lostPage();
  else if (r.section === "hjalpa") html = helpPage();
  else if (r.section === "um") html = aboutPage();
  else if (r.section === "vefverslun") html = shopPage();
  else html = notFound();
  main.innerHTML = html;
  document.title = `${r.slug ? main.querySelector("h1")?.textContent + " | " : ""}${titles[r.section] ?? "Dýrahjálp"} | Dýrahjálp Íslands`;
  for (const a of document.querySelectorAll(".desktop-nav a, .menu-dialog nav a"))
    a.toggleAttribute("aria-current", a.getAttribute("href").split("?")[0].split("#")[1] === r.path);
  const pageKey = r.path;
  const anchor = location.hash.split("#")[2];
  if (anchor && document.getElementById(anchor)) document.getElementById(anchor).scrollIntoView({ behavior: "instant", block: "start" });
  else if (pageKey !== current) window.scrollTo({ top: history.state?.y ?? 0, behavior: "instant" });
  current = pageKey;
  initMotion();
  main.focus({ preventScroll: true });
}

// Filters re-render only the grid, the chips and the count, keeping scroll and the map's pins in sync.
function applyFilters(params) {
  const grid = main.querySelector("[data-grid]");
  const state = captureGrid(grid);
  const list = filterAnimals(params);
  history.replaceState(history.state, "", `#/dyrin${params.toString() ? "?" + params : ""}`);
  grid.innerHTML = renderGrid(list);
  main.querySelector("#filters").innerHTML = renderChips(params);
  const n = activeCount(params);
  const toggle = main.querySelector(".filter-toggle");
  toggle.innerHTML = `<span class="filter-icon" aria-hidden="true"></span>Sía${n ? ` <span class="filter-n">${n}</span>` : ""}`;
  const count = main.querySelector(".filter-count");
  tweenCount(count.querySelector("[data-count]"), list.length);
  count.querySelector("[data-clear-filters]")?.remove();
  if (n) count.insertAdjacentHTML("beforeend", ' <button class="text-button" data-clear-filters>Hreinsa</button>');
  for (const link of main.querySelectorAll(".map-town-link"))
    link.classList.toggle("is-on", params.getAll("svaedi").includes(decodeURIComponent(link.getAttribute("href")?.split("svaedi=")[1] || "")));
  playGrid(grid, state);
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".skip")) { e.preventDefault(); main.focus(); main.scrollIntoView({ behavior: "instant" }); return; }
  const close = e.target.closest("[data-close]");
  if (close) document.getElementById(close.dataset.close).close();
  const chip = e.target.closest("[data-chip]");
  if (chip) { applyFilters(toggleParam(parseRoute(location.hash).params, chip.dataset.chip, chip.dataset.value)); return; }
  if (e.target.closest("[data-clear-filters]")) {
    const r = parseRoute(location.hash);
    if (r.section === "dyrin") applyFilters(new URLSearchParams());
    return;
  }
  const ft = e.target.closest(".filter-toggle");
  if (ft) {
    const panel = main.querySelector("#filters");
    const open = panel.hidden;
    panel.hidden = !open;
    ft.setAttribute("aria-expanded", String(open));
    return;
  }
  // Map pins on the list page only move the filter; on the home page they navigate.
  const townLink = e.target.closest(".map-town-link");
  if (townLink && parseRoute(location.hash).section === "dyrin" && !parseRoute(location.hash).slug) {
    e.preventDefault();
    const region = decodeURIComponent(townLink.getAttribute("href").split("svaedi=")[1]);
    applyFilters(toggleParam(parseRoute(location.hash).params, "svaedi", region));
    return;
  }
  const nav = e.target.closest('a[href^="#/"]');
  if (nav && nav.getAttribute("href") === location.hash) { if (menu.open) menu.close(); main.focus(); }
  for (const drop of document.querySelectorAll(".drop")) if (!drop.contains(e.target) || e.target.closest(".dropdown a")) drop.open = false;
});

document.addEventListener("submit", (e) => {
  const form = e.target.closest("form[data-form]");
  if (!form) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const fields = [...form.querySelectorAll("input[name], textarea[name]")].map((i) => i.name).filter((n) => ["name", "email", "phone", "message", "animal", "where"].includes(n));
  const errors = validateForm(data, fields);
  let first;
  for (const name of fields) {
    const err = form.querySelector(`#e-${name}`), input = form.querySelector(`[name="${name}"]`);
    if (!err) continue;
    err.hidden = !errors[name];
    err.textContent = errors[name] || "";
    input.setAttribute("aria-invalid", String(!!errors[name]));
    if (errors[name]) { input.setAttribute("aria-describedby", `e-${name}`); first ||= input; } else input.removeAttribute("aria-describedby");
  }
  if (first) { first.focus(); return; }
  form.querySelector(".form-done").hidden = false;
  form.querySelector("button[type=submit]").disabled = true;
  form.querySelector(".form-done").focus?.();
});

// Desktop dropdowns open on hover (fine pointers); click and keyboard still work through <details>.
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let closeTimer;
  for (const drop of document.querySelectorAll(".drop")) {
    drop.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
      for (const other of document.querySelectorAll(".drop[open]")) if (other !== drop) other.open = false;
      drop.open = true;
    });
    drop.addEventListener("mouseleave", () => {
      closeTimer = setTimeout(() => (drop.open = false), 140);
    });
    drop.querySelector("summary").addEventListener("click", (e) => {
      // A click on an already-hovered summary would toggle it shut; keep it open and let hover own it.
      if (drop.open && e.detail) e.preventDefault();
    });
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") for (const drop of document.querySelectorAll(".drop[open]")) drop.open = false;
});
window.addEventListener("hashchange", render);
render();
