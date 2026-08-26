/**
 * Øvelseskart over lov og forskrift knyttet til søknader.
 * Ikke offisiell Bufdir-hjemmelsliste. Ikke juridisk råd. Ikke vedtak.
 */

const LOV_ALLTID = ["fvl", "okonomi", "off"];

const LOVVERK_KATALOG = [
  {
    id: "fvl",
    kortnavn: "Forvaltningsloven",
    navn: "Forvaltningsloven",
    rolle: "alltid",
    kort: "Saksbehandling, begrunnelse, likebehandling, partsinnsyn og klage. Gjelder enkeltvedtak — også tilskudd.",
    merknad: "Ikke en tilskuddsforskrift. Forteller hvordan saken skal behandles."
  },
  {
    id: "okonomi",
    kortnavn: "Økonomiregelverket",
    navn: "Bestemmelser om økonomistyring i staten",
    rolle: "alltid",
    kort: "Kapitlet om tilskudd stiller krav til mål, tildelingskriterier, oppfølging og kontroll.",
    merknad: "Styringskrav til statlige virksomheter. Øvelsen er ikke et system i drift."
  },
  {
    id: "off",
    kortnavn: "Offentleglova",
    navn: "Offentleglova",
    rolle: "alltid",
    kort: "Innsyn i tilskuddssaker, med unntak når dokumentet har taushetsbelagte opplysninger.",
    merknad: "Ikke det samme som personvernvurdering."
  },
  {
    id: "utlysning",
    kortnavn: "Utlysning / bevilgning",
    navn: "Vilkår i utlysning eller bevilgning",
    rolle: "ordning",
    kort: "Der vi ikke kjenner en navngitt forskrift, står hjemmel og vilkår i utlysningen. Forvaltningsloven og økonomiregelverket gjelder likevel.",
    merknad: "Ikke finn opp paragraf. Ikke bruk offentlige millioner som øvelsespott."
  },
  {
    id: "inkl",
    kortnavn: "Inkluderingsforskriften",
    navn: "Forskrift om tilskudd til inkludering av barn og unge",
    rolle: "ordning",
    kort: "Aktivitetstyper, egenandel og vilkår for DT-0270. 4.1–4.11 i øvelsen peker hit.",
    merknad: "Lovdata: forskrift 23. november 2021 nr. 3261. Prototype bruker øvelsesregler."
  },
  {
    id: "tros",
    kortnavn: "Trossamfunnsloven",
    navn: "Trossamfunnsloven",
    rolle: "ordning",
    kort: "Hjemmel for statstilskudd til tros- og livssynssamfunn utenom Den norske kirke (DT-0087).",
    merknad: "Dialogordningen DT-0089 er prosjekt, ikke det samme driftstilskuddet."
  },
  {
    id: "ldl",
    kortnavn: "Likestillings- og diskrimineringsloven",
    navn: "Likestillings- og diskrimineringsloven",
    rolle: "mulig",
    kort: "Kan knyttes som tema når tiltaket gjelder diskriminering, kjønn, funksjonsnedsettelse eller hat.",
    merknad: "Kontekst, ikke automatisk tilskuddshjemmel."
  },
  {
    id: "bvl",
    kortnavn: "Barnevernsloven",
    navn: "Barnevernsloven",
    rolle: "mulig",
    kort: "Tema og faglig kontekst for barnevernordningene. Ikke selve tilskuddshjemmelen.",
    merknad: "Vilkår står i utlysningen."
  },
  {
    id: "gdpr",
    kortnavn: "Personvernforordningen",
    navn: "Personvernforordningen",
    rolle: "mulig",
    kort: "Kan knyttes når søknaden har personopplysninger. Personvernmodulen er mønstersøk, ikke hjemmelsvurdering.",
    merknad: "Ikke juridisk råd."
  },
  {
    id: "aiact",
    kortnavn: "KI-forordningen",
    navn: "KI-forordningen",
    rolle: "mulig",
    kort: "Kan knyttes til behandlingen i prototypen (beslutningsstøtte), ikke til søkerens tiltak.",
    merknad: "Ingen samsvarserklæring."
  },
  {
    id: "nis2",
    kortnavn: "NIS 2 / digitalsikkerhet",
    navn: "Digitalsikkerhetsloven og NIS 2-tilnærming",
    rolle: "mulig",
    kort: "Kan knyttes til hvordan vi behandler saken digitalt. Prototypen er ikke samfunnsviktig tjeneste.",
    merknad: "Ikke varslingsplikt her."
  }
];

const ORDNING_LOV = {
  "inkludering-barn-unge": { gjelder: ["inkl"], mulig: [] },
  "tros-livssyn": { gjelder: ["tros"], mulig: [] },
  "dialog-tros-livssyn": { gjelder: ["utlysning"], mulig: ["tros"] },
  "barnevernfaglig-videreutdanning": { gjelder: ["utlysning"], mulig: ["bvl"] },
  "utvikling-samhandling-barnevern": { gjelder: ["utlysning"], mulig: ["bvl"] },
  "organisasjoner-barnevern": { gjelder: ["utlysning"], mulig: ["bvl"] },
  "tiltak-likestilling-funksjonsnedsettelse": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "ferie-fritid-funksjonsnedsettelse": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "funksjonshemmedes-organisasjoner": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "universell-utforming": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "kjonns-seksualitetsmangfold": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "familie-likestilling": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "tiltak-mot-rasisme": { gjelder: ["utlysning"], mulig: ["ldl"] },
  "tiltak-mot-vold": { gjelder: ["utlysning"], mulig: [] },
  "grunnstotte-internasjonalt": { gjelder: ["utlysning"], mulig: [] },
  "grunnstotte-nasjonalt": { gjelder: ["utlysning"], mulig: [] }
};

function finnLov(id) {
  return LOVVERK_KATALOG.find((l) => l.id === id) || null;
}

function lovKortnavn(id) {
  return finnLov(id)?.kortnavn || id;
}

function knyttOrdningerLov() {
  if (typeof ORDNINGER === "undefined") return;
  ORDNINGER.forEach((o) => {
    const extra = ORDNING_LOV[o.id] || { gjelder: ["utlysning"], mulig: [] };
    o.lovIds = LOV_ALLTID.concat(extra.gjelder.filter((id) => !LOV_ALLTID.includes(id)));
    o.lovMuligIds = extra.mulig.slice();
  });
}

function unikLov(liste) {
  const sett = new Set();
  return liste.filter((id) => {
    if (!id || sett.has(id)) return false;
    sett.add(id);
    return true;
  });
}

function harInkluderingAktivitet(sak) {
  return /^4\.\d+/.test(String(sak?.aktivitet || ""));
}

function sakLovverk(sak) {
  const o = typeof sakOrdning === "function" ? sakOrdning(sak) : {};
  const extra = ORDNING_LOV[o.id || sak?.ordningId] || { gjelder: ["utlysning"], mulig: [] };
  const gjelder = unikLov(LOV_ALLTID.concat(o.lovIds || extra.gjelder));
  const mulig = unikLov((o.lovMuligIds || extra.mulig).concat(["aiact", "nis2"]));
  const pv = typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : null;
  if (pv && pv.niva && pv.niva !== "ok") mulig.push("gdpr");
  if (sak?.flag === "avvik" || sak?.flag === "avkorting") mulig.push("okonomi");
  if (sak?.flag === "plantet") mulig.push("fvl");
  const inklId = typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge";
  if (harInkluderingAktivitet(sak) && (sak?.ordningId || o.id) !== inklId) mulig.push("inkl");
  const muligRen = unikLov(mulig).filter((id) => !gjelder.includes(id));
  return {
    gjelder: gjelder.map(finnLov).filter(Boolean),
    mulig: muligRen.map(finnLov).filter(Boolean)
  };
}

function sakLovMerker(sak, maks) {
  const sett = sakLovverk(sak);
  const ids = sett.gjelder.map((l) => l.kortnavn).concat(sett.mulig.slice(0, 1).map((l) => l.kortnavn));
  return ids.slice(0, maks || 3);
}

function sakHarMuligFeilBoks(sak) {
  const inklId = typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge";
  const oid = sak?.ordningId;
  if (sak?.flag === "plantet") return { ja: true, grunn: "Plantet øvelse. Sjekk likebehandling og om KI henter feil regel." };
  if (sak?.flag === "formalia" && (oid === inklId || harInkluderingAktivitet(sak))) {
    return { ja: true, grunn: "Søker ser ut til å falle utenfor inkluderingsvilkår (formalia)." };
  }
  if (harInkluderingAktivitet(sak) && oid && oid !== inklId) {
    return { ja: true, grunn: "Aktivitet 4.1–4.11, men saken ligger på en annen Tilskudd.no-boks." };
  }
  if (oid === "dialog-tros-livssyn" && harInkluderingAktivitet(sak)) {
    return { ja: true, grunn: "Dialogordning, men teksten ligner inkluderingsaktivitet." };
  }
  return { ja: false, grunn: "" };
}

function tellFordelingMotLovverk(saker) {
  const liste = saker || (typeof SAKER !== "undefined" ? SAKER : []);
  const perOrdning = {};
  const signaler = [];
  liste.forEach((s) => {
    const o = typeof sakOrdning === "function" ? sakOrdning(s) : { id: s.ordningId, kortnavn: s.ordningId };
    const key = o.id || "ukjent";
    if (!perOrdning[key]) perOrdning[key] = { ordning: o, antall: 0, sokt: 0 };
    perOrdning[key].antall += 1;
    perOrdning[key].sokt += Number(s.belop) || 0;
    const feil = sakHarMuligFeilBoks(s);
    if (feil.ja) signaler.push({ id: s.id, org: s.org, ordning: o.kortnavn || o.navn, grunn: feil.grunn });
  });
  return {
    antall: liste.length,
    perOrdning: Object.values(perOrdning).sort((a, b) => b.antall - a.antall),
    signaler
  };
}

function lovUttrekkLinjer(saker) {
  return (saker || []).map((s) => {
    const o = typeof sakOrdningTekst === "function" ? sakOrdningTekst(s) : s.ordningId;
    const lov = sakLovverk(s);
    const g = lov.gjelder.map((l) => l.id).join(",");
    const m = lov.mulig.map((l) => l.id).join(",");
    const snutt = String(s.soknad || "").replace(/\s+/g, " ").slice(0, 140);
    return `${s.id} | ${s.org} | ${o} | ${s.flag} | søkt ${s.belop} | gjelder:${g} | mulig:${m} | ${snutt}`;
  }).join("\n");
}

const SYS_LOV_FORDELING = `Du er forvaltningsrådgiver i en pedagogisk tilskuddsprototype.
Evaluer FORDELING av saker mot øvelseskartet over lov og forskrift.
Siter T-nummer. Skriv kort på norsk, i hele setninger. Maks 8 setninger.
Pek på: skjev bunke, mulig feil boks, likebehandling, og hva saksbehandler bør åpne først.
Ikke fatt vedtak. Ikke omfordel potten. Ikke juridisk råd.
Si «ikke i uttrekket» hvis noe mangler. Fiktive saker. Ikke Bufdir.`;

function fordelingFallback(telling) {
  const top = telling.perOrdning.slice(0, 3).map((r) => `${r.ordning.kortnavn || r.ordning.navn} (${r.antall})`).join(", ");
  const sig = telling.signaler.slice(0, 4).map((s) => `${s.id} ${s.grunn}`).join(" ");
  return `Maskinell lesning: ${telling.antall} saker. Flest på ${top || "ingen ordning"}. ${sig || "Ingen automatiske signal om feil boks."} Dette er ikke modell og ikke vedtak.`;
}

async function evaluerFordelingMotLovverk(omfang) {
  const saker = omfang === "frank" && typeof frankSaker === "function"
    ? frankSaker()
    : (typeof SAKER !== "undefined" ? SAKER : []);
  const telling = tellFordelingMotLovverk(saker);
  const prompt = `Omfang: ${omfang === "frank" ? "Franks tildelte bunke" : "hele øvelsesporteføljen"}.\nOpptelling: ${telling.perOrdning.map((r) => `${r.ordning.kortnavn || r.ordning.id}:${r.antall}`).join("; ")}.\nSignaler: ${telling.signaler.map((s) => `${s.id} ${s.grunn}`).join(" | ") || "ingen"}.\nUttrekk:\n${lovUttrekkLinjer(saker)}\nSkriv en kort evaluering av fordelingen mot regelverket.`;
  try {
    const text = typeof callModelAPI === "function"
      ? await callModelAPI(prompt, SYS_LOV_FORDELING)
      : await (async () => {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, system: SYS_LOV_FORDELING })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.text) throw new Error(data.error || "api_error");
        return data.text;
      })();
    return { live: true, text, telling };
  } catch (_e) {
    return { live: false, text: fordelingFallback(telling), telling };
  }
}

function lovListeHtml(poster, escFn) {
  const esc = escFn || ((s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])));
  if (!poster.length) return "<p class='hint'>Ingen i denne listen.</p>";
  return `<ul class="lov-liste">${poster.map((l) => `<li><strong>${esc(l.navn)}</strong> — ${esc(l.kort)} <span class="hint">${esc(l.merknad)}</span></li>`).join("")}</ul>`;
}

function sakLovHtml(sak) {
  if (typeof sakLovverk !== "function") return "";
  const sett = sakLovverk(sak);
  const escFn = typeof esc === "function" ? esc : (s) => String(s ?? "");
  return `<div class="lov-blokk">
    <h3>Regelverk knyttet til denne søknaden</h3>
    <p class="hint">Øvelseskobling. Ikke offisiell hjemmelsliste. Ikke juridisk råd.</p>
    <p class="hint"><strong>Gjelder i øvelsen</strong></p>
    ${lovListeHtml(sett.gjelder, escFn)}
    <p class="hint"><strong>Kan knyttes</strong></p>
    ${lovListeHtml(sett.mulig, escFn)}
    <p class="hint"><a href="/tilskudd/velkommen">Evaluer Franks fordeling</a> · <a href="/tilskudd/analyse">Hele porteføljen</a></p>
  </div>`;
}

function merkerHtml(sak, escFn) {
  const merker = sakLovMerker(sak, 3);
  return merker.map((t) => `<span class="lov-merke">${escFn(t)}</span>`).join("");
}

function tellingHtml(telling, escFn, krFn) {
  const rader = telling.perOrdning.map((r) => `<tr>
    <td>${escFn(r.ordning.kortnavn || r.ordning.navn || r.ordning.id)}</td>
    <td class="mono">${r.antall}</td>
    <td class="mono">${krFn(r.sokt)}</td>
  </tr>`).join("");
  const sig = telling.signaler.length
    ? `<ul class="lov-liste">${telling.signaler.map((s) => `<li><a href="/tilskudd/behandle#${escFn(s.id)}">${escFn(s.id)}</a> ${escFn(s.org)} — ${escFn(s.grunn)}</li>`).join("")}</ul>`
    : "<p class='hint'>Ingen automatiske signal om feil boks.</p>";
  return `<div class="tabell-wrap"><table class="pv-tabell"><thead><tr><th>Ordning</th><th>Saker</th><th>Søkt</th></tr></thead><tbody>${rader}</tbody></table></div>
    <h3>Mulig feil boks (maskinelt)</h3>
    ${sig}`;
}

function renderLovFordeling(rotId, omfang) {
  const rot = document.getElementById(rotId);
  if (!rot) return;
  const saker = omfang === "frank" && typeof frankSaker === "function"
    ? frankSaker()
    : (typeof SAKER !== "undefined" ? SAKER : []);
  const telling = tellFordelingMotLovverk(saker);
  const escFn = typeof esc === "function" ? esc : (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const krFn = typeof kr === "function" ? kr : (n) => `${n} kr`;
  rot.innerHTML = `
    <section class="panel lov-eval">
      <h2>Fordeling mot regelverk</h2>
      <p class="hint">Maskinell opptelling først. KI kan deretter gi et kort synspunkt. Ikke vedtak. Ikke omfordeling av pott.</p>
      ${tellingHtml(telling, escFn, krFn)}
      <div class="btn-row" style="margin-top:0.8rem">
        <button class="btn btn-primary" type="button" data-lov-eval="${omfang}">Be KI evaluere fordelingen</button>
      </div>
      <div id="${rotId}Svar" class="lov-eval-svar"></div>
    </section>`;
  rot.querySelector("[data-lov-eval]")?.addEventListener("click", () => kjorKiFordeling(omfang, `${rotId}Svar`));
}

async function kjorKiFordeling(omfang, svarId) {
  const box = document.getElementById(svarId);
  if (!box) return;
  box.innerHTML = "<p class='hint'>Leser bunken mot regelverket…</p>";
  const res = await evaluerFordelingMotLovverk(omfang);
  const escFn = typeof esc === "function" ? esc : (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  box.innerHTML = `<div class="note ${res.live ? "live-ok" : "live-off"}">${res.live ? "Live KI. Forslag — ikke vedtak." : "<strong>Ikke modell.</strong> Ferdig øvelsestekst."}</div><p>${escFn(res.text)}</p>`;
}

knyttOrdningerLov();

const TILSKUDD_LOVVERK = LOVVERK_KATALOG.filter((l) => ["fvl", "okonomi", "inkl", "tros", "off", "gdpr"].includes(l.id));

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    knyttOrdningerLov();
    if (document.getElementById("portefoljeLovRot")) renderLovFordeling("portefoljeLovRot", "portefolje");
  });
  window.LOVVERK_KATALOG = LOVVERK_KATALOG;
  window.TILSKUDD_LOVVERK = TILSKUDD_LOVVERK;
  window.finnLov = finnLov;
  window.lovKortnavn = lovKortnavn;
  window.sakLovverk = sakLovverk;
  window.sakLovMerker = sakLovMerker;
  window.sakLovHtml = sakLovHtml;
  window.tellFordelingMotLovverk = tellFordelingMotLovverk;
  window.evaluerFordelingMotLovverk = evaluerFordelingMotLovverk;
  window.renderLovFordeling = renderLovFordeling;
  window.kjorKiFordeling = kjorKiFordeling;
  window.knyttOrdningerLov = knyttOrdningerLov;
}
