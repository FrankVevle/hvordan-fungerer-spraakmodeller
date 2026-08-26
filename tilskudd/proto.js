const RAMME = 1000000;
const ARCHIVE_KEY = "ovelseArkivMapper";
const PORTAL_KEY = "ovelsePortalSaker";
const TRACE_KEY = "ovelseKiSpor";

const BASE_SAKER = [
  {
    id: "T-2629",
    org: "Fjordheim kulturskolevenner",
    orgnr: "999 626 727",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 410000,
    jobb: "Se hvorfor admin er for høy, og om du vil kutte.",
    soknad: "Gratis instrumentgruppe etter skoletid, 24 barn. Søknaden er komplett. Prosjektledelse utgjør 32 % av budsjettet.",
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
  {
    id: "T-2632",
    org: "Storøy ungdomsverksted",
    orgnr: "999 303 808",
    kommune: "Storøy",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 890000,
    jobb: "Formalia er i orden. Beløpet presser potten. Du prioriterer.",
    soknad: "Heldags verksted og lønnet praksis for 28 ungdommer i 8 uker. Søknaden er formelt komplett. Beløpet er stort nok til at rammen sprekker hvis alt innvilges.",
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
  {
    id: "T-2603",
    org: "AS Fjord Byggdrift",
    orgnr: "999 333 001",
    kommune: "Fjordheim",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 450000,
    jobb: "Sjekk om søker i det hele tatt kan søke denne ordningen.",
    soknad: "Aksjeselskap søker om ferieaktivitet for ansattebarn. Ikke registrert i Frivillighetsregisteret. Formålet er rekruttering til bedriften.",
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
  {
    id: "T-2622",
    org: "Brobyggerne Oslo",
    orgnr: "999 222 333",
    kommune: "Oslo",
    aktivitet: "4.2 Jobbtilbud og veiledning",
    belop: 198000,
    jobb: "KI har hentet feil paragraf. Finn feilen og avvis med grunn.",
    soknad: "Deltidsjobb og CV-kurs for 12 ungdommer. Samarbeid med bydel. Budsjett for lønn og veileder.",
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
  {
    id: "T-2612",
    org: "Åsby bibliotekvenner",
    orgnr: "999 555 666",
    kommune: "Åsby",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 72000,
    jobb: "Tiltaket ser bra ut, men fjorårets rapport mangler.",
    soknad: "Leksehjelp og teaterlek etter skoletid, to grupper à 12 barn. Gratis. Midler til materiell og to veiledere.",
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
  },
  {
    id: "T-2631",
    org: "Myr idrettslag anlegg",
    orgnr: "999 101 202",
    kommune: "Myr",
    aktivitet: "4.1 Kultur, fritid og ferie",
    belop: 220000,
    jobb: "Sluttregnskap: penger brukt på gressbane. Vurder tilbakekreving.",
    soknad: "Fikk 220 000 kr til inkluderende trening. Sluttregnskapet viser at 140 000 gikk til ny gressbane. Resten er aktivitet.",
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
  }
];

const NYE_SAKER_FRO = [
  ["ok", "Elveleia speidere", "Havblik", "4.1", 64000, 9, "Helgeleir for 14 barn via SFO. Gratis. Budsjett for mat og buss."],
  ["ok", "Nordhei korpsforeldre", "Nordhei", "4.1", 88000, 10, "Instrumentlån og dirigent. Gratis for barn i husholdninger med lav inntekt."],
  ["ok", "Sørvika ungdomsklubb", "Sørvik", "4.8", 120000, 12, "Åpen møteplass to kvelder i uken. Unge vertskap. Ingen egenandel."],
  ["ok", "Tjeldøya friluftslag", "Tjeldøya", "4.1", 95000, 8, "Ferieuke med telt og kano. Rekruttering via helsestasjon."],
  ["ok", "Kirkebukta menighetsungdom", "Kirkebukta", "4.1", 54000, 7, "Åpen sommerleir også for barn utenfor menigheten. Gratis."],
  ["ok", "Sandnesøy 4H", "Sandnesøy", "4.1", 71000, 11, "Gårdsuke for 16 barn. Mat og utstyr dekket. Ingen kontingent."],
  ["ok", "Vestvåg ungdomsteater", "Vestvåg", "4.1", 99000, 13, "Teaterverksted etter skoletid. Kostymer og instruktør. Gratis."],
  ["ok", "Indre dalen idrettslag", "Indre dalen", "4.3", 150000, 10, "Utstyrssentral ski og fotball. Gratis utlån. Lager allerede på plass."],
  ["ok", "Østbrygga husflidslag", "Østbrygga", "4.1", 43000, 9, "Søndagsverksted strikking og tre. Barn 8–14. Gratis."],
  ["ok", "Lilleøya Røde Kors", "Lilleøya", "4.2", 175000, 12, "Deltidsjobb og førstehjelpskurs for 10 ungdommer. Avtale med kommunen."],
  ["ok", "Fjellheim speidergruppe", "Fjellheim", "4.1", 38000, 6, "Overnattingstur. Mat og buss. Rekruttert via skole."],
  ["ok", "Møllebakken kor", "Møllebakken", "4.1", 67000, 10, "Barnekor to kvelder. Notehefter og pianist. Gratis."],
  ["avkorting", "Stormyra kulturlag", "Stormyra", "4.1", 280000, 28, "Gratis filmverksted. Prosjektledelse er 28 % av budsjettet."],
  ["avkorting", "Havna musikkverksted", "Havna", "4.1", 310000, 24, "Studio etter skoletid. Administrasjon og honorar til leder 24 %."],
  ["avkorting", "Dalstranda ungdomsforum", "Dalstranda", "4.8", 190000, 22, "Åpen kafé. Lederhonorar trekker admin over 15 %."],
  ["avkorting", "Grønnlia frivilligsentral", "Grønnlia", "4.1", 240000, 31, "Ferieklubb. Kontor og prosjektledelse utgjør 31 %."],
  ["avkorting", "Kystlaget Sør", "Sørkyst", "4.1", 205000, 19, "Seilhelg for 20 barn. Koordinatorposten er 19 %."],
  ["avkorting", "Åsnes aktivitetslag", "Åsnes", "4.1", 165000, 27, "Gratis klatrekurs. Drift og ledelse 27 %."],
  ["avkorting", "Bukta kulturhusvenner", "Bukta", "4.1", 355000, 21, "Scenekunstuke. Produsentpost over 15 % admin."],
  ["avkorting", "Reinåsen ildsjelene", "Reinåsen", "4.11", 142000, 33, "Aktivitetsdag. Mye «koordinering» i budsjettet (33 %)."],
  ["formalia", "AS Barnas Eventbyrå", "Oslo", "4.1", 390000, 9, "Aksjeselskap søker ferieleir for kunder og ansattebarn. Ikke frivillig."],
  ["formalia", "AS Fjord Camp Drift", "Fjordheim", "4.1", 510000, 8, "Kommersiell camp. Formålet er salg av plasser, ikke inkludering."],
  ["formalia", "AS Ung Jobb Partner", "Bergen", "4.2", 270000, 10, "AS uten frivillig registrering. Vil ha tilskudd til egen bemanning."],
  ["formalia", "AS Leirplass Vest", "Vestvåg", "4.1", 440000, 7, "Søker som utleieselskap. Ingen frivillig formålsparagraf."],
  ["formalia", "Privatperson L. Holm", "Tromsø", "4.4", 22000, 0, "Privatperson søker kontingent til datterens håndball. Ikke i registeret."],
  ["formalia", "AS Fritidskasse Pro", "Trondheim", "4.4", 180000, 11, "Kommersielt selskap vil administrere fritidskasse mot provisjon."],
  ["historikk", "Ørnes bibliotekvenner", "Ørnes", "4.1", 61000, 9, "Leksehjelp. Tiltaket treffer. Fjorårets sluttrapport mangler."],
  ["historikk", "Sletta idrettslag", "Sletta", "4.1", 88000, 10, "Inkluderende trening. Rapport 2025 er ikke godkjent."],
  ["historikk", "Vika speidere", "Vika", "4.1", 47000, 8, "Helgeleir. Forrige tildeling uten innlevert regnskap."],
  ["historikk", "Holt ungdomskorps", "Holt", "4.1", 79000, 11, "Instrumentlån. Årsrapport for i fjor mangler i øvelsen."],
  ["historikk", "Nesodden fritidsnett", "Nesodden", "4.8", 134000, 12, "Møteplass. Underveisrapport fra fjorårets sak er åpen."],
  ["historikk", "Kroken 4H", "Kroken", "4.1", 56000, 9, "Gårdshelg. Sluttregnskap 2025 ikke levert."],
  ["ramme", "Storbyen jobbhub", "Oslo", "4.2", 620000, 12, "28 praksisplasser. Formelt komplett. Beløpet sprenger potten alene nesten."],
  ["ramme", "Region Vest ungdomsløft", "Bergen", "4.2", 540000, 11, "Veiledning og lønn i 8 uker. Stor sak mot fiktiv ramme."],
  ["ramme", "Nordland inkluderingsnett", "Bodø", "4.2", 480000, 10, "Jobb og kurs i tre kommuner. Prioritering mot ramme gjenstår."],
  ["ramme", "Innlandet praksisallianse", "Lillehammer", "4.2", 410000, 13, "Lønnet praksis. Formalia OK. Du må se potten."],
  ["avvik", "Sanden idrettspark", "Sanden", "4.1", 200000, 6, "Innvilget til trening. 120 000 kr gikk til ny tribune. Resten aktivitet."],
  ["avvik", "Holmen seilforening", "Holmen", "4.1", 175000, 5, "Innvilget seilkurs. 90 000 kr brukt på ny jolle, ikke kurs."],
  ["avvik", "Brua svømmeklubb", "Brua", "4.1", 160000, 7, "Innvilget svømmetilbud. 70 000 kr til bassengvarme (drift/anlegg)."],
  ["avvik", "Moen ridelag", "Moen", "4.1", 145000, 8, "Innvilget ridning for barn. 80 000 kr til ridehalltak."],
  ["plantet", "Jobbsprett Grorud", "Oslo", "4.2", 188000, 11, "CV-kurs og deltidsjobb. KI kan blande inn § 14 og golfklubb."],
  ["plantet", "Ung i arbeid Lofoten", "Svolvær", "4.2", 172000, 10, "Praksis i butikk. Samme plantede feilrisiko: feil paragraf."],
  ["ok", "Havblik Røde Kors ungdom", "Havblik", "4.2", 198000, 12, "Lik sak i øvelsen: jobbtilbud, ikke anlegg. Bruk denne som presedens."],
  ["ok", "Tangen åpen hall", "Tangen", "4.8", 110000, 9, "Lørdagshall. Unge vakter. Gratis inngang."],
  ["ok", "Røst kulturminnelag", "Røst", "4.11", 36000, 8, "Engangsdag med fortelling og mat. Lite beløp, komplett."],
  ["ok", "Alvdal lesevenner", "Alvdal", "4.1", 41000, 7, "Høytlesing etter SFO. Bøker allerede på biblioteket."],
  ["ok", "Selbu sjakk-klubb junior", "Selbu", "4.1", 29000, 5, "Sjakkgruppe. Brett lånes. Ingen egenandel."],
  ["ok", "Oppdal klatrevenner", "Oppdal", "4.1", 82000, 10, "Innendørs klatring for 12 barn. Utstyr lånes ut."],
  ["ok", "Fauske filmklubb ung", "Fauske", "4.1", 53000, 9, "Filmverksted. Kamera fra skolen. Gratis."],
  ["ok", "Vadsø ungdomsradio", "Vadsø", "4.1", 76000, 11, "Radiokurs. Utstyr på plass. Rekruttering via ungdomsråd."]
];

function utvidNySak(row, i, opt = {}) {
  const [flag, org, kommune, aktKode, belop, adminPct, soknad] = row;
  const aktivitet = {
    "4.1": "4.1 Kultur, fritid og ferie",
    "4.2": "4.2 Jobbtilbud og veiledning",
    "4.3": "4.3 Utstyrssentral",
    "4.4": "4.4 Lokal fritidskasse",
    "4.8": "4.8 Åpen møteplass",
    "4.11": "4.11 Annen lokal aktivitet"
  }[aktKode] || aktKode;
  const adminBelop = Math.round(belop * (adminPct / 100));
  const orgPrefix = opt.orgPrefix || "998";
  const idNr = opt.idStart || 2701;
  const orgnr = `${orgPrefix} ${String(100 + i).padStart(3, "0")} ${String(200 + i).padStart(3, "0")}`;
  const jobb = {
    ok: "Formalia ser greie ut. Les teksten og si om du vil innstille.",
    avkorting: "Se adminandelen. Foreslå kutt eller la stå.",
    formalia: "Sjekk om søker i det hele tatt kan søke.",
    historikk: "Tiltaket kan treffe, men fjorårets rapport mangler.",
    ramme: "Formalia OK. Beløpet presser potten. Du prioriterer.",
    avvik: "Sluttregnskap: penger brukt utenfor vilkår. Vurder tilbakekreving.",
    plantet: "Pass på feil paragraf. Avvis med grunn hvis KI blander § 14 og golf."
  }[flag];
  const frivillig = flag !== "formalia";
  const form = /AS |Privatperson/.test(org) ? (/Privatperson/.test(org) ? "privat" : "AS") : "forening";
  const attestOk = belop <= 200000 || (flag !== "avkorting" && flag !== "formalia");
  const rapportFjor = flag !== "historikk";
  const aktivitetBelop = Math.max(0, belop - adminBelop);
  let budsjett = [
    { post: flag === "avvik" ? "Godkjent aktivitet (brukt)" : "Aktivitet", belop: flag === "avvik" ? Math.round(belop * 0.4) : aktivitetBelop, type: "aktivitet" },
    { post: "Administrasjon", belop: adminBelop, type: "admin" }
  ];
  if (flag === "avvik") {
    budsjett = [
      { post: "Godkjent aktivitet (brukt)", belop: Math.round(belop * 0.4), type: "aktivitet" },
      { post: "Anlegg / utstyr uten vilkår", belop: Math.round(belop * 0.6), type: "avvik" }
    ];
  }
  const vedlegg = [
    { navn: "Budsjett", status: "ok" },
    { navn: "Vedtekter", status: flag === "formalia" && form === "privat" ? "mangler" : "ok" },
    { navn: "Revisorattest", status: attestOk ? "ok" : "mangler" },
    { navn: "Fjorårets rapport", status: rapportFjor ? "ok" : "mangler" }
  ];
  return {
    id: `T-${idNr + i}`,
    org,
    orgnr,
    kommune,
    aktivitet,
    ordningId: typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge",
    belop,
    jobb,
    soknad,
    flag,
    adminPct,
    adminBelop,
    rapportFjor,
    form,
    frivillig,
    budsjett,
    vedlegg
  };
}

function byggFlereSakerFro() {
  const kommuner = ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Kristiansand", "Drammen", "Fredrikstad", "Sandnes", "Bodø", "Ålesund", "Tønsberg", "Hamar", "Lillehammer", "Narvik", "Alta", "Molde", "Haugesund", "Skien", "Porsgrunn", "Arendal", "Horten", "Moss", "Sarpsborg", "Gjøvik", "Steinkjer", "Levanger", "Harstad", "Hammerfest", "Voss"];
  const akt = ["4.1", "4.2", "4.3", "4.4", "4.8", "4.11"];
  const ok = [
    "Nordlys ungdomslag", "Havblikk kulturverksted", "Fjellsti idrettsungdom", "Elvebredd fritidsklubb", "Skogkanten aktivitetslag",
    "Brygga møteplass", "Tjernet ungdomsforum", "Bakketoppen kulturhus ung", "Sandstranda naturgruppe", "Myrkanten teaterlag",
    "Kollen speiderungdom", "Varden korps ung", "Lunden danselag", "Åsen sjakklubb", "Bukta seilungdom",
    "Holmen klatregruppe", "Sletta fotballungdom", "Dalane ridning ung", "Fossen kajakklubb", "Ryggen orientering",
    "Neset kunstverksted", "Vika filmgruppe", "Moen musikkverksted", "Haugen lesesirkel ung", "Lia friluftslag",
    "Marka sykkelungdom", "Tangen båtlag ung", "Øya kor ung", "Kroken hobbyverksted", "Stien turgruppe",
    "Hella badeklubb", "Berget klatrevegg", "Kilen skatehall", "Odde kajakkungdom", "Floen natursti",
    "Grenda 4H ung", "Tunet gårdsaktivitet", "Loftet scene ung", "Naustet kystlag", "Bryggekanten kajakk"
  ];
  const avk = [
    "Admin tungt Oslo vest", "Prosjektkontoret ungdom Bergen", "Koordinatorlaget Trondheim", "Driftstungt Stavanger ung",
    "Ledelse først Tromsø", "Kontorlaget Kristiansand", "Stabsklubben Drammen", "Prosjektadmin Fredrikstad",
    "Byrålaget Sandnes", "Sekretariatet Bodø ung", "Konsulentlaget Ålesund", "Overhead Tønsberg",
    "Stabskultur Hamar", "Prosjektledelse Lillehammer", "Koordinering Narvik", "Adminforum Alta",
    "Drift Molde ung", "Kontor Haugesund", "Stab Skien", "Ledelsesteam Porsgrunn"
  ];
  const form = [
    "UngJobb AS Oslo", "Privatperson Kari Nord", "AktivLæring AS Bergen", "Privatperson Per Vest",
    "UngCoach AS Trondheim", "Privatperson Mina Sør", "FritidPro AS Stavanger", "Privatperson Ole Øst",
    "JobbStart AS Tromsø", "Privatperson Liv Fjell", "MentorUng AS Drammen", "Privatperson Nils Dal"
  ];
  const hist = [
    "Rapportløse Fjordungen", "Glemt slutt Troms", "Uten rapport Vestfold", "Mangler år Innlandet",
    "Ingen rapport Rogaland", "Utgår rapport Nordland", "Ubesvart Agder", "Tom historikk Østfold",
    "Uten fjor Møre", "Rapport savnes Finnmark"
  ];
  const ramme = [
    "Storbyjobb Oslo", "Regionsløft Bergen", "Fylkesungdom Trøndelag", "Vestkystløftet Rogaland",
    "Nordnorge-satsing Troms", "Sørlandet storpott", "Østfold samløft", "Innlandet storaktivitet"
  ];
  const avvik = [
    "Anlegg uten vilkår Vest", "Gressbane-saken Øst", "Utstyr utenfor formål", "Bygg i stedet for aktivitet",
    "Reise uten målgruppe", "Lokalene til eier"
  ];
  const plant = [
    "Golf og paragraf-saken", "Feilsitat idrettsparagraf", "Plantet klubb Sør", "Paragrafblanding Nord"
  ];
  const tekst = {
    ok: (org, k) => `${org} i ${k} tilbyr ukentlig aktivitet for ungdom 13–19. Deltakelse er gratis. Ungdomsrådet er med på planleggingen.`,
    avkorting: (org, k) => `${org} i ${k} søker prosjektledelse og administrasjon. Aktivitetene er gratis, men mye av budsjettet er koordinering.`,
    formalia: (org, k) => `${org} i ${k} vil tilby kurs mot betaling. Teksten er kort og sier lite om medvirkning.`,
    historikk: (org, k) => `${org} i ${k} viderefører fjorårets tiltak. Ungdommene selv foreslo tidspunkt. Rapporten er ikke lastet opp.`,
    ramme: (org, k) => `${org} i ${k} søker et stort regionalt løft. Gratis deltakelse. Medvirkning via ungdomspanel. Beløpet er høyt mot potten.`,
    avvik: (org, k) => `${org} i ${k} har brukt deler av tilskuddet på anlegg og utstyr utenfor vilkår. Aktivitet for ungdom var bare deler av året.`,
    plantet: (org, k) => `${org} i ${k} viser til § 14 om golfanlegg og klubbhus. Riktig regel i øvelsen er jobbtilbud 4.2, ikke golf. Sammenlign Havblik T-2608.`
  };
  const belopFor = {
    ok: (i) => 42000 + (i % 18) * 5500,
    avkorting: (i) => 78000 + (i % 10) * 9000,
    formalia: (i) => 55000 + (i % 8) * 12000,
    historikk: (i) => 61000 + (i % 7) * 7000,
    ramme: (i) => 268000 + (i % 8) * 14000,
    avvik: (i) => 92000 + (i % 6) * 8000,
    plantet: (i) => 74000 + i * 11000
  };
  const adminFor = {
    ok: (i) => 8 + (i % 7),
    avkorting: (i) => 18 + (i % 12),
    formalia: (i) => 11 + (i % 5),
    historikk: (i) => 10 + (i % 5),
    ramme: (i) => 10 + (i % 4),
    avvik: (i) => 9 + (i % 4),
    plantet: (i) => 12 + (i % 3)
  };
  const grupper = [
    ["ok", ok],
    ["avkorting", avk],
    ["formalia", form],
    ["historikk", hist],
    ["ramme", ramme],
    ["avvik", avvik],
    ["plantet", plant]
  ];
  const rows = [];
  let n = 0;
  for (const [flag, navn] of grupper) {
    navn.forEach((org, i) => {
      const kommune = kommuner[n % kommuner.length];
      const kode = akt[n % akt.length];
      rows.push([flag, org, kommune, kode, belopFor[flag](i), adminFor[flag](i), tekst[flag](org, kommune)]);
      n += 1;
    });
  }
  return rows;
}

const FLERE_SAKER_FRO = byggFlereSakerFro();

const SAKER = BASE_SAKER
  .concat(NYE_SAKER_FRO.map((row, i) => utvidNySak(row, i)))
  .concat(FLERE_SAKER_FRO.map((row, i) => utvidNySak(row, i, { orgPrefix: "997", idStart: 2801 })));

const ORDNING_FAST_INKLUDERING = new Set(["T-2629", "T-2631", "T-2622", "T-2612", "T-2632", "T-2801"]);

function knyttSakerTilOrdninger(saker) {
  const inkl = typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge";
  const pool = (typeof ORDNINGER !== "undefined" ? ORDNINGER : []).map((o) => o.id);
  const ids = pool.length ? pool : [inkl];
  let n = 0;
  saker.forEach((s) => {
    if (ORDNING_FAST_INKLUDERING.has(s.id) || s.flag === "plantet") {
      s.ordningId = inkl;
      return;
    }
    s.ordningId = ids[n % ids.length];
    n += 1;
  });
}

knyttSakerTilOrdninger(SAKER);

let ordningFilter = "alle";

function sakOrdning(sak) {
  const id = sak?.ordningId || (typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge");
  if (typeof finnOrdning === "function") {
    const o = finnOrdning(id);
    if (o) return o;
  }
  return { id, navn: "Inkludering av barn og unge", kortnavn: "Inkludering (øvelse)", ovelse: true };
}

function sakOrdningTekst(sak) {
  const o = sakOrdning(sak);
  if (typeof ordningVisningsnavn === "function") return ordningVisningsnavn(o, true);
  return o.kortnavn || o.navn;
}

if (typeof personvernKobleSaker === "function") personvernKobleSaker(SAKER);

const REGISTER = SAKER.filter((s) => !/Privatperson/.test(s.org)).map((s) => ({
  orgnr: String(s.orgnr || "").replace(/\s/g, ""),
  navn: s.org,
  form: s.form || (/AS /.test(s.org) ? "AS" : "forening"),
  frivillig: s.frivillig !== false && !/AS /.test(s.org)
})).filter((r, i, arr) => arr.findIndex((x) => x.orgnr === r.orgnr) === i);

const RAG = {
  admin: { tittel: "Øvelsesregel 2026 · administrasjon", tekst: "Prosjektledelse og generell administrasjon skal som hovedregel ikke overstige 15 % av søknadssummen. Overskytende kan foreslås avkortet. Dette er øvelse, ikke evig forskrift. Avkorting er forslag, ikke vedtak." },
  soker: { tittel: "Øvelsesregel 2026 · hvem kan søke", tekst: "Søker skal stå i Enhetsregisteret. For denne aktivitetstypen skal virksomheten også stå i Frivillighetsregisteret, med mindre søker er kommune. Kommersielt AS uten frivillig formål kan ikke søke." },
  revisor: { tittel: "Øvelsesregel 2026 · revisor", tekst: "Søknader over 200 000 kroner skal ha revisorattest. Mangler attest, skal saken flagges. Beløpsgrensen er øvelse 2026." },
  mal: { tittel: "Øvelsesregel 2026 · målgruppe", tekst: "Tiltaket skal nå barn og unge som står utenfor. Deltakelse skal være gratis eller uten urimelig egenandel. Står det ikke i teksten, er det ikke oppgitt." },
  jobb: { tittel: "Øvelsesregel · jobbtilbud 4.2", tekst: "Jobbtilbud gjelder lønnet praksis og veiledning. Det er ikke investering i anlegg. Lik sak i øvelsen: Havblik Røde Kors (T-2608)." },
  planted: { tittel: "Feil hentet utdrag (øvelse)", tekst: "Likebehandling: Golfklubben Fjord (T-2621) fikk avslag. Sim. forskrift § 14 om investering. Anbefalt avslag." },
  klage: { tittel: "Øvelsesregel · nytt faktum", tekst: "Honorar til kursleder er faglig aktivitet, ikke generell administrasjon, når det følger av dokumentasjon. Omgjøring er saksbehandlers. KI fatter ikke vedtak." },
  slutt: { tittel: "Øvelsesregel · slutt", tekst: "Tilskudd brukt i strid med vilkår kan kreves tilbake forholdsmessig. Godkjent aktivitet holdes utenfor. Forslag — ikke innkreving." },
  personvern: { tittel: "Øvelsesregel 2026 · personvern", tekst: "Fødselsnummer, helse og navngitte barn skal sladdes før teksten går til KI. E-post, telefon og adresse sladdes som hovedregel. Modulen er mønstersøk — ikke et vedtak om lovlighet." },
  aiact: { tittel: "Øvelse · KI-forordningen", tekst: "Du er beslutningsstøtte. Mennesket fatter ikke vedtak i denne prototypen. Hvis dette var ekte tilskuddsforvaltning, ville bruken sannsynligvis vært høyrisiko (vedlegg III). Ingen samsvarserklæring." },
  nis2: { tittel: "Øvelse · NIS 2 og Norge", tekst: "Norge gjennomfører NIS 1 i digitalsikkerhetsloven. NIS 2 er under tilnærming, ikke ferdig i norsk rett. NSM er kontaktpunkt. Denne prototypen er ikke en samfunnsviktig tjeneste og varsler ikke hendelser." }
};

const FALLBACK = {
  "T-2629": {
    malgruppe: { score: 4, sitat: "Gratis instrumentgruppe etter skoletid, 24 barn." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 5, sitat: "Gratis instrumentgruppe" },
    tenkning: "1. Jeg leste at prosjektledelse er 32 % av 410 000 kr.\n2. Øvelsesregelen sier maks 15 % admin — det er det eneste jeg bruker til kuttet.\n3. «Gratis instrumentgruppe, 24 barn» bruker jeg til målgruppe og gratis.\n4. Medvirkning står ikke i teksten — jeg skriver «ikke oppgitt».\n5. Jeg fatter ikke vedtak. Beløpet er et forslag.",
    brev: "Utkast — ikke vedtak\n\nDere søkte 410 000 kr. Formålet treffer. Prosjektledelse utgjør 32 %. Etter øvelsesregel 2026 (15 % admin) foreslås avkorting av den overskytende delen."
  },
  "T-2632": {
    malgruppe: { score: 5, sitat: "lønnet praksis for 28 ungdommer" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 4, sitat: "lønnet praksis" },
    tenkning: "1. Formalia ser komplette ut i teksten jeg fikk.\n2. Admin 11 % er under 15 % — jeg foreslår ikke admin-kutt.\n3. 890 000 kr mot potten på 1 000 000 kr er et prioriteringsspørsmål. Jeg rangerer ikke hvem som skal kuttes.\n4. Medvirkning: ikke oppgitt.",
    brev: "Utkast — ikke vedtak\n\nSøknaden om 890 000 kr er formelt i orden. Innstilling mot ramme gjenstår hos deg."
  },
  "T-2603": {
    malgruppe: { score: 1, sitat: "Ferieaktivitet for ansattebarn." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    tenkning: "1. Søker er et AS. Øvelsesregelen sier at kommersielt AS uten frivillig registrering ikke kan søke.\n2. Formålet er «ansattebarn» / rekruttering — det treffer ikke inkludering.\n3. Jeg foreslår utenfor ordningen. Ikke vedtak.",
    brev: "Utkast til avslag — ikke vedtak\n\nDere kan etter øvelsesregelen 2026 ikke søke som kommersielt AS uten frivillig registrering."
  },
  "T-2622": {
    malgruppe: { score: 4, sitat: "Deltidsjobb og CV-kurs for 12 ungdommer." },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 4, sitat: "Deltidsjobb og CV-kurs" },
    tenkning: "1. Jeg hentet utdraget om § 14 og Golfklubben Fjord og bruker det som lik sak.\n2. Jeg ser at søknaden handler om jobb og CV-kurs, men jeg holder likevel på avslag etter § 14.\n3. Dette er den plantede feilen i øvelsen: feil paragraf og feil presedens.",
    brev: "Utkast til avslag — ikke vedtak\n\nSøknaden avslås med henvisning til § 14 (investering) og Golfklubben Fjord (T-2621)."
  },
  "T-2612": {
    malgruppe: { score: 4, sitat: "Leksehjelp og teaterlek etter skoletid" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: 5, sitat: "Gratis." },
    tenkning: "1. Teksten beskriver gratis leksehjelp og teaterlek — det treffer målgruppe.\n2. Historikkflagget (manglende rapport) kommer fra reglene, ikke fra søknadsteksten.\n3. Jeg foreslår flagg, ikke automatisk avslag.",
    brev: "Utkast — ikke vedtak\n\nSluttregnskap etter øvelsesfristen mangler. Saken flagges."
  },
  "T-2631": {
    malgruppe: { score: 3, sitat: "inkluderende trening" },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: null, sitat: "ikke oppgitt" },
    tenkning: "1. Jeg skiller to poster: 80 000 kr trening (kan stå) og 140 000 kr gressbane (ikke godkjent).\n2. Tilbakekreving er forholdsmessig — bare anlegget.\n3. Dette er utkast. Ingen innkreving.",
    brev: "Utkast — ikke vedtak\n\n140 000 kr gikk til ny gressbane. Utkast: krev den delen tilbake."
  }
};

function fallbackFromSak(sak) {
  const planted = sak.flag === "plantet";
  return {
    malgruppe: { score: planted ? 4 : 3, sitat: sak.soknad.slice(0, 90) },
    medvirkning: { score: null, sitat: "ikke oppgitt" },
    gratis: { score: /gratis/i.test(sak.soknad) ? 5 : null, sitat: /gratis/i.test(sak.soknad) ? "Gratis" : "ikke oppgitt" },
    tenkning: planted
      ? `1. Jeg henter § 14 og Golfklubben Fjord som lik sak.\n2. Søknaden gjelder ${sak.aktivitet}, men jeg holder likevel på avslag.\n3. Dette er plantet feil i øvelsen.`
      : `1. Jeg leste søknaden til ${sak.org}.\n2. Flagget i øvelsen er ${sak.flag}.\n3. Jeg skriver utkast, ikke vedtak.`,
    notat: planted
      ? "Anbefalt avslag med henvisning til § 14 og Golfklubben Fjord (T-2621)."
      : `Øvelsesutkast for ${sak.id}. ${sak.jobb} Ikke vedtak.`,
    brev: `Utkast — ikke vedtak\n\nTil ${sak.org}\n\n${sak.soknad}\n\nDette er et forslag til saksbehandler.`
  };
}

const SYS = `Du er forvaltningsrådgiver i en pedagogisk øvelse (2026). Du fatter ALDRI vedtak. Du er ikke Bufdir.
Etter KI-forordningen (EU) 2024/1689 er du beslutningsstøtte: søkeren og saksbehandleren skal se at dette er utkast, ikke automatisert vedtak.
Du får KUN søknadstekst og utdrag under. Hvis noe mangler: skriv «ikke oppgitt».
Admin 15 % og revisor 200 000 kr er øvelsesregler 2026.
Svar på norsk. Start ALLTID med tenkning — skriv høyt hva du gjør, før du konkluderer.

## Tenkning
Nummererte setninger (5–8):
- Hva du leste i søknaden
- Hvilke utdrag du faktisk brukte
- Hva du lot være å bruke, og hvorfor
- Hva som er usikkert eller «ikke oppgitt»
- At du ikke fatter vedtak
Ikke finn på kilder.

## Semantikk
Målgruppe: N/5
Sitat målgruppe: "..." eller ikke oppgitt
Medvirkning: N/5
Sitat medvirkning: "..." eller ikke oppgitt
Gratis: N/5
Sitat gratis: "..." eller ikke oppgitt

## Saksnotat
Kort innstillingsforslag. Ikke fatt vedtak.

## Brevutkast
Første linje: Utkast — ikke vedtak`;

const SYS_KLAGE = `Du er forvaltningsrådgiver i en øvelse. Du fatter aldri vedtak. Svar på norsk.
Start med ## Tenkning (nummererte setninger: hva som er nytt, hva du bruker, hva du ikke avgjør).
Deretter:
## Vurdering
## Utkast omgjøring
## Utkast opprettholdelse`;

const SYS_SLUTT = `Du er forvaltningsrådgiver i en øvelse. Ingen innkreving, ingen vedtak. Svar på norsk.
Start med ## Tenkning (nummererte setninger: hva som er avvik, hva som kan stå, at du ikke krever inn).
Deretter:
## Vurdering
## Utkast tilbakekreving
## Alternativ`;

const work = {};
const journal = [];
let selected = null;
let listFilter = "alle";
let kiSeq = 0;
const klage = { running: false, live: null, tenkning: "", vurdering: "", omgjoring: "", opprettholdelse: "", error: "", traceId: "" };
const slutt = { running: false, live: null, tenkning: "", vurdering: "", tilbake: "", alternativ: "", error: "", traceId: "" };

function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function kr(n) { return new Intl.NumberFormat("nb-NO").format(Number(n) || 0) + " kr"; }
function norm(orgnr) { return String(orgnr || "").replace(/\s/g, ""); }
function findReg(orgnr) { return REGISTER.find((r) => r.orgnr === norm(orgnr)) || null; }
function findSak(id) { return SAKER.find((s) => s.id === id) || null; }

function tagClass(flag) {
  return ({ avkorting: "tag-avkorting", ramme: "tag-ramme", formalia: "tag-formalia", plantet: "tag-plantet", historikk: "tag-historikk", avvik: "tag-avvik" }[flag]) || "tag-ok";
}
function tagText(flag) {
  return ({ avkorting: "Avkorting", ramme: "Ramme", formalia: "Formalia", plantet: "Plantet feil", historikk: "Historikk", avvik: "Avvik" }[flag]) || "OK";
}

function runGrantRules(sak) {
  const reg = findReg(sak.orgnr);
  const checks = [];
  let recommended = sak.belop;
  if (!reg) {
    checks.push({ status: "red", label: "Søker", text: "Ikke i det simulerte registeret." });
    recommended = 0;
  } else if (!reg.frivillig) {
    checks.push({ status: "red", label: "Søker", text: `${reg.form} kan ikke søke denne øvelsesordningen (ikke frivillig).` });
    recommended = 0;
  } else {
    checks.push({ status: "green", label: "Søker", text: `${reg.navn} er forening/idrettslag i øvelsestabellen. Ikke live register.` });
  }
  const tillatt = Math.round(sak.belop * 0.15);
  if (sak.adminPct > 15 && recommended > 0) {
    const kutt = Math.max(0, sak.adminBelop - tillatt);
    recommended = sak.belop - kutt;
    checks.push({ status: "yellow", label: "Admin 15 %", text: `Admin er ${sak.adminPct} % (${kr(sak.adminBelop)}). Tillatt ${kr(tillatt)}. Foreslått kutt ${kr(kutt)} — ikke vedtak.` });
  } else {
    checks.push({ status: "green", label: "Admin 15 %", text: `Admin ${sak.adminPct} % er innenfor. Øvelsesregel 2026.` });
  }
  const attest = (sak.vedlegg || []).some((v) => /revisor/i.test(v.navn) && v.status === "ok");
  if (sak.belop > 200000 && !attest) {
    checks.push({ status: "yellow", label: "Revisor", text: `Over 200 000 kr og attest mangler. Flagg, ikke automatisk avslag.` });
  } else {
    checks.push({ status: "green", label: "Revisor", text: attest || sak.belop <= 200000 ? "Kravet i øvelsen er oppfylt eller ikke aktuelt." : "OK" });
  }
  if (!sak.rapportFjor) {
    checks.push({ status: "red", label: "Historikk", text: "Fjorårets rapport mangler." });
  } else {
    checks.push({ status: "green", label: "Historikk", text: "Ingen åpen rapportmangel i øvelsen." });
  }
  if ((sak.flag === "ramme" || sak.id === "T-2632") && recommended > 0) {
    checks.push({ status: "yellow", label: "Ramme", text: `Stort beløp mot potten ${kr(RAMME)}. KI kutter ikke. Du prioriterer.` });
  }
  if (sak.flag === "avvik" || sak.id === "T-2631") {
    recommended = 0;
    checks.push({ status: "red", label: "Slutt", text: "Deler av beløpet er brukt utenfor vilkår. Utkast: tilbakekreving. Ikke innkreving." });
  }
  return { checks, recommended };
}

function tekstsignal(sak) {
  const t = String(sak.soknad || "").toLowerCase();
  return {
    gratis: /gratis|ingen egenandel|uten kostnad/.test(t),
    medvirkning: /medvirk|ungdomsråd|ungdommene selv|ungdomspanel|deltakerne planlegger/.test(t)
  };
}

function sakLenke(id) {
  return `/tilskudd/behandle#${id}`;
}

function analyserPortefolje() {
  const rader = SAKER.map((sak) => {
    const rules = runGrantRules(sak);
    const signal = tekstsignal(sak);
    const røde = rules.checks.filter((c) => c.status === "red");
    const gule = rules.checks.filter((c) => c.status === "yellow");
    const kuttAdmin = sak.adminPct > 15 ? Math.max(0, sak.adminBelop - Math.round(sak.belop * 0.15)) : 0;
    const sokerRod = røde.some((c) => c.label === "Søker");
    return { sak, rules, signal, røde, gule, kuttAdmin, sokerRod };
  });
  const sokt = rader.reduce((s, r) => s + r.sak.belop, 0);
  const etterAdminKutt = rader.reduce((s, r) => s + (r.sak.belop - r.kuttAdmin), 0);
  const utenRodeFormalia = rader.filter((r) => !r.sokerRod && r.sak.flag !== "avvik" && r.sak.id !== "T-2631");
  const sumKanKonkurrere = utenRodeFormalia.reduce((s, r) => s + r.sak.belop, 0);
  const koe = {
    kanIkke: rader.filter((r) => r.sokerRod),
    avklare: rader.filter((r) => !r.sokerRod && (r.røde.some((c) => c.label === "Historikk") || r.gule.some((c) => c.label === "Revisor"))),
    skjonn: rader.filter((r) => !r.sokerRod && r.sak.flag !== "avvik" && r.sak.flag !== "plantet" && (r.gule.some((c) => c.label === "Admin 15 %" || c.label === "Ramme"))),
    plantet: rader.filter((r) => r.sak.flag === "plantet"),
    avvik: rader.filter((r) => r.sak.flag === "avvik" || r.sak.id === "T-2631")
  };
  const adminOver = rader.filter((r) => r.sak.adminPct > 15).sort((a, b) => b.sak.adminPct - a.sak.adminPct);
  const perAkt = {};
  rader.forEach((r) => {
    const k = r.sak.aktivitet;
    if (!perAkt[k]) perAkt[k] = [];
    perAkt[k].push(r);
  });
  const perOrdning = {};
  rader.forEach((r) => {
    const k = r.sak.ordningId || (typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge");
    if (!perOrdning[k]) perOrdning[k] = [];
    perOrdning[k].push(r);
  });
  const perKommune = {};
  rader.forEach((r) => {
    perKommune[r.sak.kommune] = (perKommune[r.sak.kommune] || 0) + 1;
  });
  const toppKommuner = Object.entries(perKommune).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const storst = [...rader].sort((a, b) => b.sak.belop - a.sak.belop).slice(0, 10);
  return {
    rader,
    antall: rader.length,
    sokt,
    etterAdminKutt,
    sumKanKonkurrere,
    utenRodeAntall: utenRodeFormalia.length,
    koe,
    adminOver,
    perAkt,
    perOrdning,
    toppKommuner,
    storst,
    risiko: {
      rodSoker: koe.kanIkke.length,
      gulRevisor: rader.filter((r) => r.gule.some((c) => c.label === "Revisor")).length,
      rodHistorikk: rader.filter((r) => r.røde.some((c) => c.label === "Historikk")).length,
      avvik: koe.avvik.length,
      gratisJa: rader.filter((r) => r.signal.gratis).length,
      medvirkJa: rader.filter((r) => r.signal.medvirkning).length
    }
  };
}

function portefoljeDigest() {
  return analyserPortefolje().rader.map((r) => {
    const rod = r.røde.map((c) => c.label).join("/") || "-";
    const gul = r.gule.map((c) => c.label).join("/") || "-";
    const setning = String(soknadTilModell(r.sak, "sladd") || "").replace(/\s+/g, " ").slice(0, 90);
    return `${r.sak.id} | ${r.sak.org} | ${sakOrdningTekst(r.sak)} | ${r.sak.aktivitet} | søkt ${r.sak.belop} | admin ${r.sak.adminPct}% | ${r.sak.flag} | anbefalt ${r.rules.recommended} | rød:${rod} | gul:${gul} | ${setning}`;
  }).join("\n");
}

function fallbackPortefoljeSvar(sporsmal) {
  const a = analyserPortefolje();
  const q = String(sporsmal || "").toLowerCase();
  const linjer = [
    "Ikke modell. Maskinell opptelling fra analysen:",
    `${a.antall} saker. Søkt ${kr(a.sokt)} mot pott ${kr(RAMME)}.`,
    `Kan ikke innstilles (søker): ${a.koe.kanIkke.length}. Må avklares: ${a.koe.avklare.length}. Skjønn: ${a.koe.skjonn.length}. Plantet: ${a.koe.plantet.length}. Avvik: ${a.koe.avvik.length}.`,
    `Admin-kutt totalt ${kr(a.sokt - a.etterAdminKutt)}. Uten røde formalia/avvik kan ${a.utenRodeAntall} saker konkurrere om potten (${kr(a.sumKanKonkurrere)}).`
  ];
  if (/oslo|kommune/.test(q)) {
    const oslo = a.rader.filter((r) => /oslo/i.test(r.sak.kommune) && r.sak.adminPct > 15);
    linjer.push(`Oslo med admin over 15 %: ${oslo.map((r) => r.sak.id).join(", ") || "ingen i uttrekket"}.`);
  }
  if (/plante/.test(q)) linjer.push(`Plantet: ${a.koe.plantet.map((r) => r.sak.id).join(", ")}.`);
  if (/ikke.*søk|kan ikke/.test(q)) linjer.push(`Kan ikke søke: ${a.koe.kanIkke.map((r) => r.sak.id).join(", ")}.`);
  return linjer.join(" ");
}

const SYS_PORTEFOLJE = `Du er forvaltningsrådgiver i en øvelse. Bruk KUN uttrekket. Siter saksnummer. Ikke fatt vedtak. Skriv «ikke i uttrekket» hvis noe mangler. Fiktiv ordning. KI forbereder, mennesket bestemmer.`;

async function sporPortefolje(sporsmal) {
  const digest = portefoljeDigest();
  const prompt = `Uttrekk av alle saker (én linje per sak):\n${digest}\n\nSpørsmål fra saksbehandler:\n${sporsmal}`;
  try {
    const text = await callModelAPI(prompt, SYS_PORTEFOLJE);
    const id = saveTrace({
      sak: "portefolje",
      org: `${SAKER.length} saker`,
      oppgave: "Porteføljespørsmål",
      live: true,
      kilder: ["Porteføljeuttrekk", RAG.admin.tittel, RAG.soker.tittel],
      prompt,
      system: SYS_PORTEFOLJE,
      tenkning: "",
      utkast: text,
      brev: "",
      raw: text
    });
    return { text, live: true, traceId: id };
  } catch (e) {
    const text = fallbackPortefoljeSvar(sporsmal);
    const id = saveTrace({
      sak: "portefolje",
      org: `${SAKER.length} saker`,
      oppgave: "Porteføljespørsmål",
      live: false,
      kilder: ["analyserPortefolje"],
      prompt,
      system: SYS_PORTEFOLJE,
      tenkning: "",
      utkast: text,
      brev: "",
      raw: "",
      error: e.message || "api"
    });
    return { text, live: false, traceId: id, error: e.message };
  }
}

function ragFor(sak) {
  const items = [RAG.soker, RAG.admin, RAG.revisor, RAG.mal];
  if (sak.flag === "plantet" || sak.id === "T-2622") items.push(RAG.jobb, RAG.planted);
  else if (String(sak.aktivitet).includes("4.2")) items.push(RAG.jobb);
  if (sak.id === "T-2629") items.push(RAG.klage);
  if (sak.flag === "avvik" || sak.id === "T-2631") items.push(RAG.slutt);
  if (typeof sjekkPersonvern === "function" && sjekkPersonvern(sak).niva !== "ok") items.push(RAG.personvern);
  if (RAG.aiact) items.push(RAG.aiact);
  return items;
}

function soknadTilModell(sak, valg) {
  if (typeof personvernForKi !== "function") return sak.soknad;
  return personvernForKi(sak, valg || "sladd").tekst;
}

async function callModelAPI(prompt, system) {
  let delay = 800;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, system })
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(result.error || "api_error");
        err.simulation = Boolean(result.simulation);
        throw err;
      }
      if (result.text) return result.text;
      throw new Error("empty");
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("Kunne ikke hente svar.");
}

function parseKi(text) {
  const grab = (label) => {
    const m = text.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
    return m ? m[1].trim() : "";
  };
  const score = (raw) => {
    const m = String(raw).match(/(\d)\s*\/\s*5/);
    return m ? Number(m[1]) : null;
  };
  const tenkning = (text.split(/##\s*Tenkning/i)[1] || "").split(/##\s*Semantikk/i)[0].trim();
  const note = (text.split(/##\s*Saksnotat/i)[1] || "").split(/##\s*Brevutkast/i)[0].trim();
  const brev = (text.split(/##\s*Brevutkast/i)[1] || "").trim();
  return {
    malgruppe: { score: score(grab("Målgruppe")), sitat: grab("Sitat målgruppe") || "ikke oppgitt" },
    medvirkning: { score: score(grab("Medvirkning")), sitat: grab("Sitat medvirkning") || "ikke oppgitt" },
    gratis: { score: score(grab("Gratis")), sitat: grab("Sitat gratis") || "ikke oppgitt" },
    tenkning,
    notat: note || text.trim(),
    brev: brev || "",
    raw: text
  };
}

function saveTrace(trace) {
  const list = loadJson(TRACE_KEY, []);
  const row = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    at: new Date().toISOString(),
    atVis: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...trace
  };
  list.unshift(row);
  saveJson(TRACE_KEY, list.slice(0, 40));
  return row.id;
}

function ensure(id) {
  if (!work[id]) {
    const sak = findSak(id);
    const rules = runGrantRules(sak);
    work[id] = {
      rules,
      recommended: rules.recommended,
      semantic: null,
      note: "",
      letter: "",
      pipeline: "regler",
      status: "Regler er ferdige. KI starter.",
      live: null,
      error: "",
      hitl: "",
      running: false,
      pv: typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : null,
      pvValg: "",
      pvSendt: ""
    };
  }
  return work[id];
}

function addJournal(entry) {
  journal.unshift({
    at: new Date().toLocaleString("no-NO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...entry
  });
  renderJournal();
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_e) {
    return fallback;
  }
}
function saveJson(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_e) { /* ignore */ }
}

function lesArkiv(id) {
  const map = loadJson(ARCHIVE_KEY, {});
  return map[id] || null;
}

function byggKiVurdering(sak, w) {
  const sjekker = (w.rules?.checks || []).map((c) => `- ${c.label} [${c.status}]: ${c.text}`).join("\n");
  const sem = w.semantic || {};
  const linje = (label, item) => `${label}: ${item?.score != null ? `${item.score}/5` : "—"} · ${item?.sitat || "ikke oppgitt"}`;
  const innhold = [
    "KI-VURDERING — UTKAST, IKKE VEDTAK",
    "Øvelse. Fiktiv ordning. Mennesket bestemmer.",
    "",
    `Sak: ${sak.id}`,
    `Søker: ${sak.org}`,
    `Kommune: ${sak.kommune}`,
    `Aktivitet: ${sak.aktivitet}`,
    `Søkt: ${kr(sak.belop)}`,
    `Foreslått beløp: ${kr(w.recommended)}`,
    `Kilde: ${w.live === true ? "live KI" : w.live === false ? "forhåndstekst — ikke modell" : "ikke kjørt"}`,
    `Tid: ${new Date().toLocaleString("no-NO")}`,
    "",
    "## Regelutfall",
    sjekker || "(ingen)",
    "",
    "## Tekstvurdering",
    linje("Målgruppe", sem.malgruppe),
    linje("Medvirkning", sem.medvirkning),
    linje("Gratis", sem.gratis),
    "",
    "## Tenkning",
    sem.tenkning || "(ikke oppgitt)",
    "",
    "## Saksnotat",
    w.note || sem.notat || "(ikke skrevet)",
    "",
    "## Brevutkast",
    w.letter || sem.brev || "(ikke skrevet)",
    "",
    "Dette dokumentet er et arbeidsvedlegg. Det er ikke et enkeltvedtak."
  ].join("\n");
  return {
    tittel: `${sak.id}-ki-vurdering.txt`,
    type: "ki-vurdering",
    innhold
  };
}

function journalforVedlegg(id, dok, handling) {
  const sak = findSak(id);
  if (!sak || !dok) return null;
  const map = loadJson(ARCHIVE_KEY, {});
  const row = map[id] || { sak: id, org: sak.org, dokumenter: [] };
  if (!row.dokumenter) row.dokumenter = [];
  row.dokumenter.unshift({
    tittel: dok.tittel,
    type: dok.type || "vedlegg",
    at: new Date().toLocaleString("no-NO"),
    innhold: dok.innhold,
    merknad: "Simulert journalpost i øvelsesarkivet. Ikke ekte arkivsystem."
  });
  row.at = new Date().toLocaleString("no-NO");
  row.handling = handling || row.handling || "vedlegg";
  if (dok.type === "ki-vurdering") row.kiVurdering = dok.innhold;
  map[id] = row;
  saveJson(ARCHIVE_KEY, map);
  return row;
}

function lastNedTekst(filnavn, tekst) {
  const blob = new Blob([tekst], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filnavn;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function renderPipe(w) {
  const el = $("pipe");
  if (!el) return;
  const order = { idle: -1, regler: 0, ki: 1, utkast: 2, hitl: 3 };
  const cur = order[w ? w.pipeline : "idle"] ?? -1;
  const labels = ["1. Tall sjekket", "2. KI leser teksten", "3. Utkast klart", "4. Du bestemmer"];
  el.innerHTML = labels.map((l, i) => {
    const cls = i < cur ? "done" : i === cur ? "now" : "";
    return `<div class="${cls}">${l}</div>`;
  }).join("");
}

function renderRamme() {
  const el = $("ramme");
  if (!el) return;
  const sum = SAKER.reduce((n, s) => n + s.belop, 0);
  const pct = Math.min(100, Math.round((sum / RAMME) * 100));
  const o = typeof ordningOvelse === "function" ? ordningOvelse() : null;
  const offentlig = o && typeof formatOffentligBelop === "function"
    ? formatOffentligBelop(o, kr)
    : "ikke oppgitt i kilden";
  el.innerHTML = `<div class="ramme"><strong>Øvelsespott:</strong> ${kr(RAMME)} — fiktiv pott for prioritering. Vi fordeler ikke den offentlige rammen. <strong>Offentlig kontekst</strong> for ${esc(o?.navn || "Inkludering av barn og unge")}: ${esc(offentlig)}. ${SAKER.length} saker har søkt ${kr(sum)} mot øvelsespotten. KI kutter ikke for å få det til å gå opp. <strong>Du prioriterer.</strong><div class="bar"><i style="width:${pct}%"></i></div></div>`;
}

function sakerFiltrert() {
  let liste = SAKER;
  if (ordningFilter !== "alle") {
    liste = liste.filter((s) => (s.ordningId || ORDNING_OVELSE_ID) === ordningFilter);
  }
  if (listFilter === "alle") return liste;
  if (listFilter === "frank") {
    const mine = typeof FRANK_TILDELTE !== "undefined" ? FRANK_TILDELTE : [];
    return liste.filter((s) => mine.includes(s.id));
  }
  if (listFilter === "personvern") {
    return liste.filter((s) => typeof sjekkPersonvern === "function" && sjekkPersonvern(s).niva !== "ok");
  }
  return liste.filter((s) => s.flag === listFilter);
}

function setListFilter(flag) {
  listFilter = flag;
  renderList();
}

function setOrdningFilter(id) {
  ordningFilter = id || "alle";
  renderList();
}

function renderList() {
  const box = $("liste");
  if (!box) return;
  const flags = ["alle", "frank", "ok", "avkorting", "formalia", "historikk", "ramme", "avvik", "plantet", "personvern"];
  const chips = flags.map((f) => {
    const n = f === "alle"
      ? SAKER.length
      : f === "frank"
        ? (typeof FRANK_TILDELTE !== "undefined" ? FRANK_TILDELTE.length : 0)
        : f === "personvern"
        ? SAKER.filter((s) => typeof sjekkPersonvern === "function" && sjekkPersonvern(s).niva !== "ok").length
        : SAKER.filter((s) => s.flag === f).length;
    const on = listFilter === f;
    const label = f === "alle" ? "Alle" : f === "frank" ? "Franks bunke" : f === "personvern" ? "Personvern" : tagText(f);
    return `<button type="button" class="chip ${on ? "on" : ""}" onclick="setListFilter('${f}')">${label} ${n}</button>`;
  }).join("");
  const ordninger = typeof ORDNINGER !== "undefined" ? ORDNINGER : [];
  const ordningOpts = [`<option value="alle">Alle ordninger</option>`].concat(
    ordninger.filter((o) => !o.ikkeSokbar).map((o) => {
      const n = SAKER.filter((s) => (s.ordningId || ORDNING_OVELSE_ID) === o.id).length;
      const merke = o.id === ORDNING_OVELSE_ID ? " (øvelse)" : "";
      return `<option value="${esc(o.id)}" ${ordningFilter === o.id ? "selected" : ""}>${esc(o.navn)}${merke} · ${n}</option>`;
    })
  ).join("");
  const rows = sakerFiltrert().map((sak) => `
    <button type="button" class="${selected === sak.id ? "on" : ""}" onclick="openSak('${sak.id}')">
      <div class="meta"><span>${sak.id}</span><span class="tag ${tagClass(sak.flag)}">${tagText(sak.flag)}</span>${typeof sjekkPersonvern === "function" && sjekkPersonvern(sak).niva !== "ok" ? `<span class="tag ${sjekkPersonvern(sak).niva === "rod" ? "tag-formalia" : "tag-avkorting"}">PV</span>` : ""}</div>
      <h3>${esc(sak.org)}</h3>
      <p class="amt">${kr(sak.belop)} · ${esc(sakOrdning(sak).kortnavn || sakOrdningTekst(sak))}</p>
      <p class="job">${esc(sak.jobb)}</p>
    </button>`).join("");
  box.innerHTML = `<label class="field">Ordning
      <select onchange="setOrdningFilter(this.value)">${ordningOpts}</select>
    </label>
    <div class="chips">${chips}</div>${rows}`;
}

function renderJournal() {
  const box = $("journal");
  if (!box) return;
  box.innerHTML = journal.length
    ? journal.map((j) => `<article><p class="mono">${esc(j.at)} · ${esc(j.type)} · ${esc(j.sak)}</p><p>${esc(j.svar)}</p></article>`).join("")
    : `<p class="hint">Tomt til du åpner en sak eller trykker en knapp. Ingenting sendes ut av nettleseren.</p>`;
}

function pvKortHtml(sak, w) {
  const sjekk = (typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : null) || w.pv;
  if (!sjekk) return `<p class="hint">Personvernmodulen er ikke lastet.</p>`;
  const cls = sjekk.niva === "rod" ? "check-red" : sjekk.niva === "gul" ? "check-yellow" : "check-green";
  const tittel = sjekk.niva === "rod" ? "Stopp" : sjekk.niva === "gul" ? "Se her" : "OK";
  const funn = sjekk.funn.length
    ? `<ul>${sjekk.funn.map((f) => `<li><strong>${esc(f.label)}</strong> — ${esc(f.tekst)}${f.treff ? ` <span class="mono">(${esc(f.treff)})</span>` : ""}</li>`).join("")}</ul>`
    : `<p class="hint">Ingen treff i mønstersøket. Det betyr ikke at teksten er «godkjent».</p>`;
  const knapper = sjekk.niva === "rod" && !w.semantic
    ? `<div class="btn-row">
        <button class="btn btn-dark" type="button" onclick="runKI('${sak.id}', true, 'sladd')">Send sladdet til KI</button>
        <button class="btn btn-ghost" type="button" onclick="runKI('${sak.id}', true, 'likevel')">Send usladdet (kun øvelse)</button>
      </div>
      <p class="hint">Rødt funn: KI startet ikke automatisk.</p>`
    : `<p class="hint">${w.pvSendt === "usladdet" ? "Du sendte usladdet tekst — bare i øvelsen." : w.pvSendt === "sladdet" || sjekk.niva !== "ok" ? "Standard: sladdet tekst til KI." : "Ingen sladding nødvendig etter mønstersøket."} <a href="/tilskudd/personvern">Hele bunken</a></p>`;
  return `<div class="check ${cls}"><small>${tittel} · Personvernmodul</small>${sjekk.niva === "ok" ? "Ingen mønsterfunn i søknad og søkernavn." : "Mønstersøk, ikke hjemmelsvurdering."}</div>
    ${funn}
    ${sjekk.niva !== "ok" ? `<details><summary>Sladdet tekst som kan sendes til KI</summary><p class="mono" style="font-size:0.82rem">${esc(sjekk.sladdet)}</p></details>` : ""}
    ${knapper}`;
}

function nis2KortHtml(sak, w) {
  if (typeof sjekkNis2Sak !== "function") return `<p class="hint">NIS 2-modulen er ikke lastet.</p>`;
  const nis = sjekkNis2Sak(sak, {
    work: w,
    pv: typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : { niva: "ok" },
    harSpor: Boolean(w.traceId)
  });
  const cls = nis.klasse === "hoy-konsekvens" ? "check-yellow" : "check-green";
  return `<div class="check ${cls}"><small>${esc(nis.klasseTekst)}</small>${esc(NIS2_REF)}. Prototypen er ikke innmeldt hos NSM.</div>
    <ul>${nis.grunner.map((g) => `<li>${esc(g)}</li>`).join("")}
      <li>${esc(nis.varsling)}</li>
    </ul>
    <p class="hint"><a href="/tilskudd/nis2">Norges tilnærming og full liste</a>. Ikke samsvar.</p>`;
}

function aiActKortHtml(sak, w) {
  if (typeof sjekkAiActSak !== "function") return `<p class="hint">KI-forordningsmodulen er ikke lastet.</p>`;
  const act = sjekkAiActSak(sak, { work: w, pv: typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : { niva: "ok" }, harSpor: Boolean(w.traceId) });
  const cls = act.klasse === "hoy-tilsyn" ? "check-yellow" : "check-green";
  return `<div class="check ${cls}"><small>${esc(act.klasseTekst)} · ${esc(act.bruk)}</small>Ikke automatisert vedtak. ${esc(AIACT_REF || "KI-forordningen")}.</div>
    <ul>${act.grunner.map((g) => `<li>${esc(g)}</li>`).join("")}
      <li>Tilsyn: ${esc(act.tilsyn)}</li>
      <li>Logging i øvelsen: ${act.logging ? "spor finnes" : "ingen spor ennå"}</li>
    </ul>
    <p class="hint"><a href="/tilskudd/aiact">Systemkrav og full klassifisert liste</a>. Ikke samsvarserklæring.</p>`;
}

function semRow(label, item) {
  const score = item?.score != null ? `${item.score}/5` : "—";
  return `<tr><td>${esc(label)}</td><td class="mono">${score}</td><td>${esc(item?.sitat || "ikke oppgitt")}</td></tr>`;
}

function renderCard() {
  const box = $("kort");
  if (!box) return;
  renderRamme();
  if (!selected) {
    renderPipe(null);
    box.innerHTML = `<p class="hint">Velg en sak til venstre. Da ser du søknaden, hva tallene viser, og et utkast du kan godkjenne, rette eller avvise.</p>`;
    return;
  }
  const sak = findSak(selected);
  const w = ensure(selected);
  renderPipe(w);
  const planted = sak.flag === "plantet";
  const kiNote = w.running
    ? `<div class="note live-run">KI leser søknaden nå…</div>`
    : w.live === true
      ? `<div class="note live-ok">Dette utkastet kom fra KI. Det er et forslag. Du fatter ikke vedtak her.</div>`
      : w.live === false
        ? `<div class="note live-off"><strong>Ikke KI-svar.</strong> Vi viser en ferdig øvelsestekst fordi live-kall ikke virket${w.error ? ` (${esc(w.error)})` : ""}.</div>`
        : `<div class="note">Venter på KI-steget.</div>`;
  const checks = w.rules.checks.map((c) => `<div class="check check-${c.status}"><small>${c.status === "green" ? "OK" : c.status === "yellow" ? "Se her" : "Stopp"} · ${esc(c.label)}</small>${esc(c.text)}</div>`).join("");
  const budsjett = sak.budsjett.map((b) => `<tr><td>${esc(b.post)}</td><td style="text-align:right">${kr(b.belop)}</td><td>${esc(b.type)}</td></tr>`).join("");
  const arkiv = lesArkiv(sak.id);
  const kiDok = w.semantic ? byggKiVurdering(sak, w) : null;
  const kiIArkiv = (arkiv?.dokumenter || []).some((d) => d.type === "ki-vurdering") || Boolean(arkiv?.kiVurdering);
  const vedlegg = sak.vedlegg.map((v) => `<li>${esc(v.navn)} — <strong>${v.status === "ok" ? "med" : "mangler"}</strong></li>`).join("");
  const kiVedlegg = kiDok
    ? `<li class="vedlegg-ki"><strong>${esc(kiDok.tittel)}</strong> — KI-vurdering (utkast)
        <p class="hint" style="margin:0.25rem 0 0.45rem">Arbeidsvedlegg. Kan journalføres i øvelsesarkivet. Ikke vedtak.</p>
        <div class="btn-row">
          <button class="btn btn-dark" type="button" onclick="journalforKiVurdering('${sak.id}')">${kiIArkiv ? "Journalfør på nytt" : "Legg ved i arkivet"}</button>
          <button class="btn btn-ghost" type="button" onclick="lastNedKiVurdering('${sak.id}')">Last ned</button>
        </div>
        ${kiIArkiv ? `<p class="hint">Ligger i øvelsesarkivet${arkiv?.at ? ` · ${esc(arkiv.at)}` : ""}.</p>` : ""}
        <details><summary>Forhåndsvis dokumentet</summary><p class="mono" style="font-size:0.78rem">${esc(kiDok.innhold)}</p></details>
      </li>`
    : `<li class="hint">KI-vurdering — ikke klar ennå. Kjør KI først.</li>`;
  const arkivListe = (arkiv?.dokumenter || []).length
    ? `<ul class="arkiv-liste">${arkiv.dokumenter.map((d) => `<li><strong>${esc(d.tittel)}</strong> · ${esc(d.at)}<br><span class="hint">${esc(d.merknad || "Simulert journalpost.")}</span></li>`).join("")}</ul>`
    : `<p class="hint">Ingen journalposter i øvelsesarkivet på denne saken ennå.</p>`;
  const sem = w.semantic
    ? `<table><thead><tr><th>Tema</th><th>Score</th><th>Sitat</th></tr></thead><tbody>${semRow("Målgruppe", w.semantic.malgruppe)}${semRow("Medvirkning", w.semantic.medvirkning)}${semRow("Gratis", w.semantic.gratis)}</tbody></table>`
    : `<p class="hint">${w.running ? "Leser teksten…" : "Ingen tekstvurdering ennå."}</p>`;
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:flex-start">
      <div>
        <p class="mono" style="margin:0;color:#4f46e5;font-weight:700">${sak.id}</p>
        <h2 style="margin:0.15rem 0">${esc(sak.org)}</h2>
        <p class="hint" style="margin:0">${esc(sakOrdningTekst(sak))} · ${esc(sak.kommune)} · ${esc(sak.aktivitet)}</p>
        <p style="margin:0.55rem 0 0;font-weight:650">Din jobb: ${esc(sak.jobb)}</p>
      </div>
      <button class="btn btn-primary" type="button" ${w.running ? "disabled" : ""} onclick="runKI('${sak.id}', true)">Kjør KI på nytt</button>
    </div>
    ${kiNote}
    ${planted ? `<div class="planted"><strong>Øvelse:</strong> Første utkast blander inn § 14 og Golfklubben Fjord. Det er feil. Riktig lik sak er Havblik (T-2608). Avvis med en setning om hvorfor.</div>` : ""}
    <div class="split" style="margin-top:1rem">
      <div>
        <h3>Søknaden</h3>
        <p>${esc(sak.soknad)}</p>
        <h3>Budsjett</h3>
        <table>${budsjett}</table>
        <h3>Vedlegg</h3>
        <ul>${vedlegg}${kiVedlegg}</ul>
        ${typeof sakLovHtml === "function" ? sakLovHtml(sak) : ""}
        <h3>Arkiv (øvelse)</h3>
        <p class="hint">Simulert journal — ikke Elements eller annen ekte arkivløsning.</p>
        ${arkivListe}
      </div>
      <div>
        <h3>Personvern</h3>
        ${pvKortHtml(sak, w)}
        <h3>KI-forordningen</h3>
        ${aiActKortHtml(sak, w)}
        <h3>NIS 2 / Norge</h3>
        ${nis2KortHtml(sak, w)}
        <h3>Det tallene viser</h3>
        ${checks}
        <h3>Det KI sier om teksten</h3>
        ${sem}
        ${w.semantic?.tenkning ? `<div class="think"><strong>Hva KI skrev mens den jobbet</strong><p class="mono">${esc(w.semantic.tenkning)}</p><p><a href="/tilskudd/transparens${w.traceId ? `#${w.traceId}` : ""}">Åpne hele tankeloggen →</a></p></div>` : `<p class="hint"><a href="/tilskudd/transparens">Se hva KI tenkte (egen side)</a></p>`}
        <label class="field">Foreslått beløp (du kan rette)
          <input id="belop" type="number" value="${w.recommended}" />
        </label>
        <label class="field">Utkast til notat
          <textarea id="notat" rows="5">${esc(w.note)}</textarea>
        </label>
        <label class="field">Utkast til brev
          <textarea id="brev" rows="5" class="mono">${esc(w.letter)}</textarea>
        </label>
        <label class="field">Din grunn (må fylles ved avvis)
          <input id="grunn" type="text" placeholder="Skriv hvorfor…" />
        </label>
        <div class="btn-row">
          <button class="btn btn-dark" type="button" onclick="hitl('bekreft')">Bekreft forslag</button>
          <button class="btn btn-ghost" type="button" onclick="hitl('juster')">Juster</button>
          <button class="btn btn-ghost" type="button" onclick="hitl('avvis')">Avvis med grunn</button>
          <button class="btn btn-ghost" type="button" onclick="hitl('sta')">La stå</button>
        </div>
        <p class="hint">Ingenting blir vedtak. Vi lagrer bare et øvelsesnotat i nettleseren.</p>
        ${w.hitl ? `<p><strong>${esc(w.hitl)}</strong></p>` : ""}
      </div>
    </div>`;
}

function readEditors(w) {
  if ($("belop") && $("belop").value !== "") w.recommended = Number($("belop").value) || 0;
  if ($("notat")) w.note = $("notat").value;
  if ($("brev")) w.letter = $("brev").value;
}

function openSak(id) {
  const sak = findSak(id);
  if (!sak) return;
  selected = id;
  const w = ensure(id);
  if (!journal.some((j) => j.sak === id && j.type === "regler")) {
    addJournal({ type: "regler", sak: id, svar: w.rules.checks.map((c) => `${c.label}: ${c.status}`).join("; ") });
  }
  renderList();
  renderCard();
  const pv = typeof sjekkPersonvern === "function" ? sjekkPersonvern(sak) : { niva: "ok" };
  w.pv = pv;
  if (!w.semantic && !w.running && pv.niva !== "rod") runKI(id, false, "sladd");
  try { history.replaceState(null, "", `#${id}`); } catch (_e) { /* ignore */ }
}

async function runKI(id, force, pvValg) {
  const sak = findSak(id);
  const w = ensure(id);
  if (!sak || w.running) return;
  if (w.semantic && !force) return;
  const gate = typeof personvernForKi === "function" ? personvernForKi(sak, pvValg || w.pvValg || "sladd") : { stopp: false, sjekk: null, tekst: sak.soknad, sladdet: false };
  w.pv = gate.sjekk;
  if (gate.stopp) {
    w.status = "Personvern: sladd før KI.";
    renderCard();
    return;
  }
  w.pvValg = pvValg || w.pvValg || "sladd";
  w.pvSendt = gate.sladdet ? "sladdet" : (gate.sjekk && gate.sjekk.niva !== "ok" ? "usladdet" : "ok");
  w.running = true;
  w.pipeline = "ki";
  w.status = "KI leser…";
  renderList();
  renderCard();
  const seq = ++kiSeq;
  const rag = ragFor(sak).map((r) => `### ${r.tittel}\n${r.tekst}`).join("\n\n");
  const prompt = `Saksnummer: ${sak.id}\nOrganisasjon: ${sak.org}\nSøkt: ${sak.belop} kr\nPersonvern: ${w.pvSendt === "sladdet" ? "søknadstekst er sladdet av øvelsesmodulen" : "søknadstekst som i saken"}.\n\nSØKNADSTEKST:\n${gate.tekst}\n\nUTDRAG (fiktiv øvelse 2026):\n${rag}\n\nSkriv først ## Tenkning, deretter semantikk, notat og brev. Ikke fatt vedtak.`;
  addJournal({ type: "ki", sak: id, svar: force ? "Kjører KI på nytt" : "Første KI-kall" });
  const kilder = ragFor(sak).map((r) => r.tittel);
  try {
    const text = await callModelAPI(prompt, SYS);
    if (seq !== kiSeq) return;
    const parsed = parseKi(text);
    w.semantic = parsed;
    w.note = parsed.notat;
    w.letter = parsed.brev || parsed.notat;
    w.live = true;
    w.traceId = saveTrace({
      sak: id,
      org: sak.org,
      oppgave: "Sakskort — vurdering og utkast",
      live: true,
      kilder,
      prompt,
      system: SYS,
      tenkning: parsed.tenkning,
      utkast: parsed.notat,
      brev: parsed.brev,
      raw: text
    });
  } catch (e) {
    if (seq !== kiSeq) return;
    const fb = FALLBACK[id] || fallbackFromSak(sak);
    w.semantic = fb;
    w.note = fb.notat;
    w.letter = fb.brev;
    w.live = false;
    w.error = e?.simulation ? "ingen nøkkel" : (e?.message || "feil");
    w.traceId = saveTrace({
      sak: id,
      org: sak.org,
      oppgave: "Sakskort — vurdering og utkast",
      live: false,
      kilder,
      prompt,
      system: SYS,
      tenkning: fb.tenkning,
      utkast: fb.notat,
      brev: fb.brev,
      raw: "",
      error: w.error
    });
  }
  w.running = false;
  w.pipeline = "utkast";
  w.kiDok = byggKiVurdering(sak, w);
  renderList();
  renderCard();
}

function lastNedKiVurdering(id) {
  const sak = findSak(id);
  const w = ensure(id);
  if (!sak || !w.semantic) return;
  readEditors(w);
  const dok = byggKiVurdering(sak, w);
  lastNedTekst(dok.tittel, dok.innhold);
}

function journalforKiVurdering(id) {
  const sak = findSak(id);
  const w = ensure(id);
  if (!sak || !w.semantic) return;
  readEditors(w);
  const dok = byggKiVurdering(sak, w);
  journalforVedlegg(id, dok, "ki-vurdering");
  w.kiDok = dok;
  addJournal({ type: "arkiv", sak: id, svar: `KI-vurdering journalført som vedlegg (${dok.tittel}). Simulert arkiv — ikke ekte system.` });
  renderCard();
}

function hitl(action) {
  if (!selected) return;
  const w = ensure(selected);
  readEditors(w);
  const grunn = ($("grunn")?.value || "").trim();
  w.pipeline = "hitl";
  if (action === "bekreft") {
    w.hitl = `Du bekreftet forslaget på ${kr(w.recommended)}. Fortsatt ikke et vedtak.`;
  } else if (action === "juster") {
    w.hitl = `Du justerte til ${kr(w.recommended)}. ${grunn || "Ingen skriftlig grunn."}`;
  } else if (action === "avvis") {
    if (!grunn) {
      w.hitl = "Skriv en grunn før du avviser.";
      renderCard();
      return;
    }
    w.hitl = `Du avviste forslaget: ${grunn}`;
  } else {
    w.hitl = "Saken står. Ingen godkjenning.";
  }
  addJournal({ type: "du", sak: selected, svar: w.hitl });
  if (action === "bekreft" || action === "juster") arkiver(selected, w, action);
  renderCard();
}

function arkiver(id, w, handling) {
  const sak = findSak(id);
  const map = loadJson(ARCHIVE_KEY, {});
  const pakke = `UTKAST — IKKE VEDTAK\n${id} ${sak.org}\nBeløp: ${w.recommended}\n\n${w.note}\n\n${w.letter}`;
  const row = map[id] || { sak: id, org: sak.org, dokumenter: [] };
  if (!row.dokumenter) row.dokumenter = [];
  row.at = new Date().toLocaleString("no-NO");
  row.handling = handling;
  row.pdf = pakke;
  row.org = sak.org;
  const kiDok = w.semantic ? byggKiVurdering(sak, w) : null;
  if (kiDok && !row.dokumenter.some((d) => d.type === "ki-vurdering")) {
    row.dokumenter.unshift({
      tittel: kiDok.tittel,
      type: "ki-vurdering",
      at: row.at,
      innhold: kiDok.innhold,
      merknad: "KI-vurdering lagt ved saken i øvelsesarkivet. Ikke vedtak."
    });
    row.kiVurdering = kiDok.innhold;
  }
  row.dokumenter.unshift({
    tittel: `${id}-innstillingsutkast.txt`,
    type: "innstillingsutkast",
    at: row.at,
    innhold: pakke,
    merknad: "Utkast etter din handling. Ikke enkeltvedtak."
  });
  map[id] = row;
  saveJson(ARCHIVE_KEY, map);
}

function setView(name) {
  ["arbeid", "klage", "slutt"].forEach((v) => {
    const el = $(`view-${v}`);
    if (el) el.hidden = v !== name;
    const a = document.querySelector(`[data-nav="${v}"]`);
    if (a) a.classList.toggle("is-on", v === name);
  });
  if (name === "klage") renderKlage();
  if (name === "slutt") renderSlutt();
}

function kiBanner(state, runningTxt) {
  if (state.running) return `<div class="note live-run">${runningTxt}</div>`;
  if (state.live === true) return `<div class="note live-ok">KI har skrevet utkast. Du velger. Ikke vedtak.</div>`;
  if (state.live === false) return `<div class="note live-off"><strong>Ikke KI-svar.</strong> Ferdig øvelsestekst. ${esc(state.error || "")}</div>`;
  return `<div class="note">Klar til å kjøre KI.</div>`;
}

function renderKlage() {
  const box = $("klageOut");
  if (!box) return;
  $("klageBanner").innerHTML = kiBanner(klage, "KI leser klagen…");
  if ($("klageRerun")) $("klageRerun").disabled = klage.running;
  if (!klage.vurdering) {
    box.innerHTML = `<p class="hint">${klage.running ? "Skriver to utkast…" : "Trykk «Kjør KI» eller vent — vi starter automatisk."}</p>`;
    return;
  }
  box.innerHTML = `${klage.tenkning ? `<div class="think"><strong>Hva KI skrev mens den jobbet</strong><p class="mono">${esc(klage.tenkning)}</p><p><a href="/tilskudd/transparens${klage.traceId ? `#${klage.traceId}` : ""}">Åpne hele tankeloggen →</a></p></div>` : ""}
    <h3>Hva som er nytt</h3><p class="mono">${esc(klage.vurdering)}</p>
    <h3>Hvis du godtar kursleder-forklaringen</h3><p class="mono">${esc(klage.omgjoring)}</p>
    <h3>Hvis du ikke godtar den</h3><p class="mono">${esc(klage.opprettholdelse)}</p>`;
}

function renderSlutt() {
  const box = $("sluttOut");
  if (!box) return;
  $("sluttBanner").innerHTML = kiBanner(slutt, "KI leser sluttregnskapet…");
  if ($("sluttRerun")) $("sluttRerun").disabled = slutt.running;
  if (!slutt.vurdering) {
    box.innerHTML = `<p class="hint">${slutt.running ? "Skriver utkast…" : "Starter KI."}</p>`;
    return;
  }
  box.innerHTML = `${slutt.tenkning ? `<div class="think"><strong>Hva KI skrev mens den jobbet</strong><p class="mono">${esc(slutt.tenkning)}</p><p><a href="/tilskudd/transparens${slutt.traceId ? `#${slutt.traceId}` : ""}">Åpne hele tankeloggen →</a></p></div>` : ""}
    <h3>Hva som er avvik</h3><p class="mono">${esc(slutt.vurdering)}</p>
    <h3>Utkast til tilbakekreving</h3><p class="mono">${esc(slutt.tilbake)}</p>
    <h3>Hvis mer dokumentasjon kommer</h3><p>${esc(slutt.alternativ)}</p>`;
}

async function runKlage(force) {
  if (klage.running || (klage.vurdering && !force)) return;
  const sak = findSak("T-2629");
  klage.running = true;
  renderKlage();
  const prompt = `Klage på T-2629. Opprinnelig: avkorting fordi admin var 32 %. Nytt faktum: 40 000 kr var kursleder (fag), ikke admin.\nSøknad: ${soknadTilModell(sak, "sladd")}\nUtdrag: ${RAG.admin.tekst}\n${RAG.klage.tekst}\nSkriv først ## Tenkning, deretter vurdering, omgjøring og opprettholdelse. Ikke vedtak.`;
  try {
    const text = await callModelAPI(prompt, SYS_KLAGE);
    const tnk = (text.split(/##\s*Tenkning/i)[1] || "").split(/##\s*Vurdering/i)[0].trim();
    const v = (text.split(/##\s*Vurdering/i)[1] || text).split(/##\s*Utkast omgjøring/i)[0].trim();
    const o = (text.split(/##\s*Utkast omgjøring/i)[1] || "").split(/##\s*Utkast opprettholdelse/i)[0].trim();
    const p = (text.split(/##\s*Utkast opprettholdelse/i)[1] || "").trim();
    klage.tenkning = tnk; klage.vurdering = v; klage.omgjoring = o; klage.opprettholdelse = p; klage.live = true;
    klage.traceId = saveTrace({ sak: "T-2629", org: sak.org, oppgave: "Klage — to utkast", live: true, kilder: [RAG.admin.tittel, RAG.klage.tittel], prompt, system: SYS_KLAGE, tenkning: tnk, utkast: v, brev: o, raw: text });
  } catch (e) {
    klage.tenkning = "1. Jeg leser at 40 000 kr skal være kursleder, ikke admin.\n2. Hvis det stemmer, synker adminandelen under 15 %.\n3. Jeg skriver to utkast. Du velger. Ikke vedtak.\nForhåndstekst — ikke modell.";
    klage.vurdering = "Nytt faktum: 40 000 kr var kursleder. Hvis du godtar det, synker adminandelen. Forhåndstekst — ikke modell.";
    klage.omgjoring = "Utkast — ikke vedtak\n\nGodta kursleder som aktivitet. Avkortingen blir mindre.";
    klage.opprettholdelse = "Utkast — ikke vedtak\n\nBehold opprinnelig avkorting mot 15 % admin.";
    klage.live = false;
    klage.error = e?.message || "feil";
    klage.traceId = saveTrace({ sak: "T-2629", org: sak.org, oppgave: "Klage — to utkast", live: false, kilder: [RAG.admin.tittel, RAG.klage.tittel], prompt, system: SYS_KLAGE, tenkning: klage.tenkning, utkast: klage.vurdering, brev: klage.omgjoring, raw: "", error: klage.error });
  }
  klage.running = false;
  renderKlage();
}

async function runSlutt(force) {
  if (slutt.running || (slutt.vurdering && !force)) return;
  const sak = findSak("T-2631");
  slutt.running = true;
  renderSlutt();
  const prompt = `Slutt T-2631. Innvilget 220 000. Brukt 140 000 på gressbane (ikke godkjent) og 80 000 på trening.\n${soknadTilModell(sak, "sladd")}\n${RAG.slutt.tekst}\nSkriv først ## Tenkning, deretter vurdering, tilbakekreving og alternativ. Ikke vedtak.`;
  try {
    const text = await callModelAPI(prompt, SYS_SLUTT);
    slutt.tenkning = (text.split(/##\s*Tenkning/i)[1] || "").split(/##\s*Vurdering/i)[0].trim();
    slutt.vurdering = (text.split(/##\s*Vurdering/i)[1] || text).split(/##\s*Utkast tilbakekreving/i)[0].trim();
    slutt.tilbake = (text.split(/##\s*Utkast tilbakekreving/i)[1] || "").split(/##\s*Alternativ/i)[0].trim();
    slutt.alternativ = (text.split(/##\s*Alternativ/i)[1] || "").trim();
    slutt.live = true;
    slutt.traceId = saveTrace({ sak: "T-2631", org: sak.org, oppgave: "Slutt — tilbakekreving", live: true, kilder: [RAG.slutt.tittel], prompt, system: SYS_SLUTT, tenkning: slutt.tenkning, utkast: slutt.vurdering, brev: slutt.tilbake, raw: text });
  } catch (e) {
    slutt.tenkning = "1. Jeg deler 220 000 kr i 140 000 anlegg og 80 000 trening.\n2. Anlegg er ikke godkjent. Trening kan stå.\n3. Utkast til tilbakekreving — ikke innkreving.\nForhåndstekst — ikke modell.";
    slutt.vurdering = "140 000 kr til gressbane er avvik. 80 000 kr trening kan stå. Forhåndstekst — ikke modell.";
    slutt.tilbake = "Utkast — ikke vedtak\n\nKrev 140 000 kr tilbake. Ikke innkreving.";
    slutt.alternativ = "Hvis anlegget likevel var godkjent, vurderer du saken på nytt.";
    slutt.live = false;
    slutt.error = e?.message || "feil";
    slutt.traceId = saveTrace({ sak: "T-2631", org: sak.org, oppgave: "Slutt — tilbakekreving", live: false, kilder: [RAG.slutt.tittel], prompt, system: SYS_SLUTT, tenkning: slutt.tenkning, utkast: slutt.vurdering, brev: slutt.tilbake, raw: "", error: slutt.error });
  }
  slutt.running = false;
  renderSlutt();
}

function klageValg(valg) {
  const t = valg === "godta"
    ? "Du tok omgjøringsutkastet inn i øvelsesjournalen. Ikke omgjøring i virkeligheten."
    : "Du tok opprettholdelsen inn i øvelsesjournalen. Ikke vedtak.";
  $("klageStatus").textContent = t;
  addJournal({ type: "du", sak: "T-2629", svar: t });
}

function sluttValg(valg) {
  const t = valg === "tilbake"
    ? "Du journalførte tilbakekrevingsutkastet. Ingen ekte innkreving."
    : "Sluttsaken står.";
  $("sluttStatus").textContent = t;
  addJournal({ type: "du", sak: "T-2631", svar: t });
}

function lookupRegister() {
  const hit = findReg($("regOrgnr")?.value);
  const out = $("regOut");
  if (!out) return;
  out.innerHTML = hit
    ? `<p><strong>${esc(hit.navn)}</strong> · ${esc(hit.form)} · frivillig ${hit.frivillig ? "ja" : "nei"}. Simulert tabell, ikke Brønnøysund.</p>`
    : `<p>Ikke funnet i øvelsestabellen.</p>`;
}

function submitSoknad() {
  const orgnr = ($("pOrgnr")?.value || "").trim();
  const org = ($("pOrg")?.value || "").trim();
  const belop = Number($("pBelop")?.value || 0);
  const soknad = ($("pTekst")?.value || "").trim();
  const ordningId = ($("pOrdning")?.value || (typeof ORDNING_OVELSE_ID !== "undefined" ? ORDNING_OVELSE_ID : "inkludering-barn-unge")).trim();
  const status = $("pStatus");
  if (!orgnr || !org || !belop || !soknad || !ordningId) {
    if (status) status.textContent = "Fyll ut alle feltene.";
    return;
  }
  const pv = typeof sjekkFritekstPersonvern === "function" ? sjekkFritekstPersonvern(`${org}\n${soknad}`) : { niva: "ok", funn: [] };
  const list = loadJson(PORTAL_KEY, []);
  const id = `T-9${String(100 + list.length).slice(-3)}`;
  list.push({ id, orgnr, org, belop, soknad, ordningId, at: new Date().toLocaleString("no-NO") });
  saveJson(PORTAL_KEY, list);
  if (status) {
    const lagret = `Lagret ${id} i denne nettleseren. Åpne arbeidslisten for å fortsette som saksbehandler.`;
    status.innerHTML = pv.niva === "rod"
      ? `${esc(lagret)} <strong>Personvern:</strong> rødt funn (${esc(pv.funn.map((f) => f.label).join(", "))}).`
      : esc(lagret);
  }
  renderMine();
}

function renderMine() {
  const box = $("pMine");
  if (!box) return;
  const list = loadJson(PORTAL_KEY, []);
  box.innerHTML = list.length
    ? list.map((p) => `<p>${esc(p.id)} · ${esc(p.org)} · ${esc(sakOrdningTekst(p))} · ${kr(p.belop)}</p>`).join("")
    : `<p class="hint">Ingen innsendinger her ennå.</p>`;
}

function fyllOrdningVelger() {
  const sel = $("pOrdning");
  if (!sel || typeof ORDNINGER === "undefined") return;
  const cur = sel.value || ORDNING_OVELSE_ID;
  sel.innerHTML = ORDNINGER.filter((o) => !o.ikkeSokbar).map((o) => {
    const merke = o.id === ORDNING_OVELSE_ID ? " (øvelsessaker i prototypen)" : "";
    const budsjett = o.offentligBelop != null ? ` · tilgjengelig ${kr(o.offentligBelop)}` : "";
    return `<option value="${esc(o.id)}" ${o.id === cur ? "selected" : ""}>${esc(o.navn)}${merke} · ${esc(o.forvalter)}${budsjett}</option>`;
  }).join("");
}

function fillPortalFromRegister() {
  const hit = findReg($("pOrgnr")?.value);
  if (hit && $("pOrg")) $("pOrg").value = hit.navn;
  if ($("pReg")) $("pReg").textContent = hit
    ? `${hit.navn} · ${hit.form} · frivillig ${hit.frivillig ? "ja" : "nei"} (simulert)`
    : "Ikke i tabellen. Du kan likevel sende.";
}

window.kr = kr;
window.esc = esc;
window.findSak = findSak;
window.loadJson = loadJson;
window.saveJson = saveJson;
window.callModelAPI = callModelAPI;
window.sakOrdning = sakOrdning;
window.sakOrdningTekst = sakOrdningTekst;
window.setListFilter = setListFilter;
window.setOrdningFilter = setOrdningFilter;
window.openSak = openSak;
window.runKI = runKI;
window.hitl = hitl;
window.journalforKiVurdering = journalforKiVurdering;
window.lastNedKiVurdering = lastNedKiVurdering;
window.setView = setView;
window.runKlage = runKlage;
window.runSlutt = runSlutt;
window.klageValg = klageValg;
window.sluttValg = sluttValg;
window.lookupRegister = lookupRegister;
window.submitSoknad = submitSoknad;
window.fillPortalFromRegister = fillPortalFromRegister;

function renderTransparens() {
  const listBox = $("sporListe");
  const det = $("sporDetalj");
  if (!listBox || !det) return;
  const list = loadJson(TRACE_KEY, []);
  const hash = (location.hash || "").replace("#", "");
  const sel = list.find((t) => t.id === hash) || list[0] || null;
  if (!list.length) {
    listBox.innerHTML = `<p class="hint">Ingen spor ennå. Åpne en sak på arbeidslisten og la KI kjøre — så dukker tenkningen opp her.</p>`;
    det.innerHTML = `<p class="hint">Siden viser det KI skrev <em>før</em> notatet: hva den leste, hva den brukte, og hva den lot være. Det er modellens egne arbeidsnotater — ikke skjulte vekter inne i modellen.</p>`;
    return;
  }
  listBox.innerHTML = list.map((t) => `
    <button type="button" class="${sel && sel.id === t.id ? "on" : ""}" onclick="location.hash='${t.id}'; renderTransparens()">
      <div class="meta"><span>${esc(t.sak)}</span><span class="tag ${t.live ? "tag-ok" : "tag-avkorting"}">${t.live ? "Live KI" : "Ikke modell"}</span></div>
      <h3>${esc(t.org || t.sak)}</h3>
      <p class="job">${esc(t.oppgave)} · ${esc(t.atVis)}</p>
    </button>`).join("");
  det.innerHTML = `
    <p class="mono" style="color:#4f46e5;font-weight:700;margin:0">${esc(sel.sak)} · ${esc(sel.atVis)}</p>
    <h2 style="margin:0.3rem 0">${esc(sel.oppgave)}</h2>
    <p class="hint">${sel.live ? "Dette kom fra live KI via /api/chat." : `Forhåndstekst — ikke modell${sel.error ? ` (${esc(sel.error)})` : ""}.`}</p>
    <div class="think">
      <strong>Tenkning (skrevet før konklusjonen)</strong>
      <p class="mono">${esc(sel.tenkning || "Ikke oppgitt i svaret.")}</p>
    </div>
    <h3>Kilder den fikk</h3>
    <ul>${(sel.kilder || []).map((k) => `<li>${esc(k)}</li>`).join("") || "<li>ikke oppgitt</li>"}</ul>
    <h3>Utkast etter tenkning</h3>
    <p class="mono">${esc(sel.utkast || "ikke oppgitt")}</p>
    ${sel.brev ? `<h3>Brev / andre utkast</h3><p class="mono">${esc(sel.brev)}</p>` : ""}
    <details>
      <summary>Hele prompten som ble sendt</summary>
      <p class="mono" style="font-size:0.78rem">${esc(sel.prompt || "")}</p>
    </details>
    <p class="hint">Vi viser det modellen ble bedt om å skrive høyt. Vi ser ikke «skjult resonnering» inne i vektenettverket.</p>
    <p><a class="btn btn-primary" href="${sel.sak === "portefolje" ? "/tilskudd/analyse" : `/tilskudd/behandle#${esc(sel.sak)}`}">${sel.sak === "portefolje" ? "Tilbake til porteføljen" : "Tilbake til saken"}</a></p>
  `;
}

function lenkSaksnr(text) {
  return esc(text).replace(/T-\d+/g, (id) => `<a href="/tilskudd/behandle#${id}">${id}</a>`);
}

function koeRaderHtml(rader, hvorfor) {
  if (!rader.length) return `<p class="hint">Ingen i denne køen.</p>`;
  return `<table><thead><tr><th>Sak</th><th>Søker</th><th>Ordning</th><th>Kommune</th><th>Søkt</th><th>Hvorfor</th></tr></thead><tbody>${rader.map((r) => {
    const grunn = hvorfor(r);
    return `<tr><td><a href="${sakLenke(r.sak.id)}">${esc(r.sak.id)}</a></td><td>${esc(r.sak.org)}</td><td>${esc(sakOrdning(r.sak).kortnavn || sakOrdningTekst(r.sak))}</td><td>${esc(r.sak.kommune)}</td><td>${kr(r.sak.belop)}</td><td>${esc(grunn)}</td></tr>`;
  }).join("")}</tbody></table>`;
}

function svgStolpe(pct, farge) {
  const w = Math.max(0, Math.min(100, pct));
  return `<svg viewBox="0 0 100 10" class="svg-bar" aria-hidden="true"><rect width="100" height="10" fill="#e2e8f0" rx="2"/><rect width="${w}" height="10" fill="${farge || "#4f46e5"}" rx="2"/></svg>`;
}

function renderAnalyse() {
  const rot = $("analyseRot");
  if (!rot) return;
  const a = analyserPortefolje();
  const aktMax = Math.max(...Object.values(a.perAkt).map((x) => x.length), 1);
  const kommMax = Math.max(...a.toppKommuner.map((x) => x[1]), 1);
  rot.innerHTML = `
    <p class="hint">Maskinell opptelling med øvelsesreglene. Sakene er fordelt på de 16 Tilskudd.no-boksene (fiktivt — ikke ekte søknader). Skjønn skjer på sakskortet.</p>
    <section class="panel">
      <h2>Tilskuddsområder</h2>
      <p class="hint">Samme inndeling som filteret på Tilskudd.no (BFD + Bufdir). Klikk en boks for å åpne sakene.</p>
      <div class="ordning-kort-liste">
        ${(typeof ORDNINGER !== "undefined" ? ORDNINGER : []).map((o) => {
          const liste = a.perOrdning[o.id] || [];
          const sokt = liste.reduce((s, r) => s + r.sak.belop, 0);
          const frist = typeof formatFrist === "function" ? formatFrist(o.frist) : o.frist;
          return `<a class="ordning-kort" href="/tilskudd/behandle#ordning=${esc(o.id)}">
            <div class="ordning-kort-frist">${esc(frist)}</div>
            <div>
              <h3>${esc(o.navn)}</h3>
              <p>${esc(o.forvalter)} · ${esc(o.tema)} · ${liste.length} saker · søkt ${kr(sokt)}</p>
            </div>
          </a>`;
        }).join("")}
      </div>
    </section>
    <div class="kpi-grid">
      <div class="kpi"><b>${a.antall}</b><span>saker i bunken</span></div>
      <div class="kpi"><b>${kr(a.sokt)}</b><span>søkt mot øvelsespott ${kr(RAMME)}</span></div>
      <div class="kpi"><b>${a.koe.kanIkke.length}</b><span>kan ikke innstilles</span></div>
      <div class="kpi"><b>${a.koe.avklare.length}</b><span>må avklares først</span></div>
    </div>

    <section class="panel koe-blokk">
      <h2>A. Dagens kø</h2>
      <h3>Kan ikke innstilles</h3>
      <p class="hint">Feil søker, ikke i register, eller privatperson.</p>
      ${koeRaderHtml(a.koe.kanIkke, (r) => r.røde.find((c) => c.label === "Søker")?.text || "Søker")}
      <h3>Må avklares</h3>
      <p class="hint">Mangler rapport eller revisor over 200 000 kr.</p>
      ${koeRaderHtml(a.koe.avklare, (r) => r.røde.concat(r.gule).filter((c) => c.label === "Historikk" || c.label === "Revisor").map((c) => c.text).join(" "))}
      <h3>Tall ferdig, skjønn gjenstår</h3>
      <p class="hint">Admin-kutt eller store beløp mot potten.</p>
      ${koeRaderHtml(a.koe.skjonn, (r) => r.gule.map((c) => c.label).join(", ") || "skjønn")}
      <h3>Plantet feil</h3>
      <p class="hint">Stopp før du stoler på KI-sitat.</p>
      ${koeRaderHtml(a.koe.plantet, () => "Plantet § 14 / golf — åpne saken")}
      <h3>Avvik / slutt</h3>
      <p class="hint">Tilbakekreving, ikke ny tildeling.</p>
      ${koeRaderHtml(a.koe.avvik, () => "Brukt utenfor vilkår")}
    </section>

    <section class="panel">
      <h2>B. Penger mot pott</h2>
      <p class="hint">Innstillingssimulering mot øvelsespotten — ikke vedtak. Offentlig tall for ${esc((typeof ordningOvelse === "function" && ordningOvelse()?.navn) || "Inkludering av barn og unge")}: ${esc(typeof formatOffentligBelop === "function" && typeof ordningOvelse === "function" ? formatOffentligBelop(ordningOvelse(), kr) : "ikke oppgitt i kilden")}. Vi later ikke som vi fordeler det beløpet her.</p>
      <p>Søkt totalt ${kr(a.sokt)} mot øvelsespott ${kr(RAMME)}. ${svgStolpe((a.sokt / RAMME) * 100, "#f59e0b")}</p>
      <p>Hvis du kutter all overskytende admin: ${kr(a.etterAdminKutt)} (likebehandling av 15 %-regelen).</p>
      <p>Hvis du tar ut røde formalia og avvik: ${a.utenRodeAntall} saker kan konkurrere, ${kr(a.sumKanKonkurrere)}.</p>
      <h3>De 10 største</h3>
      <table><thead><tr><th>Sak</th><th>Søker</th><th>Søkt</th><th>Andel av pott</th></tr></thead><tbody>
      ${a.storst.map((r) => `<tr><td><a href="${sakLenke(r.sak.id)}">${esc(r.sak.id)}</a></td><td>${esc(r.sak.org)}</td><td>${kr(r.sak.belop)}</td><td>${Math.round((r.sak.belop / RAMME) * 100)} % ${svgStolpe((r.sak.belop / RAMME) * 100)}</td></tr>`).join("")}
      </tbody></table>
    </section>

    <section class="panel">
      <h2>C. Likebehandling</h2>
      <h3>Alle med admin over 15 %</h3>
      <table><thead><tr><th>Sak</th><th>Søker</th><th>Admin</th><th>Kr</th><th>Foreslått kutt</th></tr></thead><tbody>
      ${a.adminOver.map((r) => `<tr><td><a href="${sakLenke(r.sak.id)}">${esc(r.sak.id)}</a></td><td>${esc(r.sak.org)}</td><td>${r.sak.adminPct} %</td><td>${kr(r.sak.adminBelop)}</td><td>${kr(r.kuttAdmin)}</td></tr>`).join("") || `<tr><td colspan="5">Ingen</td></tr>`}
      </tbody></table>
      <h3>Samme aktivitetstype side om side</h3>
      ${Object.keys(a.perAkt).sort().map((k) => {
        const liste = a.perAkt[k];
        return `<details><summary>${esc(k)} · ${liste.length} saker · søkt ${kr(liste.reduce((s, r) => s + r.sak.belop, 0))}</summary>
          <table><thead><tr><th>Sak</th><th>Søker</th><th>Ordning</th><th>Kommune</th><th>Søkt</th><th>Admin</th><th>Flagg</th></tr></thead><tbody>
          ${liste.map((r) => `<tr><td><a href="${sakLenke(r.sak.id)}">${esc(r.sak.id)}</a></td><td>${esc(r.sak.org)}</td><td>${esc(sakOrdning(r.sak).kortnavn || sakOrdningTekst(r.sak))}</td><td>${esc(r.sak.kommune)}</td><td>${kr(r.sak.belop)}</td><td>${r.sak.adminPct} %</td><td>${esc(tagText(r.sak.flag))}</td></tr>`).join("")}
          </tbody></table></details>`;
      }).join("")}
    </section>

    <section class="panel">
      <h2>D. Risiko og formalia</h2>
      <ul>
        <li>Rød søker: ${a.risiko.rodSoker}</li>
        <li>Gul revisor: ${a.risiko.gulRevisor}</li>
        <li>Rød historikk: ${a.risiko.rodHistorikk}</li>
        <li>Avvik: ${a.risiko.avvik}</li>
        <li>Tekstsignal «gratis» nevnt: ${a.risiko.gratisJa} / ${a.antall} (uten LLM)</li>
        <li>Tekstsignal medvirkning nevnt: ${a.risiko.medvirkJa} / ${a.antall} (uten LLM)</li>
      </ul>
    </section>

    <section class="panel">
      <h2>E. Treff og geografi</h2>
      <p class="hint">Støtter «hvem nådde vi». Ikke hovedsaken i dag.</p>
      <h3>Per aktivitet</h3>
      ${Object.entries(a.perAkt).sort((x, y) => y[1].length - x[1].length).map(([k, liste]) => `<div class="chart-row"><span>${esc(k)}</span>${svgStolpe((liste.length / aktMax) * 100)}<em>${liste.length}</em></div>`).join("")}
      <h3>Topp kommuner</h3>
      ${a.toppKommuner.map(([k, n]) => `<div class="chart-row"><span>${esc(k)}</span>${svgStolpe((n / kommMax) * 100, "#0f766e")}<em>${n}</em></div>`).join("")}
    </section>
  `;
}

async function sendPortefoljeSporsmal(ev) {
  if (ev) ev.preventDefault();
  const q = ($("pfQ")?.value || "").trim();
  const out = $("pfSvar");
  if (!q || !out) return;
  out.innerHTML = `<div class="note live-run">Leser uttrekket av ${SAKER.length} saker…</div>`;
  const res = await sporPortefolje(q);
  out.innerHTML = `${res.live ? `<div class="note live-ok">Svar fra modell. Ikke vedtak. <a href="/tilskudd/transparens#${res.traceId}">Åpne spor</a></div>` : `<div class="note live-off"><strong>Ikke modell.</strong> Fallback fra opptelling. <a href="/tilskudd/transparens#${res.traceId}">Åpne spor</a></div>`}
    <div class="think"><p>${lenkSaksnr(res.text)}</p></div>`;
}

let pvTabellFilter = "alle";

function pvKlasse(niva) {
  if (niva === "rod") return { tag: "tag-formalia", tekst: "Rød", ki: "Stopp — sladd først" };
  if (niva === "gul") return { tag: "tag-avkorting", tekst: "Gul", ki: "Sladd som hovedregel" };
  return { tag: "tag-ok", tekst: "Grønn", ki: "Ingen mønsterfunn" };
}

function setPvTabellFilter(niva) {
  pvTabellFilter = niva;
  renderPersonvern();
}

function renderPersonvern() {
  const rot = $("pvRot");
  if (!rot || typeof sjekkHelePortefoljenPersonvern !== "function") return;
  const p = sjekkHelePortefoljenPersonvern(SAKER);
  const rang = { rod: 0, gul: 1, ok: 2 };
  const alle = [...p.rader].sort((a, b) => {
    const d = (rang[a.sjekk.niva] ?? 9) - (rang[b.sjekk.niva] ?? 9);
    return d !== 0 ? d : a.sak.id.localeCompare(b.sak.id, "nb");
  });
  const vist = pvTabellFilter === "alle" ? alle : alle.filter((r) => r.sjekk.niva === pvTabellFilter);
  const chips = [
    ["alle", `Alle ${p.antall}`],
    ["rod", `Rød ${p.rod.length}`],
    ["gul", `Gul ${p.gul.length}`],
    ["ok", `Grønn ${p.ok.length}`]
  ].map(([id, label]) => `<button type="button" class="chip ${pvTabellFilter === id ? "on" : ""}" onclick="setPvTabellFilter('${id}')">${label}</button>`).join("");
  const rader = vist.map((r) => {
    const k = pvKlasse(r.sjekk.niva);
    const funn = r.sjekk.funn.length
      ? r.sjekk.funn.map((f) => esc(f.label)).join(", ")
      : "—";
    return `<tr class="pv-rad-${r.sjekk.niva}">
      <td><a href="/tilskudd/behandle#${r.sak.id}">${esc(r.sak.id)}</a></td>
      <td>${esc(r.sak.org)}</td>
      <td>${esc(sakOrdning(r.sak).kortnavn || sakOrdningTekst(r.sak))}</td>
      <td>${esc(r.sak.kommune)}</td>
      <td><span class="tag ${tagClass(r.sak.flag)}">${esc(tagText(r.sak.flag))}</span></td>
      <td><span class="tag ${k.tag}">${k.tekst}</span></td>
      <td>${funn}</td>
      <td>${esc(k.ki)}</td>
    </tr>`;
  }).join("");
  rot.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><b>${p.antall}</b><span>saker i full tabell</span></div>
      <div class="kpi"><b>${p.rod.length}</b><span>røde — sladd før KI</span></div>
      <div class="kpi"><b>${p.gul.length}</b><span>gule — sladdes som hovedregel</span></div>
      <div class="kpi"><b>${p.ok.length}</b><span>grønne — ingen mønsterfunn</span></div>
    </div>
    <section class="panel">
      <h2>Full klassifisert liste</h2>
      <p class="hint">Alle ${p.antall} saker. Sortert rød → gul → grønn. Klassifiseringen er mønstersøk, ikke vedtak. Klikk saksnummer for sakskortet.</p>
      <div class="chips">${chips}</div>
      <div class="tabell-wrap">
        <table class="pv-tabell">
          <thead>
            <tr>
              <th>Sak</th>
              <th>Søker</th>
              <th>Ordning</th>
              <th>Kommune</th>
              <th>Sakstype</th>
              <th>Personvern</th>
              <th>Funn</th>
              <th>Før KI</th>
            </tr>
          </thead>
          <tbody>${rader || `<tr><td colspan="8">Ingen i dette filteret.</td></tr>`}</tbody>
        </table>
      </div>
      <p class="hint">${vist.length} av ${p.antall} vist.</p>
    </section>
  `;
}

window.renderTransparens = renderTransparens;
window.renderPersonvern = renderPersonvern;
window.setPvTabellFilter = setPvTabellFilter;

let aiActTabellFilter = "alle";

function setAiActTabellFilter(id) {
  aiActTabellFilter = id;
  renderAiAct();
}

function renderAiAct() {
  const rot = $("aiActRot");
  if (!rot || typeof sjekkAiActSystem !== "function") return;
  const system = sjekkAiActSystem();
  const porte = sjekkHelePortefoljenAiAct(SAKER, (sak) => {
    const w = work[sak.id] || {};
    const spor = loadJson(TRACE_KEY, []).some((t) => t.sak === sak.id);
    return { work: w, harSpor: spor };
  });
  const nivaCls = { ok: "check-green", gul: "check-yellow", rod: "check-red" };
  const sjekker = system.map((s) => `<div class="check ${nivaCls[s.niva] || "check-yellow"}"><small>${esc(s.art)} · ${s.niva === "ok" ? "OK i øvelsen" : s.niva === "rod" ? "Ikke oppfylt" : "Begrenset"}</small><strong>${esc(s.tittel)}</strong><br>${esc(s.tekst)}</div>`).join("");
  const alle = [...porte.rader].sort((a, b) => {
    if (a.act.klasse !== b.act.klasse) return a.act.klasse === "hoy-tilsyn" ? -1 : 1;
    return a.sak.id.localeCompare(b.sak.id, "nb");
  });
  const vist = aiActTabellFilter === "alle" ? alle : alle.filter((r) => r.act.klasse === aiActTabellFilter);
  const chips = [
    ["alle", `Alle ${porte.antall}`],
    ["hoy-tilsyn", `Høyt tilsyn ${porte.hoy.length}`],
    ["standard", `Standard ${porte.standard.length}`]
  ].map(([id, label]) => `<button type="button" class="chip ${aiActTabellFilter === id ? "on" : ""}" onclick="setAiActTabellFilter('${id}')">${label}</button>`).join("");
  const rader = vist.map((r) => `<tr class="${r.act.klasse === "hoy-tilsyn" ? "pv-rad-gul" : "pv-rad-ok"}">
    <td><a href="/tilskudd/behandle#${r.sak.id}">${esc(r.sak.id)}</a></td>
    <td>${esc(r.sak.org)}</td>
    <td>${esc(sakOrdning(r.sak).kortnavn || sakOrdningTekst(r.sak))}</td>
    <td><span class="tag ${tagClass(r.sak.flag)}">${esc(tagText(r.sak.flag))}</span></td>
    <td>${esc(r.act.bruk)}</td>
    <td><span class="tag ${r.act.klasse === "hoy-tilsyn" ? "tag-avkorting" : "tag-ok"}">${esc(r.act.klasseTekst)}</span></td>
    <td>${esc(r.act.tilsyn)}</td>
    <td>${r.act.logging ? "Spor" : "—"}</td>
    <td>${r.act.grunner.map((g) => esc(g)).join("; ")}</td>
  </tr>`).join("");
  rot.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><b>${porte.antall}</b><span>saker klassifisert</span></div>
      <div class="kpi"><b>${porte.hoy.length}</b><span>høyt tilsyn i øvelsen</span></div>
      <div class="kpi"><b>${porte.standard.length}</b><span>standard beslutningsstøtte</span></div>
      <div class="kpi"><b>0</b><span>automatiserte vedtak</span></div>
    </div>
    <section class="panel">
      <h2>Systemet mot forordningen</h2>
      <p class="hint">${esc(AIACT_REF)}. Øvelsesvurdering — ikke samsvar, ikke juridisk råd.</p>
      ${sjekker}
    </section>
    <section class="panel">
      <h2>Full klassifisert saksliste</h2>
      <p class="hint">Alle saker er beslutningsstøtte. «Høyt tilsyn» er plantet feil, avvik eller rødt personvern. Ingen rad er et vedtak.</p>
      <div class="chips">${chips}</div>
      <div class="tabell-wrap">
        <table class="pv-tabell">
          <thead>
            <tr>
              <th>Sak</th><th>Søker</th><th>Ordning</th><th>Sakstype</th><th>Bruk</th><th>Klasse</th><th>Tilsyn</th><th>Logg</th><th>Hensyn</th>
            </tr>
          </thead>
          <tbody>${rader}</tbody>
        </table>
      </div>
      <p class="hint">${vist.length} av ${porte.antall} vist.</p>
    </section>
  `;
}

window.renderAiAct = renderAiAct;
window.setAiActTabellFilter = setAiActTabellFilter;

let nis2TabellFilter = "alle";

function setNis2TabellFilter(id) {
  nis2TabellFilter = id;
  renderNis2();
}

function renderNis2() {
  const rot = $("nis2Rot");
  if (!rot || typeof sjekkNis2System !== "function") return;
  const system = sjekkNis2System();
  const porte = sjekkHelePortefoljenNis2(SAKER, (sak) => {
    const w = work[sak.id] || {};
    const spor = loadJson(TRACE_KEY, []).some((t) => t.sak === sak.id);
    return { work: w, harSpor: spor };
  });
  const nivaCls = { ok: "check-green", gul: "check-yellow", rod: "check-red" };
  const sjekker = system.map((s) => `<div class="check ${nivaCls[s.niva] || "check-yellow"}"><small>${esc(s.art)} · ${s.niva === "ok" ? "OK / avklart i øvelsen" : s.niva === "rod" ? "Ikke på plass" : "Tilnærming / gap"}</small><strong>${esc(s.tittel)}</strong><br>${esc(s.tekst)}</div>`).join("");
  const alle = [...porte.rader].sort((a, b) => {
    if (a.nis.klasse !== b.nis.klasse) return a.nis.klasse === "hoy-konsekvens" ? -1 : 1;
    return a.sak.id.localeCompare(b.sak.id, "nb");
  });
  const vist = nis2TabellFilter === "alle" ? alle : alle.filter((r) => r.nis.klasse === nis2TabellFilter);
  const chips = [
    ["alle", `Alle ${porte.antall}`],
    ["hoy-konsekvens", `Høyere konsekvens ${porte.hoy.length}`],
    ["standard", `Standard ${porte.standard.length}`]
  ].map(([id, label]) => `<button type="button" class="chip ${nis2TabellFilter === id ? "on" : ""}" onclick="setNis2TabellFilter('${id}')">${label}</button>`).join("");
  const rader = vist.map((r) => `<tr class="${r.nis.klasse === "hoy-konsekvens" ? "pv-rad-gul" : "pv-rad-ok"}">
    <td><a href="/tilskudd/behandle#${r.sak.id}">${esc(r.sak.id)}</a></td>
    <td>${esc(r.sak.org)}</td>
    <td>${esc(sakOrdning(r.sak).kortnavn || sakOrdningTekst(r.sak))}</td>
    <td><span class="tag ${tagClass(r.sak.flag)}">${esc(tagText(r.sak.flag))}</span></td>
    <td><span class="tag ${r.nis.klasse === "hoy-konsekvens" ? "tag-avkorting" : "tag-ok"}">${esc(r.nis.klasseTekst)}</span></td>
    <td>${r.nis.sendtUt ? "Kan ha gått til OpenAI" : "Ikke sendt ut"}</td>
    <td>Nei — øvelse</td>
    <td>${r.nis.grunner.map((g) => esc(g)).join("; ")}</td>
  </tr>`).join("");
  rot.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><b>${porte.antall}</b><span>saker i tabellen</span></div>
      <div class="kpi"><b>${porte.hoy.length}</b><span>høyere konsekvens ved hendelse</span></div>
      <div class="kpi"><b>${porte.sendt.length}</b><span>med spor mot tredjepart i øvelsen</span></div>
      <div class="kpi"><b>0</b><span>varsler til NSM</span></div>
    </div>
    <section class="panel">
      <h2>Norges tilnærming</h2>
      <p class="hint">${esc(NIS2_REF)}. Kilder i øvelsen: NSM-veileder til digitalsikkerhetsloven (NIS 1 i kraft; NIS 2 under tilnærming).</p>
      ${sjekker}
    </section>
    <section class="panel">
      <h2>Full klassifisert saksliste</h2>
      <p class="hint">Ingen sak er «NIS 2-godkjent». Klassene viser øvelseskonsekvens hvis noe lekker eller KI-leverandøren svikter.</p>
      <div class="chips">${chips}</div>
      <div class="tabell-wrap">
        <table class="pv-tabell">
          <thead>
            <tr>
              <th>Sak</th><th>Søker</th><th>Ordning</th><th>Sakstype</th><th>Konsekvens</th><th>Leverandør</th><th>Varslet NSM</th><th>Hensyn</th>
            </tr>
          </thead>
          <tbody>${rader}</tbody>
        </table>
      </div>
      <p class="hint">${vist.length} av ${porte.antall} vist.</p>
    </section>
  `;
}

window.renderNis2 = renderNis2;
window.setNis2TabellFilter = setNis2TabellFilter;
window.renderAnalyse = renderAnalyse;
window.sendPortefoljeSporsmal = sendPortefoljeSporsmal;
window.sporPortefolje = sporPortefolje;

document.addEventListener("DOMContentLoaded", () => {
  if ($("sporListe")) {
    renderTransparens();
    window.addEventListener("hashchange", renderTransparens);
  }
  if ($("liste")) {
    renderRamme();
    renderList();
    renderJournal();
    renderCard();
    const hash = (location.hash || "").replace("#", "");
    if (hash.startsWith("ordning=")) {
      ordningFilter = hash.slice(8) || "alle";
      renderList();
    } else if (hash && findSak(hash)) openSak(hash);
  }
  if ($("view-klage") && !$("view-klage").hidden) runKlage(false);
  if ($("pOrgnr")) {
    fyllOrdningVelger();
    fillPortalFromRegister();
    renderMine();
  }
  if ($("analyseRot")) renderAnalyse();
  if ($("pvRot")) renderPersonvern();
  if ($("aiActRot")) renderAiAct();
  if ($("nis2Rot")) renderNis2();
  const ant = document.querySelector("[data-antall-saker]");
  if (ant) ant.textContent = `${SAKER.length} saker fordelt på 16 tilskuddsområder. Filtrer på ordning, så åpne.`;
});
