import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import {
  erJobbSak,
  formatDocs,
  retrieveFolder,
  serializeRetrieved,
  trustedIds,
  trustedParagraphs
} from "./grant-corpus.js";

const MAX_ATTEMPTS = 2;

const last = {
  reducer: (_prev, next) => next,
};

const GraphState = Annotation.Root({
  task: Annotation({ ...last, default: () => "sak" }),
  sak: Annotation({ ...last, default: () => ({}) }),
  soknad: Annotation({ ...last, default: () => "" }),
  trusted: Annotation({ ...last, default: () => [] }),
  traps: Annotation({ ...last, default: () => [] }),
  raw: Annotation({ ...last, default: () => "" }),
  parsed: Annotation({ ...last, default: () => ({}) }),
  validation: Annotation({ ...last, default: () => ({ ok: false, errors: [], attempts: 0 }) }),
  attempts: Annotation({ ...last, default: () => 0 }),
  live: Annotation({ ...last, default: () => false }),
  model: Annotation({ ...last, default: () => "" }),
  error: Annotation({ ...last, default: () => "" }),
  simulation: Annotation({ ...last, default: () => false }),
  feedback: Annotation({ ...last, default: () => "" }),
  trace: Annotation({
    reducer: (prev, next) => prev.concat(Array.isArray(next) ? next : [next]),
    default: () => []
  })
});

const SYS_SAK = `Du er forvaltningsrådgiver i en pedagogisk øvelse (2026). Du fatter ALDRI vedtak. Du er ikke Bufdir. Ikke juridisk rådgivning.
Du får KUN søknadstekst og GODKJENTE utdrag under. Hvis noe mangler: skriv «ikke oppgitt».
Skill kildetyper: lov (FVL, OFFL, ARK, GDPR, AIA) kan siteres når utdraget er hentet; fiktiv øvelsesregel 2026 skal merkes som fiktiv; veileder/kurs er ikke hjemmel.
Admin 15 % og revisor 200 000 kr er fiktive øvelsesregler 2026.
Når FVL-2 / FVL-17 ligger i mappa: si at utkastet ikke er vedtak (fvl § 2) og at utredningsplikten ligger hos saksbehandler (fvl § 17). GDPR-22 / AIA-14: ikke automatisert vedtak.
Svar på norsk. Start ALLTID med tenkning — skriv høyt hva du gjør, før du konkluderer.

## Tenkning
Nummererte setninger (5–8):
- Hva du leste i søknaden
- Hvilke utdrag du faktisk brukte (id + type: lov / fiktiv / veileder)
- Hva du lot være å bruke, og hvorfor
- Hva som er usikkert eller «ikke oppgitt»
- At du ikke fatter vedtak
Ikke finn på kilder. Ikke bruk § 14, Golfklubben Fjord eller T-2621 som hjemmel for jobbtilbud 4.2.
Hvis aktiviteten er jobbtilbud 4.2, SKAL du bruke utdraget om 4.2 og lik sak Havblik (T-2608). Ikke si at det er irrelevant.

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

const SYS_KLAGE = `Du er forvaltningsrådgiver i en øvelse. Du fatter aldri vedtak. Ikke juridisk rådgivning. Svar på norsk.
Bruk KUN godkjente utdrag. Skill lov, fiktiv øvelsesregel og veileder. Merk fiktive regler som fiktive. Vis til fvl § 2 / § 17 når de er hentet.
Start med ## Tenkning (nummererte setninger: hva som er nytt, hva du bruker, hva du ikke avgjør).
Deretter:
## Vurdering
## Utkast omgjøring
## Utkast opprettholdelse
Merk utkast som «Utkast — ikke vedtak».`;

const SYS_SLUTT = `Du er forvaltningsrådgiver i en øvelse. Ingen innkreving, ingen vedtak. Ikke juridisk rådgivning. Svar på norsk.
Bruk KUN godkjente utdrag. Skill lov, fiktiv øvelsesregel og veileder. Merk fiktive regler som fiktive. Vis til fvl § 2 / § 17 når de er hentet.
Start med ## Tenkning (nummererte setninger: hva som er avvik, hva som kan stå, at du ikke krever inn).
Deretter:
## Vurdering
## Utkast tilbakekreving
## Alternativ
Merk utkast som «Utkast — ikke vedtak».`;

function systemFor(task) {
  if (task === "klage") return SYS_KLAGE;
  if (task === "slutt") return SYS_SLUTT;
  return SYS_SAK;
}

function grab(text, label) {
  const m = text.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
  return m ? m[1].trim() : "";
}

function score(raw) {
  const m = String(raw).match(/(\d)\s*\/\s*5/);
  return m ? Number(m[1]) : null;
}

function section(text, from, to) {
  const right = text.split(new RegExp(`##\\s*${from}`, "i"))[1] || "";
  return to ? right.split(new RegExp(`##\\s*${to}`, "i"))[0].trim() : right.trim();
}

export function parseSak(text) {
  return {
    malgruppe: { score: score(grab(text, "Målgruppe")), sitat: grab(text, "Sitat målgruppe") || "ikke oppgitt" },
    medvirkning: { score: score(grab(text, "Medvirkning")), sitat: grab(text, "Sitat medvirkning") || "ikke oppgitt" },
    gratis: { score: score(grab(text, "Gratis")), sitat: grab(text, "Sitat gratis") || "ikke oppgitt" },
    tenkning: section(text, "Tenkning", "Semantikk"),
    notat: section(text, "Saksnotat", "Brevutkast") || text.trim(),
    brev: section(text, "Brevutkast") || ""
  };
}

export function parseKlage(text) {
  return {
    tenkning: section(text, "Tenkning", "Vurdering"),
    vurdering: section(text, "Vurdering", "Utkast omgjøring") || text,
    omgjoring: section(text, "Utkast omgjøring", "Utkast opprettholdelse"),
    opprettholdelse: section(text, "Utkast opprettholdelse"),
    notat: section(text, "Vurdering", "Utkast omgjøring") || text,
    brev: section(text, "Utkast omgjøring", "Utkast opprettholdelse")
  };
}

export function parseSlutt(text) {
  return {
    tenkning: section(text, "Tenkning", "Vurdering"),
    vurdering: section(text, "Vurdering", "Utkast tilbakekreving") || text,
    tilbake: section(text, "Utkast tilbakekreving", "Alternativ"),
    alternativ: section(text, "Alternativ"),
    notat: section(text, "Vurdering", "Utkast tilbakekreving") || text,
    brev: section(text, "Utkast tilbakekreving", "Alternativ")
  };
}

function parseFor(task, text) {
  if (task === "klage") return parseKlage(text);
  if (task === "slutt") return parseSlutt(text);
  return parseSak(text);
}

function cannedSak(sak) {
  const id = sak?.id || "";
  if (id === "T-2622" || sak?.flag === "plantet") {
    return `## Tenkning
1. Jeg leste at søknaden gjelder deltidsjobb og CV-kurs for ungdom.
2. Jeg brukte fiktiv øvelsesregel jobbtilbud 4.2 og lik sak Havblik Røde Kors (T-2608), samt lovutdrag FVL-2 og FVL-17.
3. Jeg lot være å bruke § 14 og Golfklubben Fjord (T-2621) — det er anlegg/investering, ikke jobbtilbud.
4. Medvirkning står ikke i teksten — jeg skriver «ikke oppgitt».
5. Jeg fatter ikke vedtak (fvl § 2). Utredningsplikten ligger hos saksbehandler (fvl § 17). Ikke automatisert vedtak.

## Semantikk
Målgruppe: 4/5
Sitat målgruppe: "Deltidsjobb og CV-kurs for 12 ungdommer."
Medvirkning: ikke oppgitt
Sitat medvirkning: ikke oppgitt
Gratis: 4/5
Sitat gratis: "Deltidsjobb og CV-kurs"

## Saksnotat
Formålet treffer fiktiv øvelsesregel 4.2. Lik sak er Havblik (T-2608), ikke Golfklubben Fjord. Dette er utkast — ikke vedtak (fvl § 2). Saksbehandler må opplyse saken (fvl § 17).

## Brevutkast
Utkast — ikke vedtak

Til ${sak?.org || "søker"}

Dere søkte om jobbtilbud og CV-kurs. Etter fiktiv øvelsesregel 4.2 og presedens Havblik (T-2608) foreslås innstilling, ikke avslag etter § 14. Dette er ikke et vedtak.`;
  }
  if (id === "T-2603") {
    return `## Tenkning
1. Søker er et AS uten frivillig registrering.
2. Jeg brukte fiktiv øvelsesregel om hvem som kan søke, og lovutdrag FVL-2 og FVL-17.
3. Formålet «ansattebarn» treffer ikke inkludering.
4. Jeg foreslår utenfor ordningen. Ikke vedtak (fvl § 2). Utredningsplikt hos saksbehandler (fvl § 17).

## Semantikk
Målgruppe: 1/5
Sitat målgruppe: "Ferieaktivitet for ansattebarn."
Medvirkning: ikke oppgitt
Sitat medvirkning: ikke oppgitt
Gratis: ikke oppgitt
Sitat gratis: ikke oppgitt

## Saksnotat
Kommersielt AS uten frivillig registrering kan etter fiktiv øvelsesregel 2026 ikke søke. Utenfor ordningen. Utkast — ikke vedtak (fvl § 2). Saksbehandler opplyser saken (fvl § 17).

## Brevutkast
Utkast — ikke vedtak

Dere kan etter den fiktive øvelsesregelen 2026 ikke søke som kommersielt AS uten frivillig registrering. Dette er ikke et vedtak.`;
  }
  return `## Tenkning
1. Jeg leste søknaden til ${sak?.org || "søker"}.
2. Jeg brukte godkjente utdrag i mappa, inkludert FVL-2 og FVL-17.
3. Fiktive øvelsesregler merkes som fiktive. Det som ikke står i teksten, merker jeg «ikke oppgitt».
4. Jeg fatter ikke vedtak (fvl § 2). Utredningsplikten ligger hos saksbehandler (fvl § 17).

## Semantikk
Målgruppe: 3/5
Sitat målgruppe: "${String(sak?.soknad || "").slice(0, 80)}"
Medvirkning: ikke oppgitt
Sitat medvirkning: ikke oppgitt
Gratis: ${/gratis/i.test(sak?.soknad || "") ? "5/5" : "ikke oppgitt"}
Sitat gratis: ${/gratis/i.test(sak?.soknad || "") ? "Gratis" : "ikke oppgitt"}

## Saksnotat
Øvelsesutkast for ${id || "saken"}. ${sak?.jobb || ""} Utkast — ikke vedtak (fvl § 2). Saksbehandler må opplyse saken (fvl § 17).

## Brevutkast
Utkast — ikke vedtak

Til ${sak?.org || "søker"}

Dette er et forslag til saksbehandler. Ikke juridisk råd.`;
}

function cannedKlage() {
  return `## Tenkning
1. Jeg leser at 40 000 kr skal være kursleder, ikke admin.
2. Fiktiv øvelsesregel: kurslederhonoror er fag når det dokumenteres. Lov: fvl § 17 (opplys saken) og fvl § 2 (ikke vedtak).
3. Jeg skriver to utkast. Du velger. Ikke vedtak.

## Vurdering
Nytt faktum: 40 000 kr var kursleder. Hvis du godtar det, synker adminandelen.

## Utkast omgjøring
Utkast — ikke vedtak

Godta kursleder som aktivitet. Avkortingen blir mindre.

## Utkast opprettholdelse
Utkast — ikke vedtak

Behold opprinnelig avkorting mot 15 % admin.`;
}

function cannedSlutt() {
  return `## Tenkning
1. Jeg deler 220 000 kr i 140 000 anlegg og 80 000 trening.
2. Anlegg er ikke godkjent etter fiktiv øvelsesregel. Trening kan stå.
3. Utkast til tilbakekreving — ikke innkreving. Ikke vedtak (fvl § 2). Utredningsplikt hos saksbehandler (fvl § 17).

## Vurdering
140 000 kr til gressbane er avvik. 80 000 kr trening kan stå.

## Utkast tilbakekreving
Utkast — ikke vedtak

Krev 140 000 kr tilbake. Ikke innkreving.

## Alternativ
Hvis anlegget likevel var godkjent, vurderer du saken på nytt.`;
}

function cannedText(task, sak) {
  if (task === "klage") return cannedKlage();
  if (task === "slutt") return cannedSlutt();
  return cannedSak(sak);
}

function brukerJobbregel(blob) {
  return String(blob).split(/(?<=[.!\n])/).some((setning) => {
    if (!/4\.2|havblik|t-2608/i.test(setning)) return false;
    if (/lot være|ikke relevant|brukte ikke|ikke bruke|ikke aktuelt/i.test(setning)) return false;
    return true;
  });
}

function brukerFellessakSomHjemmel(blob) {
  return String(blob).split(/(?<=[.!\n])/).some((setning) => {
    if (!/golfklubben|t-2621|§\s*14\b/i.test(setning)) return false;
    if (/ikke|lot være|brukte ikke|gjelder ikke|ikke lik sak|ikke hjemmel|anlegg|blokkert|avvist/i.test(setning)) {
      return false;
    }
    return true;
  });
}

export function validateDraft(state) {
  const errors = [];
  const task = state.task || "sak";
  const sak = state.sak || {};
  const parsed = state.parsed || {};
  const blob = [
    state.raw,
    parsed.tenkning,
    parsed.notat,
    parsed.brev,
    parsed.vurdering,
    parsed.omgjoring,
    parsed.tilbake
  ].filter(Boolean).join("\n");

  if (!/ikke vedtak/i.test(blob)) {
    errors.push("Utkastet er ikke merket «ikke vedtak».");
  }
  if (/\bvedtar\b|\bfatter vedtak\b|\bsender brevet\b/i.test(blob) && !/ikke.*vedtak/i.test(blob)) {
    errors.push("Teksten fremstiller et vedtak eller en sending.");
  }

  if (task === "sak" && erJobbSak(sak) && brukerFellessakSomHjemmel(blob)) {
    errors.push("Feil hjemmel eller feil lik sak: § 14 / Golfklubben Fjord (T-2621) gjelder ikke jobbtilbud 4.2.");
  }

  if (task === "sak" && erJobbSak(sak) && !brukerJobbregel(blob)) {
    errors.push("Mangler å bruke jobbtilbud 4.2 eller lik sak Havblik (T-2608) som hjemmel.");
  }

  const hentet = trustedIds(state.trusted || []);
  if (hentet.has("FVL-17") && !/§\s*17|FVL-17|utredningsplikt/i.test(blob)) {
    errors.push("Mangler å bruke hentet lovutdrag FVL-17 (fvl § 17 utredningsplikt).");
  }

  const allowedPara = trustedParagraphs(state.trusted || []);
  const allowedIds = trustedIds(state.trusted || []);
  String(blob).split(/(?<=[.!\n])/).forEach((setning) => {
    if (/ikke|lot være|brukte ikke|gjelder ikke|ikke hjemmel/i.test(setning)) return;
    const cited = setning.match(/§\s*\d+/g) || [];
    cited.forEach((p) => {
      const num = (p.match(/\d+/) || [])[0];
      if (num && allowedPara.has(num)) return;
      errors.push(`Paragraf ${p} finnes ikke i godkjente utdrag.`);
    });
    const idHits = setning.match(/\b(?:FVL|OFFL|ARK|GDPR|AIA|DFD|KURS|OEV)-[A-Z0-9]+/gi) || [];
    idHits.forEach((raw) => {
      const id = raw.toUpperCase();
      if (!allowedIds.has(id)) errors.push(`Kilde ${id} finnes ikke i godkjente utdrag.`);
    });
  });

  if (task === "sak") {
    if (!parsed.tenkning) errors.push("Mangler ## Tenkning.");
    if (!parsed.notat || parsed.notat.length < 20) errors.push("Saksnotatet er for tynt.");
  }
  if (task === "klage" && (!parsed.omgjoring || !parsed.opprettholdelse)) {
    errors.push("Klageutkastet mangler begge alternativene.");
  }
  if (task === "slutt" && !parsed.tilbake) {
    errors.push("Sluttutkastet mangler tilbakekrevingsdel.");
  }

  return { ok: errors.length === 0, errors: [...new Set(errors)], attempts: state.attempts || 0 };
}

async function callOpenAI(prompt, system) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("missing_key");
    err.simulation = true;
    throw err;
  }
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system.slice(0, 6000) },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!response.ok) {
    const err = new Error("openai_error");
    err.simulation = true;
    throw err;
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  if (!text) {
    const err = new Error("empty_response");
    err.simulation = true;
    throw err;
  }
  return { text, model };
}

function kilderLinje(docs, pred) {
  return docs.filter(pred).map((d) => `${d.id} · ${d.tittel}`).join("; ");
}

function retrieveNode(state) {
  const folder = retrieveFolder(state.sak, state.task, state.soknad);
  const lov = kilderLinje(folder.trusted, (d) => d.type === "lov") || "ingen";
  const fiktiv = kilderLinje(folder.trusted, (d) => !d.type || d.type === "fiktiv") || "ingen";
  const annen = kilderLinje(folder.trusted, (d) => d.type === "veileder" || d.type === "kurs") || "ingen";
  return {
    trusted: folder.trusted,
    traps: folder.traps,
    trace: {
      node: "rag",
      tittel: "RAG slår opp i mappa",
      detalj: `Lov: ${lov}. Fiktiv øvelse: ${fiktiv}. Veileder/kurs: ${annen}. I mappa men blokkert for utkast: ${folder.traps.map((d) => `${d.id} · ${d.tittel}`).join("; ") || "ingen"}.`
    }
  };
}

async function generateNode(state) {
  const task = state.task || "sak";
  const sak = state.sak || {};
  const system = systemFor(task);
  const extra = state.feedback
    ? `\n\nFORRIGE UTKAST BLE AVVIST AV SJEKKEN:\n${state.feedback}\nSkriv på nytt. Bruk KUN godkjente utdrag. Ikke gjenta feilene.`
    : "";
  const prompt = task === "klage"
    ? `Klage på ${sak.id || "T-2629"}. Opprinnelig: avkorting fordi admin var 32 %. Nytt faktum: 40 000 kr var kursleder (fag), ikke admin.\nSøknad:\n${state.soknad}\n\nGODKJENTE UTDRAG (lov / fiktiv / veileder er merket):\n${formatDocs(state.trusted)}\n${extra}\nSkriv først ## Tenkning, deretter vurdering, omgjøring og opprettholdelse. Ikke vedtak. Ikke juridisk råd.`
    : task === "slutt"
      ? `Slutt ${sak.id || "T-2631"}. Innvilget 220 000. Brukt 140 000 på gressbane (ikke godkjent) og 80 000 på trening.\n${state.soknad}\n\nGODKJENTE UTDRAG (lov / fiktiv / veileder er merket):\n${formatDocs(state.trusted)}\n${extra}\nSkriv først ## Tenkning, deretter vurdering, tilbakekreving og alternativ. Ikke vedtak. Ikke juridisk råd.`
      : `Saksnummer: ${sak.id || ""}\nOrganisasjon: ${sak.org || ""}\nSøkt: ${sak.belop || ""} kr\nAktivitet: ${sak.aktivitet || ""}\n${erJobbSak(sak) ? "Dette er jobbtilbud 4.2. Bruk utdraget om 4.2 og Havblik (T-2608). Ikke § 14.\n" : ""}\nSØKNADSTEKST:\n${state.soknad}\n\nGODKJENTE UTDRAG (lov / fiktiv øvelse / veileder er merket i hver blokk):\n${formatDocs(state.trusted)}\n${extra}\nSkriv først ## Tenkning, deretter semantikk, notat og brev. Tall 1–5 eller «ikke oppgitt». Merk fiktive regler som fiktive. Når FVL-17 og FVL-2 er hentet: skriv fvl § 17 (utredningsplikt hos saksbehandler) og at dette ikke er vedtak (fvl § 2). Ikke fatt vedtak. Ikke juridisk råd.`;

  const attempts = (state.attempts || 0) + 1;
  try {
    const { text, model } = await callOpenAI(prompt, system);
    return {
      raw: text,
      parsed: parseFor(task, text),
      attempts,
      live: true,
      model,
      simulation: false,
      error: "",
      trace: {
        node: "generate",
        tittel: attempts > 1 ? `Utkast skrevet på nytt (forsøk ${attempts})` : "KI skriver utkast",
        detalj: `Modell ${model}. Bare godkjente utdrag i prompten. Lov og fiktiv regel er merket hver for seg.`
      }
    };
  } catch (e) {
    const text = cannedText(task, sak);
    return {
      raw: text,
      parsed: parseFor(task, text),
      attempts,
      live: false,
      model: "",
      simulation: true,
      error: e?.message || "api",
      trace: {
        node: "generate",
        tittel: "Forhåndsutkast (grafen uten nøkkel/API)",
        detalj: "Samme sjekk kjøres. Teksten er ferdig øvelsesutkast, ikke live modell."
      }
    };
  }
}

function validateNode(state) {
  const validation = validateDraft(state);
  return {
    validation,
    feedback: validation.ok ? "" : validation.errors.map((e, i) => `${i + 1}. ${e}`).join("\n"),
    trace: {
      node: "validate",
      tittel: validation.ok ? "Sjekken godtok utkastet" : "Sjekken avviste utkastet",
      detalj: validation.ok
        ? "Hjemmel, lik sak, merking og kilder er i orden. Neste steg er saksbehandler."
        : validation.errors.join(" ")
    }
  };
}

function routeAfterValidate(state) {
  if (state.validation?.ok) return END;
  if ((state.attempts || 0) >= MAX_ATTEMPTS) return END;
  return "generate";
}

const workflow = new StateGraph(GraphState)
  .addNode("retrieve", retrieveNode)
  .addNode("generate", generateNode)
  .addNode("validate", validateNode)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "validate")
  .addConditionalEdges("validate", routeAfterValidate);

export const grantGraph = workflow.compile();

export async function runGrantGraph(input) {
  const sak = input.sak || {};
  const task = input.task || "sak";
  const soknad = typeof input.soknad === "string" && input.soknad.trim()
    ? input.soknad.trim()
    : String(sak.soknad || "");
  if (!soknad || soknad.length > 80000) {
    const err = new Error("invalid_prompt");
    throw err;
  }

  const state = await grantGraph.invoke({
    task,
    sak: {
      id: sak.id || "",
      org: sak.org || "",
      belop: sak.belop,
      aktivitet: sak.aktivitet || "",
      flag: sak.flag || "",
      jobb: sak.jobb || "",
      personvernNiva: sak.personvernNiva || ""
    },
    soknad
  });

  const validation = state.validation || { ok: false, errors: [], attempts: state.attempts || 0 };
  return {
    ok: Boolean(validation.ok),
    escalated: !validation.ok,
    live: Boolean(state.live),
    simulation: Boolean(state.simulation),
    model: state.model || "",
    error: state.error || "",
    task,
    retrieved: serializeRetrieved(state.trusted || []),
    traps: serializeRetrieved(state.traps || []),
    validation,
    parsed: state.parsed || {},
    raw: state.raw || "",
    trace: [
      {
        node: "orkestrator",
        tittel: "Koordinator (LangGraph)",
        detalj: `Sak ${sak.id || "—"}. Fast rekkefølge: RAG → utkast → sjekk${(state.attempts || 0) > 1 ? " → nytt utkast" : ""}.`
      },
      ...(state.trace || [])
    ]
  };
}
