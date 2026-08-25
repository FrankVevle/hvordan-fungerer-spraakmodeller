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

const TILSKUDD_LOVVERK = [
  {
    navn: "Forvaltningsloven",
    kort: "Saksbehandling, begrunnelse, partsinnsyn og klage. Gjelder når forvaltningen treffer enkeltvedtak — også tilskuddsvedtak.",
    merknad: "Ikke en tilskuddsforskrift. Forteller hvordan saken skal behandles."
  },
  {
    navn: "Bestemmelser om økonomistyring i staten",
    kort: "Kapitlet om tilskudd stiller krav til mål, tildelingskriterier, oppfølging og kontroll. Dette er styringskrav til statlige virksomheter.",
    merknad: "Øvelsen er ikke et statlig tilskuddssystem i drift."
  },
  {
    navn: "Forskrift om tilskudd til inkludering av barn og unge",
    kort: "Særskilt regelverk for den ordningen 4.1–4.11 peker på. Aktivitetstyper, egenandel og vilkår står der — ikke i øvelsespotten på 1 mill.",
    merknad: "Lovdata: forskrift 23. november 2021 nr. 3261. Prototype bruker øvelsesregler."
  },
  {
    navn: "Trossamfunnsloven",
    kort: "Hjemmel for statstilskudd til tros- og livssynssamfunn utenom Den norske kirke. BFD-boksen DT-0087.",
    merknad: "Ikke det samme som Bufdirs prosjektordninger."
  },
  {
    navn: "Offentleglova og personvernforordningen",
    kort: "Innsyn i tilskuddssaker, og begrensninger når dokumentet har personopplysninger. Personvernmodulen er mønstersøk, ikke hjemmelsvurdering.",
    merknad: "Ikke juridisk råd."
  }
];

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
    return `${s.id} | ${s.org} | ${o} | ${s.flag} | ${frankSakStatus(s.id)} | søkt ${s.belop} | ${s.jobb}`;
  }).join("\n");
}

function renderFrankVelkommen() {
  const rot = document.getElementById("frankRot");
  if (!rot) return;
  const saker = frankSaker();
  const startet = saker.filter((s) => frankSakStatus(s.id) === "startet");
  const vent = saker.filter((s) => frankSakStatus(s.id) !== "startet");
  const krFn = typeof kr === "function" ? kr : (n) => `${n} kr`;
  const escFn = typeof esc === "function" ? esc : (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const rad = (s) => {
    const o = typeof sakOrdning === "function" ? sakOrdning(s) : {};
    const st = frankSakStatus(s.id);
    return `<a class="frank-sak" href="/tilskudd/behandle#${escFn(s.id)}">
      <div class="meta"><span>${escFn(s.id)}</span><span class="tag ${st === "startet" ? "tag-ramme" : "tag-ok"}">${st === "startet" ? "Startet" : "Ikke startet"}</span></div>
      <h3>${escFn(s.org)}</h3>
      <p>${escFn(o.kortnavn || s.ordningId || "")} · ${krFn(s.belop)}</p>
      <p class="job">${escFn(s.jobb)}</p>
    </a>`;
  };
  rot.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><b>${saker.length}</b><span>saker fordelt til deg</span></div>
      <div class="kpi"><b>${startet.length}</b><span>du har startet</span></div>
      <div class="kpi"><b>${vent.length}</b><span>ikke startet ennå</span></div>
      <div class="kpi"><b>${krFn(saker.reduce((n, s) => n + s.belop, 0))}</b><span>søkt i din bunke</span></div>
    </div>
    <section class="panel">
      <h2>Startet</h2>
      <p class="hint">Du har åpnet eller fått dem merket som i arbeid. Fiktive saker.</p>
      <div class="frank-sak-liste">${startet.map(rad).join("") || "<p class='hint'>Ingen startet ennå.</p>"}</div>
    </section>
    <section class="panel" style="margin-top:1rem">
      <h2>Ikke startet</h2>
      <p class="hint">Tildelt deg, men ikke åpnet. Åpning merkes som startet i denne nettleseren.</p>
      <div class="frank-sak-liste">${vent.map(rad).join("") || "<p class='hint'>Tomt.</p>"}</div>
    </section>
    <section class="panel" style="margin-top:1rem">
      <h2>Regelverk knyttet til tilskudd</h2>
      <p class="hint">Ja — det finnes lov og regelverk. Dette er en pekepinn i øvelsen, ikke juridisk råd og ikke komplett liste.</p>
      <ul class="lov-liste">${TILSKUDD_LOVVERK.map((l) => `<li><strong>${escFn(l.navn)}</strong> — ${escFn(l.kort)} <span class="hint">${escFn(l.merknad)}</span></li>`).join("")}</ul>
      <p class="hint">Spør den svevende assistenten om en sak eller om regelverk. Den fatter ikke vedtak.</p>
    </section>`;
}

knyttFrankEkstraSaker();

if (typeof window !== "undefined") {
  window.ANSATT = ANSATT;
  window.TILSKUDD_LOVVERK = TILSKUDD_LOVVERK;
  window.frankSaker = frankSaker;
  window.frankDigest = frankDigest;
  window.frankSakStatus = frankSakStatus;
  window.markerFrankSakStartet = markerFrankSakStartet;
  window.renderFrankVelkommen = renderFrankVelkommen;
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
    renderFrankVelkommen();
  });
}
