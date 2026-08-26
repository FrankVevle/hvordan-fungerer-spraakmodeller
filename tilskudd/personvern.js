/**
 * Egen personvernmodul for tilskuddsøvelsen.
 * Mønstersøk — ikke en DPO, ikke Datatilsynet, ikke automatisk hjemmel.
 * Fiktive treff er merket som øvelse.
 */
const PV_PLANTE = {
  "T-2612": "Veileder skriver at eleven Mia Hansen har ADHD. Foresatt: mia.foresatt@asby.example, tlf 900 12 345.",
  "T-2632": "Kontaktperson Ole Vest, Storgata 14, Storøy. Oppgitt fødselsnummer 01010199999 (fiktivt øvelsesnummer — ikke en ekte person).",
  "T-2801": "Påmeldingsliste med e-post nordlys.kontakt@ungdom.example og mobil 482 11 200."
};

const PV_REGLER = [
  {
    id: "fnr",
    niva: "rod",
    label: "Fødselsnummer",
    tekst: "11 siffer som kan være fødselsnummer. Skal ikke sendes til KI.",
    re: /\b\d{6}\s?\d{5}\b/g
  },
  {
    id: "helse",
    niva: "rod",
    label: "Helse / særlige kategorier",
    tekst: "Helseopplysning (særlig kategori). Krever sladding før modellkall.",
    re: /\b(adhd|diagnose|psykisk|legeerklæring|sykdom|behandling(?!sgebyr)|funksjonsnedsettelse)\b/gi
  },
  {
    id: "barn_navn",
    niva: "rod",
    label: "Navngitt barn / elev",
    tekst: "Identifiserbart barn i søknadsteksten.",
    re: /\b(?:eleven|barnet|jenta|gutten)\s+[A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+)?/g
  },
  {
    id: "epost",
    niva: "gul",
    label: "E-post",
    tekst: "Direkte identifikator. Sladdes som hovedregel før KI.",
    re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  },
  {
    id: "telefon",
    niva: "gul",
    label: "Telefon",
    tekst: "Åttesifret nummer som kan være telefon. Org.nr. (9 siffer) telles ikke.",
    re: /(?:\+47[\s.]?)?(?:\d{3}[\s.]?\d{2}[\s.]?\d{3}|\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2})\b/g
  },
  {
    id: "adresse",
    niva: "gul",
    label: "Gateadresse",
    tekst: "Adresse knyttet til en person eller kontakt.",
    re: /\b[A-ZÆØÅ][a-zæøå]+(?:veien|vegen|gata|gate|plass)\s+\d+\b/gi
  }
];

function personvernKobleSaker(saker) {
  (saker || []).forEach((s) => {
    const ekstra = PV_PLANTE[s.id];
    if (!ekstra || s.pvPlantet) return;
    s.soknad = `${s.soknad} ${ekstra}`;
    s.pvPlantet = true;
    s.jobb = `${s.jobb} Sjekk personvern før KI får teksten.`;
  });
}

function personvernKildeTekst(sak) {
  const full = typeof sakFulltekst === "function" ? sakFulltekst(sak) : (sak.soknad || "");
  return [full, sak.org || ""].join("\n");
}

function personvernNivaVinner(a, b) {
  const rank = { ok: 0, gul: 1, rod: 2 };
  return (rank[a] || 0) >= (rank[b] || 0) ? a : b;
}

function sjekkPersonvern(sak) {
  const raa = personvernKildeTekst(sak);
  const funn = [];
  if (/Privatperson/i.test(sak.org || "")) {
    funn.push({
      id: "privatperson",
      niva: "gul",
      label: "Privatperson som søker",
      tekst: "Søker er navngitt person, ikke organisasjon. Vurder om teksten skal til KI.",
      treff: sak.org
    });
  }
  const utenFnr = raa.replace(/\b\d{6}\s?\d{5}\b/g, " ");
  PV_REGLER.forEach((regel) => {
    const kilde = regel.id === "telefon" ? utenFnr : raa;
    const re = new RegExp(regel.re.source, regel.re.flags);
    const treff = kilde.match(re);
    if (!treff) return;
    const unike = [...new Set(treff.map((t) => t.trim()))].filter(Boolean);
    if (regel.id === "telefon") {
      const renset = unike.filter((t) => t.replace(/\D/g, "").length === 8);
      if (!renset.length) return;
      funn.push({ id: regel.id, niva: regel.niva, label: regel.label, tekst: regel.tekst, treff: renset.join(", ") });
      return;
    }
    funn.push({ id: regel.id, niva: regel.niva, label: regel.label, tekst: regel.tekst, treff: unike.join(", ") });
  });
  let niva = "ok";
  funn.forEach((f) => { niva = personvernNivaVinner(niva, f.niva); });
  return {
    niva,
    funn,
    sladdet: sladdPersonvernTekst(typeof sakFulltekst === "function" ? sakFulltekst(sak) : (sak.soknad || ""), funn),
    raa: typeof sakFulltekst === "function" ? sakFulltekst(sak) : (sak.soknad || "")
  };
}

function sladdPersonvernTekst(tekst, funn) {
  let ut = String(tekst);
  (funn || []).forEach((f) => {
    if (!f.treff || f.id === "privatperson") return;
    f.treff.split(", ").forEach((bit) => {
      if (!bit) return;
      const escRe = bit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      ut = ut.replace(new RegExp(escRe, "g"), `[SLADDET: ${f.label}]`);
    });
  });
  return ut;
}

function personvernForKi(sak, valg) {
  const sjekk = sjekkPersonvern(sak);
  if (sjekk.niva === "rod" && valg !== "sladd" && valg !== "likevel") {
    return { stopp: true, sjekk, tekst: "", sladdet: true };
  }
  const brukSladd = valg !== "likevel";
  return {
    stopp: false,
    sjekk,
    tekst: brukSladd ? sjekk.sladdet : sjekk.raa,
    sladdet: brukSladd && sjekk.niva !== "ok"
  };
}

function sjekkHelePortefoljenPersonvern(saker) {
  const rader = (saker || []).map((sak) => ({ sak, sjekk: sjekkPersonvern(sak) }));
  return {
    antall: rader.length,
    rod: rader.filter((r) => r.sjekk.niva === "rod"),
    gul: rader.filter((r) => r.sjekk.niva === "gul"),
    ok: rader.filter((r) => r.sjekk.niva === "ok"),
    rader
  };
}

function sjekkFritekstPersonvern(tekst) {
  return sjekkPersonvern({ soknad: tekst || "", org: "" });
}