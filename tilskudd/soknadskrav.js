/**
 * Øvelseskrav til søknad + syntetisk dokumentasjon på alle saker.
 * Ikke live Bufdir. Ikke ID-porten. Ikke juridisk råd.
 */

const SOKNADSKRAV = [
  { id: "orgform", gruppe: "formal", navn: "Organisasjonsform", kort: "Registrert virksomhet med org.nr. Privatperson og enkeltpersonforetak kan i hovedsak ikke søke." },
  { id: "frivillig", gruppe: "formal", navn: "Frivillighetsregister / historikk", kort: "Frivillige skal som regel stå i Frivillighetsregisteret og ha dokumentert aktivitet 1–2 år." },
  { id: "etikk", gruppe: "formal", navn: "Etikk og trygghet", kort: "Skriftlige etiske retningslinjer, rutiner for barn/sårbare, varsling og uønskede hendelser." },
  { id: "portal", gruppe: "formal", navn: "Innsending", kort: "I øvelsen: simulert innsending. Ikke ID-porten. Ikke Bufdirs portal." },
  { id: "mal", gruppe: "innhold", navn: "Mål og evaluering", kort: "Tydelige mål og plan for hvordan effekten skal vurderes underveis og etterpå." },
  { id: "malgruppe", gruppe: "innhold", navn: "Målgruppe og rekruttering", kort: "Hvem, estimert antall, og realistisk plan for å nå dem." },
  { id: "plan", gruppe: "innhold", navn: "Gjennomføringsplan", kort: "Hva, når, hvor ofte, og hvem som har ansvaret." },
  { id: "samarbeid", gruppe: "innhold", navn: "Samarbeid", kort: "Kommune, andre organisasjoner eller fagmiljø — eller at det ikke er samarbeid." },
  { id: "budsjett", gruppe: "okonomi", navn: "Budsjett i balanse", kort: "Spesifiserte poster. Unngå store sekkeposter. Oppgi andre inntekter." },
  { id: "egen", gruppe: "okonomi", navn: "Egenfinansiering", kort: "Øvelse for inkludering: 5 % frivillige, 20 % kommune/privat. Varierer mellom ordninger." },
  { id: "profitt", gruppe: "okonomi", navn: "Ikke kommersiell profitt", kort: "Midlene skal ikke gå til forretningsdrift, profitt eller lovpålagte kjerneoppgaver." },
  { id: "revisor", gruppe: "okonomi", navn: "Revisjon og sluttrapport", kort: "Øvelse: over 200 000 kr skal ha revisorattest. Sluttrapport etter tildeling." }
];

function sakTall(sak) {
  return Number(String(sak.id || "").replace(/\D/g, "")) || 1;
}

function sakFulltekst(sak) {
  const docs = (sak.dokumenter || []).map((d) => `## ${d.tittel}\n${d.tekst}`).join("\n\n");
  return [sak.soknad || "", docs].filter(Boolean).join("\n\n");
}

function byggSoknadspakke(sak) {
  const n = sakTall(sak);
  const flag = sak.flag || "ok";
  const deltakere = 8 + (n % 20);
  const uker = 6 + (n % 8);
  const frivillig = sak.frivillig !== false && !/AS |Privatperson/.test(sak.org || "");
  const kommune = /kommune/i.test(sak.form || "") || /kommune/i.test(sak.org || "");
  const egenKrav = kommune || flag === "formalia" ? 20 : 5;
  let egenPct = egenKrav;
  let aarAktiv = 3 + (n % 4);
  let etikkStatus = "ok";
  let planKvalitet = "ok";
  let malKvalitet = "ok";
  let samKvalitet = "ok";
  let budsjettKvalitet = "ok";
  let kommersiell = !frivillig;
  let andreKilder = n % 3 === 0 ? "Søkt 10 000 kr hos kommunen. Avklart nei." : "Ingen andre søknader.";

  if (flag === "formalia") {
    aarAktiv = 0;
    etikkStatus = "mangler";
    malKvalitet = "tynt";
    planKvalitet = "tynt";
    samKvalitet = "mangler";
    egenPct = 0;
    kommersiell = true;
    andreKilder = "Ikke oppgitt.";
  } else if (flag === "historikk") {
    malKvalitet = "tynt";
    aarAktiv = 1;
  } else if (flag === "avkorting") {
    budsjettKvalitet = "sekkepost";
    planKvalitet = "tynt";
    egenPct = 2;
  } else if (flag === "ramme") {
    andreKilder = "Også søkt 200 000 kr hos fylket. Svar ikke kommet.";
    egenPct = 5;
  } else if (flag === "avvik") {
    malKvalitet = "ok";
    planKvalitet = "ok";
  } else if (flag === "plantet") {
    planKvalitet = "feil";
    malKvalitet = "tynt";
  }

  const formal = {
    orgform: /Privatperson/.test(sak.org) ? "privatperson" : (sak.form || (frivillig ? "forening" : "AS")),
    orgnr: sak.orgnr,
    frivillig,
    aarAktiv,
    etikk: etikkStatus,
    varsling: etikkStatus,
    innsending: "Simulert innsending i øvelsen. Ikke ID-porten. Ikke Bufdirs portal."
  };
  const innhold = {
    mal: malKvalitet === "ok"
      ? `Øke deltakelse for ${deltakere} barn og unge i ${sak.kommune} gjennom ${sak.aktivitet}.`
      : malKvalitet === "tynt"
        ? "Vi vil gjøre et fint tiltak for ungdom."
        : "Ikke lastet opp.",
    evaluering: malKvalitet === "ok"
      ? `Underveis: oppmøteliste hver uke. Etterpå: kort samtale med ${Math.max(4, Math.round(deltakere / 3))} deltakere og én rapportside.`
      : "Vi evaluerer hvis vi får tid.",
    malgruppe: `Barn og unge i ${sak.kommune}, primært 10–18 år.`,
    antall: deltakere,
    rekruttering: malKvalitet === "mangler"
      ? "Ikke oppgitt."
      : `Via skole, SFO og oppslag i ${sak.kommune}. ${flag === "formalia" ? "Også ansattebarn og kunder." : "Gratis plass. Ingen kontingent."}`,
    plan: planKvalitet === "feil"
      ? `Ukeplan viser aktivitet, men også henvisning til anlegg og «klubbhus/golf» som ikke hører til ${sak.aktivitet}.`
      : planKvalitet === "tynt"
        ? "Vi starter når pengene kommer. Nærmere plan kommer."
        : `${uker} uker. To økter i uken. Ansvarlig: styreleder i ${sak.org}. Sted: lokale i ${sak.kommune}.`,
    ansvar: planKvalitet === "ok" ? `Styreleder + to frivillige vakter.` : "Ikke tydelig.",
    samarbeid: samKvalitet === "mangler"
      ? "Ikke oppgitt."
      : `Muntlig avtale med ${sak.kommune} kulturkontor. Ingen underskrevet avtale i øvelsen.`
  };
  const inntektEgen = Math.round(sak.belop * (egenPct / 100));
  const okonomi = {
    egenkravPct: egenKrav,
    egenPct,
    egenKr: inntektEgen,
    andreKilder,
    kommersiell,
    sekkepost: budsjettKvalitet === "sekkepost",
    revisorOk: (sak.vedlegg || []).some((v) => /revisor/i.test(v.navn) && v.status === "ok") || sak.belop <= 200000
  };

  const etikkTekst = etikkStatus === "ok"
    ? `${sak.org} har skriftlige etiske retningslinjer (øvelse). Voksne som er alene med barn skal være to. Varsling går til styreleder. Uønskede hendelser logges. Dette er fiktivt, ikke et ekte HMS-system.`
    : `Etiske retningslinjer og varslingsrutiner er ikke lastet opp for ${sak.org}.`;
  const malTekst = `Mål: ${innhold.mal}\nEvaluering: ${innhold.evaluering}`;
  const malgTekst = `Målgruppe: ${innhold.malgruppe}\nAntall: ${innhold.antall}\nRekruttering: ${innhold.rekruttering}`;
  const planTekst = `Fremdrift: ${innhold.plan}\nAnsvar: ${innhold.ansvar}`;
  const samTekst = `Samarbeid: ${innhold.samarbeid}`;
  const budLinjer = (sak.budsjett || []).map((b) => `${b.post}: ${b.belop} kr (${b.type})`).join("\n");
  const budTekst = budsjettKvalitet === "sekkepost"
    ? `Søkt ${sak.belop} kr.\n${budLinjer}\nSekkepost: «koordinering og diverse» er ikke splittet.\nEgenfinansiering: ${egenPct} % (${inntektEgen} kr). Krav i øvelsen for denne søkertypen: ${egenKrav} %.\nAndre kilder: ${andreKilder}`
    : `Søkt ${sak.belop} kr. Poster:\n${budLinjer}\nEgenfinansiering: ${egenPct} % (${inntektEgen} kr). Øvelseskrav: ${egenKrav} % for ${kommune ? "kommune/privat" : "frivillig"}.\nAndre kilder: ${andreKilder}\nKommersiell profitt: ${kommersiell ? "risiko — søker ser kommersiell ut" : "søker oppgir at midlene ikke går til drift/profitt"}.`;
  const histTekst = sak.rapportFjor
    ? `${sak.org} viser til aktivitet i ${aarAktiv} år. Fjorårets rapport er merket som inne i øvelsen.`
    : `${sak.org} viser til aktivitet i ${aarAktiv} år. Fjorårets sluttrapport mangler.`;
  const orgTekst = `${sak.org}, org.nr ${sak.orgnr}, ${formal.orgform}, ${sak.kommune}. Frivillig i øvelsestabellen: ${frivillig ? "ja" : "nei"}. ${formal.innsending}`;

  const dokumenter = [
    { id: "org", tittel: "Organisasjon og innsending", type: "formal", status: frivillig ? "ok" : "avvik", tekst: orgTekst },
    { id: "etikk", tittel: "Etikk, trygghet og varsling", type: "formal", status: etikkStatus === "ok" ? "ok" : "mangler", tekst: etikkTekst },
    { id: "historikk", tittel: "Historikk og tidligere aktivitet", type: "formal", status: sak.rapportFjor ? "ok" : "mangler", tekst: histTekst },
    { id: "mal", tittel: "Mål og evaluering", type: "innhold", status: malKvalitet === "ok" ? "ok" : malKvalitet, tekst: malTekst },
    { id: "malgruppe", tittel: "Målgruppe og rekruttering", type: "innhold", status: malKvalitet === "mangler" ? "mangler" : (malKvalitet === "tynt" ? "tynt" : "ok"), tekst: malgTekst },
    { id: "plan", tittel: "Gjennomføringsplan", type: "innhold", status: planKvalitet === "ok" ? "ok" : planKvalitet, tekst: planTekst },
    { id: "samarbeid", tittel: "Samarbeid", type: "innhold", status: samKvalitet === "mangler" ? "mangler" : "ok", tekst: samTekst },
    { id: "budsjett", tittel: "Budsjett, egenfinansiering og andre kilder", type: "okonomi", status: okonomi.sekkepost || egenPct < egenKrav ? "tynt" : "ok", tekst: budTekst }
  ];

  return { formal, innhold, okonomi, dokumenter };
}

function knyttSoknadsdokumentasjon(saker) {
  (saker || []).forEach((s) => {
    if (s.dokumenter && s.dokumenter.length && s.formal) return;
    const pakke = byggSoknadspakke(s);
    s.formal = pakke.formal;
    s.innhold = pakke.innhold;
    s.okonomi = pakke.okonomi;
    s.dokumenter = pakke.dokumenter;
    const ekstraVedlegg = [
      { navn: "Etiske retningslinjer", status: pakke.formal.etikk === "ok" ? "ok" : "mangler" },
      { navn: "Fremdriftsplan", status: pakke.dokumenter.find((d) => d.id === "plan")?.status === "ok" ? "ok" : "mangler" },
      { navn: "Egenfinansiering", status: pakke.okonomi.egenPct >= pakke.okonomi.egenkravPct ? "ok" : "mangler" }
    ];
    s.vedlegg = s.vedlegg || [];
    ekstraVedlegg.forEach((v) => {
      if (!s.vedlegg.some((x) => x.navn === v.navn)) s.vedlegg.push(v);
    });
  });
}

function kravNiva(ok, gul) {
  if (!ok) return "red";
  if (gul) return "yellow";
  return "green";
}

function sjekkSoknadskrav(sak) {
  if (!sak.formal) knyttSoknadsdokumentasjon([sak]);
  const f = sak.formal;
  const o = sak.okonomi;
  const docs = sak.dokumenter || [];
  const dokStatus = (id) => docs.find((d) => d.id === id)?.status || "mangler";
  const items = [
    { id: "orgform", label: "Organisasjonsform", status: kravNiva(!/privatperson/i.test(f.orgform) && f.orgnr, /AS/i.test(f.orgform) && !f.frivillig), text: `${f.orgform}, org.nr ${f.orgnr}. Øvelsestabell, ikke Brønnøysund.` },
    { id: "frivillig", label: "Frivillig / historikk", status: kravNiva(f.frivillig && f.aarAktiv >= 1 && sak.rapportFjor, f.aarAktiv < 2 || !sak.rapportFjor), text: f.frivillig ? `${f.aarAktiv} år i øvelsen. Rapport i fjor: ${sak.rapportFjor ? "ja" : "mangler"}.` : "Ikke frivillig i øvelsestabellen." },
    { id: "etikk", label: "Etikk og trygghet", status: f.etikk === "ok" ? "green" : "red", text: f.etikk === "ok" ? "Etikk og varsling er lastet opp (fiktivt)." : "Etikk/varsling mangler." },
    { id: "portal", label: "Innsending", status: "green", text: f.innsending },
    { id: "mal", label: "Mål og evaluering", status: dokStatus("mal") === "ok" ? "green" : dokStatus("mal") === "tynt" ? "yellow" : "red", text: sak.innhold.mal },
    { id: "malgruppe", label: "Målgruppe og rekruttering", status: dokStatus("malgruppe") === "ok" ? "green" : "yellow", text: `${sak.innhold.antall} deltakere. ${sak.innhold.rekruttering}` },
    { id: "plan", label: "Gjennomføringsplan", status: dokStatus("plan") === "ok" ? "green" : dokStatus("plan") === "feil" ? "red" : "yellow", text: sak.innhold.plan },
    { id: "samarbeid", label: "Samarbeid", status: dokStatus("samarbeid") === "mangler" ? "yellow" : "green", text: sak.innhold.samarbeid },
    { id: "budsjett", label: "Budsjett", status: o.sekkepost ? "yellow" : "green", text: o.sekkepost ? "Sekkepost / lite splittet." : "Poster er spesifisert i øvelsen." },
    { id: "egen", label: "Egenfinansiering", status: o.egenPct >= o.egenkravPct ? "green" : "yellow", text: `${o.egenPct} % oppgitt. Øvelseskrav ${o.egenkravPct} %.` },
    { id: "profitt", label: "Ikke profitt", status: o.kommersiell ? "red" : "green", text: o.kommersiell ? "Kommersiell risiko i øvelsen." : "Søker oppgir ikke profittformål." },
    { id: "revisor", label: "Revisor", status: o.revisorOk ? "green" : "yellow", text: o.revisorOk ? "Kravet i øvelsen er oppfylt eller ikke aktuelt." : "Over beløpsgrense og attest mangler." }
  ];
  return items;
}

function dokUttrekk(sak) {
  return (sak.dokumenter || []).map((d) => `### ${d.tittel} [${d.status}]\n${d.tekst}`).join("\n\n");
}

function kravSjekkKort(sak) {
  return sjekkSoknadskrav(sak).map((c) => `${c.label}: ${c.status} — ${c.text}`).join("\n");
}

let dokVisModus = "struktur";
let dokVisId = "";

function setDokVis(modus, dokId) {
  dokVisModus = modus || dokVisModus;
  dokVisId = dokId || "";
  if (typeof renderCard === "function") renderCard();
}

function dokVisHtml(sak) {
  const escFn = typeof esc === "function" ? esc : (s) => String(s ?? "");
  const docs = sak.dokumenter || [];
  const krav = sjekkSoknadskrav(sak);
  const sjekk = krav.map((c) => {
    const t = c.status === "green" ? "OK" : c.status === "yellow" ? "Se her" : "Stopp";
    return `<div class="check check-${c.status}"><small>${t} · ${escFn(c.label)}</small>${escFn(c.text)}</div>`;
  }).join("");
  const chips = `<div class="chips">
    <button type="button" class="chip ${dokVisModus === "struktur" ? "on" : ""}" onclick="setDokVis('struktur')">Strukturert</button>
    <button type="button" class="chip ${dokVisModus === "tekst" ? "on" : ""}" onclick="setDokVis('tekst')">All tekst</button>
  </div>`;
  if (dokVisModus === "tekst") {
    const tekst = docs.map((d) => `<article class="dok-art"><h4>${escFn(d.tittel)}</h4><p>${escFn(d.tekst).replace(/\n/g, "<br>")}</p></article>`).join("");
    return `${chips}<p class="hint">Syntetisk dokumentasjon. Ikke ekte vedlegg fra Bufdir-portal.</p>${tekst}`;
  }
  const valgt = docs.find((d) => d.id === dokVisId) || docs[0];
  const liste = docs.map((d) => `<button type="button" class="dok-rad ${valgt && valgt.id === d.id ? "on" : ""}" onclick="setDokVis('struktur','${d.id}')">
    <strong>${escFn(d.tittel)}</strong>
    <span class="tag ${d.status === "ok" ? "tag-ok" : d.status === "mangler" || d.status === "feil" || d.status === "avvik" ? "tag-formalia" : "tag-avkorting"}">${escFn(d.status)}</span>
  </button>`).join("");
  return `${chips}
    <p class="hint">Øvelseskrav — syntetiske dokumenter. Velg et dokument for teksten. Ikke ID-porten.</p>
    <div class="dok-split">
      <div class="dok-liste">${liste}</div>
      <div class="dok-art">${valgt ? `<h4>${escFn(valgt.tittel)}</h4><p>${escFn(valgt.tekst).replace(/\n/g, "<br>")}</p>` : ""}</div>
    </div>
    <h4>Kravsjekk (maskinell)</h4>
    ${sjekk}`;
}

function fallbackDokSemantikk(sak) {
  const krav = sjekkSoknadskrav(sak);
  const score = (id, god) => {
    const c = krav.find((x) => x.id === id);
    if (!c) return { score: null, sitat: "ikke oppgitt" };
    if (c.status === "green") return { score: god, sitat: c.text.slice(0, 90) };
    if (c.status === "yellow") return { score: 2, sitat: c.text.slice(0, 90) };
    return { score: 1, sitat: "ikke oppgitt / svakt" };
  };
  const gronn = krav.filter((c) => c.status === "green").length;
  return {
    dokMal: score("mal", 4),
    dokMalg: score("malgruppe", 4),
    dokPlan: score("plan", 3),
    dokSam: score("samarbeid", 3),
    dokOkonomi: score("egen", 3),
    dokEtikk: score("etikk", 4),
    dokSamlet: { score: Math.min(5, Math.max(1, Math.round((gronn / krav.length) * 5))), sitat: `${gronn} av ${krav.length} punkter grønne i maskinsjekk.` }
  };
}

if (typeof SAKER !== "undefined") knyttSoknadsdokumentasjon(SAKER);

if (typeof window !== "undefined") {
  window.SOKNADSKRAV = SOKNADSKRAV;
  window.sakFulltekst = sakFulltekst;
  window.byggSoknadspakke = byggSoknadspakke;
  window.knyttSoknadsdokumentasjon = knyttSoknadsdokumentasjon;
  window.sjekkSoknadskrav = sjekkSoknadskrav;
  window.dokUttrekk = dokUttrekk;
  window.kravSjekkKort = kravSjekkKort;
  window.dokVisHtml = dokVisHtml;
  window.setDokVis = setDokVis;
  window.fallbackDokSemantikk = fallbackDokSemantikk;
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof SAKER !== "undefined") knyttSoknadsdokumentasjon(SAKER);
  });
}
