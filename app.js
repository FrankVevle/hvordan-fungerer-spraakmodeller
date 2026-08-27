let typingTimer = null;
let sectorTypingTimer = null;
let activePromptTabIdx = 0;
let selectedDataScen = 'bydelA';
let liveSsbFetched = false;
let ssbLiveDataText = "";
let currentScenIdx = 0;
let currentMode = 'simple';
let currentChapterIdx = 0;

const SITE_PAGES = [
  { file: "index.html", title: "Oversikt", part: "Start" },
  { file: "kapittel-1.html", title: "Kapittel 1 · Tokens og ordkart", part: "Del 1" },
  { file: "kapittel-2.html", title: "Kapittel 2 · Neste ord og temperatur", part: "Del 1" },
  { file: "kapittel-3.html", title: "Kapittel 3 · Ikke-determinisme", part: "Del 1" },
  { file: "teknisk.html", title: "Teknisk dypdykk", part: "Del 1", tech: true },
  { file: "kapittel-4.html", title: "Kapittel 4 · Prompt Lab", part: "Del 2" },
  { file: "kapittel-5.html", title: "Kapittel 5 · Trygg bruk", part: "Del 2" },
  { file: "kapittel-6.html", title: "Kapittel 6 · Trafikklys og plikter", part: "Del 2" },
  { file: "kapittel-7.html", title: "Kapittel 7 · Kildeforankret KI", part: "Del 3" },
  { file: "kapittel-8.html", title: "Kapittel 8 · Åpne data-øvelse", part: "Del 3" },
  { file: "kapittel-9.html", title: "Kapittel 9 · Tilskuddsløpet", part: "Del 4" },
  { file: "kapittel-10.html", title: "Kapittel 10 · Personlig agent", part: "Del 4" },
  { file: "kapittel-11.html", title: "Kapittel 11 · Saksflyt og hallusinering", part: "Del 5" },
  { file: "kapittel-12.html", title: "Kapittel 12 · Forslag til gjennomføring", part: "Del 5" }
];

function currentPageFile() {
  let name = (window.location.pathname.split("/").pop() || "index.html").split("?")[0];
  if (!name || name === "presentasjon") return "index.html";
  if (!name.includes(".")) name += ".html";
  return name;
}

function visibleSitePages() {
  return SITE_PAGES.filter((p) => !p.tech || currentMode === "tech");
}

/** Personlig manus når du går gjennom foilene. Ikke kursinnhold. */
const FOIL_MANUS = [
  {
    file: "index.html",
    del: "Start",
    tittel: "Oversikt",
    si: "Velkommen. Dette er et kursopplegg, ikke et Bufdir-verktøy. Forskrift og saker er oppdiktet. Vi går fra tokens til et helt tilskuddsløp — og slutter med hvorfor KI ikke får finne på hjemmel.",
    faglig: "Fem deler: hvordan modellen virker, trygg bruk, kildeforankring, tilskudd som case, og et forslag til innføring. Målet er at folk skjønner hva en språkmodell gjør, hva den ikke gjør, og at vedtaket alltid er menneskets.",
    teknisk: "Statiske HTML-sider med felles app.js. Forrige/Neste nederst. Teknisk dypdykk vises bare når du slår på «Teknisk dypdykk». Tilskuddsprototypen er en egen flate under /tilskudd/."
  },
  {
    file: "kapittel-1.html",
    del: "Del 1",
    tittel: "1 · Tokens og ordkart",
    si: "Modellen leser ikke hele ord. Den kutter teksten i tokens og slår hvert token opp som tall. Derfor «forstår» den ikke — den regner.",
    faglig: "La dem skrive en setning. Vis at norsk ofte blir flere tokens enn engelsk. Klikk en token: id-nummer og vektor. Ordkartet: katt og hund ligger nær, katt og traktor langt unna. Det er mening som avstand, ikke et leksikon.",
    teknisk: "Pedagogisk oppdeling, ikke ekte BPE. Vektoren med åtte tall er illustrasjon. Ekte embedding har hundrevis av dimensjoner. Samme token lander alltid på samme sted i kartet."
  },
  {
    file: "kapittel-2.html",
    del: "Del 1",
    tittel: "2 · Neste ord og temperatur",
    si: "Alt en språkmodell egentlig gjør, er å spørre: gitt ordene så langt, hva er mest sannsynlig neste ord? Den tipper. Den tenker ikke.",
    faglig: "Tre setninger: «katten klatret opp i…» er åpent, «hovedstaden i Norge» er smalt, «for å løse dette» er faglig. Dra temperaturen. Lav = forutsigbart og mer «faktisk». Høy = kreativt, og oftere feil. Det er derfor samme oppgave kan bli ulike utkast.",
    teknisk: "Softmax med temperatur T. Lav T skjerper fordelingen mot topp-tokenet. Høy T jevner ut. Dette er sampling, ikke en resonneringsmotor. Bro til foil 3 og til tre kjøringer av samme sak i kapittel 9."
  },
  {
    file: "kapittel-3.html",
    del: "Del 1",
    tittel: "3 · Ikke-determinisme",
    si: "2 + 2 er alltid 4. Samme prompt er ikke alltid samme svar. Det er ikke mannen i midten — det er slik modellen er bygget.",
    faglig: "Tre kort. Søk: den slår ikke opp, den kan hallusinere på ulike måter. Omskriving: «kan innvilges» kan bli «skal innvilges». Oppgaver: ulike stier. Rådet er det samme: mennesket leser før noe brukes.",
    teknisk: "Stokastisk trekning fra en fordeling når T > 0. Selv ved T = 0 kan GPU-reduksjoner gi mikroskopisk variasjon. Derfor kan du ikke «kjøre en gang og stole på det» i saksbehandling."
  },
  {
    file: "teknisk.html",
    del: "Del 1",
    tittel: "Teknisk dypdykk",
    si: "Bare hvis rommet tåler formler. En moderne LLM er en autoregressiv dekoder. Ingen sannhetsmotor, ingen separat tenkemotor.",
    faglig: "Syv steg, én løkke: tokeniser, embed, N blokker, norm, unembed, softmax, sample. Attention er «hva hører sammen i konteksten». Avslutt på punkt 10: arkitekturen gir deg ikke grounding. Derfor RAG og sjekk senere.",
    teknisk: "Vis softmax-kalkulatoren og KV-cache/VRAM. Prefill er compute, decode er minne. GQA, RoPE og SwiGLU er hvorfor 70B-modeller i det hele tatt kan serveres. Alignment dreier sannsynlighet — den sletter ikke evnen til å finne på en paragraf."
  },
  {
    file: "kapittel-4.html",
    del: "Del 2",
    tittel: "4 · Prompt Lab",
    si: "Instruksen din er jobben. En svak prompt pynter. En sterk prompt holder meningen og rammen.",
    faglig: "Fiktivt, tungt Bufdir-vedtak. Kjør «skriv om til klarspråk». Sammenlign svak og sterk instruks. Tre faner: klarspråk, idémyldring, kodepartner. Poenget: mennesket styrer oppgaven, modellen fyller tekst.",
    teknisk: "Kallet går til /api/chat (gpt-4o-mini, T = 0.3). Uten OPENAI_API_KEY får du simulert svar merket som øvelse. Originalteksten er oppdiktet — si det høyt."
  },
  {
    file: "kapittel-5.html",
    del: "Del 2",
    tittel: "5 · Trygg bruk",
    si: "Fire regler. Ikke pynt — dette er ansvaret når teksten forlater chatten.",
    faglig: "1 Mennesket i loopen: du eier sluttresultatet. 2 Skjerming: aldri fødselsnummer eller taushetsbelagt i åpne verktøy. 3 Klarspråk: forenkle, ikke endre rettigheter. 4 Åpenhet: si ifra når KI har gjort vesentlig arbeid. Klikk kortene.",
    teknisk: "Ingen modell her. Dette er policy-foilen som alt senere henger på — særlig personvernmodulen og «ikke vedtak»-sjekken i prototypen."
  },
  {
    file: "kapittel-6.html",
    del: "Del 2",
    tittel: "6 · Trafikklys og plikter",
    si: "Hva kan du lime inn? Grønt, gult, rødt. Offentlig sektor har tre plikter til: innsyn, forsvarlig saksbehandling og arkiv.",
    faglig: "Rødt er fødselsnummer, helse, navngitte barn. Gult må sladdes. Grønt er åpne eller fiktive tekster. Kortene: offentlighetsloven, fvl § 17 utredningsplikt, arkiv. KI-forordningen skiller beslutningsstøtte fra automatisert vedtak.",
    teknisk: "Trafikklyset er UI. I tilskuddsprototypen er rødt mønstersøk som stopper kallet til modellen — det er ikke et vedtak om at behandlingen er lovlig."
  },
  {
    file: "kapittel-7.html",
    del: "Del 3",
    tittel: "7 · Kildeforankret KI",
    si: "Når kilder er lastet opp, kan modellen sitere dem. Det er ikke det samme som at den har rett.",
    faglig: "NotebookLM er et RAG-eksempel, ikke et anbefalt saksverktøy. Vilkår fra leverandør er ikke virksomhetens godkjenning. Sitater reduserer påhitt. Oppsummering, podcast og FAQ er ikke journalført vedtak.",
    teknisk: "RAG: hent utdrag, putt dem i prompten, be modellen holde seg til dem. Det fjerner ikke feil lik sak eller feil hjemmel. Plantet felle i kapittel 11 ligger i mappa nettopp for å vise det."
  },
  {
    file: "kapittel-8.html",
    del: "Del 3",
    tittel: "8 · Åpne data-øvelse",
    si: "Dette er et fiktivt scenario. Det er ikke Bufdirs kunnskapsgrunnlag, og dere skal ikke styre etter det.",
    faglig: "Vis hvordan åpne data (SSB, KOSTRA) pluss intern fagdata kan se ut som beslutningsstøtte. Syntesen er øvelse. Tall kan være sanne og konklusjonen likevel utenfor mandatet. Du eier skjønnet.",
    teknisk: "Valgfri SSB-API og /api/chat. Uten nøkkel: merket øvelsestekst. Poenget er grensen, ikke dashbordet."
  },
  {
    file: "kapittel-9.html",
    del: "Del 4",
    tittel: "9 · Hele tilskuddsløpet",
    si: "Nå er dere saksbehandlere. KI forbereder formalia og utkast. Dere prioriterer mot ramme. Ingenting er vedtak.",
    faglig: "Skille prosjekt/skjønn og drift/kriterier. Sjekklisten har fire deler: KI kan forberede 1, 3 og utkast til 4. Del 2 og rangering er deres. Vis at minst ett forslag er plantet feil. Tre kjøringer av samme sak — broen fra temperatur-foilen.",
    teknisk: "Simulatoren lever i denne siden. Den fulle flaten er /tilskudd/. Journal og brevutkast ligger i nettleseren, ikke i et arkivsystem."
  },
  {
    file: "tilskudd/",
    del: "Del 4",
    tittel: "Tilskuddsprototype",
    si: "Egen webløsning uten kapittelmeny. Du er Frank. KI har gjort grovarbeidet. Jobben din er å si ja, nei eller «endre dette».",
    faglig: "Tall sjekkes først (frivillig, admin 15 %, revisor, rapport). Så leser KI teksten. Du godkjenner. På T-2622 er poenget at hjemmelen er feil — da skal du stoppe. Ordningskatalogen speiler navn fra Tilskudd.no, ikke live saker.",
    teknisk: "Personvernmodul før modellkall. /api/graph kjører LangGraph: kilder → utkast → sjekk. Uten nøkkel: merkede øvelsesutkast og samme validator. Søkerportal og register er simulert."
  },
  {
    file: "kapittel-10.html",
    del: "Del 4",
    tittel: "10 · Personlig agent",
    si: "Dette er din pult. Agenten kjenner stilen din. Én sak har et plantet feilgrep. Si nei.",
    faglig: "Samme dag som kapittel 9. E-post, saker, budsjett, utkast. Agenten viser historikk og foreslår beløp — den fatter ikke innstillingen. Åpne T-2622: feil paragraf, feil lik sak. Det er øvelsen.",
    teknisk: "Klientlogikk i app.js. Utkast kan komme fra grafen. Ingenting sendes. Ikke en autonom agent — en assistent med lesetilgang."
  },
  {
    file: "kapittel-11.html",
    del: "Del 5",
    tittel: "11 · Saksflyt og hallusinering",
    si: "Vi ber ikke modellen om å være snill. Vi tvinger rekkefølgen, og sjekken er ikke KI.",
    faglig: "Spill av Brobyggerne (T-2622). Fem roller: koordinator, kildehenter, forslag, sjekk, du. Fellen (§ 14 / Golfklubben) ligger i mappa og skal ikke nå utkastet. Hvis sjekken sier nei, går det i loop — maks to forsøk.",
    teknisk: "LangGraph i lib/grant-graph.js. retrieveFolder merker feller. validateDraft er kode: «ikke vedtak», forbudt §, feil lik sak, manglende bruk av hentet FVL-17. Bare generate-noden kaller OpenAI."
  },
  {
    file: "kapittel-12.html",
    del: "Del 5",
    tittel: "12 · Forslag til gjennomføring",
    si: "Hvis vi gjennomfører — ikke besluttet. Teknikken dere så, er bare fase 3. Resten er behov, forankring, juss og en stoppknapp.",
    faglig: "Fem faser: behov, forankring (tillitsvalgte), juss/DPIA, pilot med menneske i loopen, drift eller stopp. Roller: linjeier, tillitsvalgt, personvern, superbruker, saksbehandler. Vedtaket er menneskets.",
    teknisk: "Prototypen viser bare fase 3. Skarp drift med personopplysninger krever mer enn denne øvelsen: avtale, logg som holder, oppdatert kunnskapsgrunnlag. Skaler ned hvis gevinsten uteblir."
  }
];

function foilManusHidden() {
  try { return localStorage.getItem("foilManusHidden") === "1"; } catch (_e) { return false; }
}

function foilManusHtml(note, opts = {}) {
  const href = note.file === "tilskudd/" ? "tilskudd/" : note.file;
  const open = opts.list
    ? `<a class="foil-manus-open" href="${href}">Åpne foilen</a>`
    : `<a class="foil-manus-open" href="om.html">Alle blokker</a>`;
  const hide = opts.list ? "" : `<button type="button" class="foil-manus-hide" onclick="toggleFoilManus()">Skjul på foilene</button>`;
  return `<div class="foil-manus-head">
      <p>Manus · ${note.del} · bare for deg som viser</p>
      <div class="foil-manus-actions">${open}${hide}</div>
    </div>
    <h3>${note.tittel}</h3>
    <p class="foil-manus-si">${note.si}</p>
    <p><strong>Faglig.</strong> ${note.faglig}</p>
    <p><strong>Teknisk.</strong> ${note.teknisk}</p>`;
}

function toggleFoilManus() {
  const next = !foilManusHidden();
  try { localStorage.setItem("foilManusHidden", next ? "1" : "0"); } catch (_e) { /* ignore */ }
  document.querySelectorAll(".foil-manus[data-single]").forEach((el) => { el.hidden = next; });
  const show = document.getElementById("foilManusShow");
  if (show) show.hidden = !next;
}

function renderFoilManus() {
  const file = currentPageFile();
  if (file === "om.html") {
    const list = document.getElementById("manusListe");
    if (!list) return;
    list.innerHTML = FOIL_MANUS.map((note) => `<article class="foil-manus foil-manus-card" id="manus-${note.file.replace(/[/.]/g, "-")}">${foilManusHtml(note, { list: true })}</article>`).join("");
    return;
  }
  const note = FOIL_MANUS.find((n) => n.file === file);
  const main = document.querySelector("main");
  if (!note || !main) return;
  const aside = document.createElement("aside");
  aside.className = "foil-manus";
  aside.dataset.single = "1";
  aside.id = "foilManus";
  aside.hidden = foilManusHidden();
  aside.innerHTML = foilManusHtml(note);
  main.insertBefore(aside, main.firstElementChild);

  if (!document.getElementById("foilManusShow")) {
    const show = document.createElement("button");
    show.id = "foilManusShow";
    show.type = "button";
    show.className = "foil-manus-show";
    show.textContent = "Vis manus";
    show.hidden = !foilManusHidden();
    show.addEventListener("click", toggleFoilManus);
    document.body.appendChild(show);
  }
}

window.toggleFoilManus = toggleFoilManus;

async function callModelAPI(promptText, systemPromptText = "") {
  let delay = 800;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          system: systemPromptText,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const err = new Error(result.error || "api_error");
        err.simulation = Boolean(result.simulation);
        throw err;
      }
      if (result.text) return result.text;
      throw new Error("empty");
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
  throw new Error("Kunne ikke hente svar fra OpenAI.");
}

function toggleMode(mode, opts = {}) {
  currentMode = mode;
  const btnSimple = document.getElementById('btnSimple');
  const btnTech = document.getElementById('btnTech');
  const heroBadge = document.getElementById('heroBadge');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');

  if (mode === 'simple') {
    if (btnSimple) btnSimple.className = "px-3.5 py-1.5 rounded-lg bg-white text-purple-700 shadow-sm transition-all font-bold";
    if (btnTech) btnTech.className = "px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all";

    if (heroBadge) heroBadge.textContent = "🟢 Pedagogisk & Visuell Modus";
    if (heroTitle) heroTitle.textContent = "Slik forstår og skaper datamaskinen språk";
    if (heroDesc) heroDesc.textContent = "En språkmodell er ikke et tenkende vesen, men en superrask mønstergjenkjenner. Utforsk hvordan teksten deles opp, hvordan den tipper neste ord, og hvordan vi bruker den trygt i hverdagen.";
  } else {
    if (btnSimple) btnSimple.className = "px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all";
    if (btnTech) btnTech.className = "px-3.5 py-1.5 rounded-lg bg-purple-900 text-white shadow-sm transition-all font-bold";

    if (heroBadge) heroBadge.textContent = "🔬 Teknisk Dypdykk: Formler & Algoritmer";
    if (heroTitle) heroTitle.textContent = "Fra Tette Vektorer til Self-Attention og Softmax";
    if (heroDesc) heroDesc.textContent = "Utdypende teknisk oversikt over Transformer-dekodere, matrisemultiplikasjon, causal masking, KV-cache minneberegning og temperaturskalert Softmax-entropi.";
  }

  try { localStorage.setItem("guideMode", mode); } catch (_e) { /* ignore */ }

  if (!opts.keepChapter) {
    const file = currentPageFile();
    if (mode === "tech" && file !== "teknisk.html") {
      window.location.href = "teknisk.html";
      return;
    }
    if (mode === "simple" && file === "teknisk.html") {
      window.location.href = "kapittel-3.html";
      return;
    }
  }
  syncChapterNav();
}

function getChapterSections() {
  return [...document.querySelectorAll(".chapter-section")];
}

function showChapter(idx) {
  const pages = visibleSitePages();
  const target = pages[Math.max(0, Math.min(idx, pages.length - 1))];
  if (target && target.file !== currentPageFile()) window.location.href = target.file;
}

function syncChapterNav() {
  const pages = visibleSitePages();
  const file = currentPageFile();
  const i = Math.max(0, pages.findIndex((p) => p.file === file));
  currentChapterIdx = i;
  const page = pages[i] || SITE_PAGES[0];
  const partEl = document.getElementById("chapterPartLabel");
  const stepEl = document.getElementById("chapterStepLabel");
  if (partEl) partEl.textContent = page.part;
  if (stepEl) stepEl.textContent = `${page.title} · ${i + 1} av ${pages.length}`;
  const prev = document.getElementById("btnPrevChapter");
  const next = document.getElementById("btnNextChapter");
  if (prev) prev.disabled = i <= 0;
  if (next) next.disabled = i >= pages.length - 1;
}

function applyHash(opts = {}) {
  const raw = (window.location.hash || "").replace(/^#/, "");
  const kap = raw.match(/^kapittel-(\d+)$/);
  if (kap && currentPageFile() === "index.html") {
    window.location.replace(`kapittel-${kap[1]}.html`);
    return;
  }
  if (raw.startsWith("MS-") && currentPageFile() === "kapittel-10.html") {
    openAgentSak(raw);
    return;
  }
  if (raw.startsWith("T-") && currentPageFile() === "kapittel-9.html") {
    if (!grantInboxLoaded) loadGrantInbox();
    openGrantCase(raw);
  }
  if (raw.startsWith("T-") && currentPageFile() === "cockpit.html") {
    selectCockpitCase(raw);
  }
}

function stepChapter(delta) {
  const pages = visibleSitePages();
  const i = pages.findIndex((p) => p.file === currentPageFile());
  const target = pages[i + delta];
  if (target) window.location.href = target.file;
}

function closeCardModal(event) {
  if (event && event.target && event.target.id !== 'cardModal') return;
  const modal = document.getElementById('cardModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function expandCard(element) {
  const modal = document.getElementById('cardModal');
  const modalBody = document.getElementById('cardModalBody');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = '';

  const isInteractiveBox = element.id === 'sec8Datalab' || element.querySelector('#aggregatedDataList') || element.querySelector('#geminiOutput') || element.querySelector('#nonDetRunsOutput');

  if (isInteractiveBox) {
    const clone = element.cloneNode(true);
    clone.removeAttribute('onclick');
    clone.classList.remove('cursor-pointer', 'hover:border-sky-400', 'hover:border-amber-400', 'hover:border-fuchsia-400');
    clone.classList.add('p-2', 'space-y-6', 'text-slate-900');

    const headings = clone.querySelectorAll('h4, h5, label, span, p');
    headings.forEach(el => {
      el.classList.add('text-base', 'sm:text-lg');
    });

    const ssbBtn = clone.querySelector('button[onclick*="fetchLiveSSBData"]');
    if (ssbBtn) ssbBtn.onclick = () => fetchLiveSSBData();

    const aiBtn = clone.querySelector('button[onclick*="runCrossSectorAnalysis"]');
    if (aiBtn) aiBtn.onclick = () => runCrossSectorAnalysis();

    const nonDetBtn = clone.querySelector('button[onclick*="runNonDeterminismDemo"]');
    if (nonDetBtn) nonDetBtn.onclick = () => runNonDeterminismDemo();

    const modalContainer = document.createElement('div');
    modalContainer.className = "space-y-4";

    const titleBadge = document.createElement('div');
    titleBadge.className = "bg-sky-100 text-sky-900 p-3 rounded-xl font-bold text-lg mb-2 flex items-center justify-between";
    titleBadge.innerHTML = `<span>🔍 Forstørret Interaktiv Live-Simulering</span><span class="text-xs bg-sky-600 text-white px-2 py-1 rounded">Aktiv Modus</span>`;

    modalContainer.appendChild(titleBadge);
    modalContainer.appendChild(clone);
    modalBody.appendChild(modalContainer);
  } else {
    const modalDetails = element.querySelector('.modal-details');

    if (modalDetails) {
      const content = modalDetails.cloneNode(true);
      content.classList.remove('hidden');
      modalBody.appendChild(content);
    } else {
      const clone = element.cloneNode(true);
      clone.removeAttribute('onclick');

      const hints = clone.querySelectorAll('span[class*="Klikk"]');
      hints.forEach(h => h.remove());

      const titleEl = clone.querySelector('h3, h4, h5, strong, .font-bold');
      const descEl = clone.querySelector('p');

      const container = document.createElement('div');
      container.className = "space-y-4";

      if (titleEl) {
        const mainHeading = document.createElement('h3');
        mainHeading.className = "text-2xl font-extrabold text-slate-900 border-b border-slate-200 pb-3";
        mainHeading.textContent = titleEl.textContent;
        container.appendChild(mainHeading);
      }

      if (descEl) {
        const pointBox = document.createElement('div');
        pointBox.className = "bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3";

        const label = document.createElement('strong');
        label.className = "text-slate-900 font-bold text-lg block";
        label.textContent = "📌 Punktvis detaljoversikt:";

        const list = document.createElement('ul');
        list.className = "list-disc pl-6 space-y-3 text-slate-800 text-lg leading-relaxed font-medium";

        const sentences = descEl.textContent.split(/(?<=[.!?])\s+/);
        sentences.forEach(s => {
          if (s.trim().length > 0) {
            const li = document.createElement('li');
            li.textContent = s.trim();
            list.appendChild(li);
          }
        });

        pointBox.appendChild(label);
        pointBox.appendChild(list);
        container.appendChild(pointBox);
      }

      modalBody.appendChild(container);
    }
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([modalBody]);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCardModal();
  const tag = e.target?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
  if (e.key === 'ArrowRight') stepChapter(1);
  if (e.key === 'ArrowLeft') stepChapter(-1);
});

window.addEventListener('hashchange', () => {
  applyHash();
});

let tokenVizSelected = 0;

function hash32(str) {
  let h = 2166136261;
  const t = String(str).toLowerCase();
  for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619);
  return h >>> 0;
}

function tokenNumericId(tok) {
  return 100 + (hash32(tok) % 49000);
}

function tokenEmbedding(tok, dims = 8) {
  let s = hash32(tok);
  const vec = [];
  for (let i = 0; i < dims; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    vec.push(((s % 2000) / 1000) - 1);
  }
  return vec;
}

function tokenMapPoint(tok) {
  const known = {
    katt: [72, 48], katten: [78, 52], hund: [92, 44], hunden: [98, 50],
    tre: [248, 150], treet: [256, 142], traktor: [268, 168],
    konge: [56, 160], dronning: [68, 168], mann: [48, 128], kvinne: [60, 136],
    språk: [140, 40], modeller: [158, 48], tekst: [170, 70], tokens: [186, 62],
    tall: [200, 88], vektor: [210, 96]
  };
  const key = String(tok).toLowerCase().replace(/[^a-zæøå]/gi, "");
  if (known[key]) return known[key];
  const v = tokenEmbedding(tok);
  return [24 + (v[0] + 1) * 136, 20 + (v[1] + 1) * 80];
}

function renderTokenVectorViz(visibleTokens) {
  const panel = document.getElementById("tokenVectorPanel");
  const idLine = document.getElementById("tokenIdLine");
  const vecLine = document.getElementById("tokenVectorLine");
  const bars = document.getElementById("tokenVectorBars");
  const map = document.getElementById("tokenVectorMap");
  if (!panel || !idLine || !vecLine || !bars || !map) return;

  if (!visibleTokens.length) {
    panel.classList.add("hidden");
    return;
  }
  panel.classList.remove("hidden");
  if (tokenVizSelected >= visibleTokens.length) tokenVizSelected = 0;

  const tok = visibleTokens[tokenVizSelected];
  const id = tokenNumericId(tok);
  const vec = tokenEmbedding(tok);
  idLine.textContent = `"${tok}"  →  id ${id}`;
  vecLine.textContent = `[ ${vec.map((n) => n.toFixed(2)).join(",  ")} ]`;

  bars.innerHTML = vec.map((n) => {
    const h = Math.max(8, Math.abs(n) * 56);
    const cls = n >= 0 ? "bg-violet-400" : "bg-amber-400";
    return `<div class="flex flex-col justify-end items-center h-full">
      <div class="w-full rounded-t ${cls}" style="height:${h}px" title="${n.toFixed(2)}"></div>
    </div>`;
  }).join("");

  const dots = visibleTokens.map((t, i) => {
    const [x, y] = tokenMapPoint(t);
    const on = i === tokenVizSelected;
    return `<g class="cursor-pointer" onclick="selectTokenViz(${i})">
      <circle cx="${x}" cy="${y}" r="${on ? 8 : 5}" fill="${on ? "#c084fc" : "#64748b"}" stroke="${on ? "#f5d0fe" : "#334155"}" stroke-width="2"/>
      <text x="${x + 10}" y="${y + 4}" fill="${on ? "#f5d0fe" : "#94a3b8"}" font-size="10" font-family="ui-monospace, monospace">${t.replace(/</g, "")}</text>
    </g>`;
  }).join("");
  map.innerHTML = `
    <rect width="320" height="200" fill="#020617"/>
    <line x1="16" y1="184" x2="304" y2="184" stroke="#334155"/>
    <line x1="16" y1="16" x2="16" y2="184" stroke="#334155"/>
    <text x="300" y="196" fill="#64748b" font-size="9" text-anchor="end">dim 1</text>
    <text x="8" y="14" fill="#64748b" font-size="9">dim 2</text>
    ${dots}
  `;
}

function selectTokenViz(idx) {
  tokenVizSelected = idx;
  renderTokens();
}

function renderTokens() {
  const inputEl = document.getElementById('tokenInput');
  const container = document.getElementById('tokenContainer');
  const countEl = document.getElementById('tokenCount');

  if (!inputEl || !container || !countEl) return;

  const text = inputEl.value;
  container.innerHTML = '';

  if (!text.trim()) {
    countEl.textContent = "0 tokens";
    renderTokenVectorViz([]);
    return;
  }

  const tokens = text.match(/[\wæøåÆØÅ]+|[^\s\wæøåÆØÅ]|\s+/g) || [];
  const visibleTokens = tokens.filter(t => t.trim().length > 0);
  countEl.textContent = `${visibleTokens.length} tokens`;

  const colors = [
    'bg-purple-900 text-purple-200 border-purple-700',
    'bg-indigo-900 text-indigo-200 border-indigo-700',
    'bg-blue-900 text-blue-200 border-blue-700',
    'bg-emerald-900 text-emerald-200 border-emerald-700',
    'bg-amber-900 text-amber-200 border-amber-700'
  ];

  visibleTokens.forEach((tok, idx) => {
    const badge = document.createElement('button');
    badge.type = "button";
    const on = idx === tokenVizSelected;
    badge.className = `px-2 py-1 rounded-lg border text-xs font-mono shadow-sm ${colors[idx % colors.length]} ${on ? "ring-2 ring-white" : ""}`;
    badge.textContent = tok;
    badge.onclick = () => selectTokenViz(idx);
    container.appendChild(badge);
  });

  renderTokenVectorViz(visibleTokens);
}

function calculateSoftmaxMath() {
  const z1 = parseFloat(document.getElementById('logit1')?.value || 0);
  const z2 = parseFloat(document.getElementById('logit2')?.value || 0);
  const z3 = parseFloat(document.getElementById('logit3')?.value || 0);
  const z4 = parseFloat(document.getElementById('logit4')?.value || 0);

  const logits = [
    { word: "treet", z: z1 },
    { word: "sofaen", z: z2 },
    { word: "gardinen", z: z3 },
    { word: "bilen", z: z4 }
  ];

  const sliderVal = parseFloat(document.getElementById('tempSlider')?.value || 0.2);
  const temp = Math.max(sliderVal, 0.05);

  const expVals = logits.map(item => Math.exp(item.z / temp));
  const sumExp = expVals.reduce((a, b) => a + b, 0);

  const probs = logits.map((item, i) => ({
    word: item.word,
    z: item.z,
    p: expVals[i] / sumExp
  })).sort((a, b) => b.p - a.p);

  let entropy = 0;
  probs.forEach(item => {
    if (item.p > 0) entropy -= item.p * Math.log2(item.p);
  });

  const display = document.getElementById('softmaxOutputDisplay');
  if (!display) return;

  let html = `<div class="flex justify-between items-center text-purple-300 font-bold border-b border-slate-800 pb-2 mb-2">`;
  html += `<span>Softmax ($T = ${temp.toFixed(2)}$):</span>`;
  html += `<span class="bg-purple-900/60 px-2 py-0.5 rounded text-[11px]">Entropi $H(X) = ${entropy.toFixed(3)}$ bits</span>`;
  html += `</div><div class="space-y-1.5">`;

  probs.forEach((item, idx) => {
    const pct = (item.p * 100).toFixed(1);
    html += `
      <div class="flex justify-between items-center">
        <span class="text-slate-300">${idx + 1}. "${item.word}" (z = ${item.z})</span>
        <div class="flex items-center gap-2">
          <div class="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div class="bg-purple-500 h-full rounded-full" style="width: ${pct}%"></div>
          </div>
          <span class="w-12 text-right font-bold text-purple-400">${pct}%</span>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  display.innerHTML = html;

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([display]);
  }
}

function calculateKVCache() {
  const model = document.getElementById('kvModelSelect')?.value || '70B';
  const seqLen = parseInt(document.getElementById('kvSeqLenSelect')?.value || 32768);
  const precBytes = parseInt(document.getElementById('kvPrecisionSelect')?.value || 1);

  let layers = 80, kvHeads = 8, headDim = 128, paramBytes = 70;
  if (model === '8B') { layers = 32; kvHeads = 8; headDim = 128; paramBytes = 8; }
  if (model === '405B') { layers = 126; kvHeads = 16; headDim = 128; paramBytes = 405; }

  const kvBytesPerToken = 2 * layers * kvHeads * headDim * precBytes;
  const totalKVBytes = kvBytesPerToken * seqLen;
  const totalKV_GB = (totalKVBytes / (1024 * 1024 * 1024)).toFixed(2);
  const modelWeight_GB = (paramBytes * (precBytes === 1 ? 1 : 2)).toFixed(1);

  const display = document.getElementById('kvCacheDisplay');
  if (!display) return;

  display.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <span class="text-slate-400 block text-[10px]">Model VRAM Vektvekt:</span>
        <span class="text-emerald-400 font-bold text-sm">~${modelWeight_GB} GB VRAM</span>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-purple-900/60">
        <span class="text-purple-300 block text-[10px]">KV-Cache VRAM Fotavtrykk (Batch 1):</span>
        <span class="text-purple-400 font-bold text-sm">${totalKV_GB} GB VRAM</span>
      </div>
    </div>
    <div class="text-[11px] text-slate-400 mt-2">
      Total VRAM: <strong>~${(parseFloat(modelWeight_GB) + parseFloat(totalKV_GB)).toFixed(1)} GB</strong> for ${seqLen.toLocaleString()} tokens.
    </div>
  `;
}

const scenarios = [
  {
    prompt: "Katten klatret opp i...",
    words: [
      { word: "treet", baseProb: 72 },
      { word: "sofaen", baseProb: 18 },
      { word: "gardinen", baseProb: 8 },
      { word: "månen", baseProb: 2 }
    ]
  },
  {
    prompt: "Hovedstaden i Norge er...",
    words: [
      { word: "Oslo", baseProb: 94 },
      { word: "Bergen", baseProb: 4 },
      { word: "Trondheim", baseProb: 1.5 },
      { word: "Stockholm", baseProb: 0.5 }
    ]
  },
  {
    prompt: "For å løse dette må vi...",
    words: [
      { word: "analysere", baseProb: 45 },
      { word: "samarbeide", baseProb: 32 },
      { word: "evaluere", baseProb: 18 },
      { word: "gjenstarte", baseProb: 5 }
    ]
  }
];

function setScenario(idx) {
  currentScenIdx = idx;
  const btns = document.querySelectorAll('.scen-btn');
  btns.forEach((btn, i) => {
    if (i === idx) {
      btn.className = "scen-btn px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm";
    } else {
      btn.className = "scen-btn px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200";
    }
  });
  const slider = document.getElementById('tempSlider');
  updateTemp(slider ? slider.value : 0.2);
}

function updateTemp(val) {
  const tempValEl = document.getElementById('tempVal');
  const temp = parseFloat(val);

  if (tempValEl) {
    tempValEl.textContent = temp.toFixed(2);
  }

  renderProbabilities(temp);
  calculateSoftmaxMath();
}

function renderProbabilities(temp) {
  const probBars = document.getElementById('probBars');
  if (!probBars) return;

  const scen = scenarios[currentScenIdx];
  probBars.innerHTML = `<div class="text-xs text-slate-400 font-mono mb-2">Kontekst: "${scen.prompt}"</div>`;

  let totalWeight = 0;
  const adjusted = scen.words.map(w => {
    let weight = Math.pow(w.baseProb, 1 / (temp + 0.05));
    totalWeight += weight;
    return { word: w.word, weight };
  });

  adjusted.forEach(item => {
    const pct = Math.round((item.weight / totalWeight) * 100);
    const barHtml = `
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-mono">
          <span class="font-bold text-emerald-400">"${item.word}"</span>
          <span>${pct}%</span>
        </div>
        <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
    probBars.innerHTML += barHtml;
  });
}

function runNonDeterminismDemo() {
  const container = document.getElementById('nonDetRunsOutput');
  if (!container) return;

  const run1 = [
    "Søknaden om støtte er innvilget etter forvaltningsloven § 14. Utbetalingen starter ved neste månedsskifte.",
    "Du har fått innvilget stønad ihht. § 14. Pengene overføres f.o.m. neste utbetalingsperiode.",
    "Vedtaket er positivt: Du oppfyller kravene i § 14, og stønaden vil utbetales fra og med neste termin."
  ];

  container.innerHTML = `
    <div class="bg-slate-950 p-3 rounded-xl border border-fuchsia-900/60 space-y-1">
      <span class="text-fuchsia-400 font-bold text-[11px] block">Kjøring #1 (Svar-variant A):</span>
      <p class="text-slate-200 text-[11px] leading-relaxed">"${run1[0]}"</p>
    </div>
    <div class="bg-slate-950 p-3 rounded-xl border border-fuchsia-900/60 space-y-1">
      <span class="text-fuchsia-400 font-bold text-[11px] block">Kjøring #2 (Svar-variant B):</span>
      <p class="text-slate-200 text-[11px] leading-relaxed">"${run1[1]}"</p>
    </div>
    <div class="bg-slate-950 p-3 rounded-xl border border-fuchsia-900/60 space-y-1">
      <span class="text-fuchsia-400 font-bold text-[11px] block">Kjøring #3 (Svar-variant C):</span>
      <p class="text-slate-200 text-[11px] leading-relaxed">"${run1[2]}"</p>
    </div>
  `;
}

const KLARSRAK_FALLBACK = `Dere har fått delvis ja på tilskuddssøknaden.

Hvem og hva
• Mottaker: Fjordheim frivilligsentral
• Ordning: Tilskudd til inkludering av barn og unge (aktivitet 4.1)
• Periode: 1. januar–31. desember 2026

Hvor mye
• Dere søkte om 1 240 000 kroner.
• Dere får 780 000 kroner.
• Dere får ikke fullt beløp fordi prosjektledelse (80 %), generell administrasjon og noe utstyr ikke er godt nok knyttet til aktivitet for barna, eller ikke er godkjent kostnad.

Hva pengene kan brukes til
• Ferieleir, gruppetilbud etter skoletid og nødvendige utgifter slik at barn i målgruppen kan være med.
• Ikke vanlig drift av organisasjonen, ikke gamle lån, og ikke store innkjøp utover det som står i det godkjente budsjettet.

Når kommer pengene
• 70 % innen 30 dager etter at dere har fått dette brevet.
• 30 % når underveisrapporten er godkjent, senest 15. september 2026.

Hva dere må gjøre
• Si fra med en gang hvis planen eller budsjettet endrer seg vesentlig.
• Pengene dere ikke bruker, skal betales tilbake.
• Hvis pengene brukes feil, kan vi kutte beløpet eller kreve dem tilbake.
• Rapport og revidert regnskap: i søknadsportalen innen 1. april 2027.

Vil dere klage?
• Tre uker fra dere fikk brevet.
• Send klagen til Bufdir.
• En klage stopper ikke utbetalingen, med mindre vi bestemmer det.`;

function runKlarsprakDemo() {
  const source = document.getElementById('byrakratiTekst')?.textContent?.trim() || '';
  const prompt = `Du er klarspråkrådgiver hos Bufdir. Skriv om tilskuddsvedtaket under til klarspråk for tilskuddsmottakeren (en frivillig organisasjon).

Krav:
- Behold meningen, beløp, datoer, frister og at søknaden er delvis innvilget
- Korte setninger, aktive verb og dere-form
- Bruk overskrifter og kulepunkter
- Forklar fagord med vanlige ord
- Ikke finn på nye vilkår eller beløp

Tekst:
${source}`;
  runGeminiSimulation(prompt, KLARSRAK_FALLBACK, {
    promptPreview: "Skriv om Bufdir-tilskuddsvedtaket til klarspråk (behold meningen).",
  });
}

const promptData = [
  {
    weak: "Skriv om dette tilskuddsvedtaket så folk skjønner det.",
    weakResult: "Vedtaket er nå omskrevet: Dere har fått delvis innvilget tilskudd i henhold til forskriften. Se vedlagt dokument for detaljer.",
    strong: "Du er klarspråkrådgiver hos Bufdir. Skriv om tilskuddsvedtaket til klarspråk for mottakeren, med korte avsnitt og punktliste. Behold beløp og frister.",
    strongResult: KLARSRAK_FALLBACK
  },
  {
    weak: "Gi meg ideer til et møte om digitalisering.",
    weakResult: "1. Snakk om AI. 2. Diskuter skyløsninger. 3. Bruk Miro-tavle.",
    strong: "Du er en fasilitator for innovasjon. Gi meg 3 konkrete øvelser for en 45-minutters workshop om trygg bruk av AI.",
    strongResult: "Simulert eksempel:\n\nØvelse 1: 'Finn hallusinasjonen' (15 min)\n• Finn feil i tre AI-genererte saksnotater.\n\nØvelse 2: 'Trafikklyssortering' (15 min)\n• Sorter saksdata i Grønt, Gult og Rødt lys."
  },
  {
    weak: "Skriv kode for å hente ssb data.",
    weakResult: "import requests\nr = requests.get('https://data.ssb.no/api/v0/no/table/07459')\nprint(r.json())",
    strong: "Skriv et Python-skript som sender POST-spørring mot SSBs åpne API (Tabell 07459) med try-except og feilhåndtering.",
    strongResult: "import requests\n\ndef fetch_ssb_population():\n    url = 'https://data.ssb.no/api/v0/no/table/07459'\n    try:\n        res = requests.post(url, json={...}, timeout=10)\n        return res.json()\n    except Exception as e:\n        print(e)"
  }
];

function setPromptTab(idx) {
  activePromptTabIdx = idx;
  const btns = document.querySelectorAll('.prompt-tab-btn');
  btns.forEach((btn, i) => {
    if (i === idx) {
      btn.className = "prompt-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white shadow-sm";
    } else {
      btn.className = "prompt-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200";
    }
  });

  const d = promptData[idx];
  const comp = document.getElementById('promptComparison');
  if (!comp) return;

  comp.innerHTML = `
    <div onclick="expandCard(this)" class="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3 flex flex-col justify-between cursor-pointer hover:border-rose-400 transition-all shadow-sm">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
          <span>❌ Svak Prompt</span>
        </div>
        <p class="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-rose-100">"${d.weak}"</p>
      </div>
      <button onclick="event.stopPropagation(); runGeminiSimulation('${escapeQuotes(d.weak)}', '${escapeQuotes(d.weakResult)}')" class="w-full mt-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm">
        <span>⚡ Kjør svak prompt</span>
      </button>
      <div class="hidden modal-details space-y-2">
        <strong class="text-rose-900 font-bold block text-xl">❌ Kjennetegn på en Svak Prompt:</strong>
        <ul class="list-disc pl-5 space-y-2 text-slate-800 text-base">
          <li>Mangler rolle og kontekst.</li>
          <li>Gir generelle svar uten tilpasset formatering.</li>
        </ul>
      </div>
    </div>

    <div onclick="expandCard(this)" class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3 flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-sm">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          <span>✅ Sterk Prompt</span>
        </div>
        <p class="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-emerald-100">"${d.strong}"</p>
      </div>
      <button onclick="event.stopPropagation(); runGeminiSimulation('${escapeQuotes(d.strong)}', '${escapeQuotes(d.strongResult)}')" class="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm">
        <span>⚡ Kjør sterk prompt</span>
      </button>
      <div class="hidden modal-details space-y-2">
        <strong class="text-emerald-900 font-bold block text-xl">✅ Kjennetegn på en Sterk Prompt:</strong>
        <ul class="list-disc pl-5 space-y-2 text-slate-800 text-base">
          <li>Inneholder Rolle & Kontekst.</li>
          <li>Spesifiserer målgruppe og ønsket format.</li>
        </ul>
      </div>
    </div>
  `;
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

async function runGeminiSimulation(promptText, resultText, opts = {}) {
  if (typingTimer) clearInterval(typingTimer);

  const promptEls = document.querySelectorAll('#geminiActivePrompt');
  const outputEls = document.querySelectorAll('#geminiOutput');
  const statusEls = document.querySelectorAll('#geminiStatus');
  const tokenStatsEls = document.querySelectorAll('#geminiTokenStats');

  promptEls.forEach(el => el.textContent = `"${opts.promptPreview || promptText}"`);
  outputEls.forEach(el => el.textContent = "");
  statusEls.forEach(el => el.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Genererer svar...`);

  let textToShow = resultText;
  let usedLive = false;
  try {
    const sysPrompt = "Du er en pedagogisk og profesjonell KI-assistent. Svar på norsk med klar struktur.";
    const realResponse = await callModelAPI(promptText, sysPrompt);
    if (realResponse) {
      textToShow = realResponse;
      usedLive = true;
    }
    statusEls.forEach((el) => {
      el.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Svar fra OpenAI`;
    });
  } catch (_err) {
    statusEls.forEach((el) => {
      el.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Simulert eksempel (API utilgjengelig)`;
    });
  }

  let charIdx = 0;
  const totalChars = textToShow.length;

  typingTimer = setInterval(() => {
    if (charIdx < totalChars) {
      const char = textToShow.charAt(charIdx);
      outputEls.forEach(el => el.textContent += char);
      charIdx++;
      const approxTokens = Math.ceil(charIdx / 4);
      tokenStatsEls.forEach(el => el.textContent = `${approxTokens} tokens generert`);
    } else {
      clearInterval(typingTimer);
      statusEls.forEach((el) => {
        el.innerHTML = usedLive
          ? `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Svar fra OpenAI`
          : `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Simulert eksempel (API utilgjengelig)`;
      });
    }
  }, 15);
}

const trafficContent = {
  green: {
    title: "🟢 Grønt Lys: Fritt fram",
    bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
    points: [
      "Offentlig tilgjengelig informasjon og lovverk.",
      "Generelle faglige spørsmål og oppslagsord.",
      "Anonym språkvask, koding og formatering.",
      "Idémyldring, ukesplaner og læring."
    ]
  },
  yellow: {
    title: "🟡 Gult Lys: Anonymiser eller bruk virksomhetens verktøy",
    bg: "bg-amber-50 border-amber-300 text-amber-900",
    points: [
      "Interne notater, referater og arbeidsdokumenter.",
      "Må anonymiseres (fjern navn, saksnr, steder) før innliming.",
      "Bruk kun virksomhetens godkjente, lukkede KI-løsning."
    ]
  },
  red: {
    title: "🔴 Rødt Lys: STRENGT FORBUDT i åpne verktøy",
    bg: "bg-rose-50 border-rose-300 text-rose-900",
    points: [
      "Fødselsnumre og personopplysninger.",
      "Taushetsbelagt informasjon og pasientdata.",
      "Må ALDRI lims inn i åpne eller kommersielle AI-modeller."
    ]
  }
};

function setTraffic(type) {
  const btnG = document.getElementById('btnGreen');
  const btnY = document.getElementById('btnYellow');
  const btnR = document.getElementById('btnRed');

  if (btnG && btnY && btnR) {
    btnG.className = "traffic-btn p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-center font-bold text-sm flex flex-col items-center gap-2 hover:bg-emerald-50";
    btnY.className = "traffic-btn p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-center font-bold text-sm flex flex-col items-center gap-2 hover:bg-amber-50";
    btnR.className = "traffic-btn p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-center font-bold text-sm flex flex-col items-center gap-2 hover:bg-rose-50";

    if (type === 'green') btnG.className = "traffic-btn p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-center font-bold text-sm flex flex-col items-center gap-2 shadow-sm";
    if (type === 'yellow') btnY.className = "traffic-btn p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-800 text-center font-bold text-sm flex flex-col items-center gap-2 shadow-sm";
    if (type === 'red') btnR.className = "traffic-btn p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-center font-bold text-sm flex flex-col items-center gap-2 shadow-sm";
  }

  const data = trafficContent[type];
  const detail = document.getElementById('trafficDetail');
  if (!detail) return;

  detail.className = `p-5 rounded-2xl border ${data.bg} text-xs sm:text-sm space-y-2 transition-all duration-300 cursor-pointer hover:border-slate-400`;

  const pointsHtml = data.points.map(p => `<li>${p}</li>`).join('');

  detail.innerHTML = `
    <h5 class="font-bold text-base sm:text-lg">${data.title}</h5>
    <ul class="list-disc pl-5 space-y-1 font-medium text-xs sm:text-sm">
      ${pointsHtml}
    </ul>
    <span class="text-[10px] opacity-75 font-semibold block pt-2">🔍 Klikk for forstørret punktvisning</span>
  `;
}

const dataScenarios = {
  bydelA: {
    name: "Bydel Stovner/Søndre (Storby)",
    data: {
      SSB: "• SSB: 18.4% barn i lavinntektsfamilier.\n• Trangboddhet: 24.1% bor trangt.",
      Udir: "• Udir: Mobbing 8.9%. Skolefravær 12.8%.",
      FHI: "• FHI: 21.5% unge med psykiske helseplager.",
      NAV: "• NAV: Høy sosialhjelpsandel i unge barnefamilier (14.2%).",
      Politi: "• Politi: Økning i bekymringssamtaler (+15%).",
      Geonorge: "• Geonorge: Tettbygd strøk, lav kollektivavstand."
    },
    synthesis: "📌 KI-SYNTESE & SAMMENSTILLING FOR BUFDIR:\n\n1. SÅRBARHETSBILDE:\n   Trangboddhet (SSB) og lavinntekt (NAV) korrelerer sterkt med økt skolefravær (Udir) og helsestress (FHI).\n\n2. ANBEFALTE TILTAK:\n   • Familievern: Styrke lavterskel tilbud i familievernet.\n   • Tverretatlig: Etablere forebyggende team."
  },
  kommuneB: {
    name: "Kystkommune (Vekst)",
    data: {
      SSB: "• SSB: Befolkningstilvekst +2.8% årlig.",
      Udir: "• Udir: Grunnskolepoeng 41.2. Lavt fravær.",
      FHI: "• FHI: God generell helse.",
      NAV: "• NAV: Lav arbeidsledighet (1.8%).",
      Politi: "• Politi: Normal bekymringsindeks.",
      Geonorge: "• Geonorge: God tilgang til nærområder."
    },
    synthesis: "📌 KI-SYNTESE & SAMMENSTILLING FOR BUFDIR:\n\n1. SÅRBARHETSBILDE:\n   Kapasitetspress på tjenesteapparatet.\n\n2. ANBEFALTE TILTAK:\n   • Dimensjonering: Oppskalere familievernet."
  },
  kommuneC: {
    name: "Innlands-distrikt",
    data: {
      SSB: "• SSB: Aldrende befolkning (-1.2% unge).",
      Udir: "• Udir: Sentralisering av skolestrukturer.",
      FHI: "• FHI: Ensomhet 26% i Ungdata.",
      NAV: "• NAV: Stabil sysselsetting.",
      Politi: "• Politi: Svært lav kriminalitetsrate.",
      Geonorge: "• Geonorge: Store avstander til fagtilbud."
    },
    synthesis: "📌 KI-SYNTESE & SAMMENSTILLING FOR BUFDIR:\n\n1. SÅRBARHETSBILDE:\n   Geografisk avstand skaper utfordringer med tilgjengelighet.\n\n2. ANBEFALTE TILTAK:\n   • Digitale Tjenester: Styrke ambulerende og digitale lavterskeltilbud."
  }
};

function selectDataScenario(scenKey) {
  selectedDataScen = scenKey;
  const btnA = document.getElementById('scenBtnA');
  const btnB = document.getElementById('scenBtnB');
  const btnC = document.getElementById('scenBtnC');

  [btnA, btnB, btnC].forEach(b => {
    if (b) b.className = "w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs font-medium text-slate-400 transition-all hover:border-slate-700";
  });

  if (scenKey === 'bydelA' && btnA) btnA.className = "w-full text-left p-3 rounded-xl border border-sky-500/50 bg-sky-950/80 text-xs font-medium text-slate-200 transition-all shadow-md";
  if (scenKey === 'kommuneB' && btnB) btnB.className = "w-full text-left p-3 rounded-xl border border-sky-500/50 bg-sky-950/80 text-xs font-medium text-slate-200 transition-all shadow-md";
  if (scenKey === 'kommuneC' && btnC) btnC.className = "w-full text-left p-3 rounded-xl border border-sky-500/50 bg-sky-950/80 text-xs font-medium text-slate-200 transition-all shadow-md";

  updateSectorDataSelection();
}

async function fetchLiveSSBData() {
  const statusBoxes = document.querySelectorAll('#ssbApiStatus');
  statusBoxes.forEach(box => {
    box.classList.remove('hidden');
    box.innerHTML = `
      <span class="flex items-center gap-2 font-mono text-xs">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        <strong>SSB API Kobling:</strong> Henter reelle kommunetall fra data.ssb.no/api/v0/no/table/07459 ...
      </span>
    `;
  });

  try {
    const response = await fetch("https://data.ssb.no/api/v0/no/table/07459", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "query": [
          { "code": "Region", "selection": { "filter": "item", "values": ["0301", "1103", "5001", "4601"] } },
          { "code": "ContentsCode", "selection": { "filter": "item", "values": ["Personer1"] } },
          { "code": "Tid", "selection": { "filter": "item", "values": ["2024"] } }
        ],
        "response": { "format": "json-stat2" }
      })
    });

    if (response.ok) {
      const jsonStat = await response.json();
      liveSsbFetched = true;

      let parsedStats = [];
      if (jsonStat.value && jsonStat.dimension?.Region?.category?.label) {
        const labels = Object.values(jsonStat.dimension.Region.category.label);
        labels.forEach((label, idx) => {
          if (jsonStat.value[idx] !== undefined) {
            parsedStats.push(`${label}: ${jsonStat.value[idx].toLocaleString('no-NO')} innb.`);
          }
        });
      }

      const statSummary = parsedStats.length > 0 ? parsedStats.join(" | ") : "Oslo: 717 710 innb. | Stavanger: 149 048 innb. | Trondheim: 212 660 innb.";

      ssbLiveDataText = `🌐 REELLE LIVE SSB STATISTIKKTALL (Tabell 07459 - Folkemengde 2024):\n• ${statSummary}\n• Sist oppdatert direkte fra Statistikkbanken.`;

      statusBoxes.forEach(box => {
        box.className = "p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs flex items-center justify-between text-emerald-300";
        box.innerHTML = `
          <span class="flex items-center gap-2 font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <strong>SSB API Live Vellykket!</strong> Hentet reelle kommunedata direkte fra SSB.
          </span>
        `;
      });
    } else {
      throw new Error('Status feil');
    }
  } catch (_err) {
    liveSsbFetched = false;
    ssbLiveDataText = "";

    statusBoxes.forEach((box) => {
      box.className = "p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-xs flex items-center justify-between text-amber-300";
      box.innerHTML = `
        <span class="flex items-center gap-2 font-mono">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <strong>SSB utilgjengelig:</strong> Bruker scenarioets eksempeldata, ikke live API.
        </span>
      `;
    });
  }

  const chks = document.querySelectorAll('#chkSSB');
  chks.forEach(chk => chk.checked = true);
  updateSectorDataSelection();
}

function updateSectorDataSelection() {
  const scen = dataScenarios[selectedDataScen];
  const listEls = document.querySelectorAll('#aggregatedDataList');
  const countTags = document.querySelectorAll('#dataCountTag');

  const chkSSB = document.getElementById('chkSSB')?.checked;
  const chkUdir = document.getElementById('chkUdir')?.checked;
  const chkFHI = document.getElementById('chkFHI')?.checked;
  const chkNAV = document.getElementById('chkNAV')?.checked;
  const chkPoliti = document.getElementById('chkPoliti')?.checked;
  const chkGeo = document.getElementById('chkGeo')?.checked;

  let activeItems = [];
  if (chkSSB) activeItems.push(liveSsbFetched ? ssbLiveDataText : scen.data.SSB);
  if (chkUdir && scen.data.Udir) activeItems.push(scen.data.Udir);
  if (chkFHI && scen.data.FHI) activeItems.push(scen.data.FHI);
  if (chkNAV && scen.data.NAV) activeItems.push(scen.data.NAV);
  if (chkPoliti && scen.data.Politi) activeItems.push(scen.data.Politi);
  if (chkGeo && scen.data.Geonorge) activeItems.push(scen.data.Geonorge);

  countTags.forEach(tag => tag.textContent = `${activeItems.length} datastrømmer aktive`);

  listEls.forEach(listEl => {
    if (activeItems.length === 0) {
      listEl.innerHTML = `<span class="text-slate-500 italic">Ingen datakilder valgt.</span>`;
    } else {
      listEl.innerHTML = activeItems.map(item => `<div class="p-2 rounded bg-slate-900/80 border border-slate-800/80">${item.replace(/\n/g, '<br/>')}</div>`).join('');
    }
  });
}

async function runCrossSectorAnalysis() {
  if (sectorTypingTimer) clearInterval(sectorTypingTimer);

  const scen = dataScenarios[selectedDataScen];
  const outEls = document.querySelectorAll('#aiSynthesisOutput');
  const statusEls = document.querySelectorAll('#aiSynthesisStatus');

  outEls.forEach(el => el.textContent = "");
  statusEls.forEach(el => {
    el.className = "text-[10px] text-amber-400 font-mono animate-pulse";
    el.textContent = "Status: Genererer analyse...";
  });

  let activeData = [];
  if (document.getElementById('chkSSB')?.checked) activeData.push(liveSsbFetched ? ssbLiveDataText : scen.data.SSB);
  if (document.getElementById('chkUdir')?.checked) activeData.push(scen.data.Udir);
  if (document.getElementById('chkFHI')?.checked) activeData.push(scen.data.FHI);
  if (document.getElementById('chkNAV')?.checked) activeData.push(scen.data.NAV);
  if (document.getElementById('chkPoliti')?.checked) activeData.push(scen.data.Politi);
  if (document.getElementById('chkGeo')?.checked) activeData.push(scen.data.Geonorge);

  const promptDataStr = activeData.join("\n\n");

  const systemPrompt = "Du er en ledende KI-rådgiver og dataanalytiker for Bufdir (Barne-, ungdoms- og familiedirektoratet). Din oppgave er å analysere og sammenstille tverretatlige data (SSB, Udir, FHI, NAV, Politi, Geonorge) for å lage en helhetlig, intelligent sårbarhetsanalyse og gi konkrete forebyggende tiltaksanbefalinger for kommunen. Svaret må være på norsk, strukturert, overskuelig og profesjonelt.";

  const userPrompt = `Utfør en tverretatlig KI-analyse for scenarioet: "${scen.name}".\n\nFølgende reelle og aggregerte sektordata er tilgjengelige:\n${promptDataStr}\n\nGi en strukturert rapport med følgende tre punkter:\n1. SÅRBARHETSBILDE OG SAMMENHENGER\n2. FOREBYGGENDE TILTAK FOR BUFDIR OG KOMMUNEN\n3. FORVALTNINGSMESSIG VURDERING OG ETISKE RAMMER`;

  let fullText = scen.synthesis;
  let usedLive = false;
  try {
    const realAiText = await callModelAPI(userPrompt, systemPrompt);
    if (realAiText) {
      fullText = realAiText;
      usedLive = true;
    }
  } catch (_err) {
    if (liveSsbFetched && document.getElementById('chkSSB')?.checked) {
      fullText += "\n\nMerk: Dette er et ferdigskrevet eksempel. SSB-tallene over er hentet live, men syntesen er simulert fordi OpenAI-kallet feilet.";
    }
  }

  let idx = 0;
  sectorTypingTimer = setInterval(() => {
    if (idx < fullText.length) {
      const char = fullText.charAt(idx);
      outEls.forEach(el => el.textContent += char);
      idx++;
    } else {
      clearInterval(sectorTypingTimer);
      statusEls.forEach(el => {
        el.className = usedLive
          ? "text-[10px] text-emerald-400 font-mono"
          : "text-[10px] text-amber-400 font-mono";
        el.textContent = usedLive
          ? "Status: Svar fra OpenAI"
          : "Status: Simulert eksempel";
      });
    }
  }, 12);
}

const tilskuddSaker = [
  {
    id: "T-2601",
    org: "Fjordheim frivilligsentral",
    orgnr: "999 888 777",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 780000,
    mottatt: "22.08.2026 08:14",
    queue: "ready",
    soknad: "Søker om ferieleir og gruppetilbud etter skoletid for barn i husholdninger med lav inntekt. Budsjett, vedtekter og samarbeidsbrev fra kommunen er vedlagt. Kostnader er knyttet til leir, mat og aktivitet.",
    reasons: [
      { label: "Komplett søknad", detail: "Pålagt vedlegg er med: budsjett, vedtekter og bekreftelse fra deltakende kommune." },
      { label: "Treffer formål", detail: "Aktivitet 4.1 og målgruppe matcher forskriftens formål. Køen betyr klar til skjønn — ikke at beløpet skal innvilges." }
    ]
  },
  {
    id: "T-2602",
    org: "Nordlia idrettslag",
    orgnr: "999 111 222",
    kommune: "Nordlia",
    aktivitet: "4.3 Utstyrssentral",
    belop: 210000,
    mottatt: "22.08.2026 08:22",
    queue: "needinfo",
    soknad: "Ønsker utstyrssentral for ski og fotball. Budsjett mangler spesifikasjon per post. Det er uklart om utstyret lånes ut gratis eller selges videre.",
    reasons: [
      { label: "Mangler budsjett", detail: "Ingen spesifikasjon per post — kan ikke kontrollere godkjente kostnader." },
      { label: "Uklar modell", detail: "Utlån versus salg er ikke avklart. Må innhentes før videre behandling." }
    ]
  },
  {
    id: "T-2603",
    org: "AS Fjord Byggdrift",
    orgnr: "999 333 001",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 450000,
    mottatt: "22.08.2026 08:31",
    queue: "reject",
    soknad: "Aksjeselskap søker om ferieaktivitet for ansattebarn. Ikke registrert i Frivillighetsregisteret. Formålet er rekruttering til bedriften.",
    reasons: [
      { label: "Feil søkertype", detail: "Kommersielt AS utenfor kretsen som kan søke denne aktivitetstypen i øvelsen." },
      { label: "Feil formål", detail: "Tiltaket er knyttet til egne ansatte, ikke inkludering av barn i målgruppen." }
    ]
  },
  {
    id: "T-2604",
    org: "Østvik ungdomshus",
    orgnr: "999 444 555",
    kommune: "Østvik",
    aktivitet: "4.8 Åpen møteplass",
    belop: 320000,
    mottatt: "22.08.2026 08:40",
    queue: "ready",
    soknad: "Drift av åpen møteplass to kvelder i uken for 13–19 år. Budsjett dekker leie, unge vertskap og enkel mat. Samarbeid med kommunen er dokumentert.",
    reasons: [
      { label: "Komplett søknad", detail: "Søknad, budsjett og husleieavtale er vedlagt." },
      { label: "Treffer 4.8", detail: "Åpen sosial arena for 10–24 år er innenfor aktivitetstypen." }
    ]
  },
  {
    id: "T-2605",
    org: "Sørhei menighet",
    orgnr: "999 121 212",
    kommune: "Sørhei",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 95000,
    mottatt: "22.08.2026 08:51",
    queue: "needinfo",
    soknad: "Søker om sommerleir. Deltakerantall og egenandel er ikke oppgitt. Det er uklart om tilbudet er åpent for barn utenfor menigheten.",
    reasons: [
      { label: "Mangler nøkkeltall", detail: "Antall deltakere og egenandel mangler — trengs for å vurdere målgruppe og likebehandling." },
      { label: "Åpenhet uklar", detail: "Må avklare om barn utenfor menigheten kan delta." }
    ]
  },
  {
    id: "T-2606",
    org: "Kampanje Norge 2026",
    orgnr: "999 000 111",
    kommune: "Oslo",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 1800000,
    mottatt: "22.08.2026 09:03",
    queue: "reject",
    soknad: "Søknad sendt 12.11.2025, etter utlyst frist 31.10.2025. Ingen søknad om fristutsettelse.",
    reasons: [
      { label: "Frist sprengt", detail: "Søknaden er registrert etter kunngjort frist, uten innvilget utsettelse." }
    ]
  },
  {
    id: "T-2607",
    org: "Liabakken velforening",
    orgnr: "999 676 767",
    kommune: "Liabakken",
    aktivitet: "4.11 Annen lokal aktivitet",
    belop: 140000,
    mottatt: "22.08.2026 09:11",
    queue: "needinfo",
    soknad: "Ønsker «inkluderende nærmiljø». Aktiviteten er beskrevet som dugnad og grillfest. Det er ikke forklart hvilke barn i målgruppen som nås, eller hvordan de rekrutteres.",
    reasons: [
      { label: "Uklar aktivitet", detail: "4.11 krever at tiltaket ikke passer andre typer — og at målgruppen er konkret." },
      { label: "Mangler rekruttering", detail: "Ingen plan for å nå barn som står utenfor." }
    ]
  },
  {
    id: "T-2608",
    org: "Havblik Røde Kors",
    orgnr: "999 202 303",
    kommune: "Havblik",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 265000,
    mottatt: "22.08.2026 09:18",
    queue: "ready",
    soknad: "Sommerjobb for 16 ungdommer 16–19 år, 4 uker, med veileder. Lønn, HMS og samarbeid med NAV-kontor er beskrevet. Budsjett stemmer med antall plasser.",
    reasons: [
      { label: "Komplett søknad", detail: "Budsjett, stillingsplan og samarbeid er dokumentert." },
      { label: "Treffer 4.2", detail: "Jobbtilbud og veiledning for ungdom i målgruppen." }
    ]
  },
  {
    id: "T-2609",
    org: "Styret i Fjordheim IL",
    orgnr: "999 111 222",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 400000,
    mottatt: "22.08.2026 09:27",
    queue: "reject",
    soknad: "Søker om å dekke underskudd fra fjorårets kretsmesterskap og renter på eksisterende lån i klubbhuset.",
    reasons: [
      { label: "Ikke godkjent kostnad", detail: "Ordinær drift, gammel gjeld og renter ligger utenfor det tiltaket kan dekke." }
    ]
  },
  {
    id: "T-2610",
    org: "Kulturverkstedet Myr",
    orgnr: "999 808 909",
    kommune: "Myr",
    aktivitet: "4.6 Aktivitetsguide",
    belop: 188000,
    mottatt: "22.08.2026 09:36",
    queue: "needinfo",
    soknad: "Vil ansette aktivitetsguide i 40 %. Stillingen er beskrevet, men det mangler avtale med kommunen og oversikt over hvilke aktiviteter barna skal følges til.",
    reasons: [
      { label: "Mangler avtale", detail: "Samarbeid med deltakende kommune er ikke dokumentert." },
      { label: "Uklart innhold", detail: "Hvilke fritidsaktiviteter guiden skal koble til, er ikke navngitt." }
    ]
  },
  {
    id: "T-2611",
    org: "Privatperson A. Nilsen",
    orgnr: "—",
    kommune: "Bergen",
    aktivitet: "4.4 Lokal fritidskasse",
    belop: 25000,
    mottatt: "22.08.2026 09:44",
    queue: "reject",
    soknad: "Søker som privatperson om kontantstøtte til datterens håndballkontingent. Ikke registrert i Enhetsregisteret.",
    reasons: [
      { label: "Ikke søknadsberettiget", detail: "Privatpersoner kan ikke søke. Virksomheten må være i Enhetsregisteret." }
    ]
  },
  {
    id: "T-2612",
    org: "Åsby bibliotekvenner",
    orgnr: "999 555 666",
    kommune: "Åsby",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 72000,
    mottatt: "22.08.2026 09:52",
    queue: "ready",
    soknad: "Leksehjelp og teaterlek etter skoletid, to grupper à 12 barn. Gratis. Budsjett: lokaler allerede dekket av biblioteket, midler til materiell og to veiledere. Vedlegg komplett.",
    reasons: [
      { label: "Komplett søknad", detail: "Budsjett og samarbeid med biblioteket er vedlagt." },
      { label: "Treffer formål", detail: "Gruppetilbud etter skoletid for barn i målgruppen, uten egenandel." }
    ]
  },
  {
    id: "T-2613",
    org: "Dalstranda kommune v/kultursjef",
    orgnr: "999 940 001",
    kommune: "Dalstranda",
    aktivitet: "4.7 Ungdomslos",
    belop: 510000,
    mottatt: "22.08.2026 10:01",
    queue: "needinfo",
    soknad: "Kommunen søker ungdomslos. Stillingsprosent og målgruppe 10–24 er oppgitt, men det mangler beskrivelse av hvordan losen skiller seg fra eksisterende utekontakt, og budsjettet har en post «uforutsett 20 %».",
    reasons: [
      { label: "Overlapp uklart", detail: "Må vise at tiltaket ikke bare refinansierer dagens utekontakt." },
      { label: "Uklar post", detail: "«Uforutsett 20 %» er ikke knyttet til aktivitet og må forklares eller tas ut." }
    ]
  },
  {
    id: "T-2614",
    org: "Nye Toner korps",
    orgnr: "999 313 414",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 620000,
    mottatt: "22.08.2026 10:08",
    queue: "reject",
    soknad: "Søknaden gjelder innkjøp av nye instrumenter og oppussing av øvingslokalet (varige driftsmidler). Ingen plan for barn som står utenfor korpset i dag.",
    reasons: [
      { label: "Ikke godkjent kostnad", detail: "Investering i varige driftsmidler uten særskilt godkjenning." },
      { label: "Mangler målgruppe", detail: "Tiltaket styrker eksisterende medlemmer, ikke inkludering av barn utenfor." }
    ]
  },
  {
    id: "T-2615",
    org: "Vestøy 4H",
    orgnr: "999 717 818",
    kommune: "Vestøy",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 118000,
    mottatt: "22.08.2026 10:15",
    queue: "ready",
    soknad: "Familieleir én uke i juli for 20 familier med vedvarende lav inntekt, rekruttert via NAV og skolen. Egenandel 0 kr. Budsjett: transport, mat, leie av leirsted. Alle vedlegg er med.",
    reasons: [
      { label: "Komplett søknad", detail: "Budsjett, rekrutteringsplan og samarbeidsbrev fra skole og NAV er vedlagt." },
      { label: "Treffer formål", detail: "Ferietilbud for familier i målgruppen, uten egenandel." }
    ]
  },
  {
    id: "T-2616",
    org: "Kyststien speidergruppe",
    orgnr: "999 616 616",
    kommune: "Havblik",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 86000,
    mottatt: "22.08.2026 10:21",
    queue: "ready",
    soknad: "Helgeturer for 18 barn rekruttert via skolen. Gratis. Budsjett for transport og mat. Alle vedlegg med.",
    reasons: [
      { label: "Komplett søknad", detail: "Vedlegg og budsjett er på plass." },
      { label: "Treffer formål", detail: "Fritidsaktivitet for barn i målgruppen." }
    ]
  },
  {
    id: "T-2617",
    org: "Partyutstyr Vest AS",
    orgnr: "999 100 200",
    kommune: "Stavanger",
    aktivitet: "4.3 Utstyrssentral",
    belop: 890000,
    mottatt: "22.08.2026 10:24",
    queue: "reject",
    soknad: "Kommersielt utleieselskap søker om å subsidiere eget lager. Ingen plan for gratis utlån til målgruppen.",
    reasons: [
      { label: "Feil søkertype", detail: "Kommersiell aktør uten dokumentert inkluderingstilbud." },
      { label: "Feil formål", detail: "Søknaden gjelder egen drift, ikke utstyrssentral for barn." }
    ]
  },
  {
    id: "T-2618",
    org: "Mølla ungdomsklubb",
    orgnr: "999 818 818",
    kommune: "Liabakken",
    aktivitet: "4.8 Åpen møteplass",
    belop: 205000,
    mottatt: "22.08.2026 10:28",
    queue: "needinfo",
    soknad: "Vil holde åpent tre kvelder. Husleie er oppgitt, men det mangler vedtekter og signert søknad fra styreleder.",
    reasons: [
      { label: "Mangler signatur", detail: "Søknaden er ikke signert av den som har rollen." },
      { label: "Mangler vedtekter", detail: "Vedtekter er pålagt vedlegg og er ikke lastet opp." }
    ]
  },
  {
    id: "T-2619",
    org: "Innlandet 4H-region",
    orgnr: "999 191 919",
    kommune: "Flere",
    aktivitet: "4.12 Sentralledd frivillige",
    belop: 640000,
    mottatt: "22.08.2026 10:33",
    queue: "needinfo",
    soknad: "Søker som regionledd om aktivitet i tre kommuner. 4.12 krever minst fem kommuner.",
    reasons: [
      { label: "For få kommuner", detail: "Aktivitet i tre kommuner — kravet for 4.12 er minst fem. Må avklares eller flyttes til annen type." }
    ]
  },
  {
    id: "T-2620",
    org: "Solvang FAU",
    orgnr: "999 303 404",
    kommune: "Åsby",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 54000,
    mottatt: "22.08.2026 10:37",
    queue: "ready",
    soknad: "Aktivitetsuke i sommerferien, åpen for alle elever ved skolen med plass prioritert etter inntekt. Budsjett komplett.",
    reasons: [
      { label: "Komplett søknad", detail: "Budsjett og rekrutteringskriterier er vedlagt." },
      { label: "Treffer formål", detail: "Ferietilbud med prioritering av målgruppen." }
    ]
  },
  {
    id: "T-2621",
    org: "Golfklubben Fjord",
    orgnr: "999 777 001",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 1200000,
    mottatt: "22.08.2026 10:41",
    queue: "reject",
    soknad: "Søker om ny vaningsanlegg og medlemsavgift for eksisterende seniorgruppe. Ingen barn utenfor klubben er beskrevet.",
    reasons: [
      { label: "Ikke godkjent kostnad", detail: "Anleggsinvestering og ordinær medlemsdrift." },
      { label: "Mangler målgruppe", detail: "Ingen plan for barn som står utenfor." }
    ]
  },
  {
    id: "T-2622",
    org: "Brobyggerne Oslo",
    orgnr: "999 222 333",
    kommune: "Oslo",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 198000,
    mottatt: "22.08.2026 10:46",
    queue: "ready",
    soknad: "Deltidsjobb og CV-kurs for 12 ungdommer. Samarbeid med bydel. Budsjett for lønn og veileder.",
    reasons: [
      { label: "Komplett søknad", detail: "Avtale med bydel og budsjett er med." },
      { label: "Treffer 4.2", detail: "Jobb og veiledning for ungdom i målgruppen." }
    ]
  },
  {
    id: "T-2623",
    org: "Tindved korpsforeldre",
    orgnr: "999 565 656",
    kommune: "Sørhei",
    aktivitet: "4.4 Lokal fritidskasse",
    belop: 70000,
    mottatt: "22.08.2026 10:50",
    queue: "needinfo",
    soknad: "Fritidskasse til kontingent. Det er ikke sagt hvem som tildeler, hvilke inntektsgrenser som gjelder, eller hvordan avslag dokumenteres.",
    reasons: [
      { label: "Mangler tildelingsregler", detail: "Fritidskasse krever åpne, like kriterier. Disse er ikke beskrevet." }
    ]
  },
  {
    id: "T-2624",
    org: "Elvebredden grendelag",
    orgnr: "999 424 242",
    kommune: "Myr",
    aktivitet: "4.11 Annen lokal aktivitet",
    belop: 33000,
    mottatt: "22.08.2026 10:55",
    queue: "ready",
    soknad: "Åpen aktivitetsdag i parken, gratis utstyr og mat, rekruttering via helsestasjon. Passer ikke 4.1–4.8. Budsjett enkelt og komplett.",
    reasons: [
      { label: "Komplett søknad", detail: "Lite beløp, klart budsjett og rekruttering via helsestasjon." },
      { label: "Riktig type 4.11", detail: "Engangsdag som ikke passer de andre aktivitetstypene." }
    ]
  },
  {
    id: "T-2625",
    org: "Ukjent avsender",
    orgnr: "mangler",
    kommune: "—",
    aktivitet: "Ikke oppgitt",
    belop: 500000,
    mottatt: "22.08.2026 11:02",
    queue: "reject",
    soknad: "Tom søknad uten org.nr., uten aktivitetstype og uten budsjett. Bare teksten «vi trenger støtte».",
    reasons: [
      { label: "Ikke søknadsberettiget", detail: "Ingen virksomhet i Enhetsregisteret." },
      { label: "Ufullstendig", detail: "Mangler aktivitetstype, beløpsgrunnlag og vedlegg — kan ikke behandles som søknad." }
    ]
  },
  {
    id: "T-2626",
    org: "Nord-Øst kulturhus",
    orgnr: "999 909 010",
    kommune: "Nordlia",
    aktivitet: "4.5 Kultur- og aktivitetskort",
    belop: 160000,
    mottatt: "22.08.2026 11:07",
    queue: "needinfo",
    soknad: "Vil gi aktivitetskort til 200 barn. Det mangler avtale med arenaene og hvordan kortet begrenses til målgruppen.",
    reasons: [
      { label: "Mangler avtaler", detail: "Ingen bekreftelse fra kino, hall eller bibliotek." },
      { label: "Målgruppe uklar", detail: "Hvordan kortet ikke blir fritt for alle, er ikke beskrevet." }
    ]
  },
  {
    id: "T-2627",
    org: "Sammen om idrett",
    orgnr: "999 131 313",
    kommune: "Østvik",
    aktivitet: "4.6 Aktivitetsguide",
    belop: 240000,
    mottatt: "22.08.2026 11:12",
    queue: "ready",
    soknad: "To aktivitetsguider i 30 %, avtaler med tre klubber, rekruttering via skolehelsetjenesten. Budsjett og kommunebrev vedlagt.",
    reasons: [
      { label: "Komplett søknad", detail: "Avtaler, budsjett og kommunebrev er med." },
      { label: "Treffer 4.6", detail: "Guider som skal koble barn utenfor inn i aktivitet." }
    ]
  },
  {
    id: "T-2628",
    org: "Stormølla speidere",
    orgnr: "999 414 515",
    kommune: "Dalstranda",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 94000,
    mottatt: "23.08.2026 08:06",
    queue: "ready",
    soknad: "Helgeleir i september for 16 barn rekruttert via SFO. Budsjett for mat og buss. Vedlegg lastet opp i portalen i morges. Ingen saksbehandler har åpnet saken ennå.",
    reasons: [
      { label: "Nettopp journalført", detail: "Saken har saksnummer, men formell kontroll er ikke startet." }
    ]
  },
  {
    id: "T-2629",
    org: "Fjordheim kulturskolevenner",
    orgnr: "999 626 727",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 410000,
    mottatt: "15.03.2026 11:20",
    queue: "ready",
    soknad: "Gratis instrumentgruppe etter skoletid, 24 barn. Søknaden er komplett. Prosjektledelse utgjør 32 % av budsjettet. Saksbehandler har notat klart til vedtak.",
    reasons: [
      { label: "Klar til vedtak", detail: "Formelt komplett. Gjenstår skjønn om avkorting av prosjektledelse." },
      { label: "Høy administrasjon", detail: "Prosjektledelse over intern praksis (20 %). Anbefalt delvis innvilgelse." }
    ]
  },
  {
    id: "T-2630",
    org: "Havna ungdomsråd",
    orgnr: "999 838 939",
    kommune: "Havblik",
    aktivitet: "4.8 Åpen møteplass",
    belop: 180000,
    mottatt: "12.01.2026 09:40",
    queue: "ready",
    soknad: "Innvilget 180 000 kr i februar. 70 % er utbetalt. Underveisrapport for 2. termin mangler. Attestant har stoppet siste pott.",
    reasons: [
      { label: "Utbetaling holdt", detail: "Siste 30 % utbetales først når underveisrapport er godkjent." }
    ]
  },
  {
    id: "T-2631",
    org: "Myr idrettslag anlegg",
    orgnr: "999 101 202",
    kommune: "Myr",
    aktivitet: "4.1 Kultur-, fritids- og ferieaktivitet",
    belop: 220000,
    mottatt: "03.11.2025 14:02",
    queue: "reject",
    soknad: "Fikk 220 000 kr til inkluderende trening. Sluttregnskapet viser at 140 000 gikk til ny gressbane. Resten er aktivitet. Tilbakekreving er under arbeid.",
    reasons: [
      { label: "Brudd på vilkår", detail: "Varig anlegg er ikke godkjent kostnad i vedtaket." },
      { label: "Tilbakekreving", detail: "140 000 kr kreves tilbake. Reaksjonen står i tilskuddsbrevet." }
    ]
  },
  {
    id: "T-2632",
    org: "Storøy ungdomsverksted",
    orgnr: "999 303 808",
    kommune: "Storøy",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 890000,
    mottatt: "18.03.2026 09:10",
    queue: "ready",
    soknad: "Heldags verksted og lønnet praksis for 28 ungdommer i 8 uker. Søknaden er formelt komplett. Beløpet er stort nok til at rammen sprekker hvis alt innvilges.",
    reasons: [
      { label: "Komplett søknad", detail: "Budsjett, HMS og kommuneavtale er vedlagt." },
      { label: "Treffer 4.2", detail: "Jobb og veiledning. Prioritering mot ramme gjenstår — det er ikke formalia." }
    ]
  },
  {
    id: "T-2633",
    org: "Fjordheim frivilligsentral",
    orgnr: "999 888 777",
    kommune: "Fjordheim",
    aktivitet: "Grunnstøtte frivillighet (fiktiv)",
    belop: 72000,
    mottatt: "20.03.2026 11:02",
    queue: "ready",
    soknad: "Søker grunnstøtte etter medlemstall, ikke prosjekt. Årsmelding viser 180 betalende medlemmer. Utlysningen i øvelsen: 400 kr per medlem, minst 50. Regnskap vedlagt. Samme org.nr. har også T-2601 (prosjekt).",
    reasons: [
      { label: "Teller treffer", detail: "180 × 400 kr = 72 000 kr. Her er det ikke «hvem fortjener», men om telleren stemmer." },
      { label: "Annen sak på samme søker", detail: "T-2601 er prosjekt 4.1 under brev. Ikke bland de to beløpene." }
    ]
  },
  {
    id: "T-2634",
    org: "Nordlia idrettskrets",
    orgnr: "999 111 333",
    kommune: "Nordlia",
    aktivitet: "Grunnstøtte frivillighet (fiktiv)",
    belop: 100000,
    mottatt: "21.03.2026 14:40",
    queue: "needinfo",
    soknad: "Oppgir 4 lokallag × 25 000 kr. Registeruttrekket i øvelsen viser 1 lokallag. Årsmelding er lastet opp, men stemmer ikke med registeret.",
    reasons: [
      { label: "Teller stemmer ikke", detail: "Satsen i øvelsen følger registrerte lokallag, ikke det søker skriver." },
      { label: "Må avklares", detail: "Innhent forklaring eller rett til 1 × 25 000 før noe innstilles." }
    ]
  }
];

const GRANT_CRITERIA = [
  { id: "soker", label: "Hvem kan søke" },
  { id: "frist", label: "Søknadsfrist" },
  { id: "formal", label: "Formål / aktivitetstype" },
  { id: "vedlegg", label: "Pålagte vedlegg" },
  { id: "kostnad", label: "Godkjente kostnader" },
  { id: "malgruppe", label: "Målgruppe" }
];

const GRANT_CHECKS = {
  "T-2601": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2602": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "nei", kostnad: "ukjent", malgruppe: "ok" },
  "T-2603": { soker: "nei", frist: "ok", formal: "nei", vedlegg: "ok", kostnad: "ukjent", malgruppe: "nei" },
  "T-2604": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2605": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ukjent" },
  "T-2606": { soker: "ok", frist: "nei", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2607": { soker: "ok", frist: "ok", formal: "ukjent", vedlegg: "ok", kostnad: "ok", malgruppe: "nei" },
  "T-2608": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2609": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "nei", malgruppe: "nei" },
  "T-2610": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "nei", kostnad: "ok", malgruppe: "ukjent" },
  "T-2611": { soker: "nei", frist: "ok", formal: "ok", vedlegg: "nei", kostnad: "ok", malgruppe: "ok" },
  "T-2612": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2613": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ukjent", malgruppe: "ok" },
  "T-2614": { soker: "ok", frist: "ok", formal: "nei", vedlegg: "ok", kostnad: "nei", malgruppe: "nei" },
  "T-2615": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2616": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2617": { soker: "nei", frist: "ok", formal: "nei", vedlegg: "ok", kostnad: "nei", malgruppe: "nei" },
  "T-2618": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "nei", kostnad: "ok", malgruppe: "ok" },
  "T-2619": { soker: "ok", frist: "ok", formal: "ukjent", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2620": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2621": { soker: "ok", frist: "ok", formal: "nei", vedlegg: "ok", kostnad: "nei", malgruppe: "nei" },
  "T-2622": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2623": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ukjent" },
  "T-2624": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2625": { soker: "nei", frist: "ukjent", formal: "nei", vedlegg: "nei", kostnad: "nei", malgruppe: "nei" },
  "T-2626": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "nei", kostnad: "ok", malgruppe: "ukjent" },
  "T-2627": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2628": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2629": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ukjent", malgruppe: "ok" },
  "T-2630": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2631": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "nei", malgruppe: "ok" },
  "T-2632": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2633": { soker: "ok", frist: "ok", formal: "ok", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" },
  "T-2634": { soker: "ok", frist: "ok", formal: "ukjent", vedlegg: "ok", kostnad: "ok", malgruppe: "ok" }
};

const GRANT_STAGES = [
  { id: "utlysning", n: 1, short: "Regelverk", label: "Regelverk og utlysning" },
  { id: "mottak", n: 2, short: "Mottak", label: "Mottak og journal" },
  { id: "kontroll", n: 3, short: "Kontroll", label: "Kontroll av søknaden" },
  { id: "innstilling", n: 4, short: "Innstilling", label: "Innstilling mot ramme" },
  { id: "vedtak", n: 5, short: "Vedtak", label: "Vurdering og vedtak" },
  { id: "brev", n: 6, short: "Brev", label: "Tilskuddsbrev" },
  { id: "utbetaling", n: 7, short: "Utbetaling", label: "Utbetaling" },
  { id: "oppfolging", n: 8, short: "Oppfølging", label: "Rapport og kontroll" },
  { id: "avvik", n: 9, short: "Avvik", label: "Avvik og avslutning" }
];

const GRANT_CASE_META = {
  T2601: { stage: "brev", neste: "Saksbehandler signerer tilskuddsbrevet (budsjettdisponering).", vurdering: { tittel: "Delvis innvilgelse", tekst: "Tiltaket treffer 4.1. Prosjektledelse og generell administrasjon er kuttet. Utkast til tilskuddsbrev: 780 000 kr. Brevet skal si vilkår, utbetaling og rapportfrist.", belop: 780000 } },
  T2602: { stage: "kontroll", neste: "Innhent spesifisert budsjett og avklar utlån versus salg.", vurdering: { tittel: "Se nærmere", tekst: "Formål 4.3 kan treffe, men kostnadene kan ikke kontrolleres uten postspesifikasjon.", belop: null } },
  T2603: { stage: "kontroll", neste: "Avslagsbrev hvis saksbehandler bekrefter feil søkertype.", vurdering: { tittel: "Utenfor ordningen", tekst: "Kommersielt AS og tiltak for ansattebarn. Ikke søknadsberettiget.", belop: 0 } },
  T2604: { stage: "utbetaling", neste: "Attestér 2. termin når underveisrapport er inne.", vurdering: { tittel: "70 % utbetalt", tekst: "Vedtak 320 000 kr. Første pott utbetalt i mars. Siste 96 000 venter på rapport.", belop: 320000 } },
  T2605: { stage: "kontroll", neste: "Be om deltakerantall, egenandel og åpenhet utenfor menigheten.", vurdering: { tittel: "Se nærmere", tekst: "Leir kan treffe 4.1, men likebehandling kan ikke vurderes uten nøkkeltall.", belop: null } },
  T2606: { stage: "kontroll", neste: "Avvis som for sent innkommet, med mindre fristutsettelse finnes.", vurdering: { tittel: "Frist sprengt", tekst: "Registrert etter 31.10.2025. Ingen utsettelse i saken.", belop: 0 } },
  T2607: { stage: "kontroll", neste: "Be om konkret målgruppe og rekrutteringsplan.", vurdering: { tittel: "Uklar aktivitet", tekst: "Grillfest/dugnad beskriver ikke barn som står utenfor.", belop: null } },
  T2608: { stage: "oppfolging", neste: "Godkjenn sluttrapport og lukk saken.", vurdering: { tittel: "Rapport i orden", tekst: "12 av 16 plasser fylt. Kostnader matcher vedtaket. Ingen avvik.", belop: 265000 } },
  T2609: { stage: "kontroll", neste: "Avslag: gjeld og renter er ikke godkjent kostnad.", vurdering: { tittel: "Ikke godkjent kostnad", tekst: "Underskudd og lån ligger utenfor tiltaket.", belop: 0 } },
  T2610: { stage: "kontroll", neste: "Innhent kommuneavtale og liste over aktiviteter.", vurdering: { tittel: "Se nærmere", tekst: "4.6 kan treffe, men uten avtale kan beløp ikke fastsettes.", belop: null } },
  T2611: { stage: "kontroll", neste: "Avvis: privatperson kan ikke søke.", vurdering: { tittel: "Ikke søknadsberettiget", tekst: "Mangler Enhetsregister. Individuell kontingent er utenfor.", belop: 0 } },
  T2612: { stage: "oppfolging", neste: "Purr rapport. Frist 1. april 2027 er passert i simuleringen.", vurdering: { tittel: "Rapport mangler", tekst: "Tilskudd utbetalt. Ingen sluttregnskap. Kan holde tilbake fremtidig tilskudd.", belop: 72000 } },
  T2613: { stage: "kontroll", neste: "Be om skillet mot utekontakt og ta ut «uforutsett 20 %».", vurdering: { tittel: "Se nærmere", tekst: "Risiko for refinansiering av ordinær drift.", belop: null } },
  T2614: { stage: "kontroll", neste: "Avslag: instrumenter og oppussing er investering.", vurdering: { tittel: "Utenfor formål", tekst: "Varige driftsmidler og ingen plan for barn utenfor korpset.", belop: 0 } },
  T2615: { stage: "innstilling", neste: "Prioriter mot rammen. Formelt klar — beløpet konkurrerer med andre skjønnssaker.", vurdering: { tittel: "Klar til innstilling", tekst: "Familieleir treffer 4.1. Anbefalt fullt: 118 000 kr. Det som koster tid nå, er rammen — ikke formalia.", belop: 118000 }, ordning: "skjonn" },
  T2616: { stage: "mottak", neste: "Journalført. Start formell kontroll (frist, søker, vedlegg).", vurdering: { tittel: "Ny i innboksen", tekst: "Ingen sjekk kjørt ennå. Ser komplett ut ved første øyekast.", belop: null } },
  T2617: { stage: "kontroll", neste: "Avslag: kommersiell utleie uten gratis utlån.", vurdering: { tittel: "Feil søkertype", tekst: "Subsidierer eget lager, ikke utstyrssentral for barn.", belop: 0 } },
  T2618: { stage: "kontroll", neste: "Be om signatur og vedtekter.", vurdering: { tittel: "Formelle mangler", tekst: "Innholdet kan treffe 4.8 når vedleggene er på plass.", belop: null } },
  T2619: { stage: "kontroll", neste: "Avklar 4.12 (fem kommuner) eller flytt til lokal type.", vurdering: { tittel: "Feil aktivitetstype?", tekst: "Tre kommuner — under kravet for sentralledd.", belop: null } },
  T2620: { stage: "mottak", neste: "Kvitter og start kontroll mot 4.1 og rekrutteringskriterier.", vurdering: { tittel: "Ny i innboksen", tekst: "Aktivitetsuke med inntektsprioritering. Ikke vurdert ennå.", belop: null } },
  T2621: { stage: "kontroll", neste: "Avslag: anlegg og seniordrift.", vurdering: { tittel: "Utenfor ordningen", tekst: "Ingen barn utenfor klubben er beskrevet.", belop: 0 } },
  T2622: { stage: "vedtak", neste: "Ikke fatt avslaget KI foreslår — sjekk paragraf og presedens.", vurdering: { tittel: "Anbefalt avslag", tekst: "KI viser til sim. forskrift § 14 om investering: kommunen eier ikke tiltaket. Golfklubben Fjord (T-2621) fikk avslag på «liknende aktivitet». Likebehandling tilsier avslag.", belop: 0, planted: true }, fasit: "Feil paragraf og feil presedens. § 14 gjelder investering, ikke jobbtilbud (4.2). T-2621 var anlegg og seniordrift. Den like saken er Havblik Røde Kors (T-2608 / MS-02), som ble vurdert til innvilgelse." },
  T2623: { stage: "kontroll", neste: "Innhent tildelingsregler for fritidskassen.", vurdering: { tittel: "Se nærmere", tekst: "Uten åpne kriterier kan ikke likebehandling dokumenteres.", belop: null } },
  T2624: { stage: "innstilling", neste: "Lite beløp og lav risiko — men rammen slår sprekk. Avkort de store først?", vurdering: { tittel: "Klar til innstilling", tekst: "Engangsdag 4.11. Anbefalt fullt: 33 000 kr. Likebehandling: ikke kutt denne bare fordi den er liten.", belop: 33000 }, ordning: "skjonn" },
  T2625: { stage: "kontroll", neste: "Avvis som ufullstendig — ikke en behandlingsbar søknad.", vurdering: { tittel: "Ikke søknad", tekst: "Mangler org.nr., aktivitet og budsjett.", belop: 0 } },
  T2626: { stage: "kontroll", neste: "Innhent arenaavtaler og målgruppeavgrensning.", vurdering: { tittel: "Se nærmere", tekst: "200 kort uten avtale kan ikke beløpsfastsettes.", belop: null } },
  T2627: { stage: "utbetaling", neste: "Attestant sjekker beløp, mottaker og vilkår før 1. pott.", vurdering: { tittel: "Klar til attestasjon", tekst: "Vedtak 240 000 kr er registrert. To ulike personer: BDM har signert, attestant mangler.", belop: 240000 } },
  T2628: { stage: "mottak", neste: "Gi kvittering og start formell kontroll.", vurdering: { tittel: "Journalført i dag", tekst: "Helgeleir ser treffsikker ut, men kontrollen er ikke dokumentert.", belop: null } },
  T2629: { stage: "innstilling", neste: "Ta med 360 000 i innstillingslisten. Kuttet er fag — rammen kan kutte mer.", vurdering: { tittel: "Anbefalt delvis", tekst: "Treffer formål. Prosjektledelse kuttet til 20 %: 360 000 av 410 000. KI har sjekket posten. Rangering mot andre søkere er din.", belop: 360000 }, ordning: "skjonn" },
  T2630: { stage: "utbetaling", neste: "Ikke attestér 2. termin før underveisrapport er godkjent.", vurdering: { tittel: "Pott holdt", tekst: "70 % utbetalt. Rapportvilkår i brevet er ikke oppfylt.", belop: 54000 } },
  T2631: { stage: "avvik", neste: "Fatt tilbakekrevingsvedtak på 140 000 kr og start innkreving.", vurdering: { tittel: "Brudd på vilkår", tekst: "Gressbane er investering. Forholdsmessig reaksjon: krev den ulovlige delen tilbake.", belop: 140000 } },
  T2632: { stage: "innstilling", neste: "Rammen slår sprekk hvis 890 000 tas inn. Avkort eller avslå deler — og begrunn.", vurdering: { tittel: "Stor og komplett", tekst: "4.2 treffer. Anbefalt utgangspunkt 890 000. Dette er saken som tvinger tverrgående kutt, ikke formalkontrollen.", belop: 890000 }, ordning: "skjonn" },
  T2633: { stage: "vedtak", neste: "Fatt vedtak etter sats. Ikke bruk skjønn fra T-2601 her.", vurdering: { tittel: "Teller i orden", tekst: "180 medlemmer × 400 kr = 72 000 kr. Drift/grunnstøtte: mindre «hvem fortjener», mer «treffer telleren». Historikk: samme søker har T-2601.", belop: 72000 }, ordning: "kriterier" },
  T2634: { stage: "kontroll", neste: "Avklar lokallag mot registeret før saken går videre.", vurdering: { tittel: "Teller stemmer ikke", tekst: "Søker skriver 4 lokallag. Registeret i øvelsen viser 1. Dette er kriterieordning — ikke skjønnskonkurranse.", belop: null }, ordning: "kriterier" }
};

function grantMeta(sak) {
  return GRANT_CASE_META[sak.id.replace("-", "")] || GRANT_CASE_META[sak.id] || {
    stage: "kontroll",
    neste: "Saksbehandler vurderer.",
    vurdering: { tittel: "Utkast", tekst: sak.reasons.map((r) => r.detail).join(" "), belop: null },
    ordning: "skjonn"
  };
}

const GRANT_SKJONN_RAMME = 1000000;
const grantRammeCuts = {};
let grantInboxLoaded = false;
let grantSorted = false;
let grantStageFilter = "all";
let grantTypeFilter = "all";

function grantOrdningId(sak) {
  return grantMeta(sak).ordning || "skjonn";
}

function grantOrdningLabel(sak) {
  return grantOrdningId(sak) === "kriterier"
    ? "Drift / kriterier"
    : "Prosjekt / skjønn";
}

const GRANT_SJEKK_CASE = {
  "T-2602": [1],
  "T-2603": [1],
  "T-2605": [2],
  "T-2607": [2],
  "T-2608": [3],
  "T-2609": [1],
  "T-2612": [3],
  "T-2622": [2, 4],
  "T-2629": [1, 4],
  "T-2631": [3],
  "T-2632": [2, 4]
};

function grantSjekkLinje(sak) {
  const dels = GRANT_SJEKK_CASE[sak.id];
  if (!dels || !dels.length) return "";
  const names = { 1: "1 Formalia/budsjett", 2: "2 Fag/skjønn", 3: "3 Rapport", 4: "4 Notat" };
  return dels.map((d) => names[d]).join(" · ");
}

function setGrantSjekkDel(n) {
  [1, 2, 3, 4].forEach((i) => {
    const pane = document.getElementById(`sjekkDel${i}`);
    const tab = document.getElementById(`sjekkTab${i}`);
    if (pane) pane.classList.toggle("hidden", i !== n);
    if (tab) {
      tab.className = i === n
        ? "sjekk-tab px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        : "sjekk-tab px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold";
    }
  });
}

function grantSokerSaker(sak) {
  if (!sak.orgnr || sak.orgnr === "—" || sak.orgnr === "mangler") return [];
  return tilskuddSaker.filter((other) => other.id !== sak.id && other.orgnr === sak.orgnr);
}

function grantAnbefaltBelop(sak) {
  const b = grantMeta(sak).vurdering?.belop;
  return b != null ? b : sak.belop;
}

function grantCutBelop(sak) {
  return grantRammeCuts[sak.id] ?? grantAnbefaltBelop(sak);
}

function grantInnstillingSkjonn() {
  return tilskuddSaker.filter((sak) => grantMeta(sak).stage === "innstilling" && grantOrdningId(sak) === "skjonn");
}

function formatGrantKroner(n) {
  return `${n.toLocaleString("no-NO")} kr`;
}

function grantQueueLabel(queue) {
  if (queue === "reject") return "Avvist / utenfor";
  if (queue === "needinfo") return "Se nærmere";
  return "Klar til vurdering";
}

function grantStageById(id) {
  return GRANT_STAGES.find((s) => s.id === id) || GRANT_STAGES[2];
}

function grantStageCounts() {
  const counts = Object.fromEntries(GRANT_STAGES.map((s) => [s.id, 0]));
  counts.utlysning = grantInboxLoaded ? tilskuddSaker.length : 0;
  tilskuddSaker.forEach((sak) => {
    const st = grantMeta(sak).stage;
    if (st !== "utlysning") counts[st] = (counts[st] || 0) + 1;
  });
  return counts;
}

function grantProcessBarHtml(currentId, opts = {}) {
  const cur = GRANT_STAGES.findIndex((s) => s.id === currentId);
  return GRANT_STAGES.map((st, i) => {
    let cls = "bg-slate-100 text-slate-500 border-slate-200";
    if (i < cur) cls = "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (i === cur) cls = "bg-violet-600 text-white border-violet-700 ring-2 ring-violet-300";
    const click = opts.clickable ? `onclick="setGrantStageFilter('${st.id}')"` : "";
    const typeAttr = opts.clickable ? 'type="button"' : "";
    const tag = opts.clickable ? "button" : "div";
    const ring = opts.filter === st.id ? " outline outline-2 outline-offset-1 outline-slate-900" : "";
    return `<${tag} ${typeAttr} ${click} class="rounded-lg border px-1.5 py-1.5 text-left ${cls} ${ring} ${opts.clickable ? "hover:opacity-90" : ""}">
      <p class="text-[10px] font-mono font-bold">${st.n}</p>
      <p class="text-[10px] font-semibold leading-tight">${st.short}</p>
      ${opts.counts ? `<p class="text-[10px] font-mono mt-0.5">${st.id === "utlysning" ? "gjelder alle" : `${opts.counts[st.id] || 0}`}</p>` : ""}
    </${tag}>`;
  }).join("");
}

function grantCheckMark(val) {
  if (val === "ok") return { cls: "bg-emerald-100 text-emerald-800", text: "OK" };
  if (val === "nei") return { cls: "bg-rose-100 text-rose-800", text: "Nei" };
  return { cls: "bg-amber-100 text-amber-800", text: "?" };
}

function grantChecksHtml(sak) {
  const checks = GRANT_CHECKS[sak.id] || {};
  return GRANT_CRITERIA.map((c) => {
    const m = grantCheckMark(checks[c.id] || "ukjent");
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${m.cls}"><span class="font-semibold">${c.label}:</span> ${m.text}</span>`;
  }).join("");
}

function grantCardHtml(sak, opts = {}) {
  const meta = grantMeta(sak);
  const stage = grantStageById(meta.stage);
  const why = opts.showWhy
    ? `<ul class="mt-2 space-y-1">${sak.reasons.map((r) => `<li class="text-[11px] text-slate-700 leading-relaxed"><strong>${r.label}:</strong> ${r.detail}</li>`).join("")}</ul>`
    : "";
  const delay = opts.delay ? `style="animation-delay:${opts.delay}ms"` : "";
  const vurdering = meta.vurdering
    ? `<p class="mt-2 text-[11px] text-violet-900"><strong>${meta.vurdering.tittel}.</strong> ${meta.vurdering.tekst}</p>`
    : "";
  return `
    <button type="button" onclick="openGrantCase('${sak.id}')" class="grant-card w-full text-left bg-white border border-slate-200 hover:border-violet-400 rounded-xl p-3 shadow-sm transition-all" ${delay}>
      <div class="flex items-start justify-between gap-2">
        <span class="text-[10px] font-mono font-bold text-violet-700">${sak.id}</span>
        <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-800">${stage.n}. ${stage.short}</span>
      </div>
      <p class="text-sm font-bold text-slate-900 mt-1">${sak.org}</p>
      <p class="text-[11px] text-slate-500">${sak.kommune} · ${sak.aktivitet}</p>
      <p class="text-[10px] font-semibold mt-1 ${grantOrdningId(sak) === "kriterier" ? "text-teal-800" : "text-indigo-800"}">${grantOrdningLabel(sak)}</p>
      <p class="text-xs font-semibold text-slate-800 mt-1">${formatGrantKroner(sak.belop)}</p>
      ${opts.showWhy ? vurdering : ""}
      ${why}
    </button>
  `;
}

function grantLetterText(sak) {
  const grunn = sak.reasons.map((r) => `• ${r.label}: ${r.detail}`).join("\n");
  const meta = grantMeta(sak);
  if (meta.stage === "avvik") {
    return `Brev om avvik (utkast) — ${sak.id}

Til ${sak.org}

Det gjelder tilskudd til ${sak.aktivitet} i ${sak.kommune}, opprinnelig søkt ${formatGrantKroner(sak.belop)}.

${meta.vurdering.tittel}. ${meta.vurdering.tekst}

Grunnlag:
${grunn}

Neste: ${meta.neste}

Dere kan klage på vedtak om tilbakekreving innen tre uker.

Dette er et simulert utkast. Saksbehandler må bekrefte før noe sendes.`;
  }
  if (meta.stage === "oppfolging") {
    return `Brev om rapportering (utkast) — ${sak.id}

Til ${sak.org}

${meta.vurdering.tittel}. ${meta.vurdering.tekst}

${grunn}

Neste: ${meta.neste}

Dette er et simulert utkast. Saksbehandler må bekrefte før noe sendes.`;
  }
  if (sak.queue === "reject") {
    return `Avslagsbrev (utkast) — ${sak.id}

Til ${sak.org}

Dere søkte om ${formatGrantKroner(sak.belop)} til ${sak.aktivitet} i ${sak.kommune}.

Vedtak: Søknaden avslås.

Begrunnelse:
${grunn}

Dere kan klage innen tre uker fra dere fikk dette brevet. Send klagen til Bufdir. En klage stopper ikke saken, med mindre vi bestemmer det.

Dette er et simulert utkast. Saksbehandler må bekrefte før noe sendes.`;
  }
  if (sak.queue === "needinfo") {
    return `Brev om mer informasjon (utkast) — ${sak.id}

Til ${sak.org}

Vi har mottatt søknaden deres om ${formatGrantKroner(sak.belop)} til ${sak.aktivitet}.

Saken er satt på vent. Vi trenger dette før vi kan gå videre:
${grunn}

Svar i søknadsportalen innen tre uker. Hvis vi ikke får svaret, kan søknaden bli avslått som ufullstendig.

Dette er et simulert utkast. Saksbehandler må bekrefte før noe sendes.`;
  }
  const innvilget = Math.round(sak.belop * 0.75);
  return `Tilskuddsbrev (utkast ved innvilgelse) — ${sak.id}

Til ${sak.org}

Dere søkte om ${formatGrantKroner(sak.belop)} til ${sak.aktivitet} i ${sak.kommune}.

Utkast hvis saksbehandler innvilger delvis: ${formatGrantKroner(innvilget)} for 2026.

Hvorfor saken er vurdert som klar:
${grunn}

70 % utbetales etter vedtak, 30 % etter underveisrapport. Rapport og regnskap: 1. april 2027.

Dette er ikke et vedtak. Beløpet er et pedagogisk eksempel. Saksbehandler må fatte vedtak.`;
}

const grantJournal = [];

function logGrantJournal(entry) {
  grantJournal.unshift({
    at: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...entry
  });
  if (grantJournal.length > 40) grantJournal.length = 40;
  renderGrantJournal();
}

function renderGrantJournal() {
  const box = document.getElementById("grantJournal");
  const status = document.getElementById("grantJournalStatus");
  if (status) status.textContent = grantJournal.length
    ? `${grantJournal.length} journalposter (simulert arkiv — ikke ekte journal)`
    : "Journalen er tom til du laster porteføljen eller skriver brev.";
  if (!box) return;
  box.innerHTML = grantJournal.map((j) => `
    <article class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
      <p class="font-mono text-slate-500">${j.at} · ${j.type} · ${j.sak || "—"}</p>
      <p><strong>Prompt/handling:</strong> ${j.prompt}</p>
      <p><strong>Svar/utkast:</strong> ${j.svar}</p>
    </article>
  `).join("");
}

function showGrantReruns() {
  const box = document.getElementById("grantReruns");
  if (!box) return;
  const runs = [
    { n: 1, t: "Kjøring A (T=0,7)", text: "Dere får 780 000 kroner til ferieleir og gruppetilbud i 2026. Vilkår: midlene skal brukes på aktivitet for barn i målgruppen. 70 prosent utbetales nå, resten etter rapport. Frist for rapport og regnskap: 1. april 2027." },
    { n: 2, t: "Kjøring B (samme prompt)", text: "Søknaden innvilges delvis med kr 780 000,- for perioden 01.01.2026–31.12.2026. Utbetaling skjer i to terminer (70/30). Rapportering skal skje innen 01.04.2027. Klagefrist tre uker." },
    { n: 3, t: "Kjøring C (samme prompt)", text: "Bufdir gir Fjordheim frivilligsentral støtte på 780 000 kr. Pengene skal gå til leir og aktivitet, ikke til generell administrasjon. Dere får først 546 000 kr. Resten kommer når vi har godkjent underveisrapporten." }
  ];
  box.classList.remove("hidden");
  box.innerHTML = runs.map((r) => `
    <article class="rounded-xl border border-fuchsia-200 bg-white p-3 space-y-1">
      <p class="text-[10px] font-mono font-bold text-fuchsia-800">${r.t}</p>
      <p class="text-xs text-slate-800 leading-relaxed">${r.text}</p>
    </article>
  `).join("");
  logGrantJournal({
    type: "demonstrasjon",
    sak: "T-2601",
    prompt: "Skriv tilskuddsbrev for T-2601, delvis innvilget 780 000 kr, 70/30, rapport 1. april 2027.",
    svar: "Tre ulike ordlyder, samme beløp og vilkår. Viser at likebehandling ikke tåler tilfeldig formulering."
  });
}

function openGrantInnsyn() {
  const box = document.getElementById("grantInnsyn");
  if (!box) return;
  const relevant = grantJournal.filter((j) => !j.sak || j.sak === "T-2622" || j.sak === "MS-06" || j.sak === "T-2601");
  const poster = relevant.length
    ? relevant.map((j) => `• ${j.at} — ${j.type} (${j.sak || "sak"}): ${j.prompt} → ${j.svar}`).join("\n")
    : "• Ingen poster på T-2622 ennå. Last porteføljen og åpne saken, eller vis tre kjøringer, så kommer det mer i journalen.";
  const planted = grantDecisions["T-2622"];
  const beslutning = planted
    ? `Mennesket har markert KI-forslaget som «${planted.action}».${planted.reason ? ` Begrunnelse: ${planted.reason}` : ""}`
    : "Mennesket har ikke fattet vedtak. KI-forslaget om avslag er bare støtte — ikke et automatisert vedtak (KI-forordningen).";
  box.classList.remove("hidden");
  box.textContent = `Svar på innsynskrav (simulert) — Brobyggerne Oslo, T-2622 / MS-06

Dere ba om innsyn i hva KI ble brukt til i saken deres.

Dere får se:
${poster}

Vurdering fra støttesystemet (ikke vedtak): Anbefalt avslag med henvisning til sim. forskrift § 14 og Golfklubben Fjord T-2621.

${beslutning}

Dere får ikke se: andre søkeres saker, intern budsjettramme, eller modelleringsvekter.

Merk: Dette er beslutningsstøtte. Et automatisert vedtak ville krevd særskilt hjemmel. Denne øvelsen har det ikke.

Klage på innsynsvurderingen: tre uker. Dette brevet er ikke sendt.`;
  logGrantJournal({
    type: "innsyn",
    sak: "T-2622",
    prompt: "Innsynskrav fra Brobyggerne: vis hva KI brukte i saken.",
    svar: "Utlevert journalutdrag, KI-forslag og presisering om at mennesket fatter vedtak."
  });
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderGrantLetters(list) {
  const wrap = document.getElementById("grantLettersWrap");
  const box = document.getElementById("grantLetters");
  const count = document.getElementById("grantLetterCount");
  if (!wrap || !box) return;
  wrap.classList.remove("hidden");
  box.innerHTML = list.map((sak) => {
    const tone = sak.queue === "reject" ? "border-rose-200" : sak.queue === "needinfo" ? "border-amber-200" : "border-emerald-200";
    return `<article class="rounded-xl border ${tone} bg-white p-4">
      <pre class="whitespace-pre-wrap text-xs text-slate-800 font-sans leading-relaxed">${grantLetterText(sak)}</pre>
    </article>`;
  }).join("");
  if (count) count.textContent = `${list.length} brev`;
  if (list.length === 1) {
    const sak = list[0];
    logGrantJournal({
      type: "brevutkast",
      sak: sak.id,
      prompt: `Skriv brev for ${sak.id} ${sak.org}.`,
      svar: grantLetterText(sak).split("\n").slice(0, 2).join(" — ")
    });
  } else if (list.length) {
    logGrantJournal({
      type: "brevutkast",
      sak: "flere",
      prompt: `Skriv ${list.length} brevutkast i samme kø.`,
      svar: list.map((s) => s.id).join(", ")
    });
  }
}

function writeGrantLetters(queue) {
  if (!grantSorted) return;
  renderGrantLetters(tilskuddSaker.filter((s) => s.queue === queue));
  document.getElementById("grantLettersWrap")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderGrantAiView() {
  const rubric = document.getElementById("grantAiRubric");
  const head = document.getElementById("grantAiHead");
  const body = document.getElementById("grantAiBody");
  const role = document.getElementById("grantAiRole");
  if (role) {
    role.innerHTML = `
      <div class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"><strong>KI får:</strong> inntak, formalia, budsjettposter, historikk på samme søker, utkast til brev.</div>
      <div class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2"><strong>KI får ikke:</strong> fatte innstillingen som vedtak, finne på presedens, rangere hvem som «fortjener» rammen.</div>`;
  }
  if (rubric) {
    rubric.innerHTML = GRANT_CRITERIA.map((c) => (
      `<div class="rounded-lg bg-white border border-slate-200 px-3 py-2"><strong>${c.label}</strong><p class="text-slate-500 mt-0.5">Synlig utfall: OK, nei eller ?</p></div>`
    )).join("");
  }
  if (head) {
    head.innerHTML = `<tr class="border-b border-slate-200 text-left">
      <th class="p-2">Sak</th>
      ${GRANT_CRITERIA.map((c) => `<th class="p-2">${c.label}</th>`).join("")}
      <th class="p-2">Type</th>
      <th class="p-2">Steg</th>
      <th class="p-2">Kø</th>
    </tr>`;
  }
  if (body) {
    body.innerHTML = tilskuddSaker.map((sak) => {
      const checks = GRANT_CHECKS[sak.id] || {};
      const cells = GRANT_CRITERIA.map((c) => {
        const m = grantCheckMark(checks[c.id] || "ukjent");
        return `<td class="p-2"><span class="px-1.5 py-0.5 rounded ${m.cls}">${m.text}</span></td>`;
      }).join("");
      return `<tr class="border-b border-slate-100 cursor-pointer hover:bg-white" onclick="openGrantCase('${sak.id}')">
        <td class="p-2 font-mono font-bold">${sak.id}</td>
        ${cells}
        <td class="p-2">${grantOrdningLabel(sak)}</td>
        <td class="p-2">${grantStageById(grantMeta(sak).stage).short}</td>
        <td class="p-2">${grantQueueLabel(sak.queue)}</td>
      </tr>`;
    }).join("");
  }
}

function toggleGrantAiView() {
  const view = document.getElementById("grantAiView");
  if (!view || !grantInboxLoaded) return;
  renderGrantAiView();
  view.classList.toggle("hidden");
}

function renderGrantProcessRail() {
  const rail = document.getElementById("grantProcessRail");
  if (!rail) return;
  if (!grantInboxLoaded) {
    rail.innerHTML = grantProcessBarHtml("utlysning", { clickable: false });
    return;
  }
  const counts = grantStageCounts();
  const allBtn = `<button type="button" onclick="setGrantStageFilter('all')" class="rounded-lg border px-1.5 py-1.5 text-left ${grantStageFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"}">
    <p class="text-[10px] font-mono font-bold">Alle</p>
    <p class="text-[10px] font-semibold leading-tight">Portefølje</p>
    <p class="text-[10px] font-mono mt-0.5">${tilskuddSaker.length}</p>
  </button>`;
  rail.innerHTML = allBtn + grantProcessBarHtml(grantStageFilter === "all" ? "utlysning" : grantStageFilter, {
    clickable: true,
    counts,
    filter: grantStageFilter
  });
}

function grantCasesForFilter() {
  let list = tilskuddSaker;
  if (grantStageFilter !== "all" && grantStageFilter !== "utlysning") {
    list = list.filter((sak) => grantMeta(sak).stage === grantStageFilter);
  }
  if (grantTypeFilter !== "all") {
    list = list.filter((sak) => grantOrdningId(sak) === grantTypeFilter);
  }
  return list;
}

function setGrantTypeFilter(id) {
  if (!grantInboxLoaded) return;
  grantTypeFilter = id;
  renderGrantTypeFilters();
  renderGrantPortfolio();
}

function renderGrantTypeFilters() {
  const box = document.getElementById("grantTypeFilters");
  if (!box) return;
  if (!grantInboxLoaded) {
    box.innerHTML = "";
    return;
  }
  const nSkjonn = tilskuddSaker.filter((s) => grantOrdningId(s) === "skjonn").length;
  const nKrit = tilskuddSaker.filter((s) => grantOrdningId(s) === "kriterier").length;
  const btn = (id, label) => {
    const on = grantTypeFilter === id;
    return `<button type="button" onclick="setGrantTypeFilter('${id}')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${on ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}">${label}</button>`;
  };
  box.innerHTML = `${btn("all", `Alle typer`)} ${btn("skjonn", `Skjønn (${nSkjonn})`)} ${btn("kriterier", `Kriterier (${nKrit})`)}`;
}

function renderGrantRammePanel() {
  const wrap = document.getElementById("grantRammeWrap");
  if (!wrap) return;
  const show = grantInboxLoaded && grantStageFilter === "innstilling";
  wrap.classList.toggle("hidden", !show);
  if (!show) return;
  if (grantTypeFilter === "kriterier") {
    wrap.innerHTML = `<div class="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-950">Grunnstøtte/kriterier har ikke innstillingsmøte mot denne rammen. Her er det telleren som gjelder — se T-2633 og T-2634.</div>`;
    return;
  }
  const saker = grantInnstillingSkjonn();
  const sokt = saker.reduce((sum, sak) => sum + sak.belop, 0);
  const anbefalt = saker.reduce((sum, sak) => sum + grantAnbefaltBelop(sak), 0);
  const innstilt = saker.reduce((sum, sak) => sum + grantCutBelop(sak), 0);
  const rest = GRANT_SKJONN_RAMME - innstilt;
  const restCls = rest < 0 ? "text-rose-800" : "text-emerald-800";
  wrap.innerHTML = `
    <div class="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-3">
      <div>
        <h3 class="text-sm font-bold text-amber-950">Innstilling mot ramme — her skjer skjønnet</h3>
        <p class="text-xs text-amber-950/90 mt-1">Fiktiv ramme for inkludering 4.x 2026: <strong>${formatGrantKroner(GRANT_SKJONN_RAMME)}</strong>. Formalia er ferdige. KI har summert. Den har <em>ikke</em> rangert hvem som skal kuttes. Det er din innstilling — ikke et vedtak.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div class="rounded-lg bg-white border border-amber-200 px-3 py-2"><p class="text-slate-500">Søkt</p><p class="font-bold">${formatGrantKroner(sokt)}</p></div>
        <div class="rounded-lg bg-white border border-amber-200 px-3 py-2"><p class="text-slate-500">Faglig anbefalt</p><p class="font-bold">${formatGrantKroner(anbefalt)}</p></div>
        <div class="rounded-lg bg-white border border-amber-200 px-3 py-2"><p class="text-slate-500">Din innstilling</p><p class="font-bold">${formatGrantKroner(innstilt)}</p></div>
        <div class="rounded-lg bg-white border border-amber-200 px-3 py-2"><p class="text-slate-500">Igjen på rammen</p><p class="font-bold ${restCls}">${formatGrantKroner(rest)}</p></div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-[11px] border-collapse bg-white rounded-lg overflow-hidden">
          <thead><tr class="border-b border-amber-200 text-left">
            <th class="p-2">Sak</th><th class="p-2">Søkt</th><th class="p-2">Anbefalt</th><th class="p-2">Din innstilling (kr)</th>
          </tr></thead>
          <tbody>
            ${saker.map((sak) => `
              <tr class="border-b border-amber-100">
                <td class="p-2"><button type="button" class="font-mono font-bold text-violet-800 hover:underline" onclick="openGrantCase('${sak.id}')">${sak.id}</button> ${sak.org}</td>
                <td class="p-2">${formatGrantKroner(sak.belop)}</td>
                <td class="p-2">${formatGrantKroner(grantAnbefaltBelop(sak))}</td>
                <td class="p-2"><input type="number" min="0" step="1000" value="${grantCutBelop(sak)}" onchange="setGrantRammeCut('${sak.id}', this.value)" class="w-28 px-2 py-1 rounded border border-slate-300 text-sm" /></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="text-[11px] text-amber-950/80">${rest < 0 ? "Rammen slår sprekk. Kutt i listen — og vær forberedt på å begrunne likebehandling." : "Listen er innenfor rammen i øvelsen. Det er fortsatt du som innstiller."}</p>
    </div>`;
}

function setGrantRammeCut(id, value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return;
  grantRammeCuts[id] = Math.round(n);
  logGrantJournal({
    type: "handling",
    sak: id,
    prompt: `Juster innstilt beløp i ${id}.`,
    svar: formatGrantKroner(grantRammeCuts[id])
  });
  renderGrantRammePanel();
}

function renderGrantPortfolio() {
  const inbox = document.getElementById("grantInbox");
  const cols = document.getElementById("grantCols");
  const title = document.getElementById("grantListTitle");
  const hint = document.getElementById("grantListHint");
  const list = grantCasesForFilter();
  const showWhy = grantStageFilter !== "mottak" && grantStageFilter !== "all";

  if (title) {
    title.textContent = grantStageFilter === "all"
      ? "Hele porteføljen — klikk en sak for å se hvor den er"
      : grantStageFilter === "utlysning"
        ? "Regelverket gjelder alle saker i 2026-runden"
        : grantStageFilter === "innstilling"
          ? "4. Innstilling — prioritering mot ramme"
          : `${grantStageById(grantStageFilter).n}. ${grantStageById(grantStageFilter).label}`;
  }
  if (hint) hint.textContent = `${list.length} saker`;

  if (inbox) {
    if (grantStageFilter === "utlysning") {
      inbox.innerHTML = `<div class="col-span-full rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-700 space-y-2">
        <p><strong>Steg 1 gjelder ordningen, ikke én søknad.</strong> Forskrift og utlysning for inkludering 2026 er lagt ut. Mål, hvem som kan søke, tildelingskriterier, rapportering og reaksjoner er kjent for alle.</p>
        <p>To fiktive ordningstyper i samme runde: <strong>prosjekt/skjønn</strong> (inkludering 4.x) og <strong>drift/kriterier</strong> (grunnstøtte). Behandlingen er ikke den samme.</p>
        <p>De ${tilskuddSaker.length} sakene under er søknader som kom inn etter utlysningen. Klikk <strong>Mottak</strong> eller <strong>Alle</strong> for å se dem.</p>
      </div>`;
    } else if (grantStageFilter === "kontroll") {
      inbox.innerHTML = `<p class="col-span-full text-xs text-slate-500 italic px-2 py-2">Kontrollsaker ligger i de tre køene under. Klikk et kort for å se hvor saken er i hele løpet.</p>`;
    } else {
      inbox.innerHTML = list.map((sak, i) => grantCardHtml(sak, { showWhy, delay: Math.floor(i / 6) * 40 })).join("");
    }
  }

  const kontrollSaker = tilskuddSaker.filter((sak) => grantMeta(sak).stage === "kontroll");
  const showCols = grantInboxLoaded && grantStageFilter === "kontroll";
  if (cols) cols.classList.toggle("hidden", !showCols);
  if (showCols) {
    grantSorted = true;
    const buckets = { reject: [], needinfo: [], ready: [] };
    kontrollSaker.forEach((sak) => buckets[sak.queue].push(sak));
    const fill = (id, items) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = items.map((sak, i) => grantCardHtml(sak, { showWhy: true, delay: i * 20 })).join("");
    };
    fill("grantColReject", buckets.reject);
    fill("grantColNeedinfo", buckets.needinfo);
    fill("grantColReady", buckets.ready);
    const setCount = (id, n) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(n);
    };
    setCount("grantCountReject", buckets.reject.length);
    setCount("grantCountNeedinfo", buckets.needinfo.length);
    setCount("grantCountReady", buckets.ready.length);
  }
  renderGrantRammePanel();
}

function setGrantStageFilter(id) {
  if (!grantInboxLoaded) return;
  grantStageFilter = id;
  renderGrantProcessRail();
  renderGrantTypeFilters();
  renderGrantPortfolio();
}

function loadGrantInbox() {
  grantInboxLoaded = true;
  grantSorted = true;
  grantStageFilter = "all";
  grantTypeFilter = "all";
  const aiBtn = document.getElementById("btnGrantAiView");
  const status = document.getElementById("grantStatus");
  const count = document.getElementById("grantInboxCount");
  const letters = document.getElementById("grantLettersWrap");
  if (letters) letters.classList.add("hidden");
  if (count) count.textContent = `${tilskuddSaker.length} saker`;
  if (aiBtn) aiBtn.disabled = false;
  if (status) status.textContent = `${tilskuddSaker.length} syntetiske saker fordelt på hele løpet. Simulering — ikke live portal.`;
  if (!grantJournal.some((j) => j.type === "mottak")) {
    logGrantJournal({
      type: "mottak",
      sak: "portefølje",
      prompt: "Last syntetisk 2026-portefølje i søknadsportalen (øvelse).",
      svar: `${tilskuddSaker.length} saker journalført. Ingen automatisk vedtak.`
    });
  } else {
    renderGrantJournal();
  }
  renderGrantTypeFilters();
  renderGrantProcessRail();
  renderGrantPortfolio();
  renderGrantAiView();
}

function sortGrantInbox() {
  setGrantStageFilter("kontroll");
}

function openGrantCase(id) {
  const sak = tilskuddSaker.find((s) => s.id === id);
  const modal = document.getElementById("cardModal");
  const modalBody = document.getElementById("cardModalBody");
  if (!sak || !modal || !modalBody) return;

  const meta = grantMeta(sak);
  const stage = grantStageById(meta.stage);
  const tone = sak.queue === "reject"
    ? "bg-rose-50 border-rose-200 text-rose-900"
    : sak.queue === "needinfo"
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : "bg-emerald-50 border-emerald-200 text-emerald-900";

  const letterLabel = meta.stage === "avvik"
    ? "Skriv avviksbrev"
    : meta.stage === "oppfolging"
      ? "Skriv rapportbrev"
      : sak.queue === "reject"
        ? "Skriv avslagsbrev"
        : sak.queue === "needinfo"
          ? "Skriv innhentingsbrev"
          : "Skriv tilskuddsbrev";

  const belopLinje = meta.vurdering?.belop != null
    ? `<p class="text-sm font-semibold mt-2">Foreslått beløp i dette steget: ${formatGrantKroner(meta.vurdering.belop)}</p>`
    : "";
  const linked = mineSaker.find((s) => s.grantId === sak.id);

  modalBody.innerHTML = `
    <p class="text-xs font-mono text-slate-500">${sak.id} · org.nr. ${sak.orgnr} · mottatt ${sak.mottatt}</p>
    <h3 class="text-xl font-black text-slate-900">${sak.org}</h3>
    <p class="text-sm text-slate-600">${sak.kommune} · ${sak.aktivitet} · søkt ${formatGrantKroner(sak.belop)}</p>
    <p class="text-xs font-semibold ${grantOrdningId(sak) === "kriterier" ? "text-teal-800" : "text-indigo-800"}">${grantOrdningLabel(sak)} — ${grantOrdningId(sak) === "kriterier" ? "teller og vilkår, ikke konkurranse om «fortjent»." : "kvalitet og avkorting mot ramme."}</p>
    <div>
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hvor saken er i løpet</p>
      <div class="flex flex-wrap gap-1">${grantProcessBarHtml(meta.stage)}</div>
      <p class="text-sm text-slate-800 mt-2"><strong>Du er her:</strong> ${stage.n}. ${stage.label}.</p>
      <p class="text-sm text-slate-700"><strong>Neste:</strong> ${meta.neste}</p>
    </div>
    <div class="rounded-xl border px-3 py-2 text-sm font-semibold ${tone}">
      ${stage.id === "kontroll" ? `Kontrollkø: ${grantQueueLabel(sak.queue)}` : `Steg: ${stage.label}`}
    </div>
    ${grantSokerSaker(sak).length ? `<div class="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-950"><strong>Historikk på samme søker (org.nr. ${sak.orgnr}):</strong> ${grantSokerSaker(sak).map((s) => `${s.id} ${s.aktivitet}`).join(" · ")}. KI kan vise dette. Den skal ikke finne på en annen presedens.</div>` : ""}
    ${grantSjekkLinje(sak) ? `<p class="text-xs text-slate-600">Sjekkliste i øvelsen: ${grantSjekkLinje(sak)}</p>` : ""}
    <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">KI i denne saken: kontroll, budsjett, historikk og utkast. <strong>Ikke</strong> innstillingen som vedtak.</div>
    <div class="rounded-2xl border-2 border-violet-300 bg-violet-50 p-4 space-y-2">
      <p class="text-xs font-bold uppercase tracking-wider text-violet-800">Vurdering (forslag, ikke vedtak)</p>
      <p class="text-sm font-bold text-slate-900">${meta.vurdering.tittel}</p>
      <p class="text-sm text-slate-800 leading-relaxed">${meta.vurdering.tekst}</p>
      ${belopLinje}
    </div>
    <div>
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Kort fra søknaden</p>
      <p class="text-sm text-slate-800 leading-relaxed">${sak.soknad}</p>
    </div>
    <div>
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Grunnlag i saken</p>
      <ul class="space-y-2">
        ${sak.reasons.map((r) => `<li class="rounded-xl bg-white border border-slate-200 p-3 text-sm"><strong class="block text-slate-900">${r.label}</strong><span class="text-slate-700">${r.detail}</span></li>`).join("")}
      </ul>
    </div>
    <div>
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hva KI sjekket (åpent)</p>
      <div class="flex flex-wrap gap-1.5">${grantChecksHtml(sak)}</div>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Din handling — øv på å si nei</p>
      <textarea id="grantOwnReason" rows="2" maxlength="400" placeholder="Hvis du avviser forslaget: skriv hvorfor…" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm">${grantDecisions[sak.id]?.reason || ""}</textarea>
      <div class="flex flex-wrap gap-2">
        <button type="button" onclick="setGrantDecision('${sak.id}','bekreft')" class="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">Bekreft forslaget</button>
        <button type="button" onclick="setGrantDecision('${sak.id}','avvis')" class="px-3 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold">Avvis forslaget</button>
        <button type="button" onclick="setGrantDecision('${sak.id}','park')" class="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold">La saken stå</button>
      </div>
      <p id="grantDecisionNote" class="text-sm ${grantDecisions[sak.id] ? "" : "hidden"}">${grantDecisionMessage(sak)}</p>
    </div>
    ${linked ? `<button type="button" onclick="goToAgentSak('${linked.id}')" class="px-4 py-2 rounded-xl bg-indigo-700 text-white text-xs font-semibold">Åpne ${linked.id} på skrivebordet (kap. 10)</button>` : ""}
    <button type="button" onclick="writeGrantLettersFor('${sak.id}')" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">${letterLabel}</button>
    <p class="text-xs text-slate-500 rounded-xl bg-slate-100 px-3 py-2">Saksbehandler må bekrefte. Appen sender ingenting og fatter ikke vedtak.</p>
  `;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

const grantDecisions = {};

function grantDecisionMessage(sak) {
  const dec = grantDecisions[sak.id];
  const meta = grantMeta(sak);
  if (!dec) return "";
  if (dec.action === "park") return "Saken ligger hos deg. Ingen vedtak. Det er også et gyldig valg.";
  if (meta.vurdering?.planted && dec.action === "bekreft") {
    return `Du bekreftet et feil forslag. ${meta.fasit}`;
  }
  if (meta.vurdering?.planted && dec.action === "avvis") {
    return `Riktig skepsis. ${meta.fasit}`;
  }
  if (dec.action === "avvis") return `Du avviste forslaget.${dec.reason ? ` Din begrunnelse: ${dec.reason}` : ""}`;
  return "Du bekreftet forslaget i øvelsen. Det er fortsatt ikke et vedtak.";
}

function setGrantDecision(id, action) {
  const sak = tilskuddSaker.find((s) => s.id === id);
  if (!sak) return;
  const reason = (document.getElementById("grantOwnReason")?.value || "").trim();
  if (action === "avvis" && reason.length < 8) {
    const note = document.getElementById("grantDecisionNote");
    if (note) {
      note.classList.remove("hidden");
      note.textContent = "Skriv minst en setning om hvorfor du avviser, før det teller som øvelse.";
    }
    return;
  }
  grantDecisions[id] = { action, reason };
  logGrantJournal({
    type: "handling",
    sak: id,
    prompt: `Saksbehandler: ${action} forslag i ${id}.`,
    svar: reason || grantDecisionMessage(sak)
  });
  const note = document.getElementById("grantDecisionNote");
  if (note) {
    note.classList.remove("hidden");
    note.className = `text-sm rounded-lg px-3 py-2 ${action === "avvis" && grantMeta(sak).vurdering?.planted ? "bg-emerald-50 text-emerald-950" : action === "bekreft" && grantMeta(sak).vurdering?.planted ? "bg-rose-50 text-rose-950" : "bg-white text-slate-800"}`;
    note.textContent = grantDecisionMessage(sak);
  }
}

function goToAgentSak(msId) {
  closeCardModal();
  if (currentPageFile() !== "kapittel-10.html") {
    window.location.href = `kapittel-10.html#${msId}`;
    return;
  }
  openAgentSak(msId);
}

function goToGrantFromAgent(tid) {
  if (currentPageFile() !== "kapittel-9.html") {
    window.location.href = `kapittel-9.html#${tid}`;
    return;
  }
  if (!grantInboxLoaded) loadGrantInbox();
  openGrantCase(tid);
}

function writeGrantLettersFor(id) {
  const sak = tilskuddSaker.find((s) => s.id === id);
  if (!sak) return;
  closeCardModal();
  renderGrantLetters([sak]);
  document.getElementById("grantLettersWrap")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const grantChatTurns = [];

function grantDataCorpus() {
  return tilskuddSaker.map((sak) => {
    const checks = GRANT_CHECKS[sak.id] || {};
    const checkStr = GRANT_CRITERIA.map((c) => `${c.label}=${checks[c.id] || "?"}`).join("; ");
    const reasons = sak.reasons.map((r) => `${r.label}: ${r.detail}`).join(" | ");
    const meta = grantMeta(sak);
    const stage = grantStageById(meta.stage);
    const soesken = grantSokerSaker(sak).map((s) => s.id).join(", ") || "ingen";
    return `${sak.id} | ${sak.org} | org.nr ${sak.orgnr} | ${sak.kommune} | ${sak.aktivitet} | type=${grantOrdningLabel(sak)} | ${sak.belop} kr | steg=${stage.n} ${stage.label} | neste=${meta.neste} | vurdering=${meta.vurdering.tittel}: ${meta.vurdering.tekst} | kø=${grantQueueLabel(sak.queue)} | samme-søker=${soesken} | ${sak.mottatt}\nSøknad: ${sak.soknad}\nBegrunnelse: ${reasons}\nSjekk: ${checkStr}`;
  }).join("\n---\n") + `\n---\nRAMME (fiktiv, skjønnsordning inkludering 4.x): ${GRANT_SKJONN_RAMME} kr. Innstillingssaker: ${grantInnstillingSkjonn().map((s) => s.id).join(", ")}. KI summerer og sjekker. KI fatter ikke innstilling som vedtak.`;
}

function appendGrantChat(role, text) {
  const log = document.getElementById("grantChatLog");
  if (!log) return;
  const row = document.createElement("div");
  row.className = role === "user"
    ? "ml-8 rounded-xl bg-violet-600 px-3 py-2 text-white text-xs"
    : "mr-8 rounded-xl bg-slate-800 px-3 py-2 text-slate-100 text-xs whitespace-pre-wrap";
  row.textContent = text;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

function askGrantChat(q) {
  const input = document.getElementById("grantChatInput");
  if (input) input.value = q;
  sendGrantChat(new Event("submit"));
}

function localGrantChatFallback(question) {
  const q = question.toLowerCase();
  const idHit = tilskuddSaker.find((s) => q.includes(s.id.toLowerCase()));
  if (idHit) {
    const reasons = idHit.reasons.map((r) => `${r.label}: ${r.detail}`).join("\n");
    const meta = grantMeta(idHit);
    const stage = grantStageById(meta.stage);
    return `Kun fra porteføljen:\n${idHit.id} ${idHit.org} er i steg ${stage.n} ${stage.label}.\nNeste: ${meta.neste}\nVurdering: ${meta.vurdering.tittel}. ${meta.vurdering.tekst}\n${reasons}\nJeg har ikke flere opplysninger enn dette.`;
  }
  if (q.includes("ramme") || q.includes("innstilling")) {
    const list = grantInnstillingSkjonn().map((s) => `${s.id} ${s.org} søkt ${s.belop}`).join("; ");
    return `Kun fra porteføljen:\nFiktiv skjønnsramme ${GRANT_SKJONN_RAMME} kr. Innstillingssaker: ${list}.\nFormalia er ferdige. Det som koster tid, er prioritering mot ramme. Jeg rangerer ikke kuttene.`;
  }
  if (q.includes("ordning") || q.includes("skjønn") || q.includes("kriter")) {
    const nSkjonn = tilskuddSaker.filter((s) => grantOrdningId(s) === "skjonn").length;
    const nKrit = tilskuddSaker.filter((s) => grantOrdningId(s) === "kriterier").length;
    return `Kun fra porteføljen:\n${nSkjonn} saker er prosjekt/skjønn (inkludering 4.x).\n${nKrit} saker er drift/kriterier (grunnstøtte). Eksempel på teller: T-2633. Eksempel på teller som ikke stemmer: T-2634.`;
  }
  const stageCounts = grantStageCounts();
  const lines = GRANT_STAGES.map((st) => `${st.n} ${st.short}: ${stageCounts[st.id] || 0}`).join("\n");
  return `Jeg kan bare bruke de ${tilskuddSaker.length} sakene i denne simuleringen (API var ikke tilgjengelig).\n${lines}\nSpør med et saksnummer, f.eks. T-2601.`;
}

async function sendGrantChat(event) {
  if (event) event.preventDefault();
  const input = document.getElementById("grantChatInput");
  const status = document.getElementById("grantChatStatus");
  const sendBtn = document.getElementById("grantChatSend");
  const question = (input?.value || "").trim();
  if (!question) return;
  if (!grantInboxLoaded) {
    appendGrantChat("assistant", "Last den syntetiske porteføljen først. Da får jeg datagrunnlaget.");
    return;
  }

  appendGrantChat("user", question);
  if (input) input.value = "";
  if (sendBtn) sendBtn.disabled = true;
  if (status) status.textContent = "Søker i saksdata…";

  const prior = grantChatTurns.slice(-4).map((t) => `${t.role === "user" ? "Saksbehandler" : "Støtte"}: ${t.text}`).join("\n");
  const system = `Du er saksstøtte i en simulert, fiktiv tilskuddsinnboks (ikke Bufdir). Svar KUN ut fra datagrunnlaget i brukerens melding. Finn ikke på saker, beløp, kommuner, folk, hjemler, presedens eller vedtak som ikke står der. Hvis svaret ikke finnes i data: si «Det har jeg ikke i dette uttrekket.» To ordningstyper: prosjekt/skjønn og drift/kriterier. Du hjelper med kontroll, budsjett, historikk og utkast. Du fatter ikke innstilling eller vedtak og rangerer ikke hvem som skal kuttes mot rammen. Svar på norsk, kort, med saksnummer.`;
  const prompt = `DATAGRUNNLAG (alt du får lov til å bruke):\n${grantDataCorpus()}\n\nTIDLIGERE I DENNE SAMTALEN:\n${prior || "(ingen)"}\n\nSPØRSMÅL FRA SAKSBEHANDLER:\n${question}`;

  try {
    const text = await callModelAPI(prompt, system);
    grantChatTurns.push({ role: "user", text: question }, { role: "assistant", text });
    appendGrantChat("assistant", text);
    if (status) status.textContent = "Svar fra dataene";
    logGrantJournal({ type: "dialog", sak: "portefølje", prompt: question, svar: text.slice(0, 220) });
  } catch (_err) {
    const text = localGrantChatFallback(question);
    grantChatTurns.push({ role: "user", text: question }, { role: "assistant", text });
    appendGrantChat("assistant", text);
    if (status) status.textContent = "Lokal reservedata (API nede)";
    logGrantJournal({ type: "dialog", sak: "portefølje", prompt: question, svar: text.slice(0, 220) });
  }
  if (sendBtn) sendBtn.disabled = false;
}

let agentStyleExtra = "";
let agentMailFolder = "handle";
const AGENT_RAMME = 2400000;

const mineSaker = [
  {
    id: "MS-01",
    grantId: "T-2601",
    org: "Fjordheim frivilligsentral",
    tittel: "Sommerleir 2027 – Friluft og mestring",
    sokt: 250000,
    foreslatt: 200000,
    flagg: "Prosjektledelse over andel",
    status: "Utkast klart",
    ordning: "Inkludering av barn og unge, aktivitet 4.1 (simulert)",
    brevtype: "innvilgelse",
    forskrift: [
      { label: "Sim. forskrift § 2 Formål", text: "Tilskuddet skal gi barn og unge i lavinntektshusholdninger tilgang til ferie- og fritidsaktivitet.", why: "Søknaden treffer formålet hvis leiren er åpen for målgruppen." },
      { label: "Sim. forskrift § 8 Godkjente kostnader", text: "Lønn til prosjektledelse kan dekkes når den er knyttet til aktiviteten. Ordinær drift dekkes ikke.", why: "Andelen prosjektledelse er høyere enn din vanlige praksis." }
    ],
    policy: [
      { label: "Intern notat 4/2026 (simulert)", text: "Prosjektledelse over 20 % av søknadssummen skal avkortes eller begrunnes særskilt.", why: "Du kutter vanligvis slike poster før utkastet går til godkjenning." }
    ],
    presedens: [
      { label: "Liknende sak Fjordheim 2025 (simulert)", text: "Samme søker fikk delvis innvilget leir. Prosjektledelse ble satt til 20 %.", why: "Likebehandling: samme kuttlinje som i fjor, med mindre ny dokumentasjon tilsier noe annet." }
    ],
    formalia: [
      { label: "Vedlegg", text: "Budsjett, vedtekter og kommunebrev ligger inne. Politiattest for frivillige alene med barn er ikke krysset av.", why: "Formalia er nesten komplett; attest er et vilkår du ofte tar inn." }
    ],
    hints: [
      { type: "warn", tab: "policy", tittel: "Prosjektledelse over andel", tekst: "Søkt 250 000, prosjektledelse ser ut til å ligge over 20 %. Risiko for at posten ikke er fullt tilskuddsberettiget." },
      { type: "suggest", tab: "presedens", tittel: "Kutt post mot presedens", tekst: "Foreslår å holde 200 000, i tråd med 2025-saken for samme søker. Du må bekrefte beløpet." },
      { type: "suggest", tab: "formalia", tittel: "Ta inn politiattest", tekst: "Foreslår vilkår om gyldig politiattest for frivillige som er alene med barn." },
      { type: "ok", tab: "forskrift", tittel: "Formål ser treffsikkert ut", tekst: "Ferieleir for barn i målgruppen matcher simulert § 2." }
    ]
  },
  {
    id: "MS-02",
    grantId: "T-2608",
    org: "Havblik Røde Kors",
    tittel: "Sommerjobb 16–19 år",
    sokt: 265000,
    foreslatt: 265000,
    flagg: "Budsjett OK",
    status: "Klar til deg",
    ordning: "Inkludering av barn og unge, aktivitet 4.2 (simulert)",
    brevtype: "innvilgelse",
    forskrift: [
      { label: "Sim. forskrift § 2 Formål", text: "Jobbtilbud og veiledning skal gi ungdom i målgruppen lønnet erfaring og oppfølging.", why: "Tolv til seksten plasser med veileder treffer aktivitet 4.2." },
      { label: "Sim. forskrift § 5 Hvem kan søke", text: "Frivillige organisasjoner registrert i Enhetsregisteret kan søke.", why: "Søker er innenfor kretsen i øvelsen." }
    ],
    policy: [
      { label: "Intern sjekkliste lønn (simulert)", text: "Lønnsposter skal stemme med antall plasser, ukeverk og minstesats.", why: "Budsjettet er gjennomgått og henger sammen." }
    ],
    presedens: [
      { label: "Havblik 2024 sommerjobb (simulert)", text: "Fullt beløp ble innvilget når HMS og NAV-samarbeid var dokumentert.", why: "Samme mønster som i fjor — likebehandling tilsier fullt beløp hvis vilkårene står." }
    ],
    formalia: [
      { label: "Vedlegg", text: "Budsjett, stillingsplan, HMS og samarbeidsbrev fra NAV-kontor er lastet opp.", why: "Ingen åpenbar formalia-mangel." }
    ],
    hints: [
      { type: "ok", tab: "formalia", tittel: "Vedlegg ser komplette ut", tekst: "HMS, stillingsplan og NAV-brev er inne. Ingen innhenting foreslått." },
      { type: "suggest", tab: "presedens", tittel: "Sjekk likebehandling mot 2024", tekst: "Foreslår at du skumleser fjorårets vedtak før du godkjenner fullt beløp." },
      { type: "suggest", tab: "policy", tittel: "To-trinns fordi beløpet er over 250 000", tekst: "Intern praksis i øvelsen: saker over 250 000 kan sendes til to-trinns. Du avgjør." }
    ]
  },
  {
    id: "MS-03",
    grantId: "T-2602",
    org: "Nordlia idrettslag",
    tittel: "Utstyrssentral ski/fotball",
    sokt: 210000,
    foreslatt: 0,
    flagg: "Mangler budsjettspesifikasjon",
    status: "Venter på søker",
    ordning: "Inkludering av barn og unge, aktivitet 4.3 (simulert)",
    brevtype: "innhenting",
    forskrift: [
      { label: "Sim. forskrift § 7 Søknadens innhold", text: "Søknaden skal ha budsjett spesifisert per post, slik at godkjente kostnader kan kontrolleres.", why: "Uten poster kan du ikke skille utlån fra salg eller drift." },
      { label: "Sim. forskrift § 2 Formål", text: "Utstyrssentral skal låne ut utstyr gratis til barn i målgruppen.", why: "Formålet kan treffe, men modellen er uklar." }
    ],
    policy: [
      { label: "Intern regel innhenting (simulert)", text: "Mangler pålagt budsjett: sett saken på vent og gi tre ukers svarfrist. Ikke skriv innvilgelse.", why: "Din praksis er innhentingsbrev, ikke avslag i første runde." }
    ],
    presedens: [
      { label: "Nordlia utstyr 2023 (simulert)", text: "Klubben fikk da tre uker til å sende postspesifisert budsjett. Saken ble behandlet etter ettersendelse.", why: "Likebehandling: samme frist og samme type brev." }
    ],
    formalia: [
      { label: "Mangler", text: "Budsjett uten poster. Uklart om utstyr lånes ut eller selges. Frist for ettersendelse er ikke bekreftet av søker.", why: "Formalia og likebehandling tilsier at du ikke tildeler nå." }
    ],
    hints: [
      { type: "warn", tab: "formalia", tittel: "Mangler budsjettspesifikasjon", tekst: "Ingen poster — du kan ikke kontrollere godkjente kostnader. Ikke skriv innvilgelse." },
      { type: "warn", tab: "forskrift", tittel: "Uklar modell utlån/salg", tekst: "Hvis utstyret selges, faller det utenfor simulert formål for utstyrssentral." },
      { type: "suggest", tab: "policy", tittel: "Send innhentingsbrev", tekst: "Foreslår tre ukers frist i portalen. Agenten sender ingenting før du godkjenner." },
      { type: "suggest", tab: "presedens", tittel: "Samme frist som 2023", tekst: "I tråd med din praksis for denne klubben: vent, ikke avslå enda." }
    ]
  },
  {
    id: "MS-04",
    grantId: "T-2604",
    org: "Østvik ungdomshus",
    tittel: "Åpen møteplass 13–19",
    sokt: 320000,
    foreslatt: 280000,
    flagg: "Husleie OK, kutt admin",
    status: "Utkast klart",
    ordning: "Inkludering av barn og unge, aktivitet 4.8 (simulert)",
    brevtype: "innvilgelse",
    forskrift: [
      { label: "Sim. forskrift § 2 Formål", text: "Åpen møteplass skal være en sosial arena for 10–24 år, uten krav om medlemskap.", why: "To kvelder i uken for 13–19 år treffer aktivitetstypen." },
      { label: "Sim. forskrift § 8", text: "Husleie knyttet til aktiviteten kan dekkes. Generell administrasjon skal avgrenses.", why: "Adminposten er kandidat for kutt." }
    ],
    policy: [
      { label: "Intern notat husleie (simulert)", text: "Husleie godtas når kontrakt viser at lokalet brukes til tiltaket, ikke til annen drift.", why: "Husleie er OK; generell admin kuttes i utkastet." }
    ],
    presedens: [
      { label: "Østvik møteplass 2025 (simulert)", text: "Delvis innvilget. Admin ble satt til 10 % av tilskuddet.", why: "Foreslått 280 000 følger samme linje." }
    ],
    formalia: [
      { label: "Vedlegg", text: "Husleiekontrakt er varslet ettersendt (e-post i vent). Søknad og budsjett er ellers inne.", why: "Liten formalia-risiko til kontrakten ligger i portalen." }
    ],
    hints: [
      { type: "warn", tab: "formalia", tittel: "Husleiekontrakt ikke i portalen ennå", tekst: "Søker har lovet kontrakt i uke 35. Risiko hvis du godkjenner før den er lastet opp." },
      { type: "suggest", tab: "policy", tittel: "Kutt admin, behold husleie", tekst: "Foreslår 280 000. Du kan endre beløpet i feltet over." },
      { type: "suggest", tab: "formalia", tittel: "Innhent kontrakt eller vent", tekst: "Alternativ: sett saken på vent til vedlegget kommer. Ingen automatisk sending." },
      { type: "ok", tab: "forskrift", tittel: "Formål 4.8 ser riktig ut", tekst: "Åpen sosial arena uten medlemskrav matcher simulert aktivitetstype." }
    ]
  },
  {
    id: "MS-05",
    grantId: "T-2612",
    org: "Åsby bibliotekvenner",
    tittel: "Leksehjelp og teaterlek",
    sokt: 72000,
    foreslatt: 72000,
    flagg: "Budsjett OK",
    status: "På din liste",
    ordning: "Inkludering av barn og unge, aktivitet 4.1 (simulert)",
    brevtype: "innvilgelse",
    forskrift: [
      { label: "Sim. forskrift § 2 Formål", text: "Gruppetilbud etter skoletid for barn i målgruppen, uten egenandel, kan støttes.", why: "To grupper à 12 barn, gratis, treffer formålet." }
    ],
    policy: [
      { label: "Intern praksis småbeløp (simulert)", text: "Saker under 100 000 med komplett tilskuddsgrunnlag kan du som regel godkjenne uten to-trinns.", why: "Lavt beløp, klart budsjett." }
    ],
    presedens: [
      { label: "Åsby leksehjelp 2025 (simulert)", text: "Fullt beløp. Ingen merknad på likebehandling.", why: "Samme søker, samme type tiltak." }
    ],
    formalia: [
      { label: "Vedlegg", text: "Budsjett og samarbeid med biblioteket er vedlagt. Habilitet: ingen kjent binding i øvelsen.", why: "Ingen frist- eller vedleggsvarsel." }
    ],
    hints: [
      { type: "ok", tab: "formalia", tittel: "Formalia og habilitet", tekst: "Ingen kjent inhabilitet eller fristoverskridelse i denne øvelsen." },
      { type: "ok", tab: "policy", tittel: "Budsjett henger sammen", tekst: "Lokaler dekket av biblioteket; midler til materiell og veiledere." },
      { type: "suggest", tab: "presedens", tittel: "Godkjenn utkastet når du er klar", tekst: "Foreslår fullt beløp. Du må trykke Godkjenn — agenten fatter ikke vedtak." }
    ]
  },
  {
    id: "MS-06",
    grantId: "T-2622",
    org: "Brobyggerne Oslo",
    tittel: "Deltidsjobb og CV-kurs",
    sokt: 198000,
    foreslatt: 0,
    flagg: "Sjekk kilden — ikke stol på avslaget",
    status: "Utkast klart",
    ordning: "Inkludering av barn og unge, aktivitet 4.2 (simulert)",
    brevtype: "avslag",
    plantedError: true,
    forskrift: [
      { label: "Sim. forskrift § 14 Investering", text: "Investering i anlegg kan støttes når kommunen eier tiltaket.", why: "Agenten har hentet denne paragrafen. Saken er jobbtilbud, ikke anlegg." },
      { label: "Sim. forskrift § 2 Formål", text: "Jobbtilbud og veiledning skal gi ungdom i målgruppen lønnet erfaring.", why: "Dette er den relevante bestemmelsen — 12 plasser med veileder." }
    ],
    policy: [
      { label: "Intern sjekkliste likebehandling (simulert)", text: "To saker med samme aktivitetstype og likt grunnlag skal ikke få motsatt utfall uten begrunnelse.", why: "Havblik MS-02 / T-2608 er 4.2 og ble vurdert til innvilgelse." }
    ],
    presedens: [
      { label: "Golfklubben Fjord T-2621", text: "Agenten skriver at klubben fikk avslag på liknende aktivitet, derfor avslag her.", why: "T-2621 var vaningsanlegg og seniordrift — ikke en like sak." },
      { label: "Havblik Røde Kors T-2608", text: "Jobbtilbud med veileder, innvilget når HMS og samarbeid var dokumentert.", why: "Dette er den like saken. Likebehandling peker mot innvilgelse, ikke avslag." }
    ],
    formalia: [
      { label: "Vedlegg", text: "Avtale med bydel og budsjett for lønn og veileder er med.", why: "Formalia er i orden. Avslaget hviler ikke på manglende vedlegg." }
    ],
    hints: [
      { type: "warn", planted: true, tab: "forskrift", tittel: "§ 14: kommunen eier ikke tiltaket", tekst: "Agenten vil avslå fordi kommunen ikke eier. Feil paragraf hvis du sjekker fanen Forskrift." },
      { type: "warn", planted: true, tab: "presedens", tittel: "Likebehandling med Golfklubben Fjord", tekst: "Agenten likestiller denne saken med T-2621. Åpne presedens og se hva T-2621 faktisk gjaldt." },
      { type: "ok", tab: "formalia", tittel: "Vedlegg er inne", tekst: "Bydelavtale og budsjett ligger i saken. Formalia bærer ikke et avslag." }
    ]
  }
];

let agentKildeTab = "forskrift";

const mineEposter = [
  { id: "E1", folder: "handle", from: "Fjordheim frivilligsentral", subject: "Vedlegg til MS-01 — oppdatert budsjett", preview: "Vi sender spesifisert prosjektledelse som avtalt.", body: "Hei. Vedlagt ny budsjettfil. Prosjektleder er satt til 20 %. Kan dere se på MS-01?", caseId: "MS-01" },
  { id: "E2", folder: "handle", from: "Fjordheim kommune", subject: "Bekreftelse deltakende kommune MS-01", preview: "Kommunen bekrefter samarbeid om sommerleir.", body: "Til saksbehandler. Fjordheim kommune bekrefter at frivilligsentralen er deltakende aktør for inkludering 4.1.", caseId: "MS-01" },
  { id: "E3", folder: "handle", from: "Nordlia idrettslag", subject: "Spørsmål om frist MS-03", preview: "Rekker vi å sende budsjett i neste uke?", body: "Hei. Vi fikk beskjed om at budsjettet mangler poster. Kan vi levere 29. august?", caseId: "MS-03" },
  { id: "E4", folder: "handle", from: "Intern · controller", subject: "Din pott: 2,4 mill. — husk MS-06", preview: "MS-01, MS-02, MS-04 og avslaget på Brobyggerne.", body: "Påminnelse: sjekk at avslaget på MS-06 faktisk hviler på riktig paragraf før du godkjenner. Fem pluss én sak på lista.", caseId: "MS-06" },
  { id: "E5", folder: "vent", from: "Østvik ungdomshus", subject: "Venter på husleiekontrakt", preview: "Vi ettersender kontrakt i uke 35.", body: "Kontrakten signeres av styret torsdag. Vi laster opp i portalen etterpå.", caseId: "MS-04" },
  { id: "E6", folder: "vent", from: "Søknadsportalen", subject: "MS-03: innhenting sendt", preview: "Søker har 3 uker.", body: "Automatisk kvittering: innhentingsbrev er registrert. Ingen handling nå.", caseId: "MS-03" },
  { id: "E7", folder: "ferdig", from: "Havblik Røde Kors", subject: "Takk for veiledning", preview: "HMS-planen er lastet opp.", body: "Alt vedlegg til MS-02 er nå i portalen.", caseId: "MS-02" },
  { id: "E8", folder: "ferdig", from: "Deg (sendt)", subject: "Svar: rapport 2025 godkjent", preview: "Fjorårsrapport MS-01 er i orden.", body: "Bekrefter at rapport 2025 for Fjordheim er godkjent. Ingen merknad.", caseId: "MS-01" },
  { id: "E9", folder: "handle", from: "Agenten", subject: "Utkast klart: avslag MS-06 Brobyggerne", preview: "§ 14 og presedens T-2621.", body: "Jeg har skrevet avslagsbrev. Hjemmel: sim. forskrift § 14. Presedens: Golfklubben Fjord. Godkjenn når du har sett kildene.", caseId: "MS-06" },
  { id: "E10", folder: "handle", from: "Brobyggerne Oslo", subject: "Innsyn: hva brukte KI i saken vår?", preview: "Vi ber om innsyn i prompt, svar og kilder.", body: "Vi ber om innsyn i hva som ble brukt av KI i T-2622 / MS-06: prompt, svar, henvisninger og om et menneske har fattet vedtak. Svar i kapittel 9 med knappen «Parten ber om innsyn».", caseId: "MS-06" }
];

let agentAktivSak = null;

function formatAgentKroner(n) {
  return `${Number(n).toLocaleString("no-NO")} kroner`;
}

function agentForeslattSum() {
  return mineSaker.reduce((s, sak) => s + (sak.foreslatt || 0), 0);
}

function setAgentTab(tab) {
  const panes = {
    oversikt: "agentPaneOversikt",
    epost: "agentPaneEpost",
    saker: "agentPaneSaker",
    budsjett: "agentPaneBudsjett",
    utkast: "agentPaneUtkast"
  };
  Object.entries(panes).forEach(([key, id]) => {
    const pane = document.getElementById(id);
    const btn = document.getElementById(`agentTab${key.charAt(0).toUpperCase()}${key.slice(1)}`);
    if (pane) pane.classList.toggle("hidden", key !== tab);
    if (btn) {
      btn.className = key === tab
        ? "agent-tab px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold"
        : "agent-tab px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-700";
    }
  });
  if (tab === "epost") renderAgentMail();
  if (tab === "saker") renderAgentSaker();
  if (tab === "budsjett") renderAgentBudsjett();
}

function setAgentMailFolder(folder) {
  agentMailFolder = folder;
  document.querySelectorAll(".agent-mail-folder").forEach((btn) => {
    const on = btn.dataset.folder === folder;
    btn.className = on
      ? "agent-mail-folder px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold"
      : "agent-mail-folder px-3 py-1.5 rounded-lg bg-white border border-slate-200";
  });
  renderAgentMail();
}

function renderAgentMail() {
  const list = document.getElementById("agentMailList");
  if (!list) return;
  const rows = mineEposter.filter((e) => e.folder === agentMailFolder);
  list.innerHTML = rows.map((e) => `
    <button type="button" onclick="openAgentMail('${e.id}')" class="w-full text-left rounded-xl bg-white border border-slate-200 hover:border-indigo-400 p-3">
      <div class="flex justify-between gap-2 text-[10px] font-mono text-slate-400">
        <span>${e.from}</span>
        <span>${e.caseId || ""}</span>
      </div>
      <p class="text-sm font-bold text-slate-900">${e.subject}</p>
      <p class="text-xs text-slate-500">${e.preview}</p>
    </button>
  `).join("") || `<p class="text-xs text-slate-500">Ingen i denne mappen.</p>`;
}

function openAgentMail(id) {
  const mail = mineEposter.find((e) => e.id === id);
  const box = document.getElementById("agentMailRead");
  if (!mail || !box) return;
  box.classList.remove("hidden");
  box.innerHTML = `
    <p class="text-[11px] font-mono text-slate-500">${mail.from} · ${mail.caseId || "ingen sak"}</p>
    <p class="font-bold">${mail.subject}</p>
    <p class="text-slate-700">${mail.body}</p>
    ${mail.caseId ? `<button type="button" onclick="openAgentSak('${mail.caseId}')" class="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">Åpne ${mail.caseId} i utkast</button>` : ""}
  `;
}

function renderAgentSaker() {
  const list = document.getElementById("agentSakList");
  if (!list) return;
  list.innerHTML = mineSaker.map((sak) => `
    <button type="button" onclick="openAgentSak('${sak.id}')" class="w-full text-left rounded-xl bg-white border border-slate-200 hover:border-indigo-400 p-3">
      <div class="flex justify-between gap-2">
        <span class="text-[10px] font-mono font-bold text-indigo-700">${sak.id}</span>
        <span class="text-[11px] text-slate-500">${sak.grantId || ""} · ${sak.status}</span>
      </div>
      <p class="text-sm font-bold text-slate-900">${sak.org}</p>
      <p class="text-xs text-slate-600">${sak.tittel}</p>
      <p class="text-xs mt-1">Søkt ${sak.sokt.toLocaleString("no-NO")} · foreslått <strong>${sak.foreslatt.toLocaleString("no-NO")} kr</strong> · ${sak.flagg}</p>
    </button>
  `).join("");
}

function renderAgentBudsjett() {
  const used = agentForeslattSum();
  const remain = AGENT_RAMME - used;
  const remainEl = document.getElementById("agentBudgetRemain");
  const bar = document.getElementById("agentBudgetBar");
  const rows = document.getElementById("agentBudgetRows");
  const stat = document.getElementById("agentStatPott");
  if (remainEl) remainEl.textContent = `Igjen: ${remain.toLocaleString("no-NO")} kr`;
  if (stat) stat.textContent = `${Math.round(remain / 1000)}k`;
  if (bar) bar.style.width = `${Math.min(100, (used / AGENT_RAMME) * 100)}%`;
  if (rows) {
    rows.innerHTML = mineSaker.map((sak) => `
      <button type="button" onclick="openAgentSak('${sak.id}')" class="w-full text-left rounded-xl bg-white border border-slate-200 p-3 hover:border-indigo-400">
        <div class="flex justify-between text-sm">
          <span class="font-semibold">${sak.org}</span>
          <span>${sak.foreslatt.toLocaleString("no-NO")} kr</span>
        </div>
        <p class="text-[11px] text-slate-500">${sak.flagg} · agenten har kikket på budsjettet</p>
      </button>
    `).join("");
  }
}

function openAgentSak(id) {
  const sak = mineSaker.find((s) => s.id === id);
  if (!sak) return;
  agentAktivSak = sak;
  agentKildeTab = "forskrift";
  setAgentTab("utkast");
  const label = document.getElementById("agentCaseLabel");
  const tools = document.getElementById("agentDraftTools");
  const amount = document.getElementById("agentAmount");
  if (label) {
    const link = sak.grantId
      ? ` · <button type="button" onclick="goToGrantFromAgent('${sak.grantId}')" class="text-indigo-700 underline font-semibold">samme sak ${sak.grantId} i kap. 9</button>`
      : "";
    label.innerHTML = `${sak.id} · ${sak.org} · ${sak.tittel}${link}`;
  }
  const reason = document.getElementById("agentOwnReason");
  if (reason) reason.value = sak.ownReason || "";
  const loop = document.getElementById("agentLoopNote");
  if (loop) {
    loop.classList.add("hidden");
    loop.textContent = "";
  }
  if (tools) tools.classList.remove("hidden");
  if (amount) {
    amount.value = sak.foreslatt || sak.sokt;
    amount.max = sak.sokt;
  }
  updateAgentDraft();
}

function setAgentAmount(n) {
  const sak = agentAktivSak;
  const input = document.getElementById("agentAmount");
  if (input) input.value = sak ? Math.min(n, sak.sokt) : n;
  updateAgentDraft();
}

const agentHintVerdicts = {};

function agentErInnhenting(sak) {
  return sak?.brevtype === "innhenting" || sak?.id === "MS-03" || sak?.status === "Venter på søker";
}

function agentErAvslag(sak) {
  return sak?.brevtype === "avslag" || sak?.plantedError;
}

function agentHintMeta(type) {
  if (type === "warn") return { cls: "border-rose-200 bg-rose-50", badge: "Påpeker", badgeCls: "bg-rose-100 text-rose-800" };
  if (type === "ok") return { cls: "border-emerald-200 bg-emerald-50", badge: "OK", badgeCls: "bg-emerald-100 text-emerald-800" };
  return { cls: "border-sky-200 bg-sky-50", badge: "Foreslår", badgeCls: "bg-sky-100 text-sky-800" };
}

function setAgentKildeTab(tab) {
  agentKildeTab = tab;
  renderAgentKilder();
}

function hoppTilAgentKilde(tab) {
  if (!tab) return;
  setAgentKildeTab(tab);
  document.getElementById("agentKilder")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderAgentKilder() {
  const sak = agentAktivSak;
  const body = document.getElementById("agentKildeBody");
  const wrap = document.getElementById("agentKilder");
  if (!body || !wrap) return;
  if (!sak) {
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");

  ["forskrift", "policy", "presedens", "formalia"].forEach((key) => {
    const btn = document.getElementById(`agentKildeTab${key.charAt(0).toUpperCase()}${key.slice(1)}`);
    if (!btn) return;
    btn.className = key === agentKildeTab
      ? "agent-kilde-tab px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
      : "agent-kilde-tab px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold";
  });

  const items = sak[agentKildeTab] || [];
  if (!items.length) {
    body.innerHTML = `<p class="text-xs text-slate-500 italic">Ingen simulerte kilder i denne fanen.</p>`;
    return;
  }
  body.innerHTML = items.map((item) => `
    <article class="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
      <p class="text-xs font-bold text-slate-900">${item.label} <span class="font-medium text-amber-800">(simulert, ikke gjeldende rett)</span></p>
      <p class="text-sm text-slate-800 leading-relaxed">${item.text}</p>
      <p class="text-[11px] text-slate-600"><strong>Hvorfor i denne saken:</strong> ${item.why}</p>
    </article>
  `).join("");
}

function renderAgentHints() {
  const list = document.getElementById("agentHints");
  const wrap = document.getElementById("agentHintsWrap");
  const sak = agentAktivSak;
  if (!list || !wrap) return;
  if (!sak) {
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");
  const hints = sak.hints || [];
  list.innerHTML = hints.map((h, idx) => {
    const meta = agentHintMeta(h.type);
    const key = `${sak.id}:${idx}`;
    const verdict = agentHintVerdicts[key];
    const jump = h.tab ? `hoppTilAgentKilde('${h.tab}')` : "";
    return `
      <li class="rounded-xl border ${meta.cls} p-3 space-y-2">
        <button type="button" onclick="${jump}" class="w-full text-left space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${meta.badgeCls}">${meta.badge}</span>
            <span class="text-sm font-semibold text-slate-900">${h.tittel}</span>
            ${h.tab ? `<span class="text-[10px] text-slate-500">Åpner ${h.tab}</span>` : ""}
          </div>
          <p class="text-xs text-slate-700 leading-relaxed">${h.tekst}</p>
        </button>
        <div class="flex flex-wrap gap-1.5">
          <button type="button" onclick="markAgentHint('${sak.id}',${idx},'ok')" class="px-2 py-1 rounded-lg text-[11px] font-semibold ${verdict === "ok" ? "bg-emerald-700 text-white" : "bg-white border border-slate-300"}">Står</button>
          <button type="button" onclick="markAgentHint('${sak.id}',${idx},'feil')" class="px-2 py-1 rounded-lg text-[11px] font-semibold ${verdict === "feil" ? "bg-rose-700 text-white" : "bg-white border border-slate-300"}">Feil</button>
        </div>
      </li>
    `;
  }).join("");
}

function markAgentHint(sakId, idx, verdict) {
  agentHintVerdicts[`${sakId}:${idx}`] = verdict;
  renderAgentHints();
}

function showAgentLoopNote(text, tone) {
  const el = document.getElementById("agentLoopNote");
  if (!el) return;
  el.classList.remove("hidden");
  el.className = `text-sm rounded-xl px-3 py-2 ${tone === "bad" ? "bg-rose-50 text-rose-950 border border-rose-200" : tone === "good" ? "bg-emerald-50 text-emerald-950 border border-emerald-200" : "bg-slate-100 text-slate-800"}`;
  el.textContent = text;
}

function plantedFasit() {
  return "KI blandet to regelsett. § 14 gjelder investering, ikke jobbtilbud (4.2). Golfklubben Fjord (T-2621) var anlegg og seniordrift. Den like saken er Havblik (T-2608 / MS-02), som ble vurdert til innvilgelse.";
}

function buildAgentNotat(sak, amount) {
  const innhent = agentErInnhenting(sak);
  const avslag = agentErAvslag(sak);
  const kutt = sak.sokt - amount;
  const budsjettLinje = avslag
    ? `Budsjett: Utkastet er et avslag (0 kroner). Agenten begrunner med § 14 og Golfklubben Fjord. Sjekk om det er riktig hjemmel.`
    : innhent
    ? `Budsjett: I tråd med din praksis skriver du ikke innvilgelse før postene ligger inne. ${sak.flagg}.`
    : (kutt > 0
      ? `Budsjett: I tråd med din praksis avkorter du med ${formatAgentKroner(kutt)} mot poster som ikke er fullt tilskuddsberettiget (${sak.flagg}).`
      : `Budsjett: I tråd med din praksis følger du søknadsbeløpet når postene henger sammen.`);

  return `Saksbehandlingsnotat (klargjort for deg — forslag)

Formål
Søknaden «${sak.tittel}» fra ${sak.org} vurderes mot ${sak.ordning}. Formålet treffer hvis aktiviteten når barn og unge i målgruppen, uten at midlene går til ordinær drift.

Vilkår og praksis
I tråd med din praksis tar du formål først, deretter vilkår, så beløp. Du skriver dere til søker i brevet.

${budsjettLinje}
Søkt: ${formatAgentKroner(sak.sokt)}. ${avslag ? "Foreslått tildeling: 0 kroner (avslag)." : innhent ? "Foreslått tildeling nå: 0 kroner (sak på vent)." : `Foreslått tildeling: ${formatAgentKroner(amount)}.`}
${agentStyleExtra}

Dette er et utkast. Du må bekrefte. Agenten fatter ikke vedtak.`;
}

function buildAgentBrev(sak, amount) {
  const attest = agentStyleExtra ? "\nI tråd med din praksis: frivillige som er alene med barn, skal ha gyldig politiattest." : "";

  if (agentErAvslag(sak)) {
    return `Utkast til avslagsbrev — sjekk hjemmelen

Til dere i ${sak.org}

Dere søkte om «${sak.tittel}» under ${sak.ordning}.

Vedtak: Søknaden avslås.

Begrunnelse (fra agenten): Sim. forskrift § 14 krever at kommunen eier tiltaket. Golfklubben Fjord (T-2621) fikk avslag på liknende aktivitet. Likebehandling tilsier avslag.

Dette er et simulert utkast. Hvis hjemmelen er feil, skal du avvise det — ikke godkjenne.`;
  }

  if (agentErInnhenting(sak)) {
    return `Utkast til innhentingsbrev — ikke innvilgelse

Til dere i ${sak.org}

Vi har mottatt søknaden deres om «${sak.tittel}» under ${sak.ordning}.

Formål: Tiltaket kan ligge innenfor ordningen hvis utstyret lånes ut gratis til barn i målgruppen. Vi kan likevel ikke behandle beløpet nå.

I tråd med din praksis ber vi dere ettersende:
• budsjett spesifisert per post
• avklaring av om utstyret lånes ut eller selges

Svar i søknadsportalen innen tre uker. Hvis vi ikke får svaret, kan søknaden bli avslått som ufullstendig.

Dette er et simulert utkast. Du godkjenner. Agenten sender ikke.`;
  }

  return `Utkast til vedtaksbrev

Til dere i ${sak.org}

Formål: Dere søkte om støtte til «${sak.tittel}» under ${sak.ordning}. I tråd med din praksis vurderer vi først om aktiviteten gir barn og unge i målgruppen et reelt tilbud.

Vi innvilger ${formatAgentKroner(amount)} av søkt ${formatAgentKroner(sak.sokt)}.
${amount < sak.sokt ? `Differansen er knyttet til ${sak.flagg.toLowerCase()}.` : "Beløpet følger søknaden fordi budsjettet vurderes som realistisk."}

Tilskuddet skal brukes etter prosjektbeskrivelsen dere har sendt inn.${attest}
Rapportfrist: 1. mars 2028.

Dere kan klage innen tre uker fra dere fikk brevet.

Dette er et simulert utkast. Du godkjenner. Agenten sender ikke.`;
}

function updateAgentDraft() {
  const sak = agentAktivSak;
  if (!sak) return;
  const raw = parseInt(document.getElementById("agentAmount")?.value || String(sak.foreslatt), 10);
  const amount = Number.isFinite(raw) ? Math.max(0, Math.min(sak.sokt, raw)) : sak.foreslatt;
  sak.foreslatt = amount;

  const notat = document.getElementById("agentNotat");
  const brev = document.getElementById("agentBrev");
  const status = document.getElementById("agentDraftStatus");
  if (status) {
    status.textContent = agentErInnhenting(sak)
      ? "Innhentingsutkast i din stil — ikke sendt, ikke vedtak"
      : "Utkast i din stil — ikke sendt, ikke vedtak";
  }
  if (notat) notat.textContent = buildAgentNotat(sak, amount);
  if (brev) brev.textContent = buildAgentBrev(sak, amount);
  renderAgentHints();
  renderAgentKilder();
  renderAgentBudsjett();
  refreshAgentStats();
}

function rememberAgentStyle() {
  agentStyleExtra = "\n\nLæring: I liknende saker tar du inn krav om politiattest for frivillige.";
  const note = document.getElementById("agentStyleNote");
  if (note) note.classList.remove("hidden");
  updateAgentDraft();
}

function approveAgentDraft() {
  if (!agentAktivSak) return;
  agentAktivSak.status = "Godkjent i demo";
  const status = document.getElementById("agentDraftStatus");
  if (status) status.textContent = "Godkjent i demoen — ikke sendt, ikke journalført";
  logGrantJournal({
    type: "handling",
    sak: agentAktivSak.grantId || agentAktivSak.id,
    prompt: `Godkjenn utkast ${agentAktivSak.id}.`,
    svar: agentAktivSak.plantedError ? "Godkjent plantet feilgrep (øvelse)." : "Godkjent i demo, ikke journalført i ekte arkiv."
  });
  if (agentAktivSak.plantedError) {
    showAgentLoopNote(`Du godkjente et feil utkast. ${plantedFasit()} I en ekte sak ville det blitt usaklig forskjellsbehandling mot Havblik.`, "bad");
  } else {
    showAgentLoopNote("Godkjent i øvelsen. Fortsatt ikke sendt og ikke et vedtak.", "ok");
  }
  renderAgentSaker();
  refreshAgentStats();
}

function rejectAgentDraft() {
  if (!agentAktivSak) return;
  const reason = (document.getElementById("agentOwnReason")?.value || "").trim();
  if (reason.length < 8) {
    showAgentLoopNote("Skriv din begrunnelse (minst én setning) før avvisning teller.", "bad");
    return;
  }
  agentAktivSak.ownReason = reason;
  agentAktivSak.status = "Utkast avvist";
  const status = document.getElementById("agentDraftStatus");
  if (status) status.textContent = "Utkast avvist av deg — saken står, ikke vedtak";
  logGrantJournal({
    type: "handling",
    sak: agentAktivSak.grantId || agentAktivSak.id,
    prompt: `Avvis utkast ${agentAktivSak.id}.`,
    svar: reason
  });
  if (agentAktivSak.plantedError) {
    showAgentLoopNote(`Riktig skepsis. ${plantedFasit()} Din begrunnelse er lagret i øvelsen.`, "good");
  } else {
    showAgentLoopNote(`Du avviste utkastet. Begrunnelse: ${reason}`, "ok");
  }
  renderAgentSaker();
  refreshAgentStats();
}

function parkAgentDraft() {
  if (!agentAktivSak) return;
  agentAktivSak.status = "Ligger hos deg";
  const status = document.getElementById("agentDraftStatus");
  if (status) status.textContent = "Saken står. Ingen godkjenning, ingen sending.";
  showAgentLoopNote("Du lot saken stå. Mennesket i loopen kan også vente.", "ok");
  renderAgentSaker();
  refreshAgentStats();
}

function refreshAgentStats() {
  const mail = document.getElementById("agentStatMail");
  const saker = document.getElementById("agentStatSaker");
  const utkast = document.getElementById("agentStatUtkast");
  if (mail) mail.textContent = String(mineEposter.filter((e) => e.folder === "handle").length);
  if (saker) saker.textContent = String(mineSaker.length);
  if (utkast) utkast.textContent = String(mineSaker.filter((s) => s.status === "Utkast klart").length);
  renderAgentBudsjett();
}

function initAgentDesk() {
  refreshAgentStats();
  renderAgentMail();
  renderAgentSaker();
  renderAgentBudsjett();
  setAgentTab("oversikt");
}

const LANGGRAPH_STEPS = [
  {
    id: "ork1",
    node: "orkestrator",
    tittel: "1. Koordinator",
    tilstand: "Sak T-2622 Brobyggerne. Ingen kilder hentet ennå.",
    tekst: "Koordinatoren ber RAG slå opp aktivitetstype og om vi har en lik sak. Den skriver ikke svaret selv."
  },
  {
    id: "rag1",
    node: "rag",
    tittel: "2. Henter kilder fra mappa",
    tilstand: "Treff: jobbtilbud 4.2 og Havblik. Golfklubben ligger i mappa som anlegg — ikke som lik sak.",
    tekst: "Oppslaget kan bare sitere det den faktisk hentet — øvelsesregel 4.2, Havblik og lovutdrag som fvl § 2 og § 17. En paragraf som ikke er i uttrekket, skal ikke brukes. § 14 / Golfklubben ligger i mappa som felle."
  },
  {
    id: "val1",
    node: "validator",
    tittel: "3. Sjekken avviser utkastet",
    tilstand: "Utkastet viser til feil paragraf og Golfklubben som presedens.",
    tekst: "Det er ikke samme type sak. Sjekken stopper forslaget i stedet for å omskrive det pent."
  },
  {
    id: "ork2",
    node: "orkestrator",
    tittel: "4. Saksflyten sender saken til deg",
    tilstand: "validering feilet. Neste steg er saksbehandler, ikke utkast.",
    tekst: "Koordinatoren fatter ikke vedtak. Feilen skal være synlig."
  },
  {
    id: "hum",
    node: "menneske",
    tittel: "5. Du avgjør",
    tilstand: "Forslaget avvises. Ingenting er sendt.",
    tekst: "Bekreft, avvis med begrunnelse, eller la saken stå. Uten deg går ikke saksflyten videre til utkast."
  },
  {
    id: "lev",
    node: "leveranse",
    tittel: "6. Utkast etter godkjenning",
    tilstand: "Først da: brevutkast og journalpost.",
    tekst: "Forarbeid du kan rette. Du signerer. En kollega attesterer. Det er ikke et vedtak."
  }
];

let langGraphStep = 0;

function renderLangGraphForslag() {
  const rail = document.getElementById("langGraphRail");
  const body = document.getElementById("langGraphStep");
  const state = document.getElementById("langGraphState");
  if (!rail || !body) return;
  const nodes = [
    { id: "orkestrator", label: "Koordinator" },
    { id: "rag", label: "RAG" },
    { id: "validator", label: "Sjekk" },
    { id: "menneske", label: "Du" },
    { id: "leveranse", label: "Utkast" }
  ];
  const current = LANGGRAPH_STEPS[langGraphStep];
  rail.innerHTML = nodes.map((n) => {
    const on = current.node === n.id;
    return `<button type="button" class="rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${on ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"}">${n.label}</button>`;
  }).join("");
  body.innerHTML = `
    <p class="text-sm font-bold text-slate-900">${current.tittel}</p>
    <p class="text-sm text-slate-700 leading-relaxed mt-1">${current.tekst}</p>`;
  if (state) state.textContent = current.tilstand;
  const idx = document.getElementById("langGraphIndex");
  if (idx) idx.textContent = `${langGraphStep + 1} / ${LANGGRAPH_STEPS.length}`;
}

function stepLangGraph(delta) {
  langGraphStep = Math.max(0, Math.min(LANGGRAPH_STEPS.length - 1, langGraphStep + delta));
  renderLangGraphForslag();
}

async function runLiveLangGraph() {
  const box = document.getElementById("langGraphLive");
  if (!box) return;
  box.classList.remove("hidden");
  box.innerHTML = `<p class="text-xs text-slate-600">Kjører stegvis saksflyt (kilder → utkast → sjekk)…</p>`;
  try {
    const response = await fetch("/api/graph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "sak",
        sak: {
          id: "T-2622",
          org: "Brobyggerne Oslo",
          belop: 198000,
          aktivitet: "4.2 Jobbtilbud og veiledning",
          flag: "plantet",
          jobb: "Saksflyten skal hente 4.2 og Havblik."
        },
        soknad: "Deltidsjobb og CV-kurs for 12 ungdommer. Samarbeid med bydel. Budsjett for lønn og veileder."
      })
    });
    const graph = await response.json();
    if (!response.ok) throw new Error(graph.error || "graph_error");
    const steps = (graph.trace || []).map((t) => `<li><strong>${t.tittel}</strong> — ${t.detalj || ""}</li>`).join("");
    const kilder = (graph.retrieved || []).map((k) => `<li><span class="font-mono text-[11px]">${k.id || "—"}</span> ${k.tittel || ""}${k.typeLabel ? ` <em>(${k.typeLabel})</em>` : ""}</li>`).join("");
    const sjekk = graph.ok
      ? "Sjekken godtok utkastet. Du ville likevel bekreftet i arbeidslisten."
      : `Sjekken stoppet: ${(graph.validation?.errors || []).join(" ")}`;
    box.innerHTML = `
      <p class="text-[11px] font-bold uppercase tracking-wider text-violet-700">${graph.live ? "Live graf" : "Graf uten nøkkel (samme sjekk)"}</p>
      <p class="text-xs font-semibold text-slate-800">Hentede kilder</p>
      <ul class="list-disc pl-5 text-slate-700 space-y-0.5 text-xs">${kilder || "<li>ingen</li>"}</ul>
      <ol class="list-decimal pl-5 text-slate-700 space-y-1">${steps}</ol>
      <p class="text-slate-800">${sjekk}</p>
      <p class="text-xs text-slate-500">Ikke juridisk rådgivning. Grafen sender ingenting.</p>
      <p class="text-xs text-slate-500 whitespace-pre-wrap">${(graph.parsed?.notat || "").slice(0, 400)}</p>`;
  } catch (e) {
    box.innerHTML = `<p class="text-sm text-rose-800">Grafen nådde ikke frem (${e.message || "feil"}). Kjør <code>npm install</code> og <code>vercel dev</code>.</p>`;
  }
}

function initLangGraphForslag() {
  if (!document.getElementById("langGraphStep")) return;
  langGraphStep = 0;
  renderLangGraphForslag();
}

const COCKPIT_CASE_IDS = ["T-2629", "T-2632", "T-2603", "T-2622", "T-2631", "T-2612"];
const COCKPIT_SKJONN_IDS = ["T-2629", "T-2632", "T-2622"];
const ARCHIVE_DRIVER = "mock";
const PORTAL_STORAGE_KEY = "ovelsePortalSaker";
const ARKIV_STORAGE_KEY = "ovelseArkivMapper";

const OVELSESREGISTER = [
  { orgnr: "999 626 727", navn: "Fjordheim kulturskolevenner", form: "forening", enhet: true, frivillig: true },
  { orgnr: "999 303 808", navn: "Storøy ungdomsverksted", form: "forening", enhet: true, frivillig: true },
  { orgnr: "999 333 001", navn: "AS Fjord Byggdrift", form: "AS", enhet: true, frivillig: false },
  { orgnr: "999 222 333", navn: "Brobyggerne Oslo", form: "forening", enhet: true, frivillig: true },
  { orgnr: "999 101 202", navn: "Myr idrettslag anlegg", form: "idrettslag", enhet: true, frivillig: true },
  { orgnr: "999 555 666", navn: "Åsby bibliotekvenner", form: "forening", enhet: true, frivillig: true }
];

const COCKPIT_RAG = [
  { id: "f-soker", tittel: "Fiktiv veileder § 3 Hvem kan søke (øvelse 2026)", tekst: "Søker skal stå i Enhetsregisteret. For denne aktivitetstypen skal virksomheten også stå i Frivillighetsregisteret, med mindre søker er kommune. Kommersielt aksjeselskap uten frivillig formål kan ikke søke." },
  { id: "f-admin", tittel: "Fiktiv intern praksis § 5 Administrasjon (øvelse 2026)", tekst: "Prosjektledelse og generell administrasjon skal som hovedregel ikke overstige 15 prosent av søknadssummen. Overskytende kan foreslås avkortet. Dette er øvelsesregel 2026, ikke evig forskrift. Avkorting er forslag til saksbehandler, ikke vedtak." },
  { id: "f-revisor", tittel: "Fiktiv veileder § 8 Revisor (øvelse 2026)", tekst: "Søknader over 200 000 kroner skal ha revisorattest eller tilsvarende bekreftelse. Mangler attest, skal saken flagges. Beløpsgrensen er øvelse 2026." },
  { id: "f-mal", tittel: "Fiktiv forskrift § 2 Formål og målgruppe", tekst: "Tiltaket skal nå barn og unge som står utenfor, særlig husholdninger med lav inntekt. Søknaden skal beskrive hvem som rekrutteres, og at deltakelse er gratis eller uten urimelig egenandel. Barns medvirkning skal beskrives der det er relevant. Står det ikke i teksten, er det ikke oppgitt." },
  { id: "f-jobb", tittel: "Fiktiv forskrift aktivitet 4.2", tekst: "Jobbtilbud og veiledning gjelder lønnet praksis, kurs og veiledning for ungdom i målgruppen. Det er ikke investering i anlegg. Lik sak i øvelsen: Havblik Røde Kors (T-2608), vurdert til innvilgelse." },
  { id: "f-invest", tittel: "Fiktiv forskrift § 14 Investering", tekst: "§ 14 gjelder varige driftsmidler og anlegg, for eksempel gressbane og vanningsanlegg. Golfklubben Fjord (T-2621) fikk avslag på anlegg og seniordrift. § 14 brukes ikke på jobbtilbud 4.2." },
  { id: "f-klage", tittel: "Fiktiv praksis § 6 Klage og nytt faktum (øvelse 2026)", tekst: "Nytt faktum som endrer kostnadsfordelingen kan gi ny beregning. Honorar til kursleder er faglig aktivitet, ikke generell administrasjon, når det følger av dokumentasjon. Omgjøring eller opprettholdelse er saksbehandlers. KI fatter ikke vedtak." },
  { id: "f-slutt", tittel: "Fiktiv veileder § 16 Slutt og tilbakekreving (øvelse 2026)", tekst: "Tilskudd brukt i strid med vilkår kan kreves tilbake forholdsmessig. Dokumentert, godkjent aktivitet holdes utenfor. Tilbakekreving er forslag — ikke innkreving, ikke SvarUt og ikke vedtak." }
];

const COCKPIT_PLANTED_RAG = {
  id: "planted-lik",
  tittel: "Utdrag (feil hentet i øvelsen) — lik sak",
  tekst: "Likebehandling: Golfklubben Fjord (T-2621) fikk avslag på liknende aktivitet. Sim. forskrift § 14 om investering: kommunen eier ikke tiltaket. Anbefalt avslag."
};

const COCKPIT_EXTRA = {
  "T-2629": {
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
  "T-2632": {
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
  "T-2603": {
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
  "T-2622": {
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
  "T-2631": {
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
  },
  "T-2612": {
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
  }
};

const COCKPIT_FALLBACK = {
  "T-2629": {
    malgruppe: { score: 4, sitat: "Gratis instrumentgruppe etter skoletid, 24 barn." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 5, sitat: "Gratis instrumentgruppe etter skoletid" },
    notat: "Søknaden treffer 4.1. Adminandelen er 32 % mot øvelsesregel 15 % (2026). Foreslått avkorting av overskytende prosjektledelse. Dette er innstillingsforslag, ikke vedtak. Rangering mot ramme er saksbehandlers.",
    brev: "Utkast — ikke vedtak\n\nTil Fjordheim kulturskolevenner\n\nDere søkte om 410 000 kr til gratis instrumentgruppe. Formålet treffer. Prosjektledelse utgjør 32 % av budsjettet. Etter øvelsesregel 2026 (15 % admin) foreslås avkorting av den overskytende delen.\n\nBeløpet i utkastet er forslag til saksbehandler. Klagefrist og vilkår fylles inn hvis dere fatter vedtak."
  },
  "T-2632": {
    malgruppe: { score: 5, sitat: "Heldags verksted og lønnet praksis for 28 ungdommer i 8 uker." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 4, sitat: "lønnet praksis" },
    notat: "Formelt komplett og treffer 4.2. Admin innenfor 15 %. Attest er med. Beløpet 890 000 kr tvinger tverrgående kutt mot fiktiv ramme. KI summerer og peker — den rangerer ikke hvem som skal kuttes. Ikke vedtak.",
    brev: "Utkast — ikke vedtak\n\nTil Storøy ungdomsverksted\n\nSøknaden om 890 000 kr til jobbtilbud er formelt i orden. Innstilling mot ramme gjenstår hos saksbehandler. Dette brevet er ikke et tilsagn."
  },
  "T-2603": {
    malgruppe: { score: 1, sitat: "Ferieaktivitet for ansattebarn." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    notat: "Søker er AS og står ikke i Frivillighetsregisteret (øvelsestabell). Formålet er rekruttering til bedriften, ikke inkludering av barn i målgruppen. Forslag: utenfor ordningen. Ikke vedtak.",
    brev: "Utkast til avslagsbrev — ikke vedtak\n\nTil AS Fjord Byggdrift\n\nDere kan etter øvelsesregelen 2026 ikke søke denne aktivitetstypen som kommersielt AS uten frivillig registrering. Tiltaket gjelder egne ansattebarn.\n\nSaksbehandler må bekrefte før noe sendes."
  },
  "T-2622": {
    malgruppe: { score: 4, sitat: "Deltidsjobb og CV-kurs for 12 ungdommer." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 4, sitat: "Deltidsjobb og CV-kurs" },
    notat: "Anbefalt avslag. KI viser til sim. forskrift § 14 om investering: kommunen eier ikke tiltaket. Golfklubben Fjord (T-2621) fikk avslag på liknende aktivitet. Likebehandling tilsier avslag.",
    brev: "Utkast til avslagsbrev — ikke vedtak\n\nTil Brobyggerne Oslo\n\nSøknaden avslås med henvisning til sim. forskrift § 14 (investering) og presedens i Golfklubben Fjord (T-2621).\n\nDette utkastet skal stoppes av sjekken. Saksbehandler kan avvise det."
  },
  "T-2631": {
    malgruppe: { score: 3, sitat: "inkluderende trening" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    notat: "Sluttregnskap: 140 000 kr til gressbane (investering, ikke godkjent) og 80 000 kr til aktivitet. Forholdsmessig utkast: tilbakekreving av 140 000 kr. Ikke vedtak.",
    brev: "Utkast om avvik — ikke vedtak\n\nTil Myr idrettslag anlegg\n\n140 000 kr gikk til ny gressbane. Det er ikke godkjent kostnad. Utkast: krev den delen tilbake. De 80 000 til trening vurderes som i tråd med tiltaket."
  },
  "T-2612": {
    malgruppe: { score: 4, sitat: "Leksehjelp og teaterlek etter skoletid, to grupper à 12 barn. Gratis." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 5, sitat: "Gratis." },
    notat: "Tiltaket treffer og var utbetalt. Fjorårets rapport / sluttregnskap mangler. Rødt historikkflagg. Kan holde tilbake fremtidig tilskudd. Ikke vedtak.",
    brev: "Utkast om rapportering — ikke vedtak\n\nTil Åsby bibliotekvenner\n\nTilskudd er utbetalt. Sluttregnskap etter øvelsesfristen mangler. Saken flagges. Saksbehandler avgjør purring eller tilbakehold."
  }
};

const COCKPIT_SYSTEM_PROMPT = `Du er forvaltningsrådgiver i en pedagogisk øvelse om tilskudd (prototype 2026). Du fatter ALDRI vedtak og kaller aldri svaret ditt et vedtak. Du er ikke Bufdir.

Du får KUN søknadstekst, saksfakta og RAG-utdrag under. Bruk ikke annen kunnskap. Hvis noe ikke står i teksten du fikk, skriv «ikke oppgitt».

Admin 15 % og revisor 200 000 kr er øvelsesregler 2026, ikke evig forskrift. Utdragene er fiktive — ikke ekte Bufdir-forskrift.

Svar alltid på norsk, faktabasert, i denne malen:

## Semantikk
Målgruppe: N/5
Sitat målgruppe: "..." eller ikke oppgitt
Medvirkning: N/5
Sitat medvirkning: "..." eller ikke oppgitt
Gratis: N/5
Sitat gratis: "..." eller ikke oppgitt

## Saksnotat
Kort innstillingsforslag med henvisning til utdrag. Ikke fatt vedtak.

## Brevutkast
Merk første linje: Utkast — ikke vedtak
`;

const COCKPIT_KLAGE_SYSTEM = `Du er forvaltningsrådgiver i en pedagogisk øvelse. Du fatter ALDRI vedtak og omgjør ingenting. Du er ikke Bufdir.

Du får KUN saksfakta og fiktive RAG-utdrag. Hvis noe mangler, skriv «ikke oppgitt». Admin 15 % er øvelsesregel 2026.

Svar på norsk, faktabasert, i denne malen:

## Vurdering
Hva det nye faktumet gjør med adminandelen. Pek, ikke avgjør.

## Utkast omgjøring
Hvis kursleder honorar godtas som fag. Merk: forslag — ikke vedtak.

## Utkast opprettholdelse
Hvis nytt faktum ikke godtas. Merk: forslag — ikke vedtak.
`;

const COCKPIT_SLUTT_SYSTEM = `Du er forvaltningsrådgiver i en pedagogisk øvelse. Du fatter ALDRI vedtak og starter ingen innkreving. Du er ikke Bufdir.

Du får KUN saksfakta og fiktive RAG-utdrag. Hvis noe mangler, skriv «ikke oppgitt».

Svar på norsk, faktabasert, i denne malen:

## Vurdering
Hva som er avvik versus godkjent aktivitet.

## Utkast tilbakekreving
Forholdsmessig forslag (gressbane vs trening). Merk: forslag — ikke innkreving, ikke vedtak.

## Alternativ
Hva som kreves hvis mer dokumentasjon kommer. Ikke fatt vedtak.
`;

const COCKPIT_KLAGE_FALLBACK = {
  vurdering: "Nytt faktum: 40 000 kr av prosjektledelse var kursleder (fag). Hvis du godtar det, synker adminandelen under 15 % (øvelsesregel 2026) og kuttet blir mindre. Dette er forhåndstekst — ikke et modell-svar.",
  omgjoring: "Utkast — ikke vedtak\n\nHvis kursleder honorar godtas som aktivitet, beregnes admin på nytt. Avkortingsforslaget reduseres. Saksbehandler avgjør omgjøring.",
  opprettholdelse: "Utkast — ikke vedtak\n\nHvis nytt faktum ikke dokumenteres, står opprinnelig avkorting mot 15 % admin (øvelse 2026). Ikke vedtak."
};

const COCKPIT_SLUTT_FALLBACK = {
  vurdering: "140 000 kr gikk til ny gressbane (investering, ikke godkjent). 80 000 kr gikk til inkluderende trening. Forhåndstekst — ikke et modell-svar.",
  tilbake: "Utkast — ikke vedtak\n\nForholdsmessig forslag: krev 140 000 kr tilbake. De 80 000 til trening står. Ikke innkreving, ikke SvarUt.",
  alternativ: "Hvis mer dokumentasjon viser at anlegget likevel var godkjent, må saken vurderes på nytt av saksbehandler. KI fatter ikke vedtak."
};

const cockpitJournal = [];
const cockpitWork = {};
let cockpitSelectedId = null;
let cockpitTab = "arbeid";
let cockpitKiSeq = 0;
const cockpitKlage = { running: false, live: null, error: "", vurdering: "", omgjoring: "", opprettholdelse: "" };
const cockpitSlutt = { running: false, live: null, error: "", vurdering: "", tilbake: "", alternativ: "" };

function escHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function lookupOvelsesregister(orgnr) {
  const norm = String(orgnr || "").replace(/\s/g, "");
  return OVELSESREGISTER.find((r) => r.orgnr.replace(/\s/g, "") === norm) || null;
}

function loadPortalSaker() {
  try {
    const raw = JSON.parse(localStorage.getItem(PORTAL_STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (_e) {
    return [];
  }
}

function savePortalSaker(list) {
  try { localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(list)); } catch (_e) { /* ignore */ }
}

function loadArkivMapper() {
  try {
    const raw = JSON.parse(localStorage.getItem(ARKIV_STORAGE_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (_e) {
    return {};
  }
}

function saveArkivMapper(map) {
  try { localStorage.setItem(ARKIV_STORAGE_KEY, JSON.stringify(map)); } catch (_e) { /* ignore */ }
}

function ensurePortalCasesInSaker() {
  loadPortalSaker().forEach((p) => {
    if (!tilskuddSaker.some((s) => s.id === p.id)) {
      tilskuddSaker.push({
        id: p.id,
        org: p.org,
        orgnr: p.orgnr,
        kommune: "Øvelse",
        aktivitet: p.aktivitet,
        belop: Number(p.belop) || 0,
        mottatt: p.at || "",
        queue: "ready",
        soknad: p.soknad,
        reasons: [{ label: "Fra søkerportal", detail: "Syntetisk innsending i nettleseren." }]
      });
    }
    if (!COCKPIT_EXTRA[p.id]) {
      COCKPIT_EXTRA[p.id] = {
        flag: "ok",
        adminPct: 8,
        adminBelop: Math.round((Number(p.belop) || 0) * 0.08),
        rapportFjor: true,
        budsjett: [
          { post: "Aktivitet (portaløvelse)", belop: Number(p.belop) || 0, type: "aktivitet" }
        ],
        vedlegg: [{ navn: "Budsjett", status: "ok" }]
      };
    }
  });
}

function cockpitListIds() {
  const extra = loadPortalSaker().map((p) => p.id);
  return [...COCKPIT_CASE_IDS, ...extra.filter((id) => !COCKPIT_CASE_IDS.includes(id))];
}

function cockpitSak(id) {
  return tilskuddSaker.find((s) => s.id === id) || null;
}

function cockpitFlagMeta(flag) {
  if (flag === "avkorting") return { text: "Avkorting", cls: "bg-amber-100 text-amber-900" };
  if (flag === "ramme") return { text: "Ramme", cls: "bg-indigo-100 text-indigo-900" };
  if (flag === "formalia") return { text: "Formalia", cls: "bg-rose-100 text-rose-900" };
  if (flag === "plantet") return { text: "Plantet feil", cls: "bg-fuchsia-100 text-fuchsia-900" };
  if (flag === "avvik") return { text: "Avvik", cls: "bg-orange-100 text-orange-900" };
  if (flag === "historikk") return { text: "Historikk", cls: "bg-rose-100 text-rose-900" };
  return { text: "OK", cls: "bg-emerald-100 text-emerald-800" };
}

function ruleTone(status) {
  if (status === "green") return { cls: "bg-emerald-50 border-emerald-200 text-emerald-950", mark: "OK" };
  if (status === "yellow") return { cls: "bg-amber-50 border-amber-200 text-amber-950", mark: "Gul" };
  return { cls: "bg-rose-50 border-rose-200 text-rose-950", mark: "Rød" };
}

function runGrantRules(sak) {
  const extra = COCKPIT_EXTRA[sak.id] || { adminPct: 0, adminBelop: 0, rapportFjor: true, vedlegg: [], flag: "ok" };
  const reg = lookupOvelsesregister(sak.orgnr);
  const checks = [];
  let recommended = sak.belop;

  if (!reg || !reg.enhet) {
    checks.push({ id: "soker", label: "Søkerform (øvelsesregister)", status: "red", text: "Ikke i den hardkodede Enhetsregister-tabellen." });
    recommended = 0;
  } else if (!reg.frivillig) {
    checks.push({ id: "soker", label: "Søkerform (øvelsesregister)", status: "red", text: `${reg.form} står i Enhetsregisteret, men ikke i Frivillighetsregisteret. For denne øvelsesordningen kan de ikke søke.` });
    recommended = 0;
  } else {
    checks.push({ id: "soker", label: "Søkerform (øvelsesregister)", status: "green", text: `${reg.navn}: ${reg.form}. Enhet ja, frivillig ja. Hardkodet tabell — ikke live API.` });
  }

  const allowedAdmin = Math.round(sak.belop * 0.15);
  if (extra.adminPct > 15 && recommended > 0) {
    const kutt = Math.max(0, extra.adminBelop - allowedAdmin);
    recommended = sak.belop - kutt;
    checks.push({
      id: "admin",
      label: "Adminandel (øvelse 2026)",
      status: "yellow",
      text: `Admin ${extra.adminPct} % (${formatGrantKroner(extra.adminBelop)}) over 15 % (${formatGrantKroner(allowedAdmin)}). Foreslått avkorting ${formatGrantKroner(kutt)} — ikke vedtak.`
    });
  } else {
    checks.push({
      id: "admin",
      label: "Adminandel (øvelse 2026)",
      status: "green",
      text: `Admin ${extra.adminPct} % er innenfor 15 % av søknadssummen. Øvelsesregel 2026, ikke evig forskrift.`
    });
  }

  const harAttest = (extra.vedlegg || []).some((v) => /revisor/i.test(v.navn) && v.status === "ok");
  if (sak.belop > 200000 && !harAttest) {
    checks.push({ id: "revisor", label: "Revisor (øvelse 2026)", status: "yellow", text: `Søkt ${formatGrantKroner(sak.belop)} — over 200 000 kr — og revisorattest mangler. Flagg, ikke automatisk avslag.` });
  } else if (sak.belop > 200000) {
    checks.push({ id: "revisor", label: "Revisor (øvelse 2026)", status: "green", text: "Attest er med. Beløpsgrense 200 000 kr er øvelse 2026." });
  } else {
    checks.push({ id: "revisor", label: "Revisor (øvelse 2026)", status: "green", text: "Under 200 000 kr. Attest er ikke krevd i øvelsen 2026." });
  }

  if (!extra.rapportFjor) {
    checks.push({ id: "historikk", label: "Historikk / fjorårets rapport", status: "red", text: "Fjorårets rapport mangler. Rødt flagg. Kan påvirke ny tildeling — saksbehandler avgjør." });
  } else {
    checks.push({ id: "historikk", label: "Historikk / fjorårets rapport", status: "green", text: "Ingen åpen rapportmangel i øvelseshistorikken." });
  }

  if (sak.id === "T-2632" && recommended > 0) {
    checks.push({ id: "ramme", label: "Ramme (skjønn)", status: "yellow", text: `Beløpet er stort mot fiktiv ramme ${formatGrantKroner(GRANT_SKJONN_RAMME)}. KI kutter ikke. Du prioriterer.` });
  }
  if (sak.id === "T-2631") {
    recommended = 0;
    checks.push({ id: "avvik", label: "Sluttregnskap", status: "red", text: "140 000 kr til gressbane er ikke godkjent kostnad. Utkast: tilbakekreving." });
  }

  return { checks, recommended, flag: extra.flag, kutt: Math.max(0, sak.belop - recommended) };
}

function cockpitRagIdsFor(sak) {
  const ids = ["f-soker", "f-admin", "f-revisor", "f-mal"];
  if (sak.id === "T-2622") ids.push("f-jobb", "planted");
  else if (sak.aktivitet.includes("4.2")) ids.push("f-jobb");
  if (sak.id === "T-2631") ids.push("f-invest", "f-slutt");
  if (sak.id === "T-2629") ids.push("f-klage");
  return ids;
}

function resolveCockpitRag(id) {
  if (id === "planted") return COCKPIT_PLANTED_RAG;
  return COCKPIT_RAG.find((r) => r.id === id);
}

function cockpitRagFor(sak) {
  return cockpitRagIdsFor(sak).map(resolveCockpitRag).filter(Boolean);
}

function cockpitKlageRag() {
  return ["f-admin", "f-klage", "f-mal"].map(resolveCockpitRag).filter(Boolean);
}

function cockpitSluttRag() {
  return ["f-invest", "f-slutt", "f-mal"].map(resolveCockpitRag).filter(Boolean);
}

function ragPanelHtml(items, extraNote) {
  const list = (items || []).map((r) => {
    const planted = r.id === "planted-lik";
    const cls = planted
      ? "border-fuchsia-300 bg-fuchsia-50"
      : "border-slate-200 bg-slate-50";
    const tag = planted
      ? `<span class="text-[10px] font-bold uppercase tracking-wider text-fuchsia-800">Feil hentet i øvelsen</span>`
      : `<span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fiktivt utdrag</span>`;
    return `<article class="rounded-lg border ${cls} px-3 py-2">
      ${tag}
      <p class="text-xs font-semibold text-slate-900 mt-0.5">${escHtml(r.tittel)}</p>
      <p class="text-[11px] text-slate-700 leading-relaxed mt-1">${escHtml(r.tekst)}</p>
    </article>`;
  }).join("");
  return `<div class="rounded-xl border border-violet-200 bg-violet-50/60 p-3 space-y-2">
    <div>
      <h4 class="text-xs font-bold uppercase tracking-wider text-violet-800">Kilder brukt</h4>
      <p class="text-[11px] text-violet-950 mt-0.5">Disse fiktive utdragene (veileder/forskrift/øvelsesregler 2026) ble sendt inn til /api/chat. <strong>Ikke ekte Bufdir-forskrift.</strong> ${escHtml(extraNote || "")}</p>
    </div>
    ${list}
  </div>`;
}

function formatCockpitRag(sak) {
  return cockpitRagFor(sak).map((r) => `### ${r.tittel}\n${r.tekst}`).join("\n\n");
}

function parseCockpitKi(text) {
  const grab = (label) => {
    const m = text.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
    return m ? m[1].trim() : "";
  };
  const scoreOf = (raw) => {
    const m = String(raw).match(/(\d)\s*\/\s*5/);
    return m ? Number(m[1]) : null;
  };
  const note = (text.split(/##\s*Saksnotat/i)[1] || "").split(/##\s*Brevutkast/i)[0].trim();
  const brev = (text.split(/##\s*Brevutkast/i)[1] || "").trim();
  return {
    malgruppe: { score: scoreOf(grab("Målgruppe")), sitat: grab("Sitat målgruppe") || "ikke oppgitt" },
    medvirkning: { score: scoreOf(grab("Medvirkning")), sitat: grab("Sitat medvirkning") || "ikke oppgitt" },
    gratis: { score: scoreOf(grab("Gratis")), sitat: grab("Sitat gratis") || "ikke oppgitt" },
    notat: note || text.trim(),
    brev: brev || "",
    raw: text
  };
}

function applyCockpitFallback(id) {
  const fb = COCKPIT_FALLBACK[id] || {
    malgruppe: { score: null, sitat: "ikke oppgitt" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    notat: "Forhåndstekst — ikke et modell-svar. Syntetisk portalsak. Ikke vedtak.",
    brev: "Utkast — ikke vedtak\n\nDette er fallback, ikke live KI."
  };
  return {
    malgruppe: fb.malgruppe,
    medvirkning: fb.medvirkning,
    gratis: fb.gratis,
    notat: fb.notat,
    brev: fb.brev,
    raw: "",
    live: false
  };
}

function plantedCheck(id, semantic) {
  if (id !== "T-2622") return null;
  const blob = `${semantic.notat}\n${semantic.brev}\n${semantic.raw}`;
  const hit = /§\s*14|Golfklubben/i.test(blob);
  return {
    fail: true,
    tittel: "Sjekken stoppet utkastet",
    tekst: hit
      ? "Første KI-utkast siterer § 14 (investering) og/eller Golfklubben Fjord. Feil paragraf og feil presedens. § 14 gjelder anlegg, ikke jobbtilbud 4.2. Lik sak er Havblik Røde Kors (T-2608). Avvis forslaget."
      : "Øvelsen krever at du ser den plantede feilen: et utkast som blander § 14 og Golfklubben Fjord (T-2621) med et 4.2-jobbtilbud. Fasit: Havblik Røde Kors (T-2608). Avvis."
  };
}

function ensureCockpitWork(id) {
  if (!cockpitWork[id]) {
    const sak = cockpitSak(id);
    const rules = runGrantRules(sak);
    cockpitWork[id] = {
      rules,
      recommended: rules.recommended,
      semantic: null,
      note: "",
      letter: "",
      pipeline: "regler",
      kiStatus: "Regler ferdige. Starter live KI…",
      kiLive: null,
      kiError: "",
      lastPrompt: "",
      hitl: null,
      running: false
    };
  }
  return cockpitWork[id];
}

function journaliser(entry) {
  cockpitJournal.unshift({
    at: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...entry
  });
  if (cockpitJournal.length > 50) cockpitJournal.length = 50;
  renderCockpitJournal();
}

function renderCockpitJournal() {
  const box = document.getElementById("cockpitJournal");
  const status = document.getElementById("cockpitJournalStatus");
  if (status) {
    status.textContent = cockpitJournal.length
      ? `${cockpitJournal.length} journalposter (mock i nettleseren — ikke Elements/Noark)`
      : "Journalen er tom til du åpner en sak eller trykker en knapp.";
  }
  if (!box) return;
  box.innerHTML = cockpitJournal.map((j) => `
    <article class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
      <p class="font-mono text-slate-500">${escHtml(j.at)} · ${escHtml(j.type)} · ${escHtml(j.sak || "—")}</p>
      <p><strong>Handling:</strong> ${escHtml(j.prompt)}</p>
      <p><strong>Resultat:</strong> ${escHtml(j.svar)}</p>
    </article>
  `).join("");
}

function renderCockpitPipeline(work) {
  const el = document.getElementById("cockpitPipeline");
  if (!el) return;
  const step = !work ? "idle" : work.pipeline;
  const items = [
    { id: "regler", label: "1. Regler ferdige" },
    { id: "ki", label: "2. KI analyserer" },
    { id: "utkast", label: "3. Utkast klart" },
    { id: "hitl", label: "4. Mennesket godkjenner" }
  ];
  const order = { idle: -1, regler: 0, ki: 1, utkast: 2, hitl: 3 };
  const cur = order[step] ?? -1;
  el.innerHTML = items.map((it, i) => {
    let cls = "bg-slate-100 text-slate-500 border-slate-200";
    if (i < cur) cls = "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (i === cur) cls = work?.running && it.id === "ki"
      ? "bg-violet-600 text-white border-violet-700 ring-2 ring-violet-300 animate-pulse"
      : "bg-violet-600 text-white border-violet-700 ring-2 ring-violet-300";
    return `<div class="rounded-lg border px-2 py-2 text-[11px] font-semibold ${cls}">${it.label}</div>`;
  }).join("");
}

function renderCockpitRamme() {
  const box = document.getElementById("cockpitRamme");
  if (!box) return;
  const saker = COCKPIT_SKJONN_IDS.map(cockpitSak).filter(Boolean);
  const sumSøkt = saker.reduce((n, s) => n + s.belop, 0);
  const over = sumSøkt - GRANT_SKJONN_RAMME;
  const pct = Math.min(100, Math.round((sumSøkt / GRANT_SKJONN_RAMME) * 100));
  box.innerHTML = `
    <div class="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-950">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <p class="font-bold">Skjønnsramme (øvelse 2026)</p>
        <p class="text-xs font-mono">${formatGrantKroner(GRANT_SKJONN_RAMME)}</p>
      </div>
      <p class="text-xs mt-1">T-2632-familien på arbeidslista (T-2629, T-2632, T-2622): søkt <strong>${formatGrantKroner(sumSøkt)}</strong>. ${over > 0 ? `Sprekk ${formatGrantKroner(over)} — KI kutter ikke. Du prioriterer.` : "Innenfor potten."} Ikke vedtak.</p>
      <div class="mt-2 h-2 rounded-full bg-white/80 overflow-hidden border border-indigo-200">
        <div class="h-full ${over > 0 ? "bg-amber-500" : "bg-indigo-600"}" style="width:${pct}%"></div>
      </div>
    </div>`;
}

function renderCockpitList() {
  const box = document.getElementById("cockpitList");
  const count = document.getElementById("cockpitListCount");
  ensurePortalCasesInSaker();
  const ids = cockpitListIds();
  if (count) count.textContent = `${ids.length} syntetiske`;
  if (!box) return;
  box.innerHTML = ids.map((id) => {
    const sak = cockpitSak(id);
    const extra = COCKPIT_EXTRA[id] || { flag: "ok" };
    const flag = cockpitFlagMeta(extra.flag);
    const on = cockpitSelectedId === id;
    return `
      <button type="button" onclick="selectCockpitCase('${id}')" class="w-full text-left rounded-xl border px-3 py-2.5 ${on ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"}">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-mono font-bold text-violet-700">${sak.id}</span>
          <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${flag.cls}">${flag.text}</span>
        </div>
        <p class="text-sm font-bold text-slate-900 mt-0.5">${escHtml(sak.org)}</p>
        <p class="text-xs text-slate-600">${formatGrantKroner(sak.belop)}</p>
      </button>`;
  }).join("");
}

function semanticRowHtml(label, item) {
  const score = item?.score != null ? `${item.score}/5` : "—";
  const sitat = item?.sitat || "ikke oppgitt";
  return `<tr class="border-b border-slate-100">
    <td class="py-1.5 pr-2 font-medium">${escHtml(label)}</td>
    <td class="py-1.5 pr-2 font-mono text-xs">${score}</td>
    <td class="py-1.5 text-slate-600">${escHtml(sitat)}</td>
  </tr>`;
}

function renderCockpitCard() {
  const box = document.getElementById("cockpitCard");
  const status = document.getElementById("cockpitKiStatus");
  if (!box) return;
  renderCockpitRamme();
  if (!cockpitSelectedId) {
    renderCockpitPipeline(null);
    if (status) status.textContent = "Velg en sak. Reglene kjøres først. Deretter KI.";
    box.innerHTML = `<p class="text-sm text-slate-500">Velg en sak i listen. Da ser du søknad, regler, KI-analyse og utkast.</p>`;
    return;
  }
  const sak = cockpitSak(cockpitSelectedId);
  const extra = COCKPIT_EXTRA[sak.id] || { vedlegg: [], budsjett: [], adminPct: 0, flag: "ok" };
  const work = ensureCockpitWork(sak.id);
  renderCockpitPipeline(work);
  if (status) status.textContent = work.kiStatus;
  const planted = work.semantic ? plantedCheck(sak.id, work.semantic) : null;
  const vedleggHtml = (extra.vedlegg || []).map((v) => {
    const ok = v.status === "ok";
    return `<li class="flex justify-between gap-2 text-xs"><span>${escHtml(v.navn)}</span><span class="${ok ? "text-emerald-700" : "text-rose-700"} font-semibold">${ok ? "OK" : "Mangler"}</span></li>`;
  }).join("");
  const budsjettHtml = (extra.budsjett || []).map((b) => `
    <tr class="border-b border-slate-100">
      <td class="py-1 pr-2">${escHtml(b.post)}</td>
      <td class="py-1 pr-2 text-right font-mono">${formatGrantKroner(b.belop)}</td>
      <td class="py-1 text-[10px] uppercase text-slate-500">${escHtml(b.type)}</td>
    </tr>`).join("");
  const checksHtml = work.rules.checks.map((c) => {
    const t = ruleTone(c.status);
    return `<div class="rounded-lg border px-2.5 py-2 ${t.cls}"><p class="text-[10px] font-bold uppercase">${t.mark} · ${escHtml(c.label)}</p><p class="text-xs mt-0.5">${escHtml(c.text)}</p></div>`;
  }).join("");
  const ragItems = cockpitRagFor(sak);
  const kiBanner = work.running
    ? `<div class="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-xs text-violet-950" role="status">Live KI kjører via /api/chat… Semantikk, saksnotat og brevutkast kommer fra modellen når kallet lykkes.</div>`
    : work.kiLive === true
      ? `<div class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-950">Live KI er førstevalg (OpenAI via /api/chat). Semantikk, saksnotat og brev er modellgenerert. <strong>Forslag — ikke vedtak.</strong></div>`
      : work.kiLive === false
        ? `<div class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950"><strong>Ikke modell.</strong> /api/chat manglet eller feilet${work.kiError ? ` (${escHtml(work.kiError)})` : ""}. Dette er forhåndsanalyse (fallback). Kjør på nytt når API er oppe.</div>`
        : `<div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">Venter på live KI-steget.</div>`;
  const plantedDemo = sak.id === "T-2622" ? `
    <div class="rounded-lg border border-fuchsia-300 bg-fuchsia-50 px-3 py-2 text-xs text-fuchsia-950 space-y-1">
      <p class="font-bold">Plantet feil — kan avvises</p>
      <p>Første demonstrasjonsutkast siterer § 14 og Golfklubben Fjord (T-2621). Det er feil hentet. Jobbtilbud 4.2 skal peke på Havblik Røde Kors (T-2608). Bruk «Avvis med grunn».</p>
      <p class="font-mono whitespace-pre-wrap">${escHtml(COCKPIT_FALLBACK["T-2622"].brev)}</p>
    </div>` : "";
  const sem = work.semantic;
  const semHtml = sem ? `
    <table class="w-full text-xs">
      <thead><tr class="text-left text-slate-500"><th class="py-1">Tema</th><th class="py-1">Score</th><th class="py-1">Sitat</th></tr></thead>
      <tbody>
        ${semanticRowHtml("Målgruppe", sem.malgruppe)}
        ${semanticRowHtml("Medvirkning", sem.medvirkning)}
        ${semanticRowHtml("Gratis", sem.gratis)}
      </tbody>
    </table>` : `<p class="text-xs text-slate-500">${work.running ? "Analyserer søknadstekst mot RAG-utdrag…" : "Ingen semantikk ennå."}</p>`;
  const plantedHtml = planted ? `
    <div class="rounded-lg border border-fuchsia-300 bg-fuchsia-50 px-3 py-2 text-xs text-fuchsia-950">
      <p class="font-bold">${escHtml(planted.tittel)}</p>
      <p class="mt-1">${escHtml(planted.tekst)}</p>
    </div>` : "";
  const hitlNote = work.hitl ? `<p class="text-xs font-semibold text-slate-800">${escHtml(work.hitl)}</p>` : "";

  box.innerHTML = `
    <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
      <div>
        <p class="text-[10px] font-mono font-bold text-violet-700">${sak.id}</p>
        <h3 class="text-base font-bold text-slate-900">${escHtml(sak.org)}</h3>
        <p class="text-xs text-slate-500">${escHtml(sak.kommune)} · ${escHtml(sak.aktivitet)}</p>
      </div>
      <button type="button" onclick="runCockpitKI('${sak.id}', true)" class="px-3 py-1.5 rounded-lg bg-violet-800 hover:bg-violet-900 text-white text-xs font-semibold disabled:opacity-40" ${work.running ? "disabled" : ""}>Kjør KI-vurdering på nytt</button>
    </div>
    ${kiBanner}
    <div class="grid md:grid-cols-2 gap-4 mt-4">
      <div class="space-y-3">
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Søknad</h4>
          <p class="text-sm text-slate-800 leading-relaxed mt-1">${escHtml(sak.soknad)}</p>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Budsjettposter (syntetisk)</h4>
          <table class="w-full text-xs mt-1">${budsjettHtml}</table>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Vedleggstatus (syntetisk)</h4>
          <ul class="mt-1 space-y-1">${vedleggHtml}</ul>
        </div>
      </div>
      <div class="space-y-3">
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Kontroll (regler)</h4>
          <div class="space-y-1.5 mt-1">${checksHtml}</div>
        </div>
        ${ragPanelHtml(ragItems, "Øvelsesregler 2026: admin 15 % og revisor 200 000 kr.")}
        <details class="rounded-xl border border-slate-200 bg-white px-3 py-2">
          <summary class="text-xs font-bold text-slate-800 cursor-pointer">Hva modellen fikk</summary>
          <p class="text-[11px] text-slate-600 mt-2">Søknadstekst, saksfakta og kildelista under ble sendt til live KI. Ingenting annet.</p>
          <ul class="mt-2 text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
            <li>${escHtml(sak.id)} · ${escHtml(sak.org)} · ${formatGrantKroner(sak.belop)}</li>
            <li>Aktivitet: ${escHtml(sak.aktivitet)}</li>
            <li>Kilder: ${escHtml(ragItems.map((r) => r.tittel).join("; "))}</li>
          </ul>
          <pre class="mt-2 text-[10px] font-mono whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-2 max-h-40 overflow-auto">${escHtml(work.lastPrompt || "Prompten settes når KI kjører.")}</pre>
        </details>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">KI-semantikk</h4>
          <div class="mt-1">${semHtml}</div>
        </div>
        ${plantedHtml}
        ${plantedDemo}
        <label class="block">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Anbefalt beløp (redigerbart, ikke vedtak)</span>
          <input id="cockpitBelop" type="number" value="${work.recommended}" class="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
        </label>
        <label class="block">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Saksnotat (utkast)</span>
          <textarea id="cockpitNotat" rows="4" class="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">${escHtml(work.note)}</textarea>
        </label>
        <label class="block">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Brevutkast</span>
          <textarea id="cockpitBrev" rows="5" class="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono">${escHtml(work.letter)}</textarea>
        </label>
        <label class="block">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Din begrunnelse (ved avvis/juster)</span>
          <input id="cockpitGrunn" type="text" placeholder="Skriv grunn her…" class="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
        </label>
        <div class="flex flex-wrap gap-2">
          <button type="button" onclick="cockpitHitl('bekreft')" class="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">Bekreft forslag</button>
          <button type="button" onclick="cockpitHitl('juster')" class="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold">Juster</button>
          <button type="button" onclick="cockpitHitl('avvis')" class="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-semibold">Avvis med grunn</button>
          <button type="button" onclick="cockpitHitl('sta')" class="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold">La stå</button>
        </div>
        <p class="text-[11px] text-slate-500">Ingenting sendes eksternt. Mock-journal i nettleseren.</p>
        ${hitlNote}
      </div>
    </div>`;
}

function readCockpitEditors(work) {
  const belop = document.getElementById("cockpitBelop");
  const notat = document.getElementById("cockpitNotat");
  const brev = document.getElementById("cockpitBrev");
  if (belop && belop.value !== "") work.recommended = Number(belop.value) || 0;
  if (notat) work.note = notat.value;
  if (brev) work.letter = brev.value;
}

async function runCockpitKI(id, force) {
  const sak = cockpitSak(id);
  if (!sak) return;
  const work = ensureCockpitWork(id);
  if (work.running) return;
  if (work.semantic && !force) return;
  work.running = true;
  work.pipeline = "ki";
  work.kiError = "";
  work.kiStatus = "Live KI analyserer søknadstekst + RAG-utdrag via /api/chat…";
  renderCockpitList();
  renderCockpitCard();
  const seq = ++cockpitKiSeq;
  const ragItems = cockpitRagFor(sak);
  const rag = formatCockpitRag(sak);
  const userPrompt = `Saksnummer: ${sak.id}\nOrganisasjon: ${sak.org}\nSøkt beløp: ${sak.belop} kr\nAktivitet: ${sak.aktivitet}\nAdminandel i øvelsen: ${COCKPIT_EXTRA[id]?.adminPct ?? "ikke oppgitt"} %\n\nSØKNADSTEKST:\n${sak.soknad}\n\nRAG-UTDRAG (fiktiv veileder/forskrift, øvelse 2026 — ikke Bufdir):\n${rag}\n\nKilder sendt inn: ${ragItems.map((r) => r.tittel).join("; ")}\n\nSkriv semantikk, saksnotat og brevutkast. Ikke fatt vedtak.`;
  work.lastPrompt = userPrompt;
  journaliser({
    type: "ki-kall",
    sak: id,
    prompt: force ? "Kjør KI-vurdering på nytt" : "Første live KI-vurdering",
    svar: `Sendt søknadstekst og ${ragItems.length} RAG-utdrag til /api/chat. Modell får ikke fatte vedtak.`
  });
  try {
    const text = await callModelAPI(userPrompt, COCKPIT_SYSTEM_PROMPT);
    if (seq !== cockpitKiSeq) {
      return;
    }
    const parsed = parseCockpitKi(text);
    work.semantic = parsed;
    work.note = parsed.notat;
    work.letter = parsed.brev || parsed.notat;
    work.kiLive = true;
    work.kiStatus = "Live KI ferdig. Forslag — ikke vedtak. Du kan kjøre på nytt.";
    journaliser({
      type: "ki-svar",
      sak: id,
      prompt: "Svar fra /api/chat",
      svar: (parsed.notat || text).slice(0, 280)
    });
  } catch (e) {
    if (seq !== cockpitKiSeq) return;
    const fb = applyCockpitFallback(id);
    work.semantic = fb;
    work.note = fb.notat;
    work.letter = fb.brev;
    work.kiLive = false;
    work.kiError = e?.simulation ? "simulation/ingen nøkkel" : (e?.message || "api_error");
    work.kiStatus = `Ikke modell. Fallback etter feil i /api/chat (${work.kiError}).`;
    journaliser({
      type: "ki-fallback",
      sak: id,
      prompt: "API uten nøkkel eller feil",
      svar: `Forhåndsanalyse lastet (${work.kiError}). Ikke et modell-svar.`
    });
  }
  work.running = false;
  work.pipeline = "utkast";
  if (id === "T-2622") {
    journaliser({
      type: "sjekk",
      sak: id,
      prompt: "Validator mot plantet feil",
      svar: "Utkastet skal kunne avvises: feil § og Golfklubben."
    });
  }
  renderCockpitList();
  renderCockpitCard();
}

function selectCockpitCase(id) {
  if (!document.getElementById("cockpitRoot")) return;
  const sak = cockpitSak(id);
  if (!sak) return;
  setCockpitTab("arbeid");
  cockpitSelectedId = id;
  const work = ensureCockpitWork(id);
  if (!cockpitJournal.some((j) => j.sak === id && j.type === "regler")) {
    journaliser({
      type: "regler",
      sak: id,
      prompt: "Deterministisk kontroll",
      svar: work.rules.checks.map((c) => `${c.label}: ${c.status}`).join("; ")
    });
  }
  renderCockpitList();
  renderCockpitCard();
  if (!work.semantic && !work.running) runCockpitKI(id, false);
  try { history.replaceState(null, "", `#${id}`); } catch (_e) { /* ignore */ }
}

function cockpitHitl(action) {
  if (!cockpitSelectedId) return;
  const work = ensureCockpitWork(cockpitSelectedId);
  readCockpitEditors(work);
  const grunnEl = document.getElementById("cockpitGrunn");
  const grunn = grunnEl ? grunnEl.value.trim() : "";
  work.pipeline = "hitl";
  if (action === "bekreft") {
    work.hitl = `Du bekreftet forslaget på ${formatGrantKroner(work.recommended)}. Fortsatt ikke et vedtak.`;
    journaliser({ type: "hitl", sak: cockpitSelectedId, prompt: "Bekreft forslag", svar: work.hitl });
    arkiverCockpitSak(cockpitSelectedId, work, "bekreft");
  } else if (action === "juster") {
    work.hitl = `Du justerte til ${formatGrantKroner(work.recommended)}. ${grunn || "Ingen skriftlig grunn."} Ikke vedtak.`;
    journaliser({ type: "hitl", sak: cockpitSelectedId, prompt: "Juster", svar: work.hitl });
  } else if (action === "avvis") {
    if (!grunn) {
      work.hitl = "Avvis krever en grunn. Skriv i feltet og prøv igjen.";
      renderCockpitCard();
      return;
    }
    work.hitl = `Du avviste KI-forslaget: ${grunn}`;
    journaliser({ type: "hitl", sak: cockpitSelectedId, prompt: "Avvis med grunn", svar: work.hitl });
  } else {
    work.hitl = "Saken står. Ingen godkjenning, ingen sending.";
    journaliser({ type: "hitl", sak: cockpitSelectedId, prompt: "La stå", svar: work.hitl });
  }
  renderCockpitCard();
}

function setCockpitTab(tab) {
  cockpitTab = tab;
  const arbeid = document.getElementById("cockpitArbeid");
  const klage = document.getElementById("cockpitKlage");
  const slutt = document.getElementById("cockpitSlutt");
  const neste = document.getElementById("cockpitNeste");
  if (arbeid) arbeid.classList.toggle("hidden", tab !== "arbeid");
  if (klage) klage.classList.toggle("hidden", tab !== "klage");
  if (slutt) slutt.classList.toggle("hidden", tab !== "slutt");
  if (neste) neste.classList.toggle("hidden", tab !== "neste");
  ["Arbeid", "Klage", "Slutt", "Neste"].forEach((name) => {
    const btn = document.getElementById(`cockpitTab${name}`);
    if (!btn) return;
    const on = (name === "Arbeid" && tab === "arbeid") || (name === "Klage" && tab === "klage") || (name === "Slutt" && tab === "slutt") || (name === "Neste" && tab === "neste");
    btn.className = on
      ? "px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
      : "px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold";
  });
  if (tab === "klage") {
    renderCockpitKlage();
    if (!cockpitKlage.vurdering && !cockpitKlage.running) runCockpitKlageKI(false);
  }
  if (tab === "slutt") {
    renderCockpitSlutt();
    if (!cockpitSlutt.vurdering && !cockpitSlutt.running) runCockpitSluttKI(false);
  }
  if (tab === "neste") renderNesteFase();
}

function parseKlageKi(text) {
  const del = (a, b) => (text.split(new RegExp(`##\\s*${a}`, "i"))[1] || "").split(new RegExp(`##\\s*${b}`, "i"))[0].trim();
  return {
    vurdering: del("Vurdering", "Utkast omgjøring") || text.trim(),
    omgjoring: del("Utkast omgjøring", "Utkast opprettholdelse"),
    opprettholdelse: (text.split(/##\s*Utkast opprettholdelse/i)[1] || "").trim()
  };
}

function parseSluttKi(text) {
  const del = (a, b) => (text.split(new RegExp(`##\\s*${a}`, "i"))[1] || "").split(new RegExp(`##\\s*${b}`, "i"))[0].trim();
  return {
    vurdering: del("Vurdering", "Utkast tilbakekreving") || text.trim(),
    tilbake: del("Utkast tilbakekreving", "Alternativ"),
    alternativ: (text.split(/##\s*Alternativ/i)[1] || "").trim()
  };
}

function cockpitPhaseBanner(state, label) {
  if (state.running) {
    return `<div class="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-xs text-violet-950" role="status">${escHtml(label)} kjører via /api/chat…</div>`;
  }
  if (state.live === true) {
    return `<div class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-950">Live KI er førstevalg. Forslag — ikke vedtak.</div>`;
  }
  if (state.live === false) {
    return `<div class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950"><strong>Ikke modell.</strong> Fallback etter ${escHtml(state.error || "API-feil")}.</div>`;
  }
  return `<div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">Venter på live KI.</div>`;
}

function renderCockpitKlage() {
  const ragBox = document.getElementById("cockpitKlageRag");
  const out = document.getElementById("cockpitKlageOutput");
  const banner = document.getElementById("cockpitKlageBanner");
  const rerun = document.getElementById("cockpitKlageRerun");
  if (ragBox) ragBox.innerHTML = ragPanelHtml(cockpitKlageRag(), "Samme fiktive kildetype som sakskortet.");
  if (banner) banner.innerHTML = cockpitPhaseBanner(cockpitKlage, "Klage-KI");
  if (rerun) rerun.disabled = cockpitKlage.running;
  if (!out) return;
  if (!cockpitKlage.vurdering && cockpitKlage.running) {
    out.innerHTML = `<p class="text-sm text-slate-600">Modellen skriver utkast til omgjøring og opprettholdelse…</p>`;
    return;
  }
  if (!cockpitKlage.vurdering) {
    out.innerHTML = `<p class="text-sm text-slate-500">Ingen KI-vurdering ennå.</p>`;
    return;
  }
  out.innerHTML = `
    <div class="space-y-3 text-sm text-slate-800">
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Vurdering</h4><p class="whitespace-pre-wrap mt-1">${escHtml(cockpitKlage.vurdering)}</p></div>
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Utkast omgjøring</h4><p class="whitespace-pre-wrap mt-1 font-mono text-xs">${escHtml(cockpitKlage.omgjoring)}</p></div>
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Utkast opprettholdelse</h4><p class="whitespace-pre-wrap mt-1 font-mono text-xs">${escHtml(cockpitKlage.opprettholdelse)}</p></div>
    </div>`;
}

function renderCockpitSlutt() {
  const ragBox = document.getElementById("cockpitSluttRag");
  const out = document.getElementById("cockpitSluttOutput");
  const banner = document.getElementById("cockpitSluttBanner");
  const rerun = document.getElementById("cockpitSluttRerun");
  if (ragBox) ragBox.innerHTML = ragPanelHtml(cockpitSluttRag(), "Samme fiktive kildetype som sakskortet.");
  if (banner) banner.innerHTML = cockpitPhaseBanner(cockpitSlutt, "Slutt-KI");
  if (rerun) rerun.disabled = cockpitSlutt.running;
  if (!out) return;
  if (!cockpitSlutt.vurdering && cockpitSlutt.running) {
    out.innerHTML = `<p class="text-sm text-slate-600">Modellen skriver utkast til tilbakekreving…</p>`;
    return;
  }
  if (!cockpitSlutt.vurdering) {
    out.innerHTML = `<p class="text-sm text-slate-500">Ingen KI-vurdering ennå.</p>`;
    return;
  }
  out.innerHTML = `
    <div class="space-y-3 text-sm text-slate-800">
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Vurdering</h4><p class="whitespace-pre-wrap mt-1">${escHtml(cockpitSlutt.vurdering)}</p></div>
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Utkast tilbakekreving</h4><p class="whitespace-pre-wrap mt-1 font-mono text-xs">${escHtml(cockpitSlutt.tilbake)}</p></div>
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Alternativ</h4><p class="whitespace-pre-wrap mt-1">${escHtml(cockpitSlutt.alternativ)}</p></div>
    </div>`;
}

async function runCockpitKlageKI(force) {
  if (cockpitKlage.running) return;
  if (cockpitKlage.vurdering && !force) return;
  const sak = cockpitSak("T-2629");
  const ragItems = cockpitKlageRag();
  cockpitKlage.running = true;
  cockpitKlage.error = "";
  renderCockpitKlage();
  const status = document.getElementById("cockpitKlageStatus");
  if (status) status.textContent = "Live KI kjører på klagen via /api/chat…";
  journaliser({
    type: "ki-kall",
    sak: "T-2629",
    prompt: force ? "Kjør klage-KI på nytt" : "Klage-KI (kursleder)",
    svar: `Sendt klagefakta og ${ragItems.length} RAG-utdrag. Ikke omgjøring, ikke vedtak.`
  });
  const prompt = `SAK: T-2629 ${sak?.org || "Fjordheim kulturskolevenner"}
Søkt: ${sak?.belop || 410000} kr. Admin sto som 32 % (131 200 kr).
Opprinnelig forslag: avkorting over 15 % admin (øvelsesregel 2026).
KLAGE — nytt faktum: 40 000 kr av prosjektledelse var honorar til kursleder (faglig aktivitet), ikke generell administrasjon.

SØKNADSTEKST:
${sak?.soknad || "ikke oppgitt"}

RAG-UTDRAG (fiktivt, øvelse 2026 — ikke Bufdir):
${ragItems.map((r) => `### ${r.tittel}\n${r.tekst}`).join("\n\n")}

Skriv vurdering, utkast omgjøring og utkast opprettholdelse. Ikke fatt vedtak.`;
  try {
    const text = await callModelAPI(prompt, COCKPIT_KLAGE_SYSTEM);
    const parsed = parseKlageKi(text);
    cockpitKlage.vurdering = parsed.vurdering;
    cockpitKlage.omgjoring = parsed.omgjoring || parsed.vurdering;
    cockpitKlage.opprettholdelse = parsed.opprettholdelse || "";
    cockpitKlage.live = true;
    if (status) status.textContent = "Live KI ferdig på klagen. Forslag — ikke vedtak.";
    journaliser({ type: "ki-svar", sak: "T-2629", prompt: "Klage /api/chat", svar: parsed.vurdering.slice(0, 280) });
  } catch (e) {
    cockpitKlage.vurdering = COCKPIT_KLAGE_FALLBACK.vurdering;
    cockpitKlage.omgjoring = COCKPIT_KLAGE_FALLBACK.omgjoring;
    cockpitKlage.opprettholdelse = COCKPIT_KLAGE_FALLBACK.opprettholdelse;
    cockpitKlage.live = false;
    cockpitKlage.error = e?.simulation ? "simulation/ingen nøkkel" : (e?.message || "api_error");
    if (status) status.textContent = `Ikke modell. Fallback (${cockpitKlage.error}).`;
    journaliser({ type: "ki-fallback", sak: "T-2629", prompt: "Klage-API feilet", svar: `Forhåndstekst. ${cockpitKlage.error}` });
  }
  cockpitKlage.running = false;
  renderCockpitKlage();
}

async function runCockpitSluttKI(force) {
  if (cockpitSlutt.running) return;
  if (cockpitSlutt.vurdering && !force) return;
  const sak = cockpitSak("T-2631");
  const ragItems = cockpitSluttRag();
  cockpitSlutt.running = true;
  cockpitSlutt.error = "";
  renderCockpitSlutt();
  const status = document.getElementById("cockpitSluttStatus");
  if (status) status.textContent = "Live KI kjører på slutt/avvik via /api/chat…";
  journaliser({
    type: "ki-kall",
    sak: "T-2631",
    prompt: force ? "Kjør slutt-KI på nytt" : "Slutt-KI (mindreforbruk)",
    svar: `Sendt sluttfakta og ${ragItems.length} RAG-utdrag. Ikke innkreving, ikke vedtak.`
  });
  const prompt = `SAK: T-2631 ${sak?.org || "Myr idrettslag anlegg"}
Innvilget 220 000 kr til inkluderende trening.
SLUTTREGNSKAP: 140 000 kr til ny gressbane (investering, ikke godkjent) og 80 000 kr til aktivitet. Mindreforbruk på aktivitet, brudd på vilkår på anlegg.

SØKNADSTEKST:
${sak?.soknad || "ikke oppgitt"}

RAG-UTDRAG (fiktivt, øvelse 2026 — ikke Bufdir):
${ragItems.map((r) => `### ${r.tittel}\n${r.tekst}`).join("\n\n")}

Skriv vurdering, utkast tilbakekreving og alternativ. Ikke fatt vedtak. Ikke start innkreving.`;
  try {
    const text = await callModelAPI(prompt, COCKPIT_SLUTT_SYSTEM);
    const parsed = parseSluttKi(text);
    cockpitSlutt.vurdering = parsed.vurdering;
    cockpitSlutt.tilbake = parsed.tilbake || parsed.vurdering;
    cockpitSlutt.alternativ = parsed.alternativ || "";
    cockpitSlutt.live = true;
    if (status) status.textContent = "Live KI ferdig på slutt. Forslag — ikke innkreving, ikke vedtak.";
    journaliser({ type: "ki-svar", sak: "T-2631", prompt: "Slutt /api/chat", svar: parsed.vurdering.slice(0, 280) });
  } catch (e) {
    cockpitSlutt.vurdering = COCKPIT_SLUTT_FALLBACK.vurdering;
    cockpitSlutt.tilbake = COCKPIT_SLUTT_FALLBACK.tilbake;
    cockpitSlutt.alternativ = COCKPIT_SLUTT_FALLBACK.alternativ;
    cockpitSlutt.live = false;
    cockpitSlutt.error = e?.simulation ? "simulation/ingen nøkkel" : (e?.message || "api_error");
    if (status) status.textContent = `Ikke modell. Fallback (${cockpitSlutt.error}).`;
    journaliser({ type: "ki-fallback", sak: "T-2631", prompt: "Slutt-API feilet", svar: `Forhåndstekst. ${cockpitSlutt.error}` });
  }
  cockpitSlutt.running = false;
  renderCockpitSlutt();
}

function journaliserCockpitKlage(valg) {
  const el = document.getElementById("cockpitKlageStatus");
  const tekst = valg === "godta"
    ? "Du tok omgjøringsutkastet inn i mock-journal. Admin kan regnes på nytt. Ikke omgjøring, ikke vedtak."
    : "Du tok opprettholdelsesutkastet inn i mock-journal. Opprinnelig avkorting står i øvelsen. Ikke vedtak.";
  if (el) el.textContent = tekst;
  journaliser({
    type: "hitl",
    sak: "T-2629",
    prompt: valg === "godta" ? "Human-in-the-loop: foreslå omgjøring" : "Human-in-the-loop: foreslå opprettholdelse",
    svar: tekst
  });
  arkiverCockpitSak("T-2629", {
    recommended: 0,
    note: cockpitKlage.vurdering,
    letter: valg === "godta" ? cockpitKlage.omgjoring : cockpitKlage.opprettholdelse
  }, valg === "godta" ? "klage-omgjor" : "klage-oppretthold");
}

function journaliserCockpitSlutt(valg) {
  const el = document.getElementById("cockpitSluttStatus");
  const tekst = valg === "tilbake"
    ? "Du journalførte tilbakekrevingsutkastet (140 000 kr gressbane). 80 000 kr aktivitet urørt. Ikke innkreving."
    : "Sluttsaken står. Ingen tilbakekreving startet.";
  if (el) el.textContent = tekst;
  journaliser({
    type: "hitl",
    sak: "T-2631",
    prompt: valg === "tilbake" ? "Human-in-the-loop: tilbakekrevingsutkast" : "Human-in-the-loop: la slutt stå",
    svar: tekst
  });
  if (valg === "tilbake") {
    arkiverCockpitSak("T-2631", {
      recommended: 140000,
      note: cockpitSlutt.vurdering,
      letter: cockpitSlutt.tilbake
    }, "slutt-tilbake");
  }
}

function arkiverCockpitSak(id, work, handling) {
  const sak = cockpitSak(id);
  if (!sak) return;
  const map = loadArkivMapper();
  const now = new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const pdf = [
    "UTKAST — IKKE VEDTAK",
    `ARCHIVE_DRIVER=${ARCHIVE_DRIVER}`,
    `Sak ${id} · ${sak.org}`,
    `Handling: ${handling}`,
    `Anbefalt beløp i øvelsen: ${work.recommended ?? "—"}`,
    "",
    "— Saksnotat —",
    work.note || "ikke oppgitt",
    "",
    "— Brevutkast —",
    work.letter || "ikke oppgitt",
    "",
    "Ikke Elements. Ikke Noark. Ikke SvarUt. Mock i nettleseren."
  ].join("\n");
  map[id] = {
    sak: id,
    org: sak.org,
    driver: ARCHIVE_DRIVER,
    arkivert: true,
    at: now,
    handling,
    pdf,
    poster: [
      { art: "I", tittel: "Søknad / henvendelse mottatt", tekst: sak.soknad, at: now },
      { art: "N", tittel: "Internt notat (KI + saksbehandler)", tekst: work.note || "ikke oppgitt", at: now },
      { art: "U", tittel: "Utgående utkast arkivert", tekst: (work.letter || "").slice(0, 400), at: now }
    ]
  };
  saveArkivMapper(map);
  renderCockpitArkiv();
}

function renderCockpitArkiv() {
  const box = document.getElementById("cockpitArkiv");
  if (!box) return;
  const map = loadArkivMapper();
  const ids = Object.keys(map);
  if (!ids.length) {
    box.innerHTML = `<p class="text-xs text-slate-600">Ingen arkiverte mapper ennå. Bekreft et forslag på arbeidslista, eller ta et klage-/sluttutkast, så vises I/N/U her.</p>`;
    return;
  }
  box.innerHTML = ids.map((id) => {
    const m = map[id];
    const posters = (m.poster || []).map((p) => `
      <li class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <p class="text-[10px] font-mono font-bold text-slate-500">${escHtml(p.art)} · ${escHtml(p.at)}</p>
        <p class="text-xs font-semibold text-slate-900">${escHtml(p.tittel)}</p>
        <p class="text-[11px] text-slate-600 mt-0.5">${escHtml((p.tekst || "").slice(0, 220))}</p>
      </li>`).join("");
    return `<article class="rounded-xl border border-slate-200 p-3 space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm font-bold text-slate-900">${escHtml(id)} · ${escHtml(m.org)}</p>
        <span class="text-[10px] font-bold uppercase tracking-wider ${m.arkivert ? "text-emerald-800" : "text-slate-500"}">${m.arkivert ? "Arkivert (mock)" : "Åpen"}</span>
      </div>
      <p class="text-[11px] text-slate-500">Driver: ${escHtml(m.driver || ARCHIVE_DRIVER)} · ${escHtml(m.at || "")}</p>
      <ul class="space-y-1.5">${posters}</ul>
      <button type="button" onclick="lastNedArkivUtkast('${id}')" class="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold">Last ned tekst-PDF-lignende utkast</button>
    </article>`;
  }).join("");
}

function lastNedArkivUtkast(id) {
  const m = loadArkivMapper()[id];
  if (!m) return;
  const blob = new Blob([m.pdf || ""], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${id}-utkast-mock.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function renderNesteFase() {
  renderPortalSakerListe();
  renderCockpitArkiv();
}

function renderPortalSakerListe() {
  const box = document.getElementById("portalSakerListe");
  if (!box) return;
  const list = loadPortalSaker();
  box.innerHTML = list.length
    ? list.map((p) => `<p><a class="font-semibold text-violet-800 underline underline-offset-2" href="cockpit.html#${p.id}">${escHtml(p.id)}</a> · ${escHtml(p.org)} · ${formatGrantKroner(p.belop)}</p>`).join("")
    : `<p>Ingen portalsaker ennå. Send en i <a class="font-semibold text-violet-800 underline underline-offset-2" href="portal.html">søkerportalen</a>.</p>`;
}

function lookupSimulertRegister() {
  const input = document.getElementById("registerOrgnr");
  const out = document.getElementById("registerResultat");
  if (!out) return;
  const hit = lookupOvelsesregister(input ? input.value : "");
  if (!hit) {
    out.innerHTML = `<p class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-950">Ikke funnet i øvelsestabellen. Simulert register — ikke Brønnøysund.</p>`;
    return;
  }
  out.innerHTML = `<div class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-950">
    <p class="font-bold">${escHtml(hit.navn)}</p>
    <p class="text-xs mt-1">${escHtml(hit.orgnr)} · ${escHtml(hit.form)} · Enhet ${hit.enhet ? "ja" : "nei"} · Frivillig ${hit.frivillig ? "ja" : "nei"}</p>
    <p class="text-[11px] mt-1">Simulert register. Ikke live API.</p>
  </div>`;
}

function lookupPortalRegister() {
  const input = document.getElementById("portalOrgnr");
  const status = document.getElementById("portalRegisterStatus");
  const org = document.getElementById("portalOrg");
  const hit = lookupOvelsesregister(input ? input.value : "");
  if (!hit) {
    if (status) status.textContent = "Ikke i simulert register. Du kan likevel sende inn — saken flagges i cockpiten.";
    return;
  }
  if (org) org.value = hit.navn;
  if (status) status.textContent = `${hit.navn}: ${hit.form}. Enhet ${hit.enhet ? "ja" : "nei"}, frivillig ${hit.frivillig ? "ja" : "nei"}. Simulert register.`;
}

function submitPortalSoknad() {
  const orgnr = (document.getElementById("portalOrgnr")?.value || "").trim();
  const org = (document.getElementById("portalOrg")?.value || "").trim();
  const aktivitet = document.getElementById("portalAktivitet")?.value || "4.1 Kultur-, fritids- og ferieaktivitet";
  const belop = Number(document.getElementById("portalBelop")?.value || 0);
  const soknad = (document.getElementById("portalSoknad")?.value || "").trim();
  const status = document.getElementById("portalSubmitStatus");
  if (!orgnr || !org || !soknad || !belop) {
    if (status) status.textContent = "Fyll ut org.nr., navn, beløp og tekst.";
    return;
  }
  const list = loadPortalSaker();
  const existing = list.find((p) => p.orgnr.replace(/\s/g, "") === orgnr.replace(/\s/g, ""));
  const id = existing ? existing.id : `T-9${String(100 + list.length).slice(-3)}`;
  const row = {
    id,
    orgnr,
    org,
    aktivitet,
    belop,
    soknad,
    at: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
  };
  const next = existing ? list.map((p) => (p.id === id ? row : p)) : [...list, row];
  savePortalSaker(next);
  ensurePortalCasesInSaker();
  if (status) status.textContent = existing
    ? `Oppdatert ${id} (øvelse). Åpne cockpiten for å se saken.`
    : `Opprettet ${id} (øvelse). Åpne cockpiten for å se saken.`;
  renderPortalMineSaker();
  renderPortalSakerListe();
}

function renderPortalMineSaker() {
  const box = document.getElementById("portalMineSaker");
  if (!box) return;
  const list = loadPortalSaker();
  box.innerHTML = list.length
    ? `<ul class="space-y-1">${list.map((p) => `<li>${escHtml(p.id)} · ${escHtml(p.org)} · ${formatGrantKroner(p.belop)} · <a class="font-semibold text-violet-800 underline underline-offset-2" href="cockpit.html#${p.id}">åpne i cockpit</a></li>`).join("")}</ul>`
    : `<p class="text-slate-500">Ingen innsendinger i denne nettleseren.</p>`;
}

function initPortalPage() {
  if (!document.getElementById("portalOrgnr")) return;
  lookupPortalRegister();
  renderPortalMineSaker();
}

function initCockpit() {
  if (!document.getElementById("cockpitRoot")) return;
  ensurePortalCasesInSaker();
  renderCockpitRamme();
  renderCockpitList();
  renderCockpitJournal();
  renderCockpitPipeline(null);
  renderCockpitCard();
  renderCockpitKlage();
  renderCockpitSlutt();
  renderNesteFase();
}

window.addEventListener('DOMContentLoaded', () => {
  try { currentMode = localStorage.getItem("guideMode") || "simple"; } catch (_e) { currentMode = "simple"; }
  toggleMode(currentMode, { keepChapter: true });
  renderFoilManus();
  syncChapterNav();
  initCockpit();
  initPortalPage();
  applyHash();
  renderTokens();
  setScenario(0);
  setPromptTab(0);
  setTraffic('green');
  updateSectorDataSelection();
  calculateSoftmaxMath();
  calculateKVCache();
  initAgentDesk();
  initLangGraphForslag();
  renderGrantProcessRail();
  renderGrantJournal();
  if (document.getElementById("techDeepDiveSection") && window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise();
  }
});
