import { animals, towns, speciesLabel, chipGroups, filterAnimals, toggleParam, activeCount, escapeHTML as esc, pluralDyr } from "./model.js";

const BASE = import.meta.env.BASE_URL;
const photo = (a, i = 0) => `${BASE}media/dyr/${a.photos[i]}`;
const ageLine = (a) => `${a.age}, ${a.postcode} ${a.town}`;
const factWord = (f) => f.replace(/^(Vön|Vanur) /, "");

function tile(a) {
  const chips = a.facts.filter((f) => /^(Vön|Vanur) /.test(f)).slice(0, 3);
  return `<a class="tile" href="#/dyrin/${a.slug}" data-slug="${a.slug}">
    <span class="tile-frame"><img class="tile-photo" src="${photo(a)}" width="700" height="700" alt="${esc(a.name)}" loading="lazy" /></span>
    <span class="tile-name">${esc(a.name)}</span>
    <span class="tile-line">${esc(ageLine(a))}</span>
    ${chips.length ? `<span class="tile-chips">${chips.map((c) => `<span>${esc(c)}</span>`).join("")}</span>` : ""}
    ${a.foster ? `<span class="tile-foster">Á fósturheimili Dýrahjálpar</span>` : ""}
  </a>`;
}

export function renderGrid(list) {
  if (!list.length)
    return `<p class="empty rise">Ekkert dýr passar við þessar síur. <button class="text-button" data-clear-filters>Hreinsa síur</button></p>`;
  return list.map(tile).join("");
}

export function renderChips(params, groups = chipGroups) {
  return groups
    .map(
      (g) => `<div class="chip-group" role="group" aria-label="${esc(g.label)}">
      <span class="chip-label">${esc(g.label)}</span>
      ${g.options
        .map((o) => {
          const on = params.getAll(g.key).includes(o.value);
          return `<button class="chip${on ? " is-on" : ""}" aria-pressed="${on}" data-chip="${g.key}" data-value="${esc(o.value)}">${esc(o.label)}</button>`;
        })
        .join("")}
    </div>`,
    )
    .join("");
}

function map(list, params, { interactive = true } = {}) {
  const byTown = {};
  for (const a of list) (byTown[a.town] ||= []).push(a);
  const r = 15, step = 33, shown = 3;
  const pins = Object.entries(towns)
    .map(([town, t]) => {
      const here = byTown[town] || [];
      if (!here.length) return "";
      const on = params.getAll("svaedi").includes(t.region);
      const [ox, oy] = t.cluster;
      const cx0 = t.x + ox, cy = t.y + oy;
      const row = here.slice(0, shown);
      const width = (row.length - 1) * step;
      const photos = row
        .map((a, i) => {
          const cx = cx0 - width / 2 + i * step;
          return `<g class="map-pin" data-slug="${a.slug}">
            <circle cx="${cx}" cy="${cy}" r="${r + 14}" class="map-hit" />
            <clipPath id="clip-${a.slug}"><circle cx="${cx}" cy="${cy}" r="${r}" /></clipPath>
            <circle cx="${cx}" cy="${cy}" r="${r + 2.5}" class="map-ring" />
            <image href="${photo(a)}" x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" clip-path="url(#clip-${a.slug})" preserveAspectRatio="xMidYMid slice" />
            <title>${esc(a.name)}, ${esc(ageLine(a))}</title>
          </g>`;
        })
        .join("");
      const more = here.length > shown
        ? `<g class="map-more-chip"><rect x="${cx0 + width / 2 + r + 6}" y="${cy - 11}" width="30" height="22" /><text x="${cx0 + width / 2 + r + 21}" y="${cy + 5}" class="map-more">+${here.length - shown}</text></g>`
        : "";
      const label = `<text x="${t.x}" y="${t.y + 20}" class="map-town">${esc(town)} · ${here.length}</text>`;
      const leader = `<line x1="${t.x}" y1="${t.y}" x2="${cx0}" y2="${cy + r + 3}" class="map-leader" />`;
      const dot = `<circle cx="${t.x}" cy="${t.y}" r="22" class="map-hit" /><circle cx="${t.x}" cy="${t.y}" r="4.5" class="map-dot" />`;
      const inner = `${leader}${dot}${photos}${more}${label}`;
      return interactive
        ? `<a href="#/dyrin?svaedi=${encodeURIComponent(t.region)}" class="map-town-link${on ? " is-on" : ""}" aria-label="${esc(t.region)}, ${here.length} dýr">${inner}</a>`
        : `<g class="map-town-link${on ? " is-on" : ""}">${inner}</g>`;
    })
    .join("");
  return `<div class="map-plate"><svg class="map" viewBox="0 0 520.7 358.8" role="img" aria-label="Ísland. ${pluralDyr(list.length)} eftir heimili.">
    <use href="${BASE}media/map.svg#iceland" class="map-land" />
    ${pins}
  </svg></div>`;
}

export function home() {
  const list = animals;
  const params = new URLSearchParams();
  const counts = Object.keys(speciesLabel).map((s) => ({ s, n: list.filter((a) => a.species === s).length }));
  return `
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <h1><span class="hero-line"><span class="hero-line-inner">Dýrin bíða</span></span><span class="hero-line"><span class="hero-line-inner">á kortinu.</span></span></h1>
        <p class="lead"><strong><span data-count>${list.length}</span> dýr</strong> eru í heimilisleit hjá Dýrahjálp núna. Hvert og eitt er á fósturheimili eða hjá eiganda sem þarf að finna því nýtt heimili. Veldu stað á kortinu eða skoðaðu þau öll.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#/dyrin">Skoða dýrin</a>
          <a class="button" href="#/hjalpa#fostur">Gerast fósturheimili</a>
        </div>
      </div>
      ${map(list, params)}
    </div>
  </section>
  <section class="section species">
    <div class="species-row">
      ${counts.map(({ s, n }) => `<a class="species-link rise" href="#/dyrin?tegund=${encodeURIComponent(s)}"><span class="species-n">${n}</span><span>${speciesLabel[s]}</span></a>`).join("")}
    </div>
  </section>
  <section class="section">
    <div class="section-head">
      <h2 class="reveal">Nýjast í heimilisleit</h2>
      <a class="text-link rise" href="#/dyrin">Öll dýrin →</a>
    </div>
    <div class="grid">${list.slice(0, 6).map(tile).join("")}</div>
  </section>
  <section class="section help-split">
    <div class="help-photo rise"><img src="${photo(animals[2])}" width="700" height="700" alt="Perla, 6 ára hundur á fósturheimili Dýrahjálpar" loading="lazy" /></div>
    <div class="help-copy">
      <h2 class="reveal">Fósturheimili óskast</h2>
      <p class="rise">Dýrahjálp tekur við dýrum sem eiga hvergi húsaskjól. Dýrin eru vistuð á fósturheimilum þar til þau finna framtíðarheimili. Núna vantar okkur sérstaklega fleiri fósturheimili fyrir hunda, en við fögnum öllum nýjum fósturheimilum.</p>
      <p class="rise">Hægt er að skrá sig fyrir hunda, ketti, fugla, nagdýr, kanínur, eða einfaldlega allar tegundir.</p>
      <div class="rise"><a class="button button-primary" href="#/hjalpa#fostur">Skrá fósturheimili</a></div>
    </div>
  </section>
  <section class="section story">
    <figure class="story-card">
      <img class="rise" src="${photo(animals[3])}" width="700" height="700" alt="Skuggi, 4 ára hundur" loading="lazy" />
      <figcaption>
        <blockquote class="rise"><p>„Skuggi er ótrúlega glaður, mikill karakter og fljótur að læra. Er yndislegur kúrari, blíður og elskar að fá gott klapp og athygli.“</p></blockquote>
        <p class="story-source rise">Úr lýsingu fósturheimilisins á Skugga, 4 ára hundi í 112 Reykjavík. <a href="#/dyrin/skuggi">Kynnast Skugga →</a></p>
      </figcaption>
    </figure>
  </section>
  <section class="section numbers">
    <p class="big-number rise"><span>8.106</span> dýr hafa fengið aðstoð frá stofnun félagsins í maí 2008.</p>
    <p class="rise">Dýrahjálp Íslands er félag sjálfboðaliða. Bak við hvert dýr sem fær nýtt heimili er hópur sjálfboðaliða sem gaf tíma sinn. <a class="text-link" href="#/hjalpa#sjalfbodalidi">Sjálfboðastarf →</a></p>
  </section>`;
}

export function listPage(params) {
  const list = filterAnimals(params);
  const n = activeCount(params);
  return `
  <section class="page-head">
    <h1>Dýr í heimilisleit</h1>
    <p class="lead">Sýnishorn: ${animals.length} af þeim 28 dýrum sem nú eru skráð í heimilisleit á dyrahjalp.is. Öll dýr auglýst á heimasíðu Dýrahjálpar eru gefins.</p>
  </section>
  <section class="section list">
    <div class="map-row">${map(list, params, { interactive: true })}</div>
    <div class="filter-bar">
      <button class="button filter-toggle" aria-expanded="false" aria-controls="filters"><span class="filter-icon" aria-hidden="true"></span>Sía${n ? ` <span class="filter-n">${n}</span>` : ""}</button>
      <p class="filter-count"><strong data-count>${list.length}</strong> ${list.length === 1 ? "dýr" : "dýr"}${n ? ` <button class="text-button" data-clear-filters>Hreinsa</button>` : ""}</p>
    </div>
    <div class="filters" id="filters" hidden>${renderChips(params)}</div>
    <div class="grid" data-grid>${renderGrid(list)}</div>
  </section>`;
}

export function animalPage(slug) {
  const a = animals.find((x) => x.slug === slug);
  if (!a) return notFound();
  const rows = [
    ["Tegund", a.age.replace(/^.*?\s(?=[a-záðéíóúýþæö]+$)/, "")],
    ["Aldur", a.age.replace(/\s[a-záðéíóúýþæö]+$/, "")],
    ["Staður", `${a.postcode} ${a.town}`],
    ["Í umsjá", a.foster ? "Dýrahjálpar, á fósturheimili" : "Eiganda"],
    ...a.facts.map((f) => [f.startsWith("V") ? f.replace(/ .*/, "") : "Staða", f.startsWith("V") ? factWord(f) : f]),
    a.health && ["Heilsufar", a.health],
    a.includes && ["Fylgir", a.includes],
  ].filter(Boolean);
  const notice = a.foster
    ? "Það að vera á fósturheimili Dýrahjálpar þýðir að dýrið er í umsjá Dýrahjálpar. Dýrahjálp tekur ákvörðun um framtíðarheimili með aðstoð fósturheimilis."
    : "Athugið að þetta dýr er ekki í umsjá Dýrahjálpar. Dýrið er enn hjá eiganda sínum sem tekur ákvörðun um framtíðarheimili. Eigandi fær umsóknina til sín og ber ábyrgð á að vera í sambandi við umsækjendur, ekki Dýrahjálp.";
  const others = animals.filter((x) => x.slug !== a.slug && x.species === a.species).slice(0, 3);
  return `
  <article class="animal">
    <div class="animal-top">
      <div class="animal-head">
        <p class="crumb"><a href="#/dyrin">Dýr í heimilisleit</a> / ${esc(speciesLabel[a.species])}</p>
        <h1>${esc(a.name)}</h1>
        <p class="lead">${esc(ageLine(a))}</p>
      </div>
      <div class="animal-gallery">
        ${a.photos.map((p, i) => `<img src="${BASE}media/dyr/${p}" width="700" height="700" alt="${esc(a.name)}${i ? ", mynd " + (i + 1) : ""}" ${i ? 'loading="lazy"' : ""} />`).join("")}
      </div>
      <div class="animal-copy">
        ${a.paras.map((p) => `<p>${esc(p)}</p>`).join("")}
        ${a.other ? `<p>${esc(a.other)}</p>` : ""}
        <p class="notice">${notice}</p>
        <a class="button button-primary" href="#/dyrin/${a.slug}/umsokn">Senda umsókn</a>
      </div>
    </div>
    <section class="section facts">
      <h2 class="reveal">Staðreyndir</h2>
      <dl class="fact-table">${rows.map(([k, v]) => `<div class="rise"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <p class="source rise">Upplýsingar orðrétt af <a href="${a.source}" target="_blank" rel="noopener">dyrahjalp.is ↗︎</a></p>
    </section>
    ${others.length ? `<section class="section"><div class="section-head"><h2 class="reveal">Fleiri ${speciesLabel[a.species].toLowerCase()}</h2></div><div class="grid">${others.map(tile).join("")}</div></section>` : ""}
  </article>`;
}

const field = (name, label, type = "text", extra = "") =>
  `<div class="field"><label for="f-${name}">${label}</label>${
    type === "textarea" ? `<textarea id="f-${name}" name="${name}" rows="4" ${extra}></textarea>` : `<input id="f-${name}" name="${name}" type="${type}" ${extra} />`
  }<p class="error" id="e-${name}" hidden></p></div>`;

export function applyPage(slug) {
  const a = animals.find((x) => x.slug === slug);
  if (!a) return notFound();
  return `
  <section class="page-head narrow">
    <p class="crumb"><a href="#/dyrin/${a.slug}">${esc(a.name)}</a></p>
    <h1>Umsókn</h1>
    <p class="lead">${esc(a.name)}, ${esc(ageLine(a))}. ${a.foster ? "Dýrahjálp fer yfir umsóknina með fósturheimilinu." : "Eigandi fær umsóknina til sín og hefur samband."} Hönnunartillaga: ekkert er sent.</p>
  </section>
  <section class="section narrow">
  <form class="form" data-form="umsokn" novalidate>
    ${field("name", "Nafn", "text", 'autocomplete="name"')}
    ${field("email", "Netfang", "email", 'autocomplete="email" inputmode="email" spellcheck="false"')}
    ${field("phone", "Símanúmer", "tel", 'autocomplete="tel" inputmode="tel"')}
    ${field("message", "Segðu frá heimilinu, fjölskyldunni og reynslu af dýrum", "textarea")}
    <button class="button button-primary" type="submit">Senda umsókn</button>
    <p class="form-done" hidden>Takk. Umsóknin hefði nú farið til ${a.foster ? "Dýrahjálpar" : "eigandans"}. Í hönnunartillögu er ekkert sent.</p>
  </form>
  </section>`;
}

export function lostPage() {
  return `
  <section class="page-head">
    <h1>Týnd og fundin dýr</h1>
    <p class="lead">Ef þú týnir gæludýri mælum við með því að þú látir hendur standa fram úr ermum og hafir samband við þá aðila sem geta komið til aðstoðar.</p>
  </section>
  <section class="section two-col">
    <div>
      <h2 class="reveal">Nýjast skráð</h2>
      <article class="report rise">
        <p class="report-kind">Týndur köttur · Skráð 4. okt 2026</p>
        <h3>Atlas er týndur</h3>
        <p>Hvítur og rauður. Sást síðast 13. ágúst við Hótel Skúlagarð í Kelduhverfi. Atlas er mjög gæfur og mannelskur. Hann gæti hafa farið upp í bíl og því verið langt í burtu, jafnvel í öðrum landshluta. Atlas er örmerktur.</p>
        <p class="source">Eigandi: Leonardo. Upplýsingar um eiganda birtast á dyrahjalp.is.</p>
      </article>
    </div>
    <div>
      <h2 class="reveal">Hvert get ég snúið mér?</h2>
      <ol class="steps">
        <li class="rise">Ef um hund eða kött er að ræða, hafðu samband við þá aðila sem dýrafangarar fara með dýrin til: Leirur á höfuðborgarsvæðinu fyrir hunda og K-9 í Reykjanesbæ. Kettir sem finnast á höfuðborgarsvæðinu fara í Kattholt.</li>
        <li class="rise">Hafðu samband við lögreglu og dýralækna í þínu hverfi og láttu skrá að þú sért að leita að týndu gæludýri, með góðri lýsingu á dýrinu.</li>
        <li class="rise">Skráðu dýrið hér að neðan og auglýstu eftir því.</li>
      </ol>
    </div>
  </section>
  <section class="section narrow" id="skra">
    <h2 class="reveal">Skrá týnt eða fundið dýr</h2>
    <form class="form" data-form="tynt" novalidate>
      <fieldset class="field"><legend>Hvort?</legend><label class="radio"><input type="radio" name="kind" value="tynt" checked /> Týnt dýr</label><label class="radio"><input type="radio" name="kind" value="fundid" /> Fundið dýr</label></fieldset>
      ${field("animal", "Dýrið (tegund, litur, nafn)")}
      ${field("where", "Hvar og hvenær sást það síðast")}
      ${field("name", "Nafn", "text", 'autocomplete="name"')}
      ${field("phone", "Símanúmer", "tel", 'autocomplete="tel" inputmode="tel"')}
      ${field("email", "Netfang", "email", 'autocomplete="email" inputmode="email" spellcheck="false"')}
      <button class="button button-primary" type="submit">Skrá</button>
      <p class="form-done" hidden>Takk. Skráningin hefði nú birst á listanum. Í hönnunartillögu er ekkert sent.</p>
    </form>
  </section>`;
}

export function helpPage() {
  return `
  <section class="page-head">
    <h1>Vilt þú hjálpa?</h1>
    <p class="lead">Sjálfboðaliðar eru grunnurinn í starfi okkar og án þeirra gætum við ekki hjálpað dýrum í neyð.</p>
  </section>
  <section class="section help-block" id="fostur">
    <div class="help-block-copy">
      <h2 class="reveal">Fósturheimili</h2>
      <p class="rise">Getur þú séð dýri í neyð fyrir fósturheimili þar til framtíðarheimili finnst? Sum dýr þurfa nauðsynlega að finna heimili með skömmum fyrirvara og því getur reynst nauðsynlegt að koma því fyrir á fósturheimili þar til finnst varanleg lausn fyrir dýrið.</p>
      <p class="rise">Hverju dýri er úthlutað umsjónaraðila sem er tengiliður hvers fósturheimilis og ber ábyrgð á að útvega fósturdýrinu þær nauðsynjar sem á þarf að halda.</p>
    </div>
    <form class="form" data-form="fostur" novalidate>
      ${field("name", "Nafn", "text", 'autocomplete="name"')}
      ${field("email", "Netfang", "email", 'autocomplete="email" inputmode="email" spellcheck="false"')}
      ${field("phone", "Símanúmer", "tel", 'autocomplete="tel" inputmode="tel"')}
      <fieldset class="field"><legend>Fyrir hvaða dýr?</legend>${["Hunda", "Ketti", "Fugla", "Nagdýr", "Kanínur", "Allar tegundir"].map((t) => `<label class="check"><input type="checkbox" name="types" value="${t}" /> ${t}</label>`).join("")}</fieldset>
      <button class="button button-primary" type="submit">Skrá fósturheimili</button>
      <p class="form-done" hidden>Takk. Við bjóðum þér á nýliðakynningu og spjall. Í hönnunartillögu er ekkert sent.</p>
    </form>
  </section>
  <section class="section help-block" id="sjalfbodalidi">
    <div class="help-block-copy">
      <h2 class="reveal">Sjálfboðastarf</h2>
      <p class="rise">Sjálfboðaliðar koma að starfinu á fjölbreyttan hátt, til dæmis með þátttöku í fjáröflunum, samfélagsmiðlum, kynningum, útréttingum og ýmsum öðrum verkefnum sem eru nauðsynleg til að halda starfseminni gangandi.</p>
      <p class="rise">Eftir skráningu bjóðum við þér á nýliðakynningu og spjall þar sem við förum yfir starfsemina, verklag og ræðum hvaða hlutverk hentar þér best.</p>
    </div>
    <form class="form" data-form="sjalfbodalidi" novalidate>
      ${field("name", "Nafn", "text", 'autocomplete="name"')}
      ${field("email", "Netfang", "email", 'autocomplete="email" inputmode="email" spellcheck="false"')}
      ${field("message", "Hvað langar þig að gera?", "textarea")}
      <button class="button button-primary" type="submit">Skrá sjálfboðaliða</button>
      <p class="form-done" hidden>Takk. Í hönnunartillögu er ekkert sent.</p>
    </form>
  </section>
  <section class="section help-block" id="medlimur">
    <div class="help-block-copy">
      <h2 class="reveal">Gerast meðlimur</h2>
      <p class="rise">Með því að gerast meðlimur þá gengur þú í lið með okkur og styður við dýr í neyð. Félagið sendir út greiðsluseðil árlega fyrir félagsgjöldum sem eru valkvæð. Félagsgjöld ársins 2024 eru 3.800 kr.</p>
    </div>
    <form class="form" data-form="medlimur" novalidate>
      ${field("name", "Nafn", "text", 'autocomplete="name"')}
      ${field("kt", "Kennitala (aðeins notuð til staðfestingar á aldri)", "text", 'inputmode="numeric"')}
      ${field("email", "Netfang", "email", 'autocomplete="email" inputmode="email" spellcheck="false"')}
      <button class="button button-primary" type="submit">Skrá mig sem meðlim</button>
      <p class="form-done" hidden>Takk. Í hönnunartillögu er ekkert sent.</p>
    </form>
  </section>
  <section class="section help-block" id="styrkja">
    <div class="help-block-copy">
      <h2 class="reveal">Styrkja starfsemina</h2>
      <p class="rise">Dýrahjálp Íslands notar alla styrki til að hjálpa dýrum að finna ný heimili, gelda dýr sem þess þurfa, dýralæknakostnað og annað tengt markmiðum félagsins.</p>
      <p class="rise">Til fjármögnunar á starfsemi Dýrahjálpar höfum við einnig til sölu jólakort og póstkort í <a class="text-link" href="#/vefverslun">vefverslun →</a></p>
    </div>
    <div class="donate rise">
      <p class="donate-label">Styrkja með millifærslu</p>
      <p>Dýrahjálp Íslands, kt. 620508-1010. Reikningsnúmer birtist á dyrahjalp.is.</p>
      <a class="button button-primary" href="mailto:dyrahjalp@dyrahjalp.is?subject=Styrkur">Hafa samband um styrk</a>
    </div>
  </section>`;
}

export function aboutPage() {
  const people = [
    ["Valgerður", "formaður félagsins. Með meistaragráðu í fjármálum frá Háskóla Íslands. Á tvær kanínur og hund."],
    ["Sandra", "í stjórn Dýrahjálpar, hefur umsjón með daglegum rekstri. Lögfræðingur. Á fjórar kanínur."],
    ["Þórunn", "í fósturheimilateymi félagsins. Flugmaður. Á tvo hunda og kött."],
    ["Elsa", "byrjaði sem fósturheimili hjá Dýrahjálp. Sinnir daglegum rekstri og uppbyggingu. Á þrjá hunda."],
    ["Berglind", "hundaráðgjafi félagsins. BSc í sálfræði. Á þrjá hunda."],
    ["Sonja", "hjá Dýrahjálp síðan 2012. Sinnir daglegum rekstri, þróun og uppbyggingu. Á fjóra hunda og fjóra ketti."],
    ["Sirrý", "ljósmyndari Dýrahjálpar. Á tvo hunda."],
  ];
  return `
  <section class="page-head">
    <h1>Um Dýrahjálp</h1>
    <p class="lead">Markmið félagsins er að leitast við að sjá dýrum sem þarfnast heimilis fyrir skjóli og stofna til þess dýraathvarf og að vinna almenning í landinu til fylgis og stuðnings við dýravernd.</p>
  </section>
  <section class="section two-col">
    <div>
      <h2 class="reveal">Starfið</h2>
      <p class="rise">Þangað til hægt verði að stofna til slíks athvarfs mun félagið leitast við að finna þeim dýrum sem annars væri lógað ný heimili, hvort sem það er fósturheimili eða varanlegt heimili.</p>
      <p class="rise">Dýrahjálp Íslands starfrækir athvarf fyrir heimilislaus gæludýr í gegnum netið með sérhönnuðu fósturheimilakerfi. Félagið er fjármagnað að mestu með styrkjum frá einstaklingum og fyrirtækjum ásamt því að afla fjár með vörusölu.</p>
      <p class="rise">Frá stofnun félagsins í maí 2008 hefur Dýrahjálp Íslands aðstoðað alls 8.106 dýr í heimilisleit.</p>
    </div>
    <div>
      <h2 class="reveal">Skjöl</h2>
      <ul class="doc-list">
        ${["Lög Dýrahjálpar Íslands", "Siðareglur", "Jafnréttisstefna", "Starfsreglur stjórnar", "Ársreikningur 2024", "Ársreikningur 2023", "Persónuverndarstefna", "Skilmálar vefverslunar"].map((d) => `<li class="rise"><a href="https://www.dyrahjalp.is/um_felagid/" target="_blank" rel="noopener">${d} ↗︎</a></li>`).join("")}
      </ul>
    </div>
  </section>
  <section class="section">
    <h2 class="reveal">Fólkið</h2>
    <dl class="people">${people.map(([n, t]) => `<div class="rise"><dt>${n}</dt><dd>${t}</dd></div>`).join("")}</dl>
  </section>`;
}

export function shopPage() {
  const items = [
    ["Jólakort Dýrahjálpar", "Sýnishorn"],
    ["Póstkort", "Sýnishorn"],
    ["Félagsgjald 2024", "3.800 kr."],
  ];
  return `
  <section class="page-head">
    <h1>Vefverslun</h1>
    <p class="lead">Til fjármögnunar á starfsemi Dýrahjálpar höfum við til sölu m.a. jólakort og póstkort. Hönnunartillaga: vörur og verð eru sýnishorn.</p>
  </section>
  <section class="section">
    <div class="shop-grid">${items.map(([n, p]) => `<div class="shop-item rise"><div class="shop-frame"></div><p class="shop-name">${n}</p><p class="shop-price">${p}</p></div>`).join("")}</div>
  </section>`;
}

export function notFound() {
  return `<section class="page-head"><h1>Síðan fannst ekki</h1><p class="lead"><a class="text-link" href="#/">Forsíða →</a></p></section>`;
}
