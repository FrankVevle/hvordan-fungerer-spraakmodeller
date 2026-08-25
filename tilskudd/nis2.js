/**
 * NIS 2 og Norges tilnærming — øvelsesmodul.
 * Ikke samsvar. Ikke innmelding til NSM. Ikke juridisk råd.
 *
 * Norge: digitalsikkerhetsloven + forskrift gjennomfører NIS 1 (2016/1148).
 * NIS 2 (EU 2022/2555) er EØS-relevant, men per NSM-veileder ikke ferdig
 * gjennomført i norsk rett. Forskriften har likevel hentet inn enkelte
 * NIS 2-elementer (bredere hendelseshåndtering, kvartalsvis rapportering).
 * NSM er nasjonalt kontaktpunkt. Strengere sektorlov eller sikkerhetsloven går foran.
 */
const NIS2_REF = "NIS 2 (EU) 2022/2555 · digitalsikkerhetsloven (Norge)";

function sjekkNis2System() {
  return [
    {
      id: "norge",
      niva: "gul",
      art: "Norge",
      tittel: "Tilnærming, ikke full NIS 2 ennå",
      tekst: "Digitalsikkerhetsloven gjennomfører NIS 1. NSM skriver at NIS 2 ikke er implementert i norsk rett, men at forskriften allerede har tatt inn enkelte NIS 2-grep (respons, rapportering). En ekte etat følger loven som gjelder i dag — og forbereder NIS 2."
    },
    {
      id: "omfattet",
      niva: "ok",
      art: "Virkeområde",
      tittel: "Denne prototypen er ikke samfunnsviktig tjeneste",
      tekst: "Loven retter seg mot tilbydere av samfunnsviktige tjenester og digitale tjenester. En pedagogisk øvelse på Vercel er ikke innmeldt hos NSM. Hvis en direktorat-løsning gikk i produksjon, må sektormyndighet og NSM vurderes."
    },
    {
      id: "nis2klasse",
      niva: "gul",
      art: "NIS 2",
      tittel: "Vesentlig / viktig enhet (hvis ekte)",
      tekst: "NIS 2 skiller vesentlige og viktige enheter, med styreansvar og tilsyn. Offentlig forvaltning som leverer samfunnskritiske eller viktige digitale tjenester kan bli omfattet når Norge gjennomfører. Her: hypotese, ikke utpeking."
    },
    {
      id: "styring",
      niva: "rod",
      art: "Sikkerhetsstyring",
      tittel: "Forsvarlig sikkerhet",
      tekst: "Ingen risikovurdering, ingen tilgangsstyring utover det Vercel gir, ingen beredskapsplan. NSM krever forsvarlig sikkerhet av dem som er omfattet. Prototypen oppfyller ikke det."
    },
    {
      id: "leverandor",
      niva: "gul",
      art: "Leverandørkjede",
      tittel: "OpenAI og Vercel",
      tekst: "NIS 2 og NSM vektlegger leverandør- og skytjenester. Tekst kan gå til OpenAI. Drift ligger hos Vercel. Ingen tjenesteutsettingsvurdering, ingen varslingskjede mot leverandør i øvelsen."
    },
    {
      id: "varsling",
      niva: "rod",
      art: "Varsling",
      tittel: "Hendelsesvarsling til NSM",
      tekst: "Omfattede virksomheter skal varsle hendelser som virker betydelig inn på tjenesten. NIS 2 har tidlige frister (tidligvarsel / hendelsesmelding). Her finnes ingen varslingsknapp, ingen NCSC-løp, ingen tidsfrist."
    },
    {
      id: "logging",
      niva: "gul",
      art: "Hendelseshåndtering",
      tittel: "Spor i nettleseren",
      tekst: "Øvelsesspor ligger i localStorage. Det er ikke sikkerhetslogg, ikke reserveløsning, ikke gjenoppretting. NIS 2 utvider «incident handling» til å forebygge og gjenopprette — NSM har begynt å speile det i forskriften."
    },
    {
      id: "sektor",
      niva: "ok",
      art: "dsl. § 5",
      tittel: "Andre lover kan gå foran",
      tekst: "Har sektoren eller sikkerhetsloven like strenge eller strengere krav, gjelder de. Personvern og KI-forordning kommer i tillegg. Øvelsen blander ikke dette til ett «godkjent»-stempel."
    }
  ];
}

function sjekkNis2Sak(sak, ctx) {
  const pv = (ctx && ctx.pv) || (typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : { niva: "ok" });
  const w = (ctx && ctx.work) || {};
  const sendtUt = Boolean(w.live === true) || Boolean(ctx && ctx.harSpor);
  const hoyKonsekvens = pv.niva === "rod" || sak.flag === "plantet" || sak.flag === "avvik";
  const grunner = [];
  if (pv.niva === "rod") grunner.push("Rødt personvern — høyere skade hvis lekkasje eller modellbrudd");
  if (sak.flag === "plantet") grunner.push("Plantet feil — integritet i beslutningsstøtten");
  if (sak.flag === "avvik") grunner.push("Slutt/penger — tilgjengelighet og sporbarhet betyr mer");
  if (sendtUt) grunner.push("Tekst kan ha gått til tredjepart (OpenAI)");
  if (!hoyKonsekvens && !sendtUt) grunner.push("Lav øvelseskonsekvens — fortsatt ikke varsleplikt her");
  return {
    klasse: hoyKonsekvens ? "hoy-konsekvens" : "standard",
    klasseTekst: hoyKonsekvens ? "Høyere konsekvens ved hendelse" : "Standard øvelsessak",
    sendtUt,
    varsling: "Ingen — prototypen varsler ikke NSM",
    omfattet: "Ikke innmeldt. Ekte etat må vurdere digitalsikkerhetsloven.",
    grunner
  };
}

function sjekkHelePortefoljenNis2(saker, ctxFn) {
  const rader = (saker || []).map((sak) => ({
    sak,
    nis: sjekkNis2Sak(sak, ctxFn ? ctxFn(sak) : {})
  }));
  return {
    antall: rader.length,
    hoy: rader.filter((r) => r.nis.klasse === "hoy-konsekvens"),
    standard: rader.filter((r) => r.nis.klasse === "standard"),
    sendt: rader.filter((r) => r.nis.sendtUt),
    rader
  };
}