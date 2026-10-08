import animals from "./animals.json";

export { animals };

// Towns on the logo's map (viewBox 0 0 520.7 358.8). Tuned by eye against the outline.
export const towns = {
  // Geographic positions mapped onto the logo outline (viewBox 0 0 520.7 358.8, linear lon/lat fit).
  // `cluster` is where the photos float relative to the town dot, so they never cover the coast.
  Reykjavík: { x: 123, y: 267, region: "Höfuðborgarsvæðið", cluster: [50, -60] },
  Snæfellsbæ: { x: 40, y: 185, region: "Vesturland", cluster: [34, -46] },
  Akureyri: { x: 304, y: 98, region: "Norðurland", cluster: [-40, -44] },
  Húsavík: { x: 340, y: 58, region: "Norðurland", cluster: [48, -2] },
};

export const speciesLabel = {
  hundur: "Hundar",
  köttur: "Kisur",
  kanína: "Kanínur",
  annað: "Önnur dýr",
};

// Chips use their own vocabulary. "Vön/Vanur" both count as the same fact.
export const chipGroups = [
  {
    key: "tegund",
    label: "Tegund",
    options: Object.entries(speciesLabel).map(([value, label]) => ({ value, label })),
    test: (a, v) => a.species === v,
  },
  {
    key: "svaedi",
    label: "Svæði",
    options: ["Höfuðborgarsvæðið", "Vesturland", "Norðurland"].map((v) => ({ value: v, label: v })),
    test: (a, v) => a.region === v,
  },
  {
    key: "von",
    label: "Vön / vanur",
    options: [
      { value: "börnum", label: "Börnum" },
      { value: "hundum", label: "Hundum" },
      { value: "kisum", label: "Kisum" },
    ],
    test: (a, v) => a.facts.some((f) => f.endsWith(" " + v)),
  },
  {
    key: "umsja",
    label: "Í umsjá",
    options: [
      { value: "fostur", label: "Á fósturheimili Dýrahjálpar" },
      { value: "eigandi", label: "Enn hjá eiganda" },
    ],
    test: (a, v) => (v === "fostur" ? a.foster : !a.foster),
  },
];

export function parseRoute(hash) {
  const raw = (hash || "#/").replace(/^#/, "");
  const [pathPart, query = ""] = raw.split("?");
  const path = pathPart.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(query);
  const [, section, slug] = path.split("/");
  return { path, section: section || "", slug: slug || "", params };
}

export function filterAnimals(params) {
  return animals.filter((a) =>
    chipGroups.every((g) => {
      const wanted = params.getAll(g.key);
      return wanted.length === 0 || wanted.some((v) => g.test(a, v));
    }),
  );
}

export function toggleParam(params, key, value) {
  const next = new URLSearchParams(params);
  const current = next.getAll(key);
  next.delete(key);
  const list = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  for (const v of list) next.append(key, v);
  return next;
}

export function activeCount(params) {
  return chipGroups.reduce((n, g) => n + params.getAll(g.key).length, 0);
}

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const required = { name: "Nafn vantar", email: "Netfang vantar", phone: "Símanúmer vantar", message: "Skilaboð vantar" };
export function validateForm(data, fields) {
  const errors = {};
  for (const f of fields) {
    const v = (data[f] || "").trim();
    if (!v) errors[f] = required[f] || "Þetta vantar";
    else if (f === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) errors[f] = "Netfangið lítur ekki rétt út";
    else if (f === "phone" && !/^[\d\s+-]{7,}$/.test(v)) errors[f] = "Símanúmer þarf 7 tölustafi";
  }
  return errors;
}

export function pluralDyr(n) {
  return n === 1 ? "1 dýr bíður" : `${n} dýr bíða`;
}
