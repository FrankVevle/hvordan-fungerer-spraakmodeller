/** Kontrollert øvelsesmappe. Plantet § 14 ligger i mappa, men merkes som felle. */
import { JUS_KILDER, JUS_TYPELABEL } from "./jus-kilder.js";

export { JUS_KILDER, JUS_TYPELABEL };

/** Simulert forskrift § 5 nevner fellen § 14 — aldri i godkjent uttrekk. */
const JUS_ALDRI_I_GRAF = new Set(["OEV-5"]);

const JUS_KJERNE = ["FVL-2", "FVL-17", "FVL-24", "GDPR-22", "AIA-14"];

const JUS_HINT = [
  { re: /innsyn|dokument|offentleg|offentlighets|partsinnsyn/i, ids: ["FVL-18", "OFFL-3", "KURS-PLIKT"] },
  { re: /arkiv|journal/i, ids: ["ARK-6", "KURS-PLIKT"] },
  { re: /personopplys|fødsels|helse|sladd|barn|gdpr|navngitt/i, ids: ["GDPR-5", "GDPR-6", "GDPR-9", "KURS-LYS"] },
  { re: /dpia|fria|konsekvens/i, ids: ["GDPR-35", "AIA-27"] },
  { re: /automatisert|ikke vedtak|menneske i|tilsyn/i, ids: ["FVL-2", "GDPR-22", "AIA-14", "KURS-HITL"] },
  { re: /begrunn|utred/i, ids: ["FVL-17", "FVL-24"] }
];

export const CORPUS = {
  admin: {
    id: "admin",
    tittel: "Øvelsesregel 2026 · administrasjon",
    tekst: "Prosjektledelse og generell administrasjon skal som hovedregel ikke overstige 15 % av søknadssummen. Overskytende kan foreslås avkortet. Dette er øvelse, ikke evig forskrift. Avkorting er forslag, ikke vedtak."
  },
  soker: {
    id: "soker",
    tittel: "Øvelsesregel 2026 · hvem kan søke",
    tekst: "Søker skal stå i Enhetsregisteret. For denne aktivitetstypen skal virksomheten også stå i Frivillighetsregisteret, med mindre søker er kommune. Kommersielt AS uten frivillig formål kan ikke søke."
  },
  revisor: {
    id: "revisor",
    tittel: "Øvelsesregel 2026 · revisor",
    tekst: "Søknader over 200 000 kroner skal ha revisorattest. Mangler attest, skal saken flagges. Beløpsgrensen er øvelse 2026."
  },
  mal: {
    id: "mal",
    tittel: "Øvelsesregel 2026 · målgruppe",
    tekst: "Tiltaket skal nå barn og unge som står utenfor. Deltakelse skal være gratis eller uten urimelig egenandel. Står det ikke i teksten, er det ikke oppgitt."
  },
  jobb: {
    id: "jobb",
    tittel: "Øvelsesregel · jobbtilbud 4.2",
    tekst: "Jobbtilbud gjelder lønnet praksis og veiledning. Det er ikke investering i anlegg. Lik sak i øvelsen: Havblik Røde Kors (T-2608)."
  },
  planted: {
    id: "planted",
    tittel: "Feil hentet utdrag (øvelse)",
    tekst: "Likebehandling: Golfklubben Fjord (T-2621) fikk avslag. Sim. forskrift § 14 om investering. Anbefalt avslag.",
    trap: true
  },
  klage: {
    id: "klage",
    tittel: "Øvelsesregel · nytt faktum",
    tekst: "Honorar til kursleder er faglig aktivitet, ikke generell administrasjon, når det følger av dokumentasjon. Omgjøring er saksbehandlers. KI fatter ikke vedtak."
  },
  slutt: {
    id: "slutt",
    tittel: "Øvelsesregel · slutt",
    tekst: "Tilskudd brukt i strid med vilkår kan kreves tilbake forholdsmessig. Godkjent aktivitet holdes utenfor. Forslag — ikke innkreving."
  },
  personvern: {
    id: "personvern",
    tittel: "Øvelsesregel 2026 · personvern",
    tekst: "Fødselsnummer, helse og navngitte barn skal sladdes før teksten går til KI. E-post, telefon og adresse sladdes som hovedregel. Modulen er mønstersøk — ikke et vedtak om lovlighet."
  }
};

export function erJobbSak(sak) {
  const akt = String(sak?.aktivitet || "");
  const flag = String(sak?.flag || "");
  return flag === "plantet" || sak?.id === "T-2622" || akt.includes("4.2");
}

function medType(doc, type) {
  if (!doc) return doc;
  return { ...doc, type: doc.type || type };
}

export function toJusDoc(src) {
  return {
    id: src.id,
    tittel: src.tittel,
    tekst: src.tekst,
    kilde: src.kilde,
    type: src.type,
    kind: "jus"
  };
}

export function retrieveJus(query, sak, task = "sak") {
  const hay = [
    query,
    sak?.soknad,
    sak?.aktivitet,
    sak?.jobb,
    sak?.id,
    task,
    sak?.personvernNiva
  ].filter(Boolean).join("\n");

  const ids = new Set(JUS_KJERNE);
  for (const h of JUS_HINT) {
    if (h.re.test(hay)) h.ids.forEach((id) => ids.add(id));
  }
  if (sak?.personvernNiva && sak.personvernNiva !== "ok") {
    ["GDPR-5", "GDPR-6", "GDPR-9", "KURS-LYS"].forEach((id) => ids.add(id));
  }
  if (task === "klage") ids.add("FVL-18");
  if (task === "slutt") ids.add("ARK-6");

  return JUS_KILDER
    .filter((k) => ids.has(k.id) && !JUS_ALDRI_I_GRAF.has(k.id))
    .map(toJusDoc);
}

export function retrieveFolder(sak, task = "sak", query = "") {
  const trusted = [];
  const traps = [];
  const push = (doc, type = "fiktiv") => {
    if (!doc) return;
    const row = medType(doc, type);
    if (row.trap) traps.push(row);
    else trusted.push(row);
  };

  if (task === "klage") {
    push(CORPUS.admin);
    push(CORPUS.klage);
    push(CORPUS.mal);
  } else if (task === "slutt") {
    push(CORPUS.slutt);
    push(CORPUS.mal);
  } else {
    push(CORPUS.soker);
    push(CORPUS.admin);
    push(CORPUS.revisor);
    push(CORPUS.mal);
    if (erJobbSak(sak)) {
      push(CORPUS.jobb);
      if (sak?.flag === "plantet" || sak?.id === "T-2622") push(CORPUS.planted);
    }
    if (sak?.id === "T-2629") push(CORPUS.klage);
    if (sak?.flag === "avvik" || sak?.id === "T-2631") push(CORPUS.slutt);
    if (sak?.personvernNiva && sak.personvernNiva !== "ok") push(CORPUS.personvern);
  }

  retrieveJus(query, { ...sak, soknad: sak?.soknad || query }, task).forEach((doc) => {
    push(doc, doc.type);
  });

  return {
    trusted,
    traps,
    folder: [...trusted, ...traps]
  };
}

export function typeLabel(doc) {
  if (doc?.trap) return "Felle (ikke til utkast)";
  if (doc?.type && JUS_TYPELABEL[doc.type]) return JUS_TYPELABEL[doc.type];
  return "Fiktiv øvelse";
}

export function serializeRetrieved(docs) {
  return (docs || []).map((d) => ({
    id: d.id,
    tittel: d.tittel,
    type: d.type || (d.trap ? "felle" : "fiktiv"),
    typeLabel: typeLabel(d)
  }));
}

export function formatDocs(docs) {
  return docs.map((d) => {
    const lab = typeLabel(d);
    const merke = !d.type || d.type === "fiktiv"
      ? "\nMerk: fiktiv øvelsesregel — ikke gjeldende forskrift."
      : d.type === "veileder" || d.type === "kurs"
        ? "\nMerk: veileder/kurs — ikke hjemmel for vedtak."
        : "";
    const kilde = d.kilde ? `\nKilde: ${d.kilde}` : "";
    return `### [${lab}] ${d.id || "—"} · ${d.tittel}${kilde}\n${d.tekst}${merke}`;
  }).join("\n\n");
}

/** Paragrafnumre som finnes i godkjente utdrag (inkl. «§§ 24–25»). */
export function trustedParagraphs(docs) {
  const set = new Set();
  const blob = formatDocs(docs || []);
  for (const m of blob.matchAll(/§{1,2}\s*(\d+)/g)) set.add(m[1]);
  for (const m of blob.matchAll(/§{1,2}\s*(\d+)\s*[–-]\s*(\d+)/g)) {
    set.add(m[1]);
    set.add(m[2]);
  }
  return set;
}

export function trustedIds(docs) {
  return new Set((docs || []).map((d) => d.id).filter(Boolean));
}
