const RAMME = 1000000;
const ARCHIVE_KEY = "ovelseArkivMapper";
const PORTAL_KEY = "ovelsePortalSaker";
const TRACE_KEY = "ovelseKiSpor";

const SAKER = [
  {
    id: "T-2629",
    org: "Fjordheim kulturskolevenner",
    orgnr: "999 626 727",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 410000,
    jobb: "Se hvorfor admin er for høy, og om du vil kutte.",
    soknad: "Gratis instrumentgruppe etter skoletid, 24 barn. Søknaden er komplett. Prosjektledelse utgjør 32 % av budsjettet.",
    flag: "avkorting",
    adminPct: 32,
    adminBelop: 131200,
    rapportFjor: true,
    budsjett: [
      { post: "Instrumentleie og materiell", belop: 180000, type: "aktivitet" },
      { post: "Prosjektledelse / administrasjon", belop: 131200, type: "admin" },
      { post: "Lokaler og mat", belop: 98800, type: "aktivitet" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Vedtekter", status: "ok" },
      { navn: "Årsregnskap", status: "ok" },
      { navn: "Revisorattest", status: "mangler" }
    ]
  },
  {
    id: "T-2632",
    org: "Storøy ungdomsverksted",
    orgnr: "999 303 808",
    kommune: "Storøy",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 890000,
    jobb: "Formalia er i orden. Beløpet presser potten. Du prioriterer.",
    soknad: "Heldags verksted og lønnet praksis for 28 ungdommer i 8 uker. Søknaden er formelt komplett. Beløpet er stort nok til at rammen sprekker hvis alt innvilges.",
    flag: "ramme",
    adminPct: 11,
    adminBelop: 97900,
    rapportFjor: true,
    budsjett: [
      { post: "Lønn praksisplasser", belop: 520000, type: "aktivitet" },
      { post: "Veileder og HMS", belop: 180000, type: "aktivitet" },
      { post: "Administrasjon", belop: 97900, type: "admin" },
      { post: "Lokaler og materiell", belop: 92100, type: "aktivitet" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "HMS-plan", status: "ok" },
      { navn: "Kommuneavtale", status: "ok" },
      { navn: "Revisorattest", status: "ok" }
    ]
  },
  {
    id: "T-2603",
    org: "AS Fjord Byggdrift",
    orgnr: "999 333 001",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 450000,
    jobb: "Sjekk om søker i det hele tatt kan søke denne ordningen.",
    soknad: "Aksjeselskap søker om ferieaktivitet for ansattebarn. Ikke registrert i Frivillighetsregisteret. Formålet er rekruttering til bedriften.",
    flag: "formalia",
    adminPct: 8,
    adminBelop: 36000,
    rapportFjor: true,
    budsjett: [
      { post: "Ferieaktivitet ansattebarn", belop: 414000, type: "aktivitet" },
      { post: "Administrasjon", belop: 36000, type: "admin" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Vedtekter", status: "ok" },
      { navn: "Revisorattest", status: "mangler" }
    ]
  },
  {
    id: "T-2622",
    org: "Brobyggerne Oslo",
    orgnr: "999 222 333",
    kommune: "Oslo",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 198000,
    jobb: "KI har hentet feil paragraf. Finn feilen og avvis med grunn.",
    soknad: "Deltidsjobb og CV-kurs for 12 ungdommer. Samarbeid med bydel. Budsjett for lønn og veileder.",
    flag: "plantet",
    adminPct: 12,
    adminBelop: 23760,
    rapportFjor: true,
    budsjett: [
      { post: "Lønn deltidsjobb", belop: 120000, type: "aktivitet" },
      { post: "CV-kurs og veileder", belop: 54240, type: "aktivitet" },
      { post: "Administrasjon", belop: 23760, type: "admin" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Avtale med bydel", status: "ok" },
      { navn: "Vedtekter", status: "ok" }
    ]
  },
  {
    id: "T-2612",
    org: "Åsby bibliotekvenner",
    orgnr: "999 555 666",
    kommune: "Åsby",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 72000,
    jobb: "Tiltaket ser bra ut, men fjorårets rapport mangler.",
    soknad: "Leksehjelp og teaterlek etter skoletid, to grupper à 12 barn. Gratis. Midler til materiell og to veiledere.",
    flag: "historikk",
    adminPct: 10,
    adminBelop: 7200,
    rapportFjor: false,
    budsjett: [
      { post: "Materiell og veiledere", belop: 64800, type: "aktivitet" },
      { post: "Administrasjon", belop: 7200, type: "admin" }
    ],
    vedlegg: [
      { navn: "Budsjett", status: "ok" },
      { navn: "Samarbeid bibliotek", status: "ok" },
      { navn: "Fjorårets rapport", status: "mangler" }
    ]
  },
  {
    id: "T-2631",
    org: "Myr idrettslag anlegg",
    orgnr: "999 101 202",
    kommune: "Myr",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 220000,
    jobb: "Sluttregnskap: penger brukt på gressbane. Vurder tilbakekreving.",
    soknad: "Fikk 220 000 kr til inkluderende trening. Sluttregnskapet viser at 140 000 gikk til ny gressbane. Resten er aktivitet.",
    flag: "avvik",
    adminPct: 6,
    adminBelop: 13200,
    rapportFjor: true,
    budsjett: [
      { post: "Inkluderende trening (brukt)", belop: 80000, type: "aktivitet" },
      { post: "Ny gressbane (ikke godkjent)", belop: 140000, type: "avvik" }
    ],
    vedlegg: [
      { navn: "Sluttregnskap", status: "ok" },
      { navn: "Opprinnelig vedtak", status: "ok" }
    ]
  }
];

const REGISTER = [
  { orgnr: "999626727", navn: "Fjordheim kulturskolevenner", form: "forening", frivillig: true },
  { orgnr: "999303808", navn: "Storøy ungdomsverksted", form: "forening", frivillig: true },
  { orgnr: "999333001", navn: "AS Fjord Byggdrift", form: "AS", frivillig: false },
  { orgnr: "999222333", navn: "Brobyggerne Oslo", form: "forening", frivillig: true },
  { orgnr: "999101202", navn: "Myr idrettslag anlegg", form: "idrettslag", frivillig: true },
  { orgnr: "999555666", navn: "Åsby bibliotekvenner", form: "forening", frivillig: true }
];

const RAG = {
  admin: { tittel: "Øvelsesregel 2026 · administrasjon", tekst: "Prosjektledelse og generell administrasjon skal som hovedregel ikke overstige 15 % av søknadssummen. Overskytende kan foreslås avkortet. Dette er øvelse, ikke evig forskrift. Avkorting er forslag, ikke vedtak." },
  soker: { tittel: "Øvelsesregel 2026 · hvem kan søke", tekst: "Søker skal stå i Enhetsregisteret. For denne aktivitetstypen skal virksomheten også stå i Frivillighetsregisteret, med mindre søker er kommune. Kommersielt AS uten frivillig formål kan ikke søke." },
  revisor: { tittel: "Øvelsesregel 2026 · revisor", tekst: "Søknader over 200 000 kroner skal ha revisorattest. Mangler attest, skal saken flagges. Beløpsgrensen er øvelse 2026." },
  mal: { tittel: "Øvelsesregel 2026 · målgruppe", tekst: "Tiltaket skal nå barn og unge som står utenfor. Deltakelse skal være gratis eller uten urimelig egenandel. Står det ikke i teksten, er det ikke oppgitt." },
  jobb: { tittel: "Øvelsesregel · jobbtilbud 4.2", tekst: "Jobbtilbud gjelder lønnet praksis og veiledning. Det er ikke investering i anlegg. Lik sak i øvelsen: Havblik Røde Kors (T-2608)." },
  planted: { tittel: "Feil hentet utdrag (øvelse)", tekst: "Likebehandling: Golfklubben Fjord (T-2621) fikk avslag. Sim. forskrift § 14 om investering. Anbefalt avslag." },
  klage: { tittel: "Øvelsesregel · nytt faktum", tekst: "Honorar til kursleder er faglig aktivitet, ikke generell administrasjon, når det følger av dokumentasjon. Omgjøring er saksbehandlers. KI fatter ikke vedtak." },
  slutt: { tittel: "Øvelsesregel · slutt", tekst: "Tilskudd brukt i strid med vilkår kan kreves tilbake forholdsmessig. Godkjent aktivitet holdes utenfor. Forslag — ikke innkreving." }
};

const FALLBACK = {
  "T-2629": {
    malgruppe: { score: 4, sitat: "Gratis instrumentgruppe etter skoletid, 24 barn." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 5, sitat: "Gratis instrumentgruppe" },
    tenkning: "1. Jeg leste at prosjektledelse er 32 % av 410 000 kr.\n2. Øvelsesregelen sier maks 15 % admin — det er det eneste jeg bruker til kuttet.\n3. «Gratis instrumentgruppe, 24 barn» bruker jeg til målgruppe og gratis.\n4. Medvirkning står ikke i teksten — jeg skriver «ikke oppgitt».\n5. Jeg fatter ikke vedtak. Beløpet er et forslag.",
    brev: "Utkast — ikke vedtak\n\nDere søkte 410 000 kr. Formålet treffer. Prosjektledelse utgjør 32 %. Etter øvelsesregel 2026 (15 % admin) foreslås avkorting av den overskytende delen."
  },
  "T-2632": {
    malgruppe: { score: 5, sitat: "lønnet praksis for 28 ungdommer" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 4, sitat: "lønnet praksis" },
    tenkning: "1. Formalia ser komplette ut i teksten jeg fikk.\n2. Admin 11 % er under 15 % — jeg foreslår ikke admin-kutt.\n3. 890 000 kr mot potten på 1 000 000 kr er et prioriteringsspørsmål. Jeg rangerer ikke hvem som skal kuttes.\n4. Medvirkning: ikke oppgitt.",
    brev: "Utkast — ikke vedtak\n\nSøknaden om 890 000 kr er formelt i orden. Innstilling mot ramme gjenstår hos deg."
  },
  "T-2603": {
    malgruppe: { score: 1, sitat: "Ferieaktivitet for ansattebarn." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    tenkning: "1. Søker er et AS. Øvelsesregelen sier at kommersielt AS uten frivillig registrering ikke kan søke.\n2. Formålet er «ansattebarn» / rekruttering — det treffer ikke inkludering.\n3. Jeg foreslår utenfor ordningen. Ikke vedtak.",
    brev: "Utkast til avslag — ikke vedtak\n\nDere kan etter øvelsesregelen 2026 ikke søke som kommersielt AS uten frivillig registrering."
  },
  "T-2622": {
    malgruppe: { score: 4, sitat: "Deltidsjobb og CV-kurs for 12 ungdommer." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 4, sitat: "Deltidsjobb og CV-kurs" },
    tenkning: "1. Jeg hentet utdraget om § 14 og Golfklubben Fjord og bruker det som lik sak.\n2. Jeg ser at søknaden handler om jobb og CV-kurs, men jeg holder likevel på avslag etter § 14.\n3. Dette er den plantede feilen i øvelsen: feil paragraf og feil presedens.",
    brev: "Utkast til avslag — ikke vedtak\n\nSøknaden avslås med henvisning til § 14 (investering) og Golfklubben Fjord (T-2621)."
  },
  "T-2612": {
    malgruppe: { score: 4, sitat: "Leksehjelp og teaterlek etter skoletid" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 5, sitat: "Gratis." },
    tenkning: "1. Teksten beskriver gratis leksehjelp og teaterlek — det treffer målgruppe.\n2. Historikkflagget (manglende rapport) kommer fra reglene, ikke fra søknadsteksten.\n3. Jeg foreslår flagg, ikke automatisk avslag.",
    brev: "Utkast — ikke vedtak\n\nSluttregnskap etter øvelsesfristen mangler. Saken flagges."
  },
  "T-2631": {
    malgruppe: { score: 3, sitat: "inkluderende trening" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    tenkning: "1. Jeg skiller to poster: 80 000 kr trening (kan stå) og 140 000 kr gressbane (ikke godkjent).\n2. Tilbakekreving er forholdsmessig — bare anlegget.\n3. Dette er utkast. Ingen innkreving.",
    brev: "Utkast — ikke vedtak\n\n140 000 kr gikk til ny gressbane. Utkast: krev den delen tilbake."
  }
};

const SYS = `Du er forvaltningsrådgiver i en pedagogisk øvelse (2026). Du fatter ALDRI vedtak. Du er ikke Bufdir.
Du får KUN søknadstekst og utdrag under. Hvis noe mangler: skriv «ikke oppgitt».
Admin 15 % og revisor 200 000 kr er øvelsesregler 2026.
Svar på norsk. Start ALLTID med tenkning — skriv høyt hva du gjør, før du konkluderer.

## Tenkning
Nummererte setninger (5–8):
- Hva du leste i søknaden
- Hvilke utdrag du faktisk brukte
- Hva du lot være å bruke, og hvorfor
- Hva som er usikkert eller «ikke oppgitt»
- At du ikke fatter vedtak
Ikke finn på kilder.

## Semantikk
Målgruppe: N/5
Sitat målgruppe: "..." eller ikke oppgitt
Medvirkning: N/5
Sitat medvirkning: "..." eller ikke oppgitt
Gratis: N/5
Sitat gratis: "..." eller ikke oppgitt

## Saksnotat
Kort innstillingsforslag. Ikke fatt vedtak.

## Brevutkast
Første linje: Utkast — ikke vedtak`;

const SYS_KLAGE = `Du er forvaltningsrådgiver i en øvelse. Du fatter aldri vedtak. Svar på norsk.
Start med ## Tenkning (nummererte setninger: hva som er nytt, hva du bruker, hva du ikke avgjør).
Deretter:
## Vurdering
## Utkast omgjøring
## Utkast opprettholdelse`;

const SYS_SLUTT = `Du er forvaltningsrådgiver i en øvelse. Ingen innkreving, ingen vedtak. Svar på norsk.
Start med ## Tenkning (nummererte setninger: hva som er avvik, hva som kan stå, at du ikke krever inn).
Deretter:
## Vurdering
## Utkast tilbakekreving
## Alternativ`;

const work = {};
const journal = [];
let selected = null;
let kiSeq = 0;
const klage = { running: false, live: null, tenkning: "", vurdering: "", omgjoring: "", opprettholdelse: "", error: "", traceId: "" };
const slutt = { running: false, live: null, tenkning: "", vurdering: "", tilbake: "", alternativ: "", error: "", traceId: "" };

function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function kr(n) { return new Intl.NumberFormat("nb-NO").format(Number(n) || 0) + " kr"; }
function norm(orgnr) { return String(orgnr || "").replace(/\s/g, ""); }
function findReg(orgnr) { return REGISTER.find((r) => r.orgnr === norm(orgnr)) || null; }
function findSak(id) { return SAKER.find((s) => s.id === id) || null; }

function tagClass(flag) {
  return ({ avkorting: "tag-avkorting", ramme: "tag-ramme", formalia: "tag-formalia", plantet: "tag-plantet", historikk: "tag-historikk", avvik: "tag-avvik" }[flag]) || "tag-ok";
}
function tagText(flag) {
  return ({ avkorting: "Avkorting", ramme: "Ramme", formalia: "Formalia", plantet: "Plantet feil", historikk: "Historikk", avvik: "Avvik" }[flag]) || "OK";
}

function runGrantRules(sak) {
  const reg = findReg(sak.orgnr);
  const checks = [];
  let recommended = sak.belop;
  if (!reg) {
    checks.push({ status: "red", label: "Søker", text: "Ikke i det simulerte registeret." });
    recommended = 0;
  } else if (!reg.frivillig) {
    checks.push({ status: "red", label: "Søker", text: `${reg.form} kan ikke søke denne øvelsesordningen (ikke frivillig).` });
    recommended = 0;
  } else {
    checks.push({ status: "green", label: "Søker", text: `${reg.navn} er forening/idrettslag i øvelsestabellen. Ikke live register.` });
  }
  const tillatt = Math.round(sak.belop * 0.15);
  if (sak.adminPct > 15 && recommended > 0) {
    const kutt = Math.max(0, sak.adminBelop - tillatt);
    recommended = sak.belop - kutt;
    checks.push({ status: "yellow", label: "Admin 15 %", text: `Admin er ${sak.adminPct} % (${kr(sak.adminBelop)}). Tillatt ${kr(tillatt)}. Foreslått kutt ${kr(kutt)} — ikke vedtak.` });
  } else {
    checks.push({ status: "green", label: "Admin 15 %", text: `Admin ${sak.adminPct} % er innenfor. Øvelsesregel 2026.` });
  }
  const attest = (sak.vedlegg || []).some((v) => /revisor/i.test(v.navn) && v.status === "ok");
  if (sak.belop > 200000 && !attest) {
    checks.push({ status: "yellow", label: "Revisor", text: `Over 200 000 kr og attest mangler. Flagg, ikke automatisk avslag.` });
  } else {
    checks.push({ status: "green", label: "Revisor", text: attest || sak.belop <= 200000 ? "Kravet i øvelsen er oppfylt eller ikke aktuelt." : "OK" });
  }
  if (!sak.rapportFjor) {
    checks.push({ status: "red", label: "Historikk", text: "Fjorårets rapport mangler." });
  } else {
    checks.push({ status: "green", label: "Historikk", text: "Ingen åpen rapportmangel i øvelsen." });
  }
  if (sak.id === "T-2632" && recommended > 0) {
    checks.push({ status: "yellow", label: "Ramme", text: `Stort beløp mot potten ${kr(RAMME)}. KI kutter ikke. Du prioriterer.` });
  }
  if (sak.id === "T-2631") {
    recommended = 0;
    checks.push({ status: "red", label: "Slutt", text: "140 000 kr til gressbane er ikke godkjent kostnad." });
  }
  return { checks, recommended };
}

function ragFor(sak) {
  const items = [RAG.soker, RAG.admin, RAG.revisor, RAG.mal];
  if (sak.id === "T-2622") items.push(RAG.jobb, RAG.planted);
  if (sak.id === "T-2629") items.push(RAG.klage);
  if (sak.id === "T-2631") items.push(RAG.slutt);
  return items;
}

async function callModelAPI(prompt, system) {
  let delay = 800;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, system })
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(result.error || "api_error");
        err.simulation = Boolean(result.simulation);
        throw err;
      }
      if (result.text) return result.text;
      throw new Error("empty");
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("Kunne ikke hente svar.");
}

function parseKi(text) {
  const grab = (label) => {
    const m = text.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
    return m ? m[1].trim() : "";
  };
  const score = (raw) => {
    const m = String(raw).match(/(\d)\s*\/\s*5/);
    return m ? Number(m[1]) : null;
  };
  const tenkning = (text.split(/##\s*Tenkning/i)[1] || "").split(/##\s*Semantikk/i)[0].trim();
  const note = (text.split(/##\s*Saksnotat/i)[1] || "").split(/##\s*Brevutkast/i)[0].trim();
  const brev = (text.split(/##\s*Brevutkast/i)[1] || "").trim();
  return {
    malgruppe: { score: score(grab("Målgruppe")), sitat: grab("Sitat målgruppe") || "ikke oppgitt" },
    medvirkning: { score: score(grab("Medvirkning")), sitat: grab("Sitat medvirkning") || "ikke oppgitt" },
    gratis: { score: score(grab("Gratis")), sitat: grab("Sitat gratis") || "ikke oppgitt" },
    tenkning,
    notat: note || text.trim(),
    brev: brev || "",
    raw: text
  };
}

function saveTrace(trace) {
  const list = loadJson(TRACE_KEY, []);
  const row = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    at: new Date().toISOString(),
    atVis: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...trace
  };
  list.unshift(row);
  saveJson(TRACE_KEY, list.slice(0, 40));
  return row.id;
}

function ensure(id) {
  if (!work[id]) {
    const sak = findSak(id);
    const rules = runGrantRules(sak);
    work[id] = {
      rules,
      recommended: rules.recommended,
      semantic: null,
      note: "",
      letter: "",
      pipeline: "regler",
      status: "Regler er ferdige. KI starter.",
      live: null,
      error: "",
      hitl: "",
      running: false
    };
  }
  return work[id];
}

function addJournal(entry) {
  journal.unshift({
    at: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...entry
  });
  renderJournal();
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_e) {
    return fallback;
  }
}
function saveJson(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_e) { /* ignore */ }
}

function renderPipe(w) {
  const el = $("pipe");
  if (!el) return;
  const order = { idle: -1, regler: 0, ki: 1, utkast: 2, hitl: 3 };
  const cur = order[w ? w.pipeline : "idle"] ?? -1;
  const labels = ["1. Tall sjekket", "2. KI leser teksten", "3. Utkast klart", "4. Du bestemmer"];
  el.innerHTML = labels.map((l, i) => {
    const cls = i < cur ? "done" : i === cur ? "now" : "";
    return `<div class="${cls}">${l}</div>`;
  }).join("");
}

function renderRamme() {
  const el = $("ramme");
  if (!el) return;
  const ids = ["T-2629", "T-2632", "T-2622"];
  const sum = ids.map(findSak).reduce((n, s) => n + s.belop, 0);
  const pct = Math.min(100, Math.round((sum / RAMME) * 100));
  el.innerHTML = `<div class="ramme"><strong>Pott i øvelsen:</strong> ${kr(RAMME)}. Tre skjønnssaker på lista har søkt ${kr(sum)}. KI kutter ikke for å få det til å gå opp. <strong>Du prioriterer.</strong><div class="bar"><i style="width:${pct}%"></i></div></div>`;
}

function renderList() {
  const box = $("liste");
  if (!box) return;
  box.innerHTML = SAKER.map((sak) => `
    <button type="button" class="${selected === sak.id ? "on" : ""}" onclick="openSak('${sak.id}')">
      <div class="meta"><span>${sak.id}</span><span class="tag ${tagClass(sak.flag)}">${tagText(sak.flag)}</span></div>
      <h3>${esc(sak.org)}</h3>
      <p class="amt">${kr(sak.belop)}</p>
      <p class="job">${esc(sak.jobb)}</p>
    </button>`).join("");
}

function renderJournal() {
  const box = $("journal");
  if (!box) return;
  box.innerHTML = journal.length
    ? journal.map((j) => `<article><p class="mono">${esc(j.at)} · ${esc(j.type)} · ${esc(j.sak)}</p><p>${esc(j.svar)}</p></article>`).join("")
    : `<p class="hint">Tomt til du åpner en sak eller trykker en knapp. Ingenting sendes ut av nettleseren.</p>`;
}

function semRow(label, item) {
  const score = item?.score != null ? `${item.score}/5` : "—";
  return `<tr><td>${esc(label)}</td><td class="mono">${score}</td><td>${esc(item?.sitat || "ikke oppgitt")}</td></tr>`;
}

function renderCard() {
  const box = $("kort");
  if (!box) return;
  renderRamme();
  if (!selected) {
    renderPipe(null);
    box.innerHTML = `<p class="hint">Velg en sak til venstre. Da ser du søknaden, hva tallene viser, og et utkast du kan godkjenne, rette eller avvise.</p>`;
    return;
  }
  const sak = findSak(selected);
  const w = ensure(selected);
  renderPipe(w);
  const planted = sak.id === "T-2622";
  const kiNote = w.running
    ? `<div class="note live-run">KI leser søknaden nå…</div>`
    : w.live === true
      ? `<div class="note live-ok">Dette utkastet kom fra KI. Det er et forslag. Du fatter ikke vedtak her.</div>`
      : w.live === false
        ? `<div class="note live-off"><strong>Ikke KI-svar.</strong> Vi viser en ferdig øvelsestekst fordi live-kall ikke virket${w.error ? ` (${esc(w.error)})` : ""}.</div>`
        : `<div class="note">Venter på KI-steget.</div>`;
  const checks = w.rules.checks.map((c) => `<div class="check check-${c.status}"><small>${c.status === "green" ? "OK" : c.status === "yellow" ? "Se her" : "Stopp"} · ${esc(c.label)}</small>${esc(c.text)}</div>`).join("");
  const budsjett = sak.budsjett.map((b) => `<tr><td>${esc(b.post)}</td><td style="text-align:right">${kr(b.belop)}</td><td>${esc(b.type)}</td></tr>`).join("");
  const vedlegg = sak.vedlegg.map((v) => `<li>${esc(v.navn)} — <strong>${v.status === "ok" ? "med" : "mangler"}</strong></li>`).join("");
  const sem = w.semantic
    ? `<table><thead><tr><th>Tema</th><th>Score</th><th>Sitat</th></tr></thead><tbody>${semRow("Målgruppe", w.semantic.malgruppe)}${semRow("Medvirkning", w.semantic.medvirkning)}${semRow("Gratis", w.semantic.gratis)}</tbody></table>`
    : `<p class="hint">${w.running ? "Leser teksten…" : "Ingen tekstvurdering ennå."}</p>`;
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:flex-start">
      <div>
        <p class="mono" style="margin:0;color:#4f46e5;font-weight:700">${sak.id}</p>
        <h2 style="margin:0.15rem 0">${esc(sak.org)}</h2>
        <p class="hint" style="margin:0">${esc(sak.kommune)} · ${esc(sak.aktivitet)}</p>
        <p style="margin:0.55rem 0 0;font-weight:650">Din jobb: ${esc(sak.jobb)}</p>
      </div>
      <button class="btn btn-primary" type="button" ${w.running ? "disabled" : ""} onclick="runKI('${sak.id}', true)">Kjør KI på nytt</button>
    </div>
    ${kiNote}
    ${planted ? `<div class="planted"><strong>Øvelse:</strong> Første utkast blander inn § 14 og Golfklubben Fjord. Det er feil. Riktig lik sak er Havblik (T-2608). Avvis med en setning om hvorfor.</div>` : ""}
    <div class="split" style="margin-top:1rem">
      <div>
        <h3>Søknaden</h3>
        <p>${esc(sak.soknad)}</p>
        <h3>Budsjett</h3>
        <table>${budsjett}</table>
        <h3>Vedlegg</h3>
        <ul>${vedlegg}</ul>
      </div>
      <div>
        <h3>Det tallene viser</h3>
        ${checks}
        <h3>Det KI sier om teksten</h3>
        ${sem}
        ${w.semantic?.tenkning ? `<div class="think"><strong>Hva KI skrev mens den jobbet</strong><p class="mono">${esc(w.semantic.tenkning)}</p><p><a href="transparens.html${w.traceId ? `#${w.traceId}` : ""}">Åpne hele tankeloggen →</a></p></div>` : `<p class="hint"><a href="transparens.html">Se hva KI tenkte (egen side)</a></p>`}
        <label class="field">Foreslått beløp (du kan rette)
          <input id="belop" type="number" value="${w.recommended}" />
        </label>
        <label class="field">Utkast til notat
          <textarea id="notat" rows="5">${esc(w.note)}</textarea>
        </label>
        <label class="field">Utkast til brev
          <textarea id="brev" rows="5" class="mono">${esc(w.letter)}</textarea>
        </label>
        <label class="field">Din grunn (må fylles ved avvis)
          <input id="grunn" type="text" placeholder="Skriv hvorfor…" />
        </label>
        <div class="btn-row">
          <button class="btn btn-dark" type="button" onclick="hitl('bekreft')">Bekreft forslag</button>
          <button class="btn btn-ghost" type="button" onclick="hitl('juster')">Juster</button>
          <button class="btn btn-ghost" type="button" onclick="hitl('avvis')">Avvis med grunn</button>
          <button class="btn btn-ghost" type="button" onclick="hitl('sta')">La stå</button>
        </div>
        <p class="hint">Ingenting blir vedtak. Vi lagrer bare et øvelsesnotat i nettleseren.</p>
        ${w.hitl ? `<p><strong>${esc(w.hitl)}</strong></p>` : ""}
      </div>
    </div>`;
}

function readEditors(w) {
  if ($("belop") && $("belop").value !== "") w.recommended = Number($("belop").value) || 0;
  if ($("notat")) w.note = $("notat").value;
  if ($("brev")) w.letter = $("brev").value;
}

function openSak(id) {
  const sak = findSak(id);
  if (!sak) return;
  selected = id;
  const w = ensure(id);
  if (!journal.some((j) => j.sak === id && j.type === "regler")) {
    addJournal({ type: "regler", sak: id, svar: w.rules.checks.map((c) => `${c.label}: ${c.status}`).join("; ") });
  }
  renderList();
  renderCard();
  if (!w.semantic && !w.running) runKI(id, false);
  try { history.replaceState(null, "", `#${id}`); } catch (_e) { /* ignore */ }
}

async function runKI(id, force) {
  const sak = findSak(id);
  const w = ensure(id);
  if (!sak || w.running) return;
  if (w.semantic && !force) return;
  w.running = true;
  w.pipeline = "ki";
  w.status = "KI leser…";
  renderList();
  renderCard();
  const seq = ++kiSeq;
  const rag = ragFor(sak).map((r) => `### ${r.tittel}\n${r.tekst}`).join("\n\n");
  const prompt = `Saksnummer: ${sak.id}\nOrganisasjon: ${sak.org}\nSøkt: ${sak.belop} kr\n\nSØKNADSTEKST:\n${sak.soknad}\n\nUTDRAG (fiktiv øvelse 2026):\n${rag}\n\nSkriv først ## Tenkning, deretter semantikk, notat og brev. Ikke fatt vedtak.`;
  addJournal({ type: "ki", sak: id, svar: force ? "Kjører KI på nytt" : "Første KI-kall" });
  const kilder = ragFor(sak).map((r) => r.tittel);
  try {
    const text = await callModelAPI(prompt, SYS);
    if (seq !== kiSeq) return;
    const parsed = parseKi(text);
    w.semantic = parsed;
    w.note = parsed.notat;
    w.letter = parsed.brev || parsed.notat;
    w.live = true;
    w.traceId = saveTrace({
      sak: id,
      org: sak.org,
      oppgave: "Sakskort — vurdering og utkast",
      live: true,
      kilder,
      prompt,
      system: SYS,
      tenkning: parsed.tenkning,
      utkast: parsed.notat,
      brev: parsed.brev,
      raw: text
    });
  } catch (e) {
    if (seq !== kiSeq) return;
    const fb = FALLBACK[id] || FALLBACK["T-2629"];
    w.semantic = fb;
    w.note = fb.notat;
    w.letter = fb.brev;
    w.live = false;
    w.error = e?.simulation ? "ingen nøkkel" : (e?.message || "feil");
    w.traceId = saveTrace({
      sak: id,
      org: sak.org,
      oppgave: "Sakskort — vurdering og utkast",
      live: false,
      kilder,
      prompt,
      system: SYS,
      tenkning: fb.tenkning,
      utkast: fb.notat,
      brev: fb.brev,
      raw: "",
      error: w.error
    });
  }
  w.running = false;
  w.pipeline = "utkast";
  renderList();
  renderCard();
}

function hitl(action) {
  if (!selected) return;
  const w = ensure(selected);
  readEditors(w);
  const grunn = ($("grunn")?.value || "").trim();
  w.pipeline = "hitl";
  if (action === "bekreft") {
    w.hitl = `Du bekreftet forslaget på ${kr(w.recommended)}. Fortsatt ikke et vedtak.`;
  } else if (action === "juster") {
    w.hitl = `Du justerte til ${kr(w.recommended)}. ${grunn || "Ingen skriftlig grunn."}`;
  } else if (action === "avvis") {
    if (!grunn) {
      w.hitl = "Skriv en grunn før du avviser.";
      renderCard();
      return;
    }
    w.hitl = `Du avviste forslaget: ${grunn}`;
  } else {
    w.hitl = "Saken står. Ingen godkjenning.";
  }
  addJournal({ type: "du", sak: selected, svar: w.hitl });
  if (action === "bekreft") arkiver(selected, w, "bekreft");
  renderCard();
}

function arkiver(id, w, handling) {
  const sak = findSak(id);
  const map = loadJson(ARCHIVE_KEY, {});
  map[id] = {
    sak: id,
    org: sak.org,
    at: new Date().toLocaleString("no-NO"),
    handling,
    pdf: `UTKAST — IKKE VEDTAK\n${id} ${sak.org}\nBeløp: ${w.recommended}\n\n${w.note}\n\n${w.letter}`
  };
  saveJson(ARCHIVE_KEY, map);
}

function setView(name) {
  ["arbeid", "klage", "slutt"].forEach((v) => {
    const el = $(`view-${v}`);
    if (el) el.hidden = v !== name;
    const a = document.querySelector(`[data-nav="${v}"]`);
    if (a) a.classList.toggle("is-on", v === name);
  });
  if (name === "klage") renderKlage();
  if (name === "slutt") renderSlutt();
}

function kiBanner(state, runningTxt) {
  if (state.running) return `<div class="note live-run">${runningTxt}</div>`;
  if (state.live === true) return `<div class="note live-ok">KI har skrevet utkast. Du velger. Ikke vedtak.</div>`;
  if (state.live === false) return `<div class="note live-off"><strong>Ikke KI-svar.</strong> Ferdig øvelsestekst. ${esc(state.error || "")}</div>`;
  return `<div class="note">Klar til å kjøre KI.</div>`;
}

function renderKlage() {
  const box = $("klageOut");
  if (!box) return;
  $("klageBanner").innerHTML = kiBanner(klage, "KI leser klagen…");
  if ($("klageRerun")) $("klageRerun").disabled = klage.running;
  if (!klage.vurdering) {
    box.innerHTML = `<p class="hint">${klage.running ? "Skriver to utkast…" : "Trykk «Kjør KI» eller vent — vi starter automatisk."}</p>`;
    return;
  }
  box.innerHTML = `${klage.tenkning ? `<div class="think"><strong>Hva KI skrev mens den jobbet</strong><p class="mono">${esc(klage.tenkning)}</p><p><a href="transparens.html${klage.traceId ? `#${klage.traceId}` : ""}">Åpne hele tankeloggen →</a></p></div>` : ""}
    <h3>Hva som er nytt</h3><p class="mono">${esc(klage.vurdering)}</p>
    <h3>Hvis du godtar kursleder-forklaringen</h3><p class="mono">${esc(klage.omgjoring)}</p>
    <h3>Hvis du ikke godtar den</h3><p class="mono">${esc(klage.opprettholdelse)}</p>`;
}

function renderSlutt() {
  const box = $("sluttOut");
  if (!box) return;
  $("sluttBanner").innerHTML = kiBanner(slutt, "KI leser sluttregnskapet…");
  if ($("sluttRerun")) $("sluttRerun").disabled = slutt.running;
  if (!slutt.vurdering) {
    box.innerHTML = `<p class="hint">${slutt.running ? "Skriver utkast…" : "Starter KI."}</p>`;
    return;
  }
  box.innerHTML = `${slutt.tenkning ? `<div class="think"><strong>Hva KI skrev mens den jobbet</strong><p class="mono">${esc(slutt.tenkning)}</p><p><a href="transparens.html${slutt.traceId ? `#${slutt.traceId}` : ""}">Åpne hele tankeloggen →</a></p></div>` : ""}
    <h3>Hva som er avvik</h3><p class="mono">${esc(slutt.vurdering)}</p>
    <h3>Utkast til tilbakekreving</h3><p class="mono">${esc(slutt.tilbake)}</p>
    <h3>Hvis mer dokumentasjon kommer</h3><p>${esc(slutt.alternativ)}</p>`;
}

async function runKlage(force) {
  if (klage.running || (klage.vurdering && !force)) return;
  const sak = findSak("T-2629");
  klage.running = true;
  renderKlage();
  const prompt = `Klage på T-2629. Opprinnelig: avkorting fordi admin var 32 %. Nytt faktum: 40 000 kr var kursleder (fag), ikke admin.\nSøknad: ${sak.soknad}\nUtdrag: ${RAG.admin.tekst}\n${RAG.klage.tekst}\nSkriv først ## Tenkning, deretter vurdering, omgjøring og opprettholdelse. Ikke vedtak.`;
  try {
    const text = await callModelAPI(prompt, SYS_KLAGE);
    const tnk = (text.split(/##\s*Tenkning/i)[1] || "").split(/##\s*Vurdering/i)[0].trim();
    const v = (text.split(/##\s*Vurdering/i)[1] || text).split(/##\s*Utkast omgjøring/i)[0].trim();
    const o = (text.split(/##\s*Utkast omgjøring/i)[1] || "").split(/##\s*Utkast opprettholdelse/i)[0].trim();
    const p = (text.split(/##\s*Utkast opprettholdelse/i)[1] || "").trim();
    klage.tenkning = tnk; klage.vurdering = v; klage.omgjoring = o; klage.opprettholdelse = p; klage.live = true;
    klage.traceId = saveTrace({ sak: "T-2629", org: sak.org, oppgave: "Klage — to utkast", live: true, kilder: [RAG.admin.tittel, RAG.klage.tittel], prompt, system: SYS_KLAGE, tenkning: tnk, utkast: v, brev: o, raw: text });
  } catch (e) {
    klage.tenkning = "1. Jeg leser at 40 000 kr skal være kursleder, ikke admin.\n2. Hvis det stemmer, synker adminandelen under 15 %.\n3. Jeg skriver to utkast. Du velger. Ikke vedtak.\nForhåndstekst — ikke modell.";
    klage.vurdering = "Nytt faktum: 40 000 kr var kursleder. Hvis du godtar det, synker adminandelen. Forhåndstekst — ikke modell.";
    klage.omgjoring = "Utkast — ikke vedtak\n\nGodta kursleder som aktivitet. Avkortingen blir mindre.";
    klage.opprettholdelse = "Utkast — ikke vedtak\n\nBehold opprinnelig avkorting mot 15 % admin.";
    klage.live = false;
    klage.error = e?.message || "feil";
    klage.traceId = saveTrace({ sak: "T-2629", org: sak.org, oppgave: "Klage — to utkast", live: false, kilder: [RAG.admin.tittel, RAG.klage.tittel], prompt, system: SYS_KLAGE, tenkning: klage.tenkning, utkast: klage.vurdering, brev: klage.omgjoring, raw: "", error: klage.error });
  }
  klage.running = false;
  renderKlage();
}

async function runSlutt(force) {
  if (slutt.running || (slutt.vurdering && !force)) return;
  const sak = findSak("T-2631");
  slutt.running = true;
  renderSlutt();
  const prompt = `Slutt T-2631. Innvilget 220 000. Brukt 140 000 på gressbane (ikke godkjent) og 80 000 på trening.\n${sak.soknad}\n${RAG.slutt.tekst}\nSkriv først ## Tenkning, deretter vurdering, tilbakekreving og alternativ. Ikke vedtak.`;
  try {
    const text = await callModelAPI(prompt, SYS_SLUTT);
    slutt.tenkning = (text.split(/##\s*Tenkning/i)[1] || "").split(/##\s*Vurdering/i)[0].trim();
    slutt.vurdering = (text.split(/##\s*Vurdering/i)[1] || text).split(/##\s*Utkast tilbakekreving/i)[0].trim();
    slutt.tilbake = (text.split(/##\s*Utkast tilbakekreving/i)[1] || "").split(/##\s*Alternativ/i)[0].trim();
    slutt.alternativ = (text.split(/##\s*Alternativ/i)[1] || "").trim();
    slutt.live = true;
    slutt.traceId = saveTrace({ sak: "T-2631", org: sak.org, oppgave: "Slutt — tilbakekreving", live: true, kilder: [RAG.slutt.tittel], prompt, system: SYS_SLUTT, tenkning: slutt.tenkning, utkast: slutt.vurdering, brev: slutt.tilbake, raw: text });
  } catch (e) {
    slutt.tenkning = "1. Jeg deler 220 000 kr i 140 000 anlegg og 80 000 trening.\n2. Anlegg er ikke godkjent. Trening kan stå.\n3. Utkast til tilbakekreving — ikke innkreving.\nForhåndstekst — ikke modell.";
    slutt.vurdering = "140 000 kr til gressbane er avvik. 80 000 kr trening kan stå. Forhåndstekst — ikke modell.";
    slutt.tilbake = "Utkast — ikke vedtak\n\nKrev 140 000 kr tilbake. Ikke innkreving.";
    slutt.alternativ = "Hvis anlegget likevel var godkjent, vurderer du saken på nytt.";
    slutt.live = false;
    slutt.error = e?.message || "feil";
    slutt.traceId = saveTrace({ sak: "T-2631", org: sak.org, oppgave: "Slutt — tilbakekreving", live: false, kilder: [RAG.slutt.tittel], prompt, system: SYS_SLUTT, tenkning: slutt.tenkning, utkast: slutt.vurdering, brev: slutt.tilbake, raw: "", error: slutt.error });
  }
  slutt.running = false;
  renderSlutt();
}

function klageValg(valg) {
  const t = valg === "godta"
    ? "Du tok omgjøringsutkastet inn i øvelsesjournalen. Ikke omgjøring i virkeligheten."
    : "Du tok opprettholdelsen inn i øvelsesjournalen. Ikke vedtak.";
  $("klageStatus").textContent = t;
  addJournal({ type: "du", sak: "T-2629", svar: t });
}

function sluttValg(valg) {
  const t = valg === "tilbake"
    ? "Du journalførte tilbakekrevingsutkastet. Ingen ekte innkreving."
    : "Sluttsaken står.";
  $("sluttStatus").textContent = t;
  addJournal({ type: "du", sak: "T-2631", svar: t });
}

function lookupRegister() {
  const hit = findReg($("regOrgnr")?.value);
  const out = $("regOut");
  if (!out) return;
  out.innerHTML = hit
    ? `<p><strong>${esc(hit.navn)}</strong> · ${esc(hit.form)} · frivillig ${hit.frivillig ? "ja" : "nei"}. Simulert tabell, ikke Brønnøysund.</p>`
    : `<p>Ikke funnet i øvelsestabellen.</p>`;
}

function submitSoknad() {
  const orgnr = ($("pOrgnr")?.value || "").trim();
  const org = ($("pOrg")?.value || "").trim();
  const belop = Number($("pBelop")?.value || 0);
  const soknad = ($("pTekst")?.value || "").trim();
  const status = $("pStatus");
  if (!orgnr || !org || !belop || !soknad) {
    if (status) status.textContent = "Fyll ut alle feltene.";
    return;
  }
  const list = loadJson(PORTAL_KEY, []);
  const id = `T-9${String(100 + list.length).slice(-3)}`;
  list.push({ id, orgnr, org, belop, soknad, at: new Date().toLocaleString("no-NO") });
  saveJson(PORTAL_KEY, list);
  if (status) status.textContent = `Lagret ${id} i denne nettleseren. Åpne arbeidslisten for å fortsette som saksbehandler.`;
  renderMine();
}

function renderMine() {
  const box = $("pMine");
  if (!box) return;
  const list = loadJson(PORTAL_KEY, []);
  box.innerHTML = list.length
    ? list.map((p) => `<p>${esc(p.id)} · ${esc(p.org)} · ${kr(p.belop)}</p>`).join("")
    : `<p class="hint">Ingen innsendinger her ennå.</p>`;
}

function fillPortalFromRegister() {
  const hit = findReg($("pOrgnr")?.value);
  if (hit && $("pOrg")) $("pOrg").value = hit.navn;
  if ($("pReg")) $("pReg").textContent = hit
    ? `${hit.navn} · ${hit.form} · frivillig ${hit.frivillig ? "ja" : "nei"} (simulert)`
    : "Ikke i tabellen. Du kan likevel sende.";
}

window.openSak = openSak;
window.runKI = runKI;
window.hitl = hitl;
window.setView = setView;
window.runKlage = runKlage;
window.runSlutt = runSlutt;
window.klageValg = klageValg;
window.sluttValg = sluttValg;
window.lookupRegister = lookupRegister;
window.submitSoknad = submitSoknad;
window.fillPortalFromRegister = fillPortalFromRegister;

function renderTransparens() {
  const listBox = $("sporListe");
  const det = $("sporDetalj");
  if (!listBox || !det) return;
  const list = loadJson(TRACE_KEY, []);
  const hash = (location.hash || "").replace("#", "");
  const sel = list.find((t) => t.id === hash) || list[0] || null;
  if (!list.length) {
    listBox.innerHTML = `<p class="hint">Ingen spor ennå. Åpne en sak på arbeidslisten og la KI kjøre — så dukker tenkningen opp her.</p>`;
    det.innerHTML = `<p class="hint">Siden viser det KI skrev <em>før</em> notatet: hva den leste, hva den brukte, og hva den lot være. Det er modellens egne arbeidsnotater — ikke skjulte vekter inne i modellen.</p>`;
    return;
  }
  listBox.innerHTML = list.map((t) => `
    <button type="button" class="${sel && sel.id === t.id ? "on" : ""}" onclick="location.hash='${t.id}'; renderTransparens()">
      <div class="meta"><span>${esc(t.sak)}</span><span class="tag ${t.live ? "tag-ok" : "tag-avkorting"}">${t.live ? "Live KI" : "Ikke modell"}</span></div>
      <h3>${esc(t.org || t.sak)}</h3>
      <p class="job">${esc(t.oppgave)} · ${esc(t.atVis)}</p>
    </button>`).join("");
  det.innerHTML = `
    <p class="mono" style="color:#4f46e5;font-weight:700;margin:0">${esc(sel.sak)} · ${esc(sel.atVis)}</p>
    <h2 style="margin:0.3rem 0">${esc(sel.oppgave)}</h2>
    <p class="hint">${sel.live ? "Dette kom fra live KI via /api/chat." : `Forhåndstekst — ikke modell${sel.error ? ` (${esc(sel.error)})` : ""}.`}</p>
    <div class="think">
      <strong>Tenkning (skrevet før konklusjonen)</strong>
      <p class="mono">${esc(sel.tenkning || "Ikke oppgitt i svaret.")}</p>
    </div>
    <h3>Kilder den fikk</h3>
    <ul>${(sel.kilder || []).map((k) => `<li>${esc(k)}</li>`).join("") || "<li>ikke oppgitt</li>"}</ul>
    <h3>Utkast etter tenkning</h3>
    <p class="mono">${esc(sel.utkast || "ikke oppgitt")}</p>
    ${sel.brev ? `<h3>Brev / andre utkast</h3><p class="mono">${esc(sel.brev)}</p>` : ""}
    <details>
      <summary>Hele prompten som ble sendt</summary>
      <p class="mono" style="font-size:0.78rem">${esc(sel.prompt || "")}</p>
    </details>
    <p class="hint">Vi viser det modellen ble bedt om å skrive høyt. Vi ser ikke «skjult resonnering» inne i vektenettverket.</p>
    <p><a class="btn btn-primary" href="behandle.html#${esc(sel.sak)}">Tilbake til saken</a></p>
  `;
}

window.renderTransparens = renderTransparens;

document.addEventListener("DOMContentLoaded", () => {
  if ($("sporListe")) {
    renderTransparens();
    window.addEventListener("hashchange", renderTransparens);
  }
  if ($("liste")) {
    renderRamme();
    renderList();
    renderJournal();
    renderCard();
    const hash = (location.hash || "").replace("#", "");
    if (hash && findSak(hash)) openSak(hash);
  }
  if ($("view-klage") && !$("view-klage").hidden) runKlage(false);
  if ($("pOrgnr")) {
    fillPortalFromRegister();
    renderMine();
  }
});
