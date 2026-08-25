/**
 * Snapshot av ordningsboksene på Tilskudd.no for Bufdir + BFD.
 * Filter: ADMINISTRATOR=972417793 (BFD) og 986128433 (Bufdir).
 * 16 bokser. Ikke live. Ikke utlysning. Ikke penger prototypen tildeler.
 * Snapshot: 25. august 2026.
 */
const ORDNING_OVELSE_ID = "inkludering-barn-unge";
const ORDNINGER_SNAPSHOT = "25. august 2026";

const KILDE_BUFDIR = "https://www.bufdir.no/tilskudd/";
const KILDE_LOTTSTIFT_FILTER =
  "https://tilskudd.lottstift.no/ordninger?ADMINISTRATOR=972417793&ADMINISTRATOR=986128433";
const KILDE_BUFDIR_FORVALTER =
  "https://tilskudd.lottstift.no/forvalter/986128433/barne-ungdoms-og-familiedirektoratet";
const KILDE_BFD_FORVALTER =
  "https://tilskudd.lottstift.no/forvalter/972417793/barne-og-familiedepartementet";

const ORDNINGER = [
  {
    "id": "barnevernfaglig-videreutdanning",
    "dtId": "DT-0715",
    "navn": "Barnevernfaglig videreutdanning",
    "kortnavn": "Barnevernfaglig VU",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2026-05-15",
    "offentligBelop": 41194,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": null,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0715 (2026). Tilgjengelige midler 41 194 kr. Tildelt beløp er ikke publisert på boksen ennå.",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0715/2026/barnevernfaglig-videreutdanning",
    "sideUrl": "https://www.bufdir.no/tilskudd/barnevernfaglig-videreutdanning/",
    "beskrivelse": "Tilskuddsordningen skal bidra til økt bruk av videreutdanningstilbudet i barnevernet.",
    "frivillighetsregister": false
  },
  {
    "id": "dialog-tros-livssyn",
    "dtId": "DT-0089",
    "navn": "Tilskudd til dialog, debatt, samarbeid og kunnskapsutvikling på tros- og livssynsfeltet",
    "kortnavn": "Dialog tros- og livssyn",
    "forvalter": "BFD",
    "orgnr": "972417793",
    "tema": "Prosjektmidler",
    "frist": "2026-04-08",
    "offentligBelop": 3500000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 3500000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0089 (2026). Tilgjengelige midler 3 500 000 kr. Tildelt 3 500 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0089/2026/tilskudd-til-dialog-debatt-samarbeid-og-kunnskapsutvikling-pa-tros-og-livssynsfeltet",
    "sideUrl": "https://www.regjeringen.no/no/aktuelt/tilskudd-til-dialog-debatt-samarbeid-og-kunnskapsutvikling-pa-tros-og-livssynsfeltet-2026/id3149470/",
    "beskrivelse": "Målet med tilskuddsordningen er å øke kunnskapen om og kjennskapen til tros- og livssynssamfunn i samfunnet og å fremme mangfold og\ninkludering og løse sosiale utfordringer.",
    "frivillighetsregister": false
  },
  {
    "id": "tros-livssyn",
    "dtId": "DT-0087",
    "navn": "Tilskot til trus- og livssynssamfunn",
    "kortnavn": "Tros- og livssynssamfunn",
    "forvalter": "BFD",
    "orgnr": "972417793",
    "tema": "Driftsmidler",
    "frist": "2026-03-01",
    "offentligBelop": 1284542000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": null,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0087 (2026). Tilgjengelige midler 1 284 542 000 kr. Tildelt beløp er ikke publisert på boksen ennå.",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0087/2026/tilskot-til-trus-og-livssynssamfunn",
    "sideUrl": "https://www.statsforvalteren.no/portal/Folk-og-samfunn/Tros--og-livssynssamfunn/",
    "beskrivelse": "Tilskota til trus- og livssynssamfunn utanom Den norske kyrkja er heimla i lov om tros- og livssynssamfunn (trussamfunnslova). Samfunna får eit statstilskot som svarer om lag til d",
    "frivillighetsregister": false
  },
  {
    "id": "tiltak-likestilling-funksjonsnedsettelse",
    "dtId": "DT-0005",
    "navn": "Tilskudd til tiltak som fremmer likestilling av personer med funksjonsnedsettelse",
    "kortnavn": "Likestilling funksjonsnedsettelse",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2026-02-16",
    "offentligBelop": 16880000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 16430000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0005 (2026). Tilgjengelige midler 16 880 000 kr. Tildelt 16 430 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0005/2026/tilskudd-til-tiltak-som-fremmer-likestilling-av-personer-med-funksjonsnedsettelse",
    "sideUrl": "https://www.bufdir.no/tilskudd/bedre-levekarene-og-livskvaliteten-til-personer-med-funksjonsnedsettelse/",
    "beskrivelse": "Målet med tilskuddsordningen er å fremme likestilling av personer med funksjonsnedsettelse i samfunnet, gjennom å øke bevissthet og respekt for menneskerettighetene og bekjempe ste",
    "frivillighetsregister": true
  },
  {
    "id": "utvikling-samhandling-barnevern",
    "dtId": "DT-0027",
    "navn": "Tilskudd til utviklings- og samhandlingsprosjekter i barnevernet",
    "kortnavn": "Utvikling barnevern",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2026-01-16",
    "offentligBelop": 16469000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 16469000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0027 (2026). Tilgjengelige midler 16 469 000 kr. Tildelt 16 469 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0027/2026/tilskudd-til-utviklings-og-samhandlingsprosjekter-i-barnevernet",
    "sideUrl": "https://www.bufdir.no/tilskudd/utviklings-og-samhandlingsprosjekter-i-barnevernet/",
    "beskrivelse": "Ordningen  skal bidra til å utvikle barnevernsfeltet gjennom forebygging av problemutvikling, og ved at utsatte barn og unge får bedre hjelp til livsmestring og utvikling i trygge ",
    "frivillighetsregister": true
  },
  {
    "id": "universell-utforming",
    "dtId": "DT-0018",
    "navn": "Tilskudd til kunnskapsutvikling, kompetanseheving og informasjon innen universell utforming",
    "kortnavn": "Universell utforming",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2026-01-16",
    "offentligBelop": 16100000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 18800000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0018 (2026). Tilgjengelige midler 16 100 000 kr. Tildelt 18 800 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0018/2026/tilskudd-til-kunnskapsutvikling-kompetanseheving-og-informasjon-innen-universell-utforming",
    "sideUrl": "https://www.bufdir.no/tilskudd/uu/",
    "beskrivelse": "Tilskuddsordningen er et virkemiddel for å bidra til kunnskapsutvikling, kompetanseheving og informasjon innen universell utforming på viktige samfunnsområder som planlegging, bygg",
    "frivillighetsregister": false
  },
  {
    "id": "kjonns-seksualitetsmangfold",
    "dtId": "DT-0008",
    "navn": "Tilskudd til å styrke kjønns- og seksualitetsmangfold",
    "kortnavn": "Kjønns- og seksualitetsmangfold",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler, Driftsmidler",
    "frist": "2025-12-31",
    "offentligBelop": 37550000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 43270000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0008 (2026). Tilgjengelige midler 37 550 000 kr. Tildelt 43 270 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0008/2026/tilskudd-til-a-styrke-kjonns-og-seksualitetsmangfold",
    "sideUrl": "https://www.bufdir.no/tilskudd/kjonns-og-seksualitetsmangfold/",
    "beskrivelse": "Målet med tilskuddsordningen er å styrke kjønns- og seksualitetsmangfoldet blant befolkningen i Norge og bidra til bedre levekår og livskvalitet for personer som bryter med normer ",
    "frivillighetsregister": true
  },
  {
    "id": "familie-likestilling",
    "dtId": "DT-0073",
    "navn": "Tilskudd til frivillige organisasjoner på familie- og likestillingsområdet",
    "kortnavn": "Familie og likestilling",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Driftsmidler, Prosjektmidler",
    "frist": "2025-12-15",
    "offentligBelop": 17600000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 19870122,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0073 (2026). Tilgjengelige midler 17 600 000 kr. Tildelt 19 870 122 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0073/2026/tilskudd-til-frivillige-organisasjoner-pa-familie-og-likestillingsomradet",
    "sideUrl": "https://www.bufdir.no/tilskudd/familie-og-likestillingspolitiske-tiltak/",
    "beskrivelse": "Målet med tilskuddsordningen er å sikre drift, bidra til mangfold og skape høyere aktivitet blant frivillige organisasjoner som arbeider med familie- og likestillingspolitikk i Nor",
    "frivillighetsregister": false
  },
  {
    "id": "organisasjoner-barnevern",
    "dtId": "DT-0026",
    "navn": "Tilskudd til generell drift av organisasjoner i barnevernet",
    "kortnavn": "Org. i barnevernet",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Driftsmidler",
    "frist": "2025-12-09",
    "offentligBelop": 23598000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 23598000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0026 (2026). Tilgjengelige midler 23 598 000 kr. Tildelt 23 598 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0026/2026/tilskudd-til-generell-drift-av-organisasjoner-i-barnevernet",
    "sideUrl": "https://www.bufdir.no/tilskudd/organisasjoner-pa-barnevernsomradet/",
    "beskrivelse": "Driftstilskudd til organisasjoner på barnevernsområdet. Bevilgningen for 2026 blir klar i januar 2026.",
    "frivillighetsregister": true
  },
  {
    "id": "tiltak-mot-vold",
    "dtId": "DT-0078",
    "navn": "Drifts- og prosjekttilskudd til tiltak mot vold og overgrep",
    "kortnavn": "Mot vold og overgrep",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler, Driftsmidler",
    "frist": "2025-11-28",
    "offentligBelop": 12995000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 19120000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0078 (2026). Tilgjengelige midler 12 995 000 kr. Tildelt 19 120 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0078/2026/drifts-og-prosjekttilskudd-til-tiltak-mot-vold-og-overgrep",
    "sideUrl": "https://www.bufdir.no/tilskudd/tiltak-mot-vold-og-overgrep/",
    "beskrivelse": "Ordningen skal bidra til målene i regjeringens handlingsplaner mot vold og overgrep,  forebygge og bekjempe vold og overgrep i nære relasjoner, og ivareta voldsutsatte voksne og ba",
    "frivillighetsregister": false
  },
  {
    "id": "ferie-fritid-funksjonsnedsettelse",
    "dtId": "DT-0004",
    "navn": "Tilskudd til ferie- og fritidstiltak for personer med funksjonsnedsettelse",
    "kortnavn": "Ferie og fritid",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2025-11-17",
    "offentligBelop": 32000000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 31764754,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0004 (2026). Tilgjengelige midler 32 000 000 kr. Tildelt 31 764 754 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0004/2026/tilskudd-til-ferie-og-fritidstiltak-for-personer-med-funksjonsnedsettelse",
    "sideUrl": "https://www.bufdir.no/tilskudd/fritidstiltak-for-personer-med-funksjonsnedsettelser/",
    "beskrivelse": "Målet med tilskuddsordningen er at personer med funksjonsnedsettelse skal få delta på ferie- og fritidstiltak arrangert av det sivile samfunnet. ",
    "frivillighetsregister": true
  },
  {
    "id": "inkludering-barn-unge",
    "dtId": "DT-0270",
    "navn": "Tilskudd til inkludering av barn og unge",
    "kortnavn": "Inkludering (øvelse)",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2025-10-31",
    "offentligBelop": 614656000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 605408000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0270 (2026). Tilgjengelige midler 614 656 000 kr. Tildelt 605 408 000 kr (samme år  ikke nødvendigvis komplett). Bufdir-siden oppgir bevilgning 758,4 mill. kr — vi viser boksens felt, ikke det tallet som øvelsespott.",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0270/2026/tilskudd-til-inkludering-av-barn-og-unge",
    "sideUrl": "https://www.bufdir.no/tilskudd/inkludering-av-barn-og-unge/",
    "beskrivelse": "Målet med tilskuddsordningen er å legge til rette for at alle barn og unge skal ha mulighet til mestring og samfunnsdeltakelse. Målgruppen er barn og unge til og med 24 år som av u",
    "frivillighetsregister": false,
    "ovelse": true
  },
  {
    "id": "tiltak-mot-rasisme",
    "dtId": "DT-0006",
    "navn": "Tilskuddsordning om tiltak mot rasisme, diskriminering og hatefulle ytringer",
    "kortnavn": "Mot rasisme og hat",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Prosjektmidler",
    "frist": "2025-10-15",
    "offentligBelop": 26400000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 26400000,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0006 (2026). Tilgjengelige midler 26 400 000 kr. Tildelt 26 400 000 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0006/2026/tilskuddsordning-om-tiltak-mot-rasisme-diskriminering-og-hatefulle-ytringer",
    "sideUrl": "https://www.bufdir.no/tilskudd/tiltak-mot-rasisme-diskriminering-og-hatefulle-ytringer/",
    "beskrivelse": "Tilskuddsordningen skal støtte initiativer og aktiviteter som har til hensikt å motvirke rasisme, diskriminering og hatefulle ytringer.  ",
    "frivillighetsregister": true
  },
  {
    "id": "grunnstotte-internasjonalt",
    "dtId": "DT-0083",
    "navn": "Tilskudd til frivillige barne- og ungdomsorganisasjoner - grunnstøtte internasjonalt arbeid",
    "kortnavn": "Grunnstøtte internasjonalt",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Driftsmidler",
    "frist": "2025-09-15",
    "offentligBelop": 5450000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 3715567,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0083 (2026). Tilgjengelige midler 5 450 000 kr. Tildelt 3 715 567 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0083/2026/tilskudd-til-frivillige-barne-og-ungdomsorganisasjoner-grunnstotte-internasjonalt-arbeid",
    "sideUrl": "https://www.bufdir.no/tilskudd/barne-og-ungdomsorganisasjoner/",
    "beskrivelse": "Målet med tilskuddsordningen er å legge til rette for barn og ungdoms deltakelse i barne- og ungdomsorganisasjonene. Tilskuddsordningene skal stimulere org. til engasjement og meda",
    "frivillighetsregister": false
  },
  {
    "id": "grunnstotte-nasjonalt",
    "dtId": "DT-0081",
    "navn": "Tilskudd til frivillige barne- og ungdomsorganisasjoner - grunnstøtte nasjonalt arbeid",
    "kortnavn": "Grunnstøtte nasjonalt",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Driftsmidler",
    "frist": "2025-09-15",
    "offentligBelop": 197090000,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 184866011,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0081 (2026). Tilgjengelige midler 197 090 000 kr. Tildelt 184 866 011 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0081/2026/tilskudd-til-frivillige-barne-og-ungdomsorganisasjoner-grunnstotte-nasjonalt-arbeid",
    "sideUrl": "https://www.bufdir.no/tilskudd/barne-og-ungdomsorganisasjoner/",
    "beskrivelse": "Målet med tilskuddsordningen er å legge til rette for barn og ungdoms deltakelse i barne- og ungdomsorganisasjonene. Tilskuddsordningene skal stimulere organisasjonene til engasjem",
    "frivillighetsregister": false
  },
  {
    "id": "funksjonshemmedes-organisasjoner",
    "dtId": "DT-0014",
    "navn": "Tilskudd til funksjonshemmedes organisasjoner",
    "kortnavn": "Funksjonshemmedes org.",
    "forvalter": "Bufdir",
    "orgnr": "986128433",
    "tema": "Driftsmidler",
    "frist": "2025-09-15",
    "offentligBelop": 254095246,
    "offentligType": "tilgjengelige_midler",
    "sistTildelt": 244146232,
    "aar": 2026,
    "kilde": "Tilskudd.no-boksen DT-0014 (2026). Tilgjengelige midler 254 095 246 kr. Tildelt 244 146 232 kr (samme år  ikke nødvendigvis komplett).",
    "kildeUrl": "https://tilskudd.lottstift.no/ordning/DT-0014/2026/tilskudd-til-funksjonshemmedes-organisasjoner",
    "sideUrl": "https://www.bufdir.no/tilskudd/funksjonshemmedes-organisasjoner/",
    "beskrivelse": "Målet med tilskuddsordningen er å styrke mulighetene for frivillige og demokratiske landsomfattende organisasjoner for personer med funksjonsnedsettelse til å jobbe mot diskriminer",
    "frivillighetsregister": false
  }
];

function finnOrdning(id) {
  return ORDNINGER.find((o) => o.id === id || o.dtId === id) || null;
}

function ordningOvelse() {
  return finnOrdning(ORDNING_OVELSE_ID);
}

function offentligTypeTekst(o) {
  if (!o || o.offentligBelop == null) return "ikke oppgitt i kilden";
  if (o.offentligType === "tilgjengelige_midler") return "Tilgjengelige midler";
  if (o.offentligType === "vedtatt_ramme") return "Vedtatt ramme";
  if (o.offentligType === "sist_tildelt") return "Sist tildelt";
  return "Offentlig tall";
}

function formatKrNb(n) {
  return new Intl.NumberFormat("nb-NO").format(n) + " kr";
}

function formatOffentligBelop(o, krFn) {
  if (!o || o.offentligBelop == null) return "ikke oppgitt i kilden";
  const tall = typeof krFn === "function" ? krFn(o.offentligBelop) : formatKrNb(o.offentligBelop);
  const aar = o.aar ? ` (${o.aar})` : "";
  return `${offentligTypeTekst(o)} ${tall}${aar}`;
}

function formatFrist(iso) {
  if (!iso) return "ikke oppgitt i kilden";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

function ordningVisningsnavn(o, medOvelse) {
  if (!o) return "Ukjent ordning";
  if (medOvelse && o.id === ORDNING_OVELSE_ID) return `${o.navn} (øvelse)`;
  return o.navn;
}

function summerOrdningsbudsjett(liste) {
  const rader = liste || ORDNINGER;
  return rader.reduce((acc, o) => {
    if (o.offentligBelop != null) {
      acc.tilgjengelig += o.offentligBelop;
      acc.medTilgjengelig += 1;
    } else acc.utenTilgjengelig += 1;
    if (o.sistTildelt != null) {
      acc.tildelt += o.sistTildelt;
      acc.medTildelt += 1;
    } else acc.utenTildelt += 1;
    return acc;
  }, { tilgjengelig: 0, tildelt: 0, medTilgjengelig: 0, utenTilgjengelig: 0, medTildelt: 0, utenTildelt: 0 });
}

function andelTekst(del, hel) {
  if (del == null || !hel) return "—";
  return `${Math.round((del / hel) * 1000) / 10} %`;
}

function renderOrdningskatalog() {
  const rot = document.getElementById("katalogRot");
  if (!rot) return;
  const filter = document.getElementById("katForvalter")?.value || "alle";
  const liste = ORDNINGER.filter((o) => filter === "alle" || o.forvalter === filter);
  const tot = summerOrdningsbudsjett(liste);
  const buf = summerOrdningsbudsjett(liste.filter((o) => o.forvalter === "Bufdir"));
  const bfd = summerOrdningsbudsjett(liste.filter((o) => o.forvalter === "BFD"));
  const rader = liste.map((o) => {
    const tilgj = o.offentligBelop == null ? "ikke oppgitt i kilden" : formatKrNb(o.offentligBelop);
    const tildelt = o.sistTildelt == null ? "ikke oppgitt i kilden" : formatKrNb(o.sistTildelt);
    const merke = o.ovelse ? `<span class="tag tag-ramme">Øvelse + plantede saker</span>` : `<span class="tag">Fiktive saker her</span>`;
    return `<tr>
      <td>${escKat(o.navn)} ${merke}<br><span class="hint">${escKat(o.beskrivelse || "")}</span></td>
      <td class="mono">${escKat(o.dtId)}</td>
      <td>${escKat(o.forvalter)}</td>
      <td>${escKat(o.tema)}</td>
      <td>${escKat(formatFrist(o.frist))}</td>
      <td class="mono">${escKat(tilgj)}<br><span class="hint">${escKat(andelTekst(o.offentligBelop, tot.tilgjengelig))} av totalen</span></td>
      <td class="mono">${escKat(tildelt)}${o.sistTildelt != null ? `<br><span class="hint">${escKat(andelTekst(o.sistTildelt, tot.tildelt))} av tildelt</span>` : ""}</td>
      <td>
        <a href="${escKat(o.kildeUrl)}" target="_blank" rel="noopener">Boksen på Tilskudd.no</a>
        ${o.sideUrl ? `<br><a href="${escKat(o.sideUrl)}" target="_blank" rel="noopener">Forvalters side</a>` : ""}
        <br><span class="hint">${escKat(o.kilde)}</span>
      </td>
    </tr>`;
  }).join("");
  rot.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><b>${formatKrNb(tot.tilgjengelig)}</b><span>totalt tilgjengelige midler 2026 (${tot.medTilgjengelig} ordninger)</span></div>
      <div class="kpi"><b>${formatKrNb(tot.tildelt)}</b><span>totalt tildelt 2026 (${tot.medTildelt} av ${liste.length} har tall)</span></div>
      <div class="kpi"><b>${formatKrNb(buf.tilgjengelig)}</b><span>Bufdir · tilgjengelig</span></div>
      <div class="kpi"><b>${formatKrNb(bfd.tilgjengelig)}</b><span>BFD · tilgjengelig</span></div>
    </div>
    <p class="hint">${liste.length} av ${ORDNINGER.length} bokser (14 Bufdir + 2 BFD). Snapshot ${escKat(ORDNINGER_SNAPSHOT)}. Summering av boksenes «Tilgjengelige midler» og tildelt-felt — ikke øvelsespotten. ${tot.utenTildelt} ordninger har ikke publisert tildelt 2026 ennå. Bufdir.no har flere utlysninger utenfor dette filteret.</p>
    <div class="tabell-wrap">
      <table class="pv-tabell kat-tabell">
        <thead>
          <tr>
            <th>Boks / tilskudd</th>
            <th>ID</th>
            <th>Forvalter</th>
            <th>Type</th>
            <th>Frist (siste på boksen)</th>
            <th>Budsjett per tilskudd (tilgjengelig 2026)</th>
            <th>Tildelt per tilskudd 2026</th>
            <th>Kilde</th>
          </tr>
        </thead>
        <tbody>${rader}</tbody>
        <tfoot>
          <tr>
            <th colspan="5">Totalt i utvalget</th>
            <th class="mono">${escKat(formatKrNb(tot.tilgjengelig))}</th>
            <th class="mono">${escKat(formatKrNb(tot.tildelt))}${tot.utenTildelt ? ` <span class="hint">(+ ${tot.utenTildelt} uten tall)</span>` : ""}</th>
            <th></th>
          </tr>
        </tfoot>
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
  window.formatFrist = formatFrist;
  window.offentligTypeTekst = offentligTypeTekst;
  window.ordningVisningsnavn = ordningVisningsnavn;
  window.renderOrdningskatalog = renderOrdningskatalog;
  window.summerOrdningsbudsjett = summerOrdningsbudsjett;
  window.KILDE_LOTTSTIFT_FILTER = KILDE_LOTTSTIFT_FILTER;
}
