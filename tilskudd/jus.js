const JUS_PRESETS = {
  saksbehandler: [
    { q: "Hvilken risikoklasse i KI-forordningen treffer denne bruken — intern assistent på tilskudd?", t: "AI Act-risikoklasse" },
    { q: "Hva krever menneske i loopen her, etter kurs, veileder og KI-forordningen art. 14?", t: "Menneske i loopen" },
    { q: "Når trenger vi DPIA, og når ev. FRIA, for denne prototypen versus skarp drift?", t: "DPIA vs FRIA" },
    { q: "Hva gjelder for innsyn og arkiv når KI har skrevet utkast i en sak?", t: "Innsyn og arkiv" },
    { q: "Hva kan KI ikke avgjøre i denne bruken?", t: "Hva KI ikke kan avgjøre" },
    { q: "Hva sier veilederen om medbestemmelse og tillitsvalgte ved innføring av KI?", t: "Tillitsvalgte" },
    { q: "Hva gjør vi med personopplysninger i søknadstekst før teksten går til KI?", t: "Personopplysninger i søknad" }
  ],
  soker: [
    { q: "Kan en maskin selv si ja eller nei til søknaden min?", t: "Kan KI vedta?" },
    { q: "Kan jeg se dokumentene i saken min, også det KI har skrevet?", t: "Innsyn for søker" },
    { q: "Hvem kan søke denne øvelsesordningen?", t: "Hvem kan søke?" },
    { q: "Hva skjer hvis administrasjon er over 15 prosent?", t: "Admin 15 %" },
    { q: "Må jeg ha revisorattest?", t: "Revisor" },
    { q: "Kan jeg lime inn fødselsnummer eller helse i søknadsteksten?", t: "Personopplysninger" },
    { q: "Er dette et ekte vedtak eller juridisk råd?", t: "Er dette råd?" }
  ]
};

let jusModus = "saksbehandler";
let jusFilter = "alle";

function jusEsc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function jusKilder() {
  return typeof JUS_KILDER !== "undefined" ? JUS_KILDER : [];
}

function setJusModus(modus) {
  jusModus = modus === "soker" ? "soker" : "saksbehandler";
  const sb = document.getElementById("jusModeSb");
  const so = document.getElementById("jusModeSok");
  if (sb) sb.classList.toggle("on", jusModus === "saksbehandler");
  if (so) so.classList.toggle("on", jusModus === "soker");
  const hint = document.getElementById("jusModeHint");
  const chatH = document.getElementById("jusChatHint");
  if (jusModus === "soker") {
    if (hint) hint.textContent = "Enkelt språk. Ingen intern score. Ikke vedtak. Du er simulert søker.";
    if (chatH) chatH.textContent = "Forhåndsspørsmål for søker. Svaret skal være forståelig og sitere kilder.";
  } else {
    if (hint) hint.textContent = "Innsyn, arkiv, utredningsplikt og KI-forordningen. Interne score vises ikke til søker.";
    if (chatH) chatH.textContent = "Forhåndsspørsmål for saksbehandler. Svar må vise siterte kilder.";
  }
  renderJusPresets();
}

function renderJusPresets() {
  const box = document.getElementById("jusPresets");
  if (!box) return;
  box.innerHTML = JUS_PRESETS[jusModus].map((p) =>
    `<button type="button" class="chip" onclick="document.getElementById('jusQ').value=${JSON.stringify(p.q)};sendJusSporsmal()">${jusEsc(p.t)}</button>`
  ).join("");
}

function renderJusFilter() {
  const box = document.getElementById("jusFilter");
  if (!box) return;
  const types = ["alle", "lov", "veileder", "kurs", "fiktiv"];
  const labels = { alle: "Alle", lov: "Lov", veileder: "Veileder", kurs: "Kurs", fiktiv: "Fiktiv" };
  box.innerHTML = types.map((t) =>
    `<button type="button" class="chip ${jusFilter === t ? "on" : ""}" onclick="setJusFilter('${t}')">${labels[t]}</button>`
  ).join("");
}

function setJusFilter(t) {
  jusFilter = t;
  renderJusFilter();
  renderJusKilder();
}

function renderJusKilder() {
  const box = document.getElementById("jusKildeListe");
  if (!box) return;
  const list = jusKilder().filter((k) => jusFilter === "alle" || k.type === jusFilter);
  const typeLab = typeof JUS_TYPELABEL !== "undefined" ? JUS_TYPELABEL : {};
  box.innerHTML = list.map((k) => `
    <article class="jus-kilde jus-kilde-${k.type}">
      <p class="jus-kilde-meta"><span class="tag">${jusEsc(typeLab[k.type] || k.type)}</span> <span class="mono">${jusEsc(k.id)}</span></p>
      <h3>${jusEsc(k.tittel)}</h3>
      <p class="hint">${jusEsc(k.kilde)}</p>
      <p>${jusEsc(k.tekst)}</p>
    </article>`).join("");
}

function jusSystemPrompt() {
  const rolle = jusModus === "soker"
    ? "Brukeren er en simulert søker. Skriv enkelt norsk. Ingen interne score, ingen innstilling, ingen rangering. Si tydelig at dette ikke er et vedtak og ikke juridisk råd."
    : "Brukeren er saksbehandler. Trekk inn innsyn, arkiv, utredningsplikt og KI-forordningen når spørsmålet berører det. Ikke fatt vedtak.";
  return `Du er jusassistent i en pedagogisk øvelse. IKKE juridisk rådgivning. IKKE vedtak. Ikke Bufdir.
Svar BARE fra kildene som følger i brukerens melding (id, type, tittel, tekst).
Siter kilde-id i hakeparentes, f.eks. [FVL-17] [AIA-27].
Hvis svaret ikke finnes i kildene: si at det mangler i mappa. Finn ikke på paragrafer.
Merk fiktive øvelsesregler som fiktive. Skill lov, veileder, kurs og fiktiv.
${rolle}
Svar på norsk. Kort og presist. Avslutt med en linje: Siterte kilder: [ID] [ID]`;
}

function jusUserPrompt(sporsmal) {
  const blokk = jusKilder().map((k) =>
    `[${k.id}] type=${k.type}\nTittel: ${k.tittel}\nKilde: ${k.kilde}\n${k.tekst}`
  ).join("\n\n");
  return `Modus: ${jusModus === "soker" ? "simulert søker" : "saksbehandler"}
Spørsmål: ${sporsmal}

## Kilder i mappa
${blokk}`;
}

function hentSiterte(text) {
  const ids = new Set();
  const re = /\[([A-Z0-9-]+)\]/g;
  let m;
  while ((m = re.exec(text))) {
    if (jusKilder().some((k) => k.id === m[1])) ids.add(m[1]);
  }
  return [...ids];
}

function markerSitat(text) {
  return jusEsc(text).replace(/\[([A-Z0-9-]+)\]/g, (all, id) => {
    const ok = jusKilder().some((k) => k.id === id);
    return ok ? `<button type="button" class="jus-cite" onclick="scrollJusKilde('${id}')">${all}</button>` : all;
  });
}

function scrollJusKilde(id) {
  jusFilter = "alle";
  renderJusFilter();
  renderJusKilder();
  const el = [...document.querySelectorAll(".jus-kilde")].find((n) => n.textContent.includes(id));
  if (el) {
    el.classList.add("jus-kilde-on");
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => el.classList.remove("jus-kilde-on"), 1800);
  }
}

const JUS_HINT = [
  { re: /risiko|ai act|forordning|høyrisiko|hoyrisiko|klasse/i, ids: ["AIA-RISIKO", "AIA-14", "DFD-NIVA", "DFD-RISIKO"] },
  { re: /menneske|tilsyn|loopen|hitl|godkjenn/i, ids: ["AIA-14", "KURS-HITL", "GDPR-22", "FVL-17"] },
  { re: /dpia|fria|konsekvens/i, ids: ["GDPR-35", "AIA-27", "DFD-RISIKO"] },
  { re: /innsyn|arkiv|journal|offentleg|offentlighets/i, ids: ["OFFL-3", "ARK-6", "FVL-18", "KURS-PLIKT"] },
  { re: /ikke kan avgjøre|ikke avgjøre|vedta|automatisert|beslutning/i, ids: ["FVL-2", "GDPR-22", "KURS-HITL", "AIA-14"] },
  { re: /tillits|medbestemm|hovedavtal/i, ids: ["DFD-TILLIT"] },
  { re: /personopplys|fødsels|helse|sladd|gdpr/i, ids: ["GDPR-5", "GDPR-9", "OEV-PV", "KURS-LYS"] },
  { re: /søke|soker|frivillig|aksjeselskap/i, ids: ["OEV-SOKER"] },
  { re: /admin|15 ?%/i, ids: ["OEV-ADMIN"] },
  { re: /revisor|200 ?000/i, ids: ["OEV-REV"] },
  { re: /§ ?5|paragraf 5|ramme|prioriter/i, ids: ["OEV-5"] },
  { re: /råd|rådgiv|ekte vedtak/i, ids: ["FVL-2", "KURS-HITL"] }
];

function simulertJusSvar(sporsmal) {
  const q = sporsmal.toLowerCase();
  const hinted = [];
  for (const h of JUS_HINT) {
    if (h.re.test(q)) hinted.push(...h.ids);
  }
  const uniqueHint = [...new Set(hinted)];
  const fraHint = uniqueHint.map((id) => jusKilder().find((k) => k.id === id)).filter(Boolean);
  const treff = jusKilder().filter((k) => {
    const bag = `${k.tittel} ${k.tekst} ${k.id}`.toLowerCase();
    const nøkler = q.split(/[^a-zæøå0-9]+/i).filter((w) => w.length > 3);
    return nøkler.some((w) => bag.includes(w));
  });
  const valgte = (fraHint.length ? fraHint : treff).slice(0, 5);
  if (!valgte.length) {
    return {
      text: "Dette står ikke i mappa. Jeg kan bare svare fra lovutdragene, DFD-veilederen, kurskapittel 5–6 og de fiktive 2026-reglene som ligger synlig. Offisielle interne dokumenter er ikke lastet.\n\nSiterte kilder: (ingen)",
      ids: []
    };
  }
  const linjer = valgte.map((k) => `${k.tittel} [${k.id}]: ${k.tekst}`);
  const pre = jusModus === "soker"
    ? "Dette er øvelse, ikke et vedtak og ikke juridisk råd. Enkelt sagt, ut fra mappa:\n\n"
    : "Simulert svar (ingen API-nøkkel). Bare fra mappa:\n\n";
  const text = `${pre}${linjer.join("\n\n")}\n\nSiterte kilder: ${valgte.map((k) => `[${k.id}]`).join(" ")}`;
  return { text, ids: valgte.map((k) => k.id) };
}

async function sendJusSporsmal(ev) {
  if (ev) ev.preventDefault();
  const q = (document.getElementById("jusQ")?.value || "").trim();
  const out = document.getElementById("jusSvar");
  if (!q || !out) return;
  out.innerHTML = `<div class="note live-run">Slår opp i mappa…</div>`;
  const system = jusSystemPrompt();
  const prompt = jusUserPrompt(q);
  let text = "";
  let live = false;
  let sim = false;
  let err = "";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, system })
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok || !result.text) {
      const e = new Error(result.error || "api_error");
      e.simulation = Boolean(result.simulation);
      throw e;
    }
    text = result.text;
    live = true;
  } catch (e) {
    sim = Boolean(e && e.simulation) || true;
    err = e && e.message ? e.message : "api_error";
    const fb = simulertJusSvar(q);
    text = fb.text;
  }
  const ids = hentSiterte(text);
  const kildeHtml = ids.length
    ? `<ul class="jus-sitater">${ids.map((id) => {
      const k = jusKilder().find((x) => x.id === id);
      return `<li><button type="button" class="jus-cite" onclick="scrollJusKilde('${id}')">[${id}]</button> ${jusEsc(k ? k.tittel : id)}</li>`;
    }).join("")}</ul>`
    : `<p class="hint">Ingen kilde-id ble sitert. Be om et nytt svar, eller sjekk at spørsmålet treffer mappa.</p>`;
  const merke = live
    ? `<div class="note live-ok">Svar fra modell via /api/chat. Ikke juridisk rådgivning. Ikke vedtak.</div>`
    : `<div class="note live-off"><strong>Simulert svar.</strong> API-nøkkel mangler eller kallet feilet (${jusEsc(err)}). Teksten er satt sammen fra mappa, ikke fra en modell.</div>`;
  out.innerHTML = `${merke}
    <div class="think"><p>${markerSitat(text).replace(/\n/g, "<br>")}</p></div>
    <h3>Siterte kilder</h3>
    ${kildeHtml}`;
}

window.setJusModus = setJusModus;
window.setJusFilter = setJusFilter;
window.sendJusSporsmal = sendJusSporsmal;
window.scrollJusKilde = scrollJusKilde;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("jusForm")) return;
  renderJusFilter();
  renderJusKilder();
  setJusModus("saksbehandler");
});
