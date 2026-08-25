/**
 * KI-forordningen (EU) 2024/1689 — øvelsesmodul.
 * Ikke samsvarsvurdering. Ikke CE-merking. Ikke juridisk råd.
 */
const AIACT_REF = "KI-forordningen (EU) 2024/1689";

function sjekkAiActSystem() {
  return [
    {
      id: "forbudt",
      niva: "ok",
      art: "Art. 5",
      tittel: "Forbudt praksis",
      tekst: "Ingen sosial scoring, ingen biometrisk identifikasjon, ingen utnytting av sårbarhet. Øvelsen er utenfor forbudt bruk."
    },
    {
      id: "hoyrisiko",
      niva: "gul",
      art: "Vedlegg III",
      tittel: "Offentlige ytelser og tjenester",
      tekst: "Hvis dette var ekte tilskuddsforvaltning, ville KI som støtte til tildeling sannsynligvis vært høyrisiko. Her er det en pedagogisk prototype — ikke et høyrisikosystem i drift."
    },
    {
      id: "rolle",
      niva: "ok",
      art: "Art. 3 / 14",
      tittel: "Beslutningsstøtte, ikke automatisert vedtak",
      tekst: "Modellen skriver utkast. Mennesket bekrefter, justerer eller avviser. Ingen knapp fatter enkeltvedtak."
    },
    {
      id: "gpai",
      niva: "gul",
      art: "GPAI",
      tittel: "Allmenn modell hos tredjepart",
      tekst: "Live-kall går til OpenAI (GPAI). I en ekte etat er det deployer-plikter mot leverandør. Her: øvelse, nøkkel i Vercel, ingen databehandleravtale i prototypen."
    },
    {
      id: "tilsyn",
      niva: "ok",
      art: "Art. 14",
      tittel: "Menneskelig tilsyn",
      tekst: "Sakskortet krever handling av deg. Plantet feil (feil paragraf) er der for at tilsynet skal feile synlig hvis du stoler blindt."
    },
    {
      id: "apenhet",
      niva: "ok",
      art: "Art. 13 og 50",
      tittel: "Åpenhet",
      tekst: "Utkast merkes «ikke vedtak». Transparenssiden viser kilder og tenkning. Søkerportalen sier at innsending er simulert."
    },
    {
      id: "logging",
      niva: "gul",
      art: "Art. 12",
      tittel: "Logging",
      tekst: "Spor lagres i nettleseren (localStorage). Det er ikke automatisk, manipulasjonssikker logging som forordningen krever for høyrisiko."
    },
    {
      id: "data",
      niva: "gul",
      art: "Art. 10",
      tittel: "Data og personvern før modellkall",
      tekst: "Personvernmodulen sladder mønsterfunn. Det er ikke datastyring av treningssett — vi bruker en ferdig GPAI, ikke et eget modelltrening."
    },
    {
      id: "robust",
      niva: "gul",
      art: "Art. 15",
      tittel: "Nøyaktighet og robusthet",
      tekst: "Plantet feil viser at modellen kan hente feil regel. Ingen nøyaktighetsmål, ingen evaluering mot fasit utover øvelsen."
    },
    {
      id: "samsvar",
      niva: "rod",
      art: "Kap. III",
      tittel: "Samsvar og dokumentasjon",
      tekst: "Ingen risikostyring, ingen teknisk dokumentasjon, ingen samsvarsvurdering, ingen CE-merking. Ikke ta denne prototypen i produksjon."
    }
  ];
}

function sjekkAiActSak(sak, ctx) {
  const pv = (ctx && ctx.pv) || (typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : { niva: "ok", funn: [] });
  const w = (ctx && ctx.work) || {};
  const hoyTilsyn = sak.flag === "plantet" || sak.flag === "avvik" || pv.niva === "rod";
  const grunner = [];
  if (sak.flag === "plantet") grunner.push("Plantet modellfeil — tilsynet må fange den");
  if (sak.flag === "avvik") grunner.push("Slutt/tilbakekreving — ikke automatisk innkreving");
  if (pv.niva === "rod") grunner.push("Rødt personvern — ikke send usladdet til KI");
  if (!hoyTilsyn) grunner.push("Vanlig beslutningsstøtte under menneskelig tilsyn");
  let tilsyn = "Ikke kjørt";
  if (w.hitl) tilsyn = "Menneske har handlet";
  else if (w.semantic) tilsyn = "Utkast venter på deg";
  const logging = Boolean(w.traceId) || Boolean(ctx && ctx.harSpor);
  return {
    bruk: "Beslutningsstøtte",
    forbudt: false,
    klasse: hoyTilsyn ? "hoy-tilsyn" : "standard",
    klasseTekst: hoyTilsyn ? "Høyt tilsyn (øvelse)" : "Standard støtte",
    grunner,
    tilsyn,
    logging,
    pv: pv.niva
  };
}

function sjekkHelePortefoljenAiAct(saker, ctxFn) {
  const rader = (saker || []).map((sak) => ({
    sak,
    act: sjekkAiActSak(sak, ctxFn ? ctxFn(sak) : {})
  }));
  return {
    antall: rader.length,
    hoy: rader.filter((r) => r.act.klasse === "hoy-tilsyn"),
    standard: rader.filter((r) => r.act.klasse === "standard"),
    venter: rader.filter((r) => r.act.tilsyn === "Utkast venter på deg"),
    handlet: rader.filter((r) => r.act.tilsyn === "Menneske har handlet"),
    rader
  };
}