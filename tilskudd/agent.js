/**
 * Svevende KI-assistent for den fiktive ansatte. Ikke vedtak. Ikke Bufdir.
 */
const SYS_AGENT = `Du er en svevende KI-assistent i en pedagogisk tilskuddsprototype.
Du heter bare «Assistenten». Du jobber sammen med saksbehandleren Frank.
Du fatter aldri vedtak. Du gir synspunkt og bistand, merket som forslag.
Svar kort på norsk, i hele setninger.
Hvis spørsmålet gjelder Franks saker: bruk KUN bunken du får. Siter saksnummer.
Hvis noe ikke står i bunken: skriv «ikke i Franks bunke».
Regelverk: du kan peke på forvaltningsloven, økonomiregelverket for staten, forskrift om inkludering av barn og unge, trossamfunnsloven, offentleglova og personvernforordningen — på overordnet nivå. Si at det ikke er juridisk råd.
Fiktive saker. Ikke late som du er Bufdir eller Tilskudd.no.`;

function agentEsc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function agentFallback(spm) {
  const q = String(spm || "").toLowerCase();
  const saker = typeof frankSaker === "function" ? frankSaker() : [];
  const startet = saker.filter((s) => typeof frankSakStatus === "function" && frankSakStatus(s.id) === "startet");
  if (/startet|begynt|i arbeid|hvilke saker/.test(q)) {
    if (!startet.length) return "Jeg finner ingen startede saker i Franks bunke ennå.";
    return `Du har startet ${startet.map((s) => `${s.id} ${s.org}`).join(", ")}. Resten i bunken er ikke startet. Dette er øvelse — ikke vedtak.`;
  }
  if (/lov|forskrift|regel|hjemmel|økonomi/.test(q)) {
    const lov = (typeof TILSKUDD_LOVVERK !== "undefined" ? TILSKUDD_LOVVERK : [])
      .map((l) => `${l.navn}: ${l.kort}`)
      .join(" ");
    return `Ja. Tilskudd er knyttet til flere regelsett. ${lov} Dette er ikke juridisk råd. Live-svar manglet, så dette er en ferdig øvelsestekst.`;
  }
  const treff = saker.find((s) => q.includes(s.id.toLowerCase()) || q.includes(String(s.org).toLowerCase()));
  if (treff) {
    return `Synspunkt på ${treff.id} ${treff.org}: ${treff.jobb} Søknaden sier: «${treff.soknad}». Jeg foreslår at du åpner sakskortet og sjekker tall og personvern selv. Ikke vedtak.`;
  }
  if (/bistand|synspunkt|hjelp|vurder/.test(q)) {
    return "Jeg kan se på en sak hvis du oppgir saksnummer, for eksempel T-2629. Jeg forbereder. Du bestemmer.";
  }
  return "Jeg er assistenten din i øvelsen. Spør om sakene du har startet, om bistand til en sak, eller om regelverk for tilskudd. Jeg fatter ikke vedtak.";
}

function agentSystemTillegg() {
  const navn = (typeof ANSATT !== "undefined" && ANSATT.navn) || "Frank";
  const digest = typeof frankDigest === "function" ? frankDigest() : "";
  const lov = (typeof TILSKUDD_LOVVERK !== "undefined" ? TILSKUDD_LOVVERK : [])
    .map((l) => `- ${l.navn}: ${l.kort}`)
    .join("\n");
  return `${SYS_AGENT}\nAnsatt: ${navn}.\nFranks bunke:\n${digest || "(tom)"}\nRegelverk i øvelsen:\n${lov}`;
}

async function agentSpør(spm) {
  const prompt = `Frank spør: ${spm}\nSvar konkret. Hvis det gjelder saker, siter T-nummer.`;
  if (typeof callModelAPI === "function") {
    return callModelAPI(prompt, agentSystemTillegg());
  }
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system: agentSystemTillegg() })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.text) {
    const err = new Error(data.error || "api_error");
    err.simulation = true;
    throw err;
  }
  return data.text;
}

function byggAgentUi() {
  if (document.getElementById("kiAgent")) return;
  const wrap = document.createElement("div");
  wrap.id = "kiAgent";
  wrap.innerHTML = `
    <div id="kiAgentPanel" class="ki-agent-panel" hidden>
      <header>
        <strong>Assistenten</strong>
        <span>For Frank · forslag, ikke vedtak</span>
        <button type="button" class="ki-agent-x" data-agent-lukk aria-label="Lukk">×</button>
      </header>
      <div id="kiAgentLogg" class="ki-agent-logg"></div>
      <div class="chips ki-agent-chips">
        <button type="button" class="chip" data-agent-q="Hvilke saker har jeg startet?">Startede saker</button>
        <button type="button" class="chip" data-agent-q="Gi meg synspunkt på T-2629">Bistand T-2629</button>
        <button type="button" class="chip" data-agent-q="Kjenner vi regelverk knyttet til tilskudd?">Regelverk</button>
      </div>
      <form id="kiAgentForm">
        <label class="field">Spør assistenten
          <input id="kiAgentQ" type="text" placeholder="F.eks. Hva bør jeg se etter i T-3001?" autocomplete="off" />
        </label>
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
    <button type="button" id="kiAgentFab" class="ki-agent-fab" aria-expanded="false" aria-controls="kiAgentPanel">
      <span class="ki-agent-face" aria-hidden="true">
        <i></i><i></i>
      </span>
      <span class="sr-only">Åpne KI-assistent</span>
    </button>`;
  document.body.appendChild(wrap);
  const logg = document.getElementById("kiAgentLogg");
  const panel = document.getElementById("kiAgentPanel");
  const fab = document.getElementById("kiAgentFab");
  const navn = (typeof ANSATT !== "undefined" && ANSATT.fornavn) || "Frank";
  const startet = typeof frankSaker === "function"
    ? frankSaker().filter((s) => frankSakStatus(s.id) === "startet").length
    : 0;
  logg.innerHTML = `<div class="ki-agent-msg ki-agent-bot"><p>Hei ${agentEsc(navn)}. Jeg er den svevende assistenten. Du har ${startet} saker merket som startet. Spør om bunken, be om synspunkt, eller spør om regelverk. Jeg fatter ikke vedtak.</p></div>`;

  function aapne(ja) {
    panel.hidden = !ja;
    fab.setAttribute("aria-expanded", ja ? "true" : "false");
  }
  fab.addEventListener("click", () => aapne(panel.hidden));
  wrap.querySelector("[data-agent-lukk]").addEventListener("click", () => aapne(false));
  wrap.querySelectorAll("[data-agent-q]").forEach((b) => {
    b.addEventListener("click", () => {
      document.getElementById("kiAgentQ").value = b.getAttribute("data-agent-q");
      document.getElementById("kiAgentForm").requestSubmit();
    });
  });
  document.getElementById("kiAgentForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const q = (document.getElementById("kiAgentQ").value || "").trim();
    if (!q) return;
    document.getElementById("kiAgentQ").value = "";
    logg.insertAdjacentHTML("beforeend", `<div class="ki-agent-msg ki-agent-du"><p>${agentEsc(q)}</p></div>`);
    const vent = document.createElement("div");
    vent.className = "ki-agent-msg ki-agent-bot";
    vent.innerHTML = "<p>Leser bunken din…</p>";
    logg.appendChild(vent);
    logg.scrollTop = logg.scrollHeight;
    try {
      const text = await agentSpør(q);
      vent.innerHTML = `<p>${agentEsc(text)}</p><p class="hint">Live KI. Forslag — ikke vedtak.</p>`;
    } catch (_e) {
      vent.innerHTML = `<p>${agentEsc(agentFallback(q))}</p><p class="hint">Ikke modell. Ferdig øvelsestekst.</p>`;
    }
    logg.scrollTop = logg.scrollHeight;
  });
}

document.addEventListener("DOMContentLoaded", byggAgentUi);
