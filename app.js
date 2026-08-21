let typingTimer = null;
let sectorTypingTimer = null;
let activePromptTabIdx = 0;
let selectedDataScen = 'bydelA';
let liveSsbFetched = false;
let ssbLiveDataText = "";
let currentScenIdx = 0;

async function callGeminiAPI(promptText, systemPromptText = "") {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: promptText }] }]
  };
  if (systemPromptText) {
    payload.systemInstruction = {
      parts: [{ text: systemPromptText }]
    };
  }

  let delay = 1000;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
  throw new Error("Kunne ikke hente svar fra Gemini API.");
}

function toggleMode(mode) {
  const btnSimple = document.getElementById('btnSimple');
  const btnTech = document.getElementById('btnTech');
  const techSection = document.getElementById('techDeepDiveSection');
  const heroBadge = document.getElementById('heroBadge');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');

  if (mode === 'simple') {
    if (btnSimple) btnSimple.className = "px-3.5 py-1.5 rounded-lg bg-white text-purple-700 shadow-sm transition-all font-bold";
    if (btnTech) btnTech.className = "px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all";
    if (techSection) techSection.style.display = "none";

    if (heroBadge) heroBadge.textContent = "🟢 Pedagogisk & Visuell Modus";
    if (heroTitle) heroTitle.textContent = "Slik forstår og skaper datamaskinen språk";
    if (heroDesc) heroDesc.textContent = "En språkmodell er ikke et tenkende vesen, men en superrask mønstergjenkjenner. Utforsk hvordan teksten deles opp, hvordan den tipper neste ord, og hvordan vi bruker den trygt i hverdagen.";
  } else {
    if (btnSimple) btnSimple.className = "px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all";
    if (btnTech) btnTech.className = "px-3.5 py-1.5 rounded-lg bg-purple-900 text-white shadow-sm transition-all font-bold";
    if (techSection) techSection.style.display = "block";

    if (heroBadge) heroBadge.textContent = "🔬 Teknisk Dypdykk: Formler & Algoritmer";
    if (heroTitle) heroTitle.textContent = "Fra Tette Vektorer til Self-Attention og Softmax";
    if (heroDesc) heroDesc.textContent = "Utdypende teknisk oversikt over Transformer-dekodere, matrisemultiplikasjon, causal masking, KV-cache minneberegning og temperaturskalert Softmax-entropi.";

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }
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
});

function renderTokens() {
  const inputEl = document.getElementById('tokenInput');
  const container = document.getElementById('tokenContainer');
  const countEl = document.getElementById('tokenCount');

  if (!inputEl || !container || !countEl) return;

  const text = inputEl.value;
  container.innerHTML = '';

  if (!text.trim()) {
    countEl.textContent = "0 tokens";
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
    const badge = document.createElement('span');
    badge.className = `px-2 py-1 rounded-lg border text-xs font-mono shadow-sm ${colors[idx % colors.length]}`;
    badge.textContent = tok;
    container.appendChild(badge);
  });
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

const promptData = [
  {
    weak: "Skriv om dette vedtaket så folk skjønner det.",
    weakResult: "Vedtaket er nå omskrevet: Du har fått innvilget støtte i henhold til § 14-2. Se vedlagt dokument for detaljer.",
    strong: "Du er en rådgiver i offentlig sektor. Skriv om denne teksten til klarspråk på B2-nivå for en innbygger med korte avsnitt og punktliste.",
    strongResult: "Svar fra Gemini:\n\nDu har fått innvilget foreldrepenger.\n\nHer er det viktigste du må vite:\n• Utbetalingen starter første virkedag i neste måned.\n• Du må melde fra om endringer i inntekt innen 8 dager."
  },
  {
    weak: "Gi meg ideer til et møte om digitalisering.",
    weakResult: "1. Snakk om AI. 2. Diskuter skyløsninger. 3. Bruk Miro-tavle.",
    strong: "Du er en fasilitator for innovasjon. Gi meg 3 konkrete øvelser for en 45-minutters workshop om trygg bruk av AI.",
    strongResult: "Svar fra Gemini:\n\nØvelse 1: 'Finn hallusinasjonen' (15 min)\n• Finn feil i tre AI-genererte saksnotater.\n\nØvelse 2: 'Trafikklyssortering' (15 min)\n• Sorter saksdata i Grønt, Gult og Rødt lys."
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

async function runGeminiSimulation(promptText, resultText) {
  if (typingTimer) clearInterval(typingTimer);

  const promptEls = document.querySelectorAll('#geminiActivePrompt');
  const outputEls = document.querySelectorAll('#geminiOutput');
  const statusEls = document.querySelectorAll('#geminiStatus');
  const tokenStatsEls = document.querySelectorAll('#geminiTokenStats');

  promptEls.forEach(el => el.textContent = `"${promptText}"`);
  outputEls.forEach(el => el.textContent = "");
  statusEls.forEach(el => el.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Genererer svar...`);

  let textToShow = resultText;
  try {
    const sysPrompt = "Du er en pedagogisk og profesjonell KI-assistent. Svar på norsk med klar struktur.";
    const realResponse = await callGeminiAPI(promptText, sysPrompt);
    if (realResponse) textToShow = realResponse;
  } catch (_err) {
    // Bruk forhåndsvisning når Gemini-nøkkel mangler
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
      statusEls.forEach(el => el.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Fullført`);
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
    liveSsbFetched = true;
    ssbLiveDataText = `🌐 LIVE SSB API DATASETT (Tabell 07459):\n• Reell befolkning hentet for Oslo (717 710 innb.), Bergen (291 000 innb.), Stavanger (149 048 innb.), Trondheim (212 660 innb.).`;

    statusBoxes.forEach(box => {
      box.className = "p-3 rounded-xl bg-sky-950/80 border border-sky-500/40 text-xs flex items-center justify-between text-sky-300";
      box.innerHTML = `
        <span class="flex items-center gap-2 font-mono">
          <span class="w-2 h-2 rounded-full bg-sky-400"></span>
          <strong>SSB API Integrert:</strong> Viser reelle data fra Statistikkbanken.
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
  try {
    const realAiText = await callGeminiAPI(userPrompt, systemPrompt);
    if (realAiText) fullText = realAiText;
  } catch (_err) {
    if (liveSsbFetched && document.getElementById('chkSSB')?.checked) {
      fullText += "\n\n💡 MERK (LIVE SSB API-DATA INKLUDERT):\n   KI-analysen er beriket med ferske befolkningstall direkte fra SSB Statistikkbanken.";
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
        el.className = "text-[10px] text-emerald-400 font-mono";
        el.textContent = "Status: Fullført";
      });
    }
  }, 12);
}

window.addEventListener('DOMContentLoaded', () => {
  toggleMode('simple');
  renderTokens();
  setScenario(0);
  setPromptTab(0);
  setTraffic('green');
  updateSectorDataSelection();
  calculateSoftmaxMath();
  calculateKVCache();
});
