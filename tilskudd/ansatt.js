/**
 * Fiktiv ansatt i øvelsen. Ikke en ekte HR-post, ikke Bufdir.
 */
const ANSATT = {
  id: "frank",
  fornavn: "Frank",
  navn: "Frank",
  stilling: "Saksbehandler, tilskudd",
  enhet: "Øvelseskontoret — ikke Bufdir",
  epost: "frank@ovelse.local"
};

const FRANK_STATUS_KEY = "ovelseFrankStatus";

const FRANK_STANDARD_STATUS = {
  "T-2629": "startet",
  "T-2622": "startet",
  "T-2632": "startet",
  "T-3001": "startet",
  "T-2612": "ikke_startet",
  "T-2603": "ikke_startet",
  "T-2701": "ikke_startet",
  "T-3002": "ikke_startet",
  "T-3003": "ikke_startet"
};

const FRANK_TILDELTE = Object.keys(FRANK_STANDARD_STATUS);

const FRANK_EKSTRA = [
  {
    id: "T-3001",
    org: "Åsby leseklubb",
    orgnr: "999 555 667",
    kommune: "Åsby",
    aktivitet: "4.1 Kultur, fritid og ferie",
    ordningId: "inkludering-barn-unge",
    belop: 45000,
    jobb: "Ny fiktiv sak i din bunke. Les teksten og si om du vil innstille.",
    soknad: "Gratis lesestund etter skoletid for 10 barn. Ingen egenandel. Foreldregruppe er med på planlegging.",
    flag: "ok",
    adminPct: 10,
    adminBelop: 4500,
    rapportFjor: true,
    form: "forening",
    frivillig: true,
    budsjett: [
      { post: "Lesestund og materiell", belop: 40500, type: "aktivitet" },
      { post: "Administrasjon", belop: 4500, type: "admin" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Vedtekter", status: "ok" },
      { navn: "Revisorattest", status: "ok" }
    ]
  },
  {
    id: "T-3002",
    org: "Dialogverksted Fjord",
    orgnr: "999 441 220",
    kommune: "Fjordheim",
    aktivitet: "Prosjekt — dialog",
    ordningId: "dialog-tros-livssyn",
    belop: 180000,
    jobb: "Ny fiktiv sak på BFD-dialogordningen. Vurder om formålet treffer.",
    soknad: "Lokalt dialogmøte mellom tros- og livssynssamfunn og ungdomsråd. Ingen egenandel. Målet er kunnskap og inkludering, ikke forkynnelse.",
    flag: "ok",
    adminPct: 12,
    adminBelop: 21600,
    rapportFjor: true,
    form: "forening",
    frivillig: true,
    budsjett: [
      { post: "Møter og møteledelse", belop: 158400, type: "aktivitet" },
      { post: "Administrasjon", belop: 21600, type: "admin" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Prosjektplan", status: "ok" },
      { navn: "Revisorattest", status: "mangler" }
    ]
  },
  {
    id: "T-3003",
    org: "Nordvika ungdomsverksted",
    orgnr: "999 330 118",
    kommune: "Nordvika",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    ordningId: "inkludering-barn-unge",
    belop: 96000,
    jobb: "Ny fiktiv sak. Vurder om tiltaket er aktivitet eller skjult bemanning.",
    soknad: "Kveldsverksted med CV-hjelp for åtte ungdommer. Gratis. Søker ber også om lønn til to faste «koordinatorer» uten frivillig innsats.",
    flag: "avkorting",
    adminPct: 26,
    adminBelop: 24960,
    rapportFjor: true,
    form: "forening",
    frivillig: true,
    budsjett: [
      { post: "Verksted og materiell", belop: 71040, type: "aktivitet" },
      { post: "Koordinator / administrasjon", belop: 24960, type: "admin" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Vedtekter", status: "ok" },
      { navn: "Revisorattest", status: "ok" }
    ]
  }
];

function frankLovListe() {
  if (typeof TILSKUDD_LOVVERK !== "undefined") return TILSKUDD_LOVVERK;
  return [];
}

function lesFrankStatus() {
  if (typeof loadJson === "function") return loadJson(FRANK_STATUS_KEY, { ...FRANK_STANDARD_STATUS });
  try {
    const raw = localStorage.getItem(FRANK_STATUS_KEY);
    return raw ? { ...FRANK_STANDARD_STATUS, ...JSON.parse(raw) } : { ...FRANK_STANDARD_STATUS };
  } catch (_e) {
    return { ...FRANK_STANDARD_STATUS };
  }
}

function skrivFrankStatus(map) {
  if (typeof saveJson === "function") saveJson(FRANK_STATUS_KEY, map);
  else localStorage.setItem(FRANK_STATUS_KEY, JSON.stringify(map));
}

function markerFrankSakStartet(id) {
  if (!FRANK_TILDELTE.includes(id)) return;
  const map = lesFrankStatus();
  if (map[id] === "startet") return;
  map[id] = "startet";
  skrivFrankStatus(map);
}

function frankSakStatus(id) {
  return lesFrankStatus()[id] || "ikke_startet";
}

function knyttFrankEkstraSaker() {
  if (typeof SAKER === "undefined") return;
  FRANK_EKSTRA.forEach((sak) => {
    if (!SAKER.some((s) => s.id === sak.id)) SAKER.push(sak);
  });
}

function frankSaker() {
  if (typeof findSak !== "function") return [];
  return FRANK_TILDELTE.map((id) => findSak(id)).filter(Boolean);
}

function frankDigest() {
  return frankSaker().map((s) => {
    const o = typeof sakOrdningTekst === "function" ? sakOrdningTekst(s) : s.ordningId;
    const lov = typeof sakLovverk === "function"
      ? sakLovverk(s).gjelder.map((l) => l.id).join(",")
      : "";
    const dok = (s.dokumenter || []).map((d) => `${d.id}:${d.status}`).join(",");
    return `${s.id} | ${s.org} | ${o} | ${s.flag} | ${frankSakStatus(s.id)} | søkt ${s.belop} | lov:${lov} | dok:${dok} | ${s.jobb}`;
  }).join("\n");
}

let frankMinSideFilter = null;

function frankSakerIBoks(nøkkel) {
  const saker = frankSaker();
  if (nøkkel === "startet") return saker.filter((s) => frankSakStatus(s.id) === "startet");
  if (nøkkel === "ikke_startet") return saker.filter((s) => frankSakStatus(s.id) !== "startet");
  return saker;
}

function setFrankBoksFilter(nøkkel) {
  frankMinSideFilter = frankMinSideFilter === nøkkel ? null : nøkkel;
  try {
    history.replaceState(null, "", frankMinSideFilter ? `#${frankMinSideFilter}` : location.pathname);
  } catch (_e) { /* ignore */ }
  renderFrankVelkommen();
}

function renderFrankVelkommen() {
  const rot = document.getElementById("frankRot");
  if (!rot) return;
  const saker = frankSaker();
  const startet = frankSakerIBoks("startet");
  const vent = frankSakerIBoks("ikke_startet");
  const krFn = typeof kr === "function" ? kr : (n) => `${n} kr`;
  const escFn = typeof esc === "function" ? esc : (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const rad = (s) => {
    const o = typeof sakOrdning === "function" ? sakOrdning(s) : {};
    const st = frankSakStatus(s.id);
    return `<a class="frank-sak" href="/tilskudd/behandle#${escFn(s.id)}">
      <div class="meta"><span>${escFn(s.id)}</span><span class="tag ${st === "startet" ? "tag-ramme" : "tag-ok"}">${st === "startet" ? "Startet" : "Ikke startet"}</span></div>
      <h3>${escFn(s.org)}</h3>
      <p>${escFn(o.kortnavn || s.ordningId || "")} · ${krFn(s.belop)}</p>
      <p class="lov-merker">${typeof sakLovMerker === "function" ? sakLovMerker(s, 3).map((t) => `<span class="lov-merke">${escFn(t)}</span>`).join("") : ""}</p>
      <p class="job">${escFn(s.jobb)}</p>
    </a>`;
  };
  const boks = (nøkkel, tall, tekst) => `<button type="button" class="kpi kpi-klikk ${frankMinSideFilter === nøkkel ? "on" : ""}" onclick="setFrankBoksFilter('${nøkkel}')">
      <b>${tall}</b><span>${tekst}</span>
    </button>`;
  const titler = {
    tildelt: "Saker fordelt til deg",
    startet: "Saker du har startet",
    ikke_startet: "Saker du ikke har startet"
  };
  const valgte = frankMinSideFilter ? frankSakerIBoks(frankMinSideFilter) : [];
  const sakPanel = frankMinSideFilter
    ? `<section class="panel" id="frankSaker">
      <h2>${escFn(titler[frankMinSideFilter] || "Saker")}</h2>
      <p class="hint">Klikk en sak for å åpne den. Klikk samme boks igjen for å skjule listen. Fiktive saker.</p>
      <div class="frank-sak-liste">${valgte.map(rad).join("") || "<p class='hint'>Ingen saker i denne boksen.</p>"}</div>
    </section>`
    : `<p class="hint">Klikk en boks over for å se sakene. Samme mønster som arbeidslisten.</p>`;
  rot.innerHTML = `
    <div class="kpi-grid frank-boks-rutenett">
      ${boks("tildelt", saker.length, "saker fordelt til deg")}
      ${boks("startet", startet.length, "du har startet")}
      ${boks("ikke_startet", vent.length, "ikke startet ennå")}
      ${boks("tildelt", krFn(saker.reduce((n, s) => n + s.belop, 0)), "søkt i din bunke")}
    </div>
    ${sakPanel}
    <section class="panel" style="margin-top:1rem">
      <h2>Regelverk knyttet til tilskudd</h2>
      <p class="hint">Ja — det finnes lov og regelverk. Dette er en pekepinn i øvelsen, ikke juridisk råd og ikke komplett liste.</p>
      <ul class="lov-liste">${frankLovListe().map((l) => `<li><strong>${escFn(l.navn)}</strong> — ${escFn(l.kort)} <span class="hint">${escFn(l.merknad)}</span></li>`).join("")}</ul>
      <p class="hint">Spør den svevende assistenten om en sak eller om regelverk. Den fatter ikke vedtak.</p>
    </section>
    <div id="frankLovRot"></div>`;
  if (typeof renderLovFordeling === "function") renderLovFordeling("frankLovRot", "frank");
}

knyttFrankEkstraSaker();
if (typeof knyttSoknadsdokumentasjon === "function" && typeof SAKER !== "undefined") knyttSoknadsdokumentasjon(SAKER);

if (typeof window !== "undefined") {
  window.ANSATT = ANSATT;
  window.frankSaker = frankSaker;
  window.frankDigest = frankDigest;
  window.frankSakStatus = frankSakStatus;
  window.markerFrankSakStartet = markerFrankSakStartet;
  window.renderFrankVelkommen = renderFrankVelkommen;
  window.setFrankBoksFilter = setFrankBoksFilter;
  window.FRANK_TILDELTE = FRANK_TILDELTE;
  const forrige = window.openSak;
  if (typeof forrige === "function") {
    window.openSak = function (id) {
      markerFrankSakStartet(id);
      return forrige(id);
    };
  }
  document.addEventListener("DOMContentLoaded", () => {
    knyttFrankEkstraSaker();
    if (typeof knyttSoknadsdokumentasjon === "function") knyttSoknadsdokumentasjon(typeof SAKER !== "undefined" ? SAKER : []);
    const hash = (location.hash || "").replace("#", "");
    if (hash === "tildelt" || hash === "startet" || hash === "ikke_startet") frankMinSideFilter = hash;
    renderFrankVelkommen();
  });
}
