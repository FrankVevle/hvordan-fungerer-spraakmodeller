/**
 * Snapshot av offentlige ordningsnavn (Bufdir + BFD).
 * Ikke live mot Tilskudd.no. Ikke utlysning. Ikke penger prototypen tildeler.
 * Snapshot: 25. august 2026.
 */
const ORDNING_OVELSE_ID = "inkludering-barn-unge";
const ORDNINGER_SNAPSHOT = "25. august 2026";

const KILDE_BUFDIR = "https://www.bufdir.no/tilskudd/";
const KILDE_LOTTSTIFT_FILTER =
  "https://tilskudd.lottstift.no/ordninger?ADMINISTRATOR=986128433&ADMINISTRATOR=972417793";
const KILDE_BUFDIR_FORVALTER =
  "https://tilskudd.lottstift.no/forvalter/986128433/barne-ungdoms-og-familiedirektoratet";
const KILDE_BFD_FORVALTER =
  "https://tilskudd.lottstift.no/forvalter/972417793/barne-og-familiedepartementet";

const ORDNINGER = [
  {
    id: "barne-ungdomsorganisasjoner",
    navn: "Barne- og ungdomsorganisasjoner",
    kortnavn: "Barne- og ungdomsorg.",
    forvalter: "Bufdir",
    tema: "Barn og ungdom",
    offentligBelop: 184866011,
    offentligType: "sist_tildelt",
    aar: 2026,
    kilde: "Tilskudd.no (Bufdir-forvaltersiden). 2026 er ikke ferdig publisert.",
    kildeUrl: KILDE_BUFDIR_FORVALTER,
    sideUrl: "https://www.bufdir.no/tilskudd/barne-og-ungdomsorganisasjoner/"
  },
  {
    id: "barnevernfaglig-videreutdanning",
    navn: "Barnevernfaglig videreutdanning",
    kortnavn: "Barnevernfaglig VU",
    forvalter: "Bufdir",
    tema: "Barnevern",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ikke oppgitt som samlet ramme på Bufdir-listesiden ved snapshot.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "bo-stotte-ufrivillig-opphold",
    navn: "Bo- og støttetilbud for personer utsatt for ufrivillig opphold i utlandet",
    kortnavn: "Bo/støtte ufrivillig opphold",
    forvalter: "Bufdir",
    tema: "Vold",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ikke oppgitt i kilden vi leste.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "bo-stotte-negativ-sosial-kontroll",
    navn: "Bo- og støttetilbud til personer utsatt for negativ sosial kontroll og æresrelatert vold",
    kortnavn: "Bo/støtte æresrelatert vold",
    forvalter: "Bufdir",
    tema: "Vold",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ikke oppgitt i kilden vi leste.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "erasmus-ungdom",
    navn: "Erasmus+ ungdom",
    kortnavn: "Erasmus+ ungdom",
    forvalter: "Bufdir",
    tema: "Barn og ungdom",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ekstern EU-ordning. Norsk samlet ramme ikke oppgitt på Bufdir-listesiden.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "familie-likestillingspolitiske",
    navn: "Familie- og likestillingspolitiske tiltak",
    kortnavn: "Familie- og likestilling",
    forvalter: "Bufdir",
    tema: "Likestilling og ikke-diskriminering",
    offentligBelop: 17600000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Bevilgningen for 2026 er på 17,6 millioner kroner.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/familie-og-likestillingspolitiske-tiltak/",
    sideUrl: "https://www.bufdir.no/tilskudd/familie-og-likestillingspolitiske-tiltak/"
  },
  {
    id: "ferie-fritid-funksjonsnedsettelse",
    navn: "Ferie- og fritidstiltak for personer med funksjonsnedsettelser",
    kortnavn: "Ferie og fritid (funksjon)",
    forvalter: "Bufdir",
    tema: "Funksjonsnedsettelse",
    offentligBelop: 31764754,
    offentligType: "sist_tildelt",
    aar: 2026,
    kilde: "Tilskudd.no (Bufdir-forvaltersiden). 2026 er ikke ferdig publisert.",
    kildeUrl: KILDE_BUFDIR_FORVALTER,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "foreldrestottende",
    navn: "Foreldrestøttende tiltak",
    kortnavn: "Foreldrestøtte",
    forvalter: "Bufdir",
    tema: "Foreldrestøtte",
    offentligBelop: null,
    offentligType: null,
    aar: 2026,
    kilde: "Bufdir: ferdig fordelt for 2026, men samlet beløp ikke sitert på siden vi leste. Lyses ikke ut fra 2027.",
    kildeUrl: "https://www.bufdir.no/tilskudd/foreldrestottende-tiltak/",
    sideUrl: "https://www.bufdir.no/tilskudd/foreldrestottende-tiltak/"
  },
  {
    id: "funksjonshemmedes-organisasjoner",
    navn: "Funksjonshemmedes organisasjoner",
    kortnavn: "Funksjonshemmedes org.",
    forvalter: "Bufdir",
    tema: "Funksjonsnedsettelse",
    offentligBelop: 254095246,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Bevilginga for 2026 er kr 254 095 246.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/funksjonshemmedes-organisasjoner/",
    sideUrl: "https://www.bufdir.no/tilskudd/funksjonshemmedes-organisasjoner/"
  },
  {
    id: "inkludering-barn-unge",
    navn: "Inkludering av barn og unge",
    kortnavn: "Inkludering (øvelse)",
    forvalter: "Bufdir",
    tema: "Barn og ungdom",
    offentligBelop: 758400000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: bevilgning 758,4 mill. kr for 2026. Tilskudd.no viser sist tildelt 605 408 000 kr (2026 ikke ferdig publisert).",
    kildeUrl: "https://www.bufdir.no/tilskudd/inkludering-av-barn-og-unge/",
    sideUrl: "https://www.bufdir.no/tilskudd/inkludering-av-barn-og-unge/",
    ovelse: true
  },
  {
    id: "kjonns-seksualitetsmangfold",
    navn: "Kjønns- og seksualitetsmangfold",
    kortnavn: "Kjønns- og seksualitetsmangfold",
    forvalter: "Bufdir",
    tema: "Likestilling og ikke-diskriminering",
    offentligBelop: 37550000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Bevilgningen for 2026 er kr 37 550 000.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/kjonns-og-seksualitetsmangfold/",
    sideUrl: "https://www.bufdir.no/tilskudd/kjonns-og-seksualitetsmangfold/"
  },
  {
    id: "kommunalt-forebyggingsprogram",
    navn: "Kommunalt forebyggingsprogram for barn og unge",
    kortnavn: "Kommunalt forebyggingsprogram",
    forvalter: "Bufdir",
    tema: "Barn og ungdom",
    offentligBelop: 518796000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Bevilgning til fordeling er 518 796 000 kroner.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/kommunalt-forebyggingsprogram/",
    sideUrl: "https://www.bufdir.no/tilskudd/kommunalt-forebyggingsprogram/"
  },
  {
    id: "oppgradering-krisesenterbygg",
    navn: "Oppgradering av krisesenterbygg",
    kortnavn: "Krisesenterbygg",
    forvalter: "Bufdir",
    tema: "Vold",
    offentligBelop: 20760000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: 20 760 000 kr i tilskuddspotten for 2026.",
    kildeUrl: "https://www.bufdir.no/tilskudd/oppgradering-av-krisesenterbygg/",
    sideUrl: "https://www.bufdir.no/tilskudd/oppgradering-av-krisesenterbygg/"
  },
  {
    id: "organisasjoner-barnevern",
    navn: "Organisasjoner på barnevernsområdet",
    kortnavn: "Org. på barnevern",
    forvalter: "Bufdir",
    tema: "Barnevern",
    offentligBelop: 23598000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Det er bevilget 23,598 millioner kroner til ordningen for 2026.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/organisasjoner-pa-barnevernsomradet/",
    sideUrl: "https://www.bufdir.no/tilskudd/organisasjoner-pa-barnevernsomradet/"
  },
  {
    id: "sentre-incest-voldtekt",
    navn: "Sentre mot incest og seksuelle overgrep og ressurssentre mot voldtekt",
    kortnavn: "Incest- og voldtektssentre",
    forvalter: "Bufdir",
    tema: "Vold",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ikke oppgitt som samlet beløp på sidene vi leste.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "tiltak-mot-rasisme",
    navn: "Tiltak mot rasisme, diskriminering og hatefulle ytringer",
    kortnavn: "Mot rasisme og hat",
    forvalter: "Bufdir",
    tema: "Likestilling og ikke-diskriminering",
    offentligBelop: 26400000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Bevilgningen til ordningen for 2026 er 26,4 millioner.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/tiltak-mot-rasisme-diskriminering-og-hatefulle-ytringer/",
    sideUrl: "https://www.bufdir.no/tilskudd/tiltak-mot-rasisme-diskriminering-og-hatefulle-ytringer/"
  },
  {
    id: "tiltak-mot-vold",
    navn: "Tiltak mot vold og overgrep",
    kortnavn: "Mot vold og overgrep",
    forvalter: "Bufdir",
    tema: "Vold",
    offentligBelop: 12995000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «Bevilgningen til ordningen for 2026 var 12,995 millioner kroner.»",
    kildeUrl: "https://www.bufdir.no/tilskudd/tiltak-mot-vold-og-overgrep/",
    sideUrl: "https://www.bufdir.no/tilskudd/tiltak-mot-vold-og-overgrep/"
  },
  {
    id: "tiltak-likestilling-funksjonsnedsettelse",
    navn: "Tiltak som fremmer likestilling av personer med funksjonsnedsettelse",
    kortnavn: "Likestilling funksjonsnedsettelse",
    forvalter: "Bufdir",
    tema: "Funksjonsnedsettelse",
    offentligBelop: 16880000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Tildelingsbrev Bufdir 2026: 16,88 mill. kr til tilskuddsordningen.",
    kildeUrl: "https://www.regjeringen.no/contentassets/e3c03f39789d433a9ade95467740b6ab/tildelingsbrev-2026-bufdir.pdf",
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "tryggest",
    navn: "TryggEst",
    kortnavn: "TryggEst",
    forvalter: "Bufdir",
    tema: "Vold",
    offentligBelop: 7000000,
    offentligType: "vedtatt_ramme",
    aar: 2026,
    kilde: "Bufdir: «om lag 7 mill. kroner» for 2026, med forbehold om Stortingets vedtak.",
    kildeUrl: "https://www.bufdir.no/tilskudd/tryggest/",
    sideUrl: "https://www.bufdir.no/tilskudd/tryggest/"
  },
  {
    id: "universell-utforming",
    navn: "Universell utforming - kunnskapsutvikling, kompetanseheving og informasjon",
    kortnavn: "Universell utforming",
    forvalter: "Bufdir",
    tema: "Universell utforming",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ikke oppgitt som samlet ramme på sidene vi leste.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "utvikling-samhandling-barnevern",
    navn: "Utviklings- og samhandlingsprosjekter i barnevernet",
    kortnavn: "Utvikling barnevern",
    forvalter: "Bufdir",
    tema: "Barnevern",
    offentligBelop: null,
    offentligType: null,
    aar: null,
    kilde: "Ikke oppgitt som samlet ramme på sidene vi leste.",
    kildeUrl: KILDE_BUFDIR,
    sideUrl: "https://www.bufdir.no/tilskudd/"
  },
  {
    id: "tros-livssyn",
    navn: "Tilskot til trus- og livssynssamfunn",
    kortnavn: "Tros- og livssynssamfunn",
    forvalter: "BFD",
    tema: "Tro og livssyn",
    offentligBelop: 1142606472,
    offentligType: "sist_tildelt",
    aar: null,
    kilde: "Tilskudd.no BFD-oversikt (historisk tildelt). 2026-visningen viser 0 kr — året er ikke ferdig publisert.",
    kildeUrl: KILDE_BFD_FORVALTER,
    sideUrl: KILDE_BFD_FORVALTER
  },
  {
    id: "dialog-tros-livssyn",
    navn: "Tilskudd til dialog, debatt, samarbeid og kunnskapsutvikling på tros- og livssynsfeltet",
    kortnavn: "Dialog tros- og livssyn",
    forvalter: "BFD",
    tema: "Tro og livssyn",
    offentligBelop: 3500000,
    offentligType: "sist_tildelt",
    aar: 2026,
    kilde: "Tilskudd.no BFD-forvaltersiden, tildelt 3 500 000 kr (2026, ikke ferdig år).",
    kildeUrl: KILDE_BFD_FORVALTER,
    sideUrl: KILDE_BFD_FORVALTER
  },
  {
    id: "enkeltstaende-bfd",
    navn: "Enkeltstående tilskudd (BFD)",
    kortnavn: "Enkeltstående (BFD)",
    forvalter: "BFD",
    tema: "Enkeltstående tildelinger",
    offentligBelop: null,
    offentligType: null,
    aar: 2026,
    kilde: "Ikke en søknadsordning. Navngitte tildelinger på Tilskudd.no. Vi summerer ikke mottakere inn i prototypen.",
    kildeUrl: KILDE_BFD_FORVALTER,
    sideUrl: KILDE_BFD_FORVALTER,
    ikkeSokbar: true
  }
];

function finnOrdning(id) {
  return ORDNINGER.find((o) => o.id === id) || null;
}

function ordningOvelse() {
  return finnOrdning(ORDNING_OVELSE_ID);
}

function offentligTypeTekst(o) {
  if (!o || o.offentligBelop == null) return "ikke oppgitt i kilden";
  if (o.offentligType === "vedtatt_ramme") return "Vedtatt ramme";
  if (o.offentligType === "sist_tildelt") return "Sist tildelt";
  return "Offentlig tall";
}

function formatOffentligBelop(o, krFn) {
  if (!o || o.offentligBelop == null) return "ikke oppgitt i kilden";
  const tall = typeof krFn === "function" ? krFn(o.offentligBelop) : `${o.offentligBelop} kr`;
  const aar = o.aar ? ` (${o.aar})` : "";
  return `${offentligTypeTekst(o)} ${tall}${aar}`;
}

function ordningVisningsnavn(o, medOvelse) {
  if (!o) return "Ukjent ordning";
  if (medOvelse && o.id === ORDNING_OVELSE_ID) return `${o.navn} (øvelse)`;
  return o.navn;
}

function renderOrdningskatalog() {
  const rot = document.getElementById("katalogRot");
  if (!rot) return;
  const filter = document.getElementById("katForvalter")?.value || "alle";
  const liste = ORDNINGER.filter((o) => filter === "alle" || o.forvalter === filter);
  const rader = liste.map((o) => {
    const belop = o.offentligBelop == null
      ? "ikke oppgitt i kilden"
      : new Intl.NumberFormat("nb-NO").format(o.offentligBelop) + " kr";
    const type = o.offentligBelop == null ? "—" : offentligTypeTekst(o);
    const aar = o.aar || "—";
    const merke = o.ovelse ? `<span class="tag tag-ramme">Øvelsessaker her</span>` : `<span class="tag">Bare katalog</span>`;
    const sok = o.ikkeSokbar ? "Nei — enkeltstående" : "Ja i katalogen (simulert)";
    return `<tr>
      <td>${escKat(o.navn)} ${merke}</td>
      <td>${escKat(o.forvalter)}</td>
      <td>${escKat(o.tema)}</td>
      <td>${escKat(type)}</td>
      <td class="mono">${escKat(belop)}</td>
      <td>${escKat(String(aar))}</td>
      <td>${escKat(sok)}</td>
      <td><a href="${escKat(o.kildeUrl)}" target="_blank" rel="noopener">Kilde</a>${o.sideUrl && o.sideUrl !== o.kildeUrl ? ` · <a href="${escKat(o.sideUrl)}" target="_blank" rel="noopener">Bufdir</a>` : ""}<br><span class="hint">${escKat(o.kilde)}</span></td>
    </tr>`;
  }).join("");
  rot.innerHTML = `
    <p class="hint">${liste.length} av ${ORDNINGER.length} rader. Snapshot ${escKat(ORDNINGER_SNAPSHOT)}. Offentlige historiske/vedtatte tall — ikke potten i øvelsen.</p>
    <div class="tabell-wrap">
      <table class="pv-tabell kat-tabell">
        <thead>
          <tr>
            <th>Ordning</th>
            <th>Forvalter</th>
            <th>Tema</th>
            <th>Type tall</th>
            <th>Offentlig beløp</th>
            <th>År</th>
            <th>Søkbar her?</th>
            <th>Kilde</th>
          </tr>
        </thead>
        <tbody>${rader}</tbody>
      </table>
    </div>`;
}

function escKat(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

if (typeof window !== "undefined") {
  window.ORDNINGER = ORDNINGER;
  window.ORDNING_OVELSE_ID = ORDNING_OVELSE_ID;
  window.finnOrdning = finnOrdning;
  window.ordningOvelse = ordningOvelse;
  window.formatOffentligBelop = formatOffentligBelop;
  window.offentligTypeTekst = offentligTypeTekst;
  window.ordningVisningsnavn = ordningVisningsnavn;
  window.renderOrdningskatalog = renderOrdningskatalog;
  window.KILDE_LOTTSTIFT_FILTER = KILDE_LOTTSTIFT_FILTER;
}
