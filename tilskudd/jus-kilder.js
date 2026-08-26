/** Kontrollert kunnskapsgrunnlag for jusmodulen. type: lov | veileder | fiktiv | kurs */
const JUS_KILDER = [
  {
    id: "FVL-2",
    type: "lov",
    tittel: "Forvaltningsloven § 2 — vedtak",
    kilde: "Lov 10. februar 1967 om behandlingsmåten i forvaltningssaker (forvaltningsloven)",
    tekst: "Vedtak er en avgjørelse som treffes under utøving av offentlig myndighet og som generelt eller konkret er bestemmende for rettigheter eller plikter til private personer. Enkeltvedtak er et vedtak som gjelder rettigheter eller plikter til en eller flere bestemte personer. Et KI-utkast i denne øvelsen er ikke et vedtak."
  },
  {
    id: "FVL-17",
    type: "lov",
    tittel: "Forvaltningsloven § 17 — utredningsplikt",
    kilde: "Lov 10. februar 1967 om behandlingsmåten i forvaltningssaker (forvaltningsloven)",
    tekst: "Forvaltningsorganet skal påse at saken er så godt opplyst som mulig før vedtak treffes. KI-genererte påstander må verifiseres. Utredningsplikten ligger hos organet og saksbehandleren, ikke hos modellen."
  },
  {
    id: "FVL-18",
    type: "lov",
    tittel: "Forvaltningsloven § 18 — partsinnsyn",
    kilde: "Lov 10. februar 1967 om behandlingsmåten i forvaltningssaker (forvaltningsloven)",
    tekst: "En part har rett til å gjøre seg kjent med sakens dokumenter. Notater, analyser og utkast produsert med KI-støtte kan inngå i saken. Unntak finnes for interne dokumenter og visse opplysninger; det må vurderes konkret."
  },
  {
    id: "FVL-24",
    type: "lov",
    tittel: "Forvaltningsloven §§ 24–25 — begrunnelse",
    kilde: "Lov 10. februar 1967 om behandlingsmåten i forvaltningssaker (forvaltningsloven)",
    tekst: "Enkeltvedtak skal som hovedregel begrunnes. Begrunnelsen skal vise til de regler og de faktiske forhold vedtaket bygger på, og de hovedhensyn som har vært avgjørende. Et KI-utkast kan være forarbeid til begrunnelsen, men erstatter den ikke."
  },
  {
    id: "OFFL-3",
    type: "lov",
    tittel: "Offentleglova § 3 — hovedregel om innsyn",
    kilde: "Lov 19. mai 2006 nr. 16 om rett til innsyn i dokument i offentleg verksemd (offentleglova)",
    tekst: "Saksdokument, journalar og liknande register for organet er opne for innsyn dersom ikkje anna følgjer av lov eller forskrift. Alle kan krevje innsyn hos vedkommande organ. Bruk av KI skal ikkje stå i vegen for innsyn. Taushetsbelagde opplysningar er unnatekne, jf. § 13."
  },
  {
    id: "ARK-6",
    type: "lov",
    tittel: "Arkivlova § 6 — plikt til å ha arkiv",
    kilde: "Lov 4. desember 1992 nr. 126 om arkiv (arkivlova)",
    tekst: "Offentlege organ pliktar å ha arkiv, og desse skal vera ordna og innretta slik at dokumenta er tryggja som informasjonskjelder for samtid og ettertid. Dokument omgrep i arkivlova samsvarar med forvaltningslova og offentleglova. Relevante KI-utkast og spor som inngår i saksbehandlinga skal kunne journalførast."
  },
  {
    id: "GDPR-5",
    type: "lov",
    tittel: "Personvernforordningen art. 5 — prinsipper",
    kilde: "Forordning (EU) 2016/679 (personvernforordningen / GDPR), gjennomført i personopplysningsloven 15. juni 2018 nr. 38",
    tekst: "Personopplysninger skal behandles lovlig, rettferdig og åpent; samles inn for uttrykkelige, uttrykte formål; være relevante og begrenset til det nødvendige (dataminimering); være korrekte; lagres ikke lenger enn nødvendig; og sikres med integritet og konfidensialitet. Behandlingsansvarlig er ansvarlig for etterlevelse."
  },
  {
    id: "GDPR-6",
    type: "lov",
    tittel: "Personvernforordningen art. 6 — behandlingsgrunnlag",
    kilde: "Forordning (EU) 2016/679 (personvernforordningen / GDPR)",
    tekst: "Behandling er bare lovlig dersom minst ett vilkår er oppfylt, typisk samtykke, avtale, rettslig forpliktelse, vitale interesser, allmennhetens interesse / offentlig myndighetsutøvelse, eller berettiget interesse. Offentlig tilskuddsbehandling bygger vanligvis på rettslig grunnlag, ikke på at søker «godtar KI» i et skjema."
  },
  {
    id: "GDPR-9",
    type: "lov",
    tittel: "Personvernforordningen art. 9 — særlige kategorier",
    kilde: "Forordning (EU) 2016/679 (personvernforordningen / GDPR)",
    tekst: "Behandling av særlige kategorier — blant annet helse, etnisk opprinnelse, politisk oppfatning, religion — er som hovedregel forbudt, med snevre unntak. I søknadstekst kan slike opplysninger dukke opp. De skal ikke sendes urørt til en åpen modell."
  },
  {
    id: "GDPR-22",
    type: "lov",
    tittel: "Personvernforordningen art. 22 — automatiserte avgjørelser",
    kilde: "Forordning (EU) 2016/679 (personvernforordningen / GDPR)",
    tekst: "Den registrerte skal ha rett til ikke å være gjenstand for en avgjørelse som utelukkende er basert på automatisert behandling, herunder profilering, som har rettsvirkning eller på tilsvarende måte i betydelig grad påvirker vedkommende. Unntak krever blant annet særskilt grunnlag og egnede tiltak, herunder menneskelig inngripen. Denne prototypen er beslutningsstøtte med menneske i loopen — ikke en automatisert avgjørelse."
  },
  {
    id: "GDPR-35",
    type: "lov",
    tittel: "Personvernforordningen art. 35 — DPIA",
    kilde: "Forordning (EU) 2016/679 (personvernforordningen / GDPR)",
    tekst: "Der en type behandling, særlig ved bruk av ny teknologi, sannsynligvis vil medføre høy risiko for fysiske personers rettigheter og friheter, skal behandlingsansvarlig foreta en vurdering av personvernkonsekvenser (DPIA) før behandlingen. KI mot søknader med personopplysninger treffer ofte dette. DPIA er personvern; FRIA etter KI-forordningen er et annet, men beslektet krav."
  },
  {
    id: "AIA-RISIKO",
    type: "lov",
    tittel: "KI-forordningen — risikoklasser (overskriftsnivå)",
    kilde: "Forordning (EU) 2024/1689 om kunstig intelligens (KI-forordningen)",
    tekst: "Forordningen skiller forbudt praksis, høyrisiko-systemer, begrenset transparens og minimal risiko. Høyrisiko omfatter blant annet visse systemer brukt av offentlige myndigheter til å vurdere adgang til offentlige ytelser og tjenester (vedlegg III). Denne øvelsen er intern beslutningsstøtte med syntetiske data — ikke et klassifisert produksjonssystem. Skarp bruk mot reelle tilskuddssøknader kan nærme seg høyrisiko og må vurderes konkret."
  },
  {
    id: "AIA-14",
    type: "lov",
    tittel: "KI-forordningen art. 14 — menneskelig tilsyn",
    kilde: "Forordning (EU) 2024/1689 om kunstig intelligens (KI-forordningen)",
    tekst: "Høyrisiko KI-systemer skal utformes og brukes slik at de kan overvåkes effektivt av fysiske personer. Tilsynet skal kunne forstå risiko, tolke utdata og stanse eller overstyre systemet. «Menneske i loopen» i prototypen er en øvelse i dette prinsippet — ikke dokumentasjon på at art. 14 er oppfylt i drift."
  },
  {
    id: "AIA-27",
    type: "lov",
    tittel: "KI-forordningen art. 27 — FRIA",
    kilde: "Forordning (EU) 2024/1689 om kunstig intelligens (KI-forordningen)",
    tekst: "Offentligrettslige organer og visse private som yter offentlige tjenester, skal som idriftsettere av høyrisiko KI-systemer gjennomføre en vurdering av konsekvenser for grunnleggende rettigheter (FRIA) før ibruktaking. Vurderingen dekker prosess, varighet, berørte grupper, risiko, menneskelig tilsyn og tiltak. En eksisterende DPIA kan brukes som grunnlag; de to er ikke det samme. Øvelsen har ingen FRIA — det kreves før skarp drift hvis bruken er høyrisiko."
  },
  {
    id: "DFD-NIVA",
    type: "veileder",
    tittel: "DFD-veilederen — assistentnivå 1–3",
    kilde: "Digitaliserings- og forvaltningsdepartementet / ekspertgruppen, juni 2025: «KI-assistenter i arbeidslivet»",
    tekst: "Nivå 1: åpen offentlig chat uten interne kilder. Nivå 2: assistent inne i eksisterende verktøy med begrenset kontekst. Nivå 3: tilpasset assistent med egne datakilder (for eksempel RAG). Veilederen anbefaler ofte å starte lavere. Dette forslaget er nivå 3b i øvelse. Skille assistent (svarer, skriver utkast, utfører ikke) fra agent (utfører handlinger). Forslaget er assistent."
  },
  {
    id: "DFD-RISIKO",
    type: "veileder",
    tittel: "DFD-veilederen — dataklasse, DPIA/FRIA, logging",
    kilde: "Digitaliserings- og forvaltningsdepartementet / ekspertgruppen, juni 2025: «KI-assistenter i arbeidslivet»",
    tekst: "Hensikt, organisasjon og juss kommer før teknikk. Personopplysninger i intern saksbehandling (ofte klasse D i veilederens språk) hever kravene: nivå 3, DPIA, ev. FRIA ved skarp offentlig høyrisiko-bruk, databehandleravtale, logging og kompetanse. Syntetiske data i øvelsen erstatter ikke dette."
  },
  {
    id: "DFD-TILLIT",
    type: "veileder",
    tittel: "DFD-veilederen — tillitsvalgte og kompetanse",
    kilde: "Digitaliserings- og forvaltningsdepartementet / ekspertgruppen, juni 2025: «KI-assistenter i arbeidslivet»",
    tekst: "Innføring av KI i arbeidet skal forankres. Tillitsvalgte inngår via arbeidsmiljøloven og, i staten, Hovedavtalen om IKT og KI. Rollebasert opplæring og kompetanseplikt gjelder. Dette er ikke et rent IT-prosjekt. Linjeier, tillitsvalgt, personvern/jurist, superbruker og saksbehandler må være med."
  },
  {
    id: "KURS-HITL",
    type: "kurs",
    tittel: "Kurs kapittel 5 — menneske i loopen",
    kilde: "Kurset «Hvordan fungerer språkmodeller?», kapittel 5 (NAV-inspirerte regler, pedagogisk)",
    tekst: "Du har alltid det faglige og juridiske ansvaret for sluttresultatet. Sjekk fakta, referanser, tall og lovhenvisninger før bruk. Bruk KI som assistent, aldri som uavhengig beslutningstaker. Ikke lim inn fødselsnummer, taushetsbelagt eller helse i åpne verktøy. Vær åpen om KI-støtte der det er relevant."
  },
  {
    id: "KURS-LYS",
    type: "kurs",
    tittel: "Kurs kapittel 6 — trafikklys",
    kilde: "Kurset «Hvordan fungerer språkmodeller?», kapittel 6",
    tekst: "Grønt: åpne, ikke-identifiserende opplysninger. Gult: personopplysninger som kan sladdes (navn, e-post, telefon, adresse). Rødt: fødselsnummer, helse, navngitte barn, taushetsbelagt — skal ikke gå urørt til KI. I prototypen stopper rødt automatisk KI-kall."
  },
  {
    id: "KURS-PLIKT",
    type: "kurs",
    tittel: "Kurs kapittel 6 — innsyn, utredning, arkiv",
    kilde: "Kurset «Hvordan fungerer språkmodeller?», kapittel 6",
    tekst: "Offentlige virksomheter har plikter etter forvaltningsloven, offentleglova, arkivlova og KI-forordningen. KI-støttet materiale kan være omfattet av innsyn. Utredningsplikt: saken skal være godt opplyst; KI-påstander må sjekkes. Helautomatisk saksbehandling krever særskilt hjemmel. Arkiv: sporbarhet for modell, kilder og instruks som inngår i saken."
  },
  {
    id: "OEV-ADMIN",
    type: "fiktiv",
    tittel: "Øvelsesregel 2026 — administrasjon 15 %",
    kilde: "Fiktiv øvelsesregel i tilskuddsprototypen (ikke forskrift, ikke Bufdir)",
    tekst: "Prosjektledelse og generell administrasjon skal som hovedregel ikke overstige 15 % av søknadssummen. Overskytende kan foreslås avkortet. Avkorting er forslag, ikke vedtak. Dette er fiktiv øvelse for 2026."
  },
  {
    id: "OEV-SOKER",
    type: "fiktiv",
    tittel: "Øvelsesregel 2026 — hvem kan søke",
    kilde: "Fiktiv øvelsesregel i tilskuddsprototypen (ikke forskrift, ikke Bufdir)",
    tekst: "Søker skal stå i Enhetsregisteret. For denne aktivitetstypen skal virksomheten også stå i Frivillighetsregisteret, med mindre søker er kommune. Kommersielt aksjeselskap uten frivillig formål kan ikke søke. Registeret i prototypen er en tabell, ikke et live register. Fiktiv øvelse."
  },
  {
    id: "OEV-REV",
    type: "fiktiv",
    tittel: "Øvelsesregel 2026 — revisor 200 000 kr",
    kilde: "Fiktiv øvelsesregel i tilskuddsprototypen (ikke forskrift, ikke Bufdir)",
    tekst: "Søknader over 200 000 kroner skal ha revisorattest. Mangler attest, skal saken flagges — ikke automatisk avslås. Beløpsgrensen er øvelse 2026."
  },
  {
    id: "OEV-5",
    type: "fiktiv",
    tittel: "Simulert forskrift § 5 — ramme (fiktiv)",
    kilde: "Fiktiv øvelsesbestemmelse i kapittel 9 / prototypen. «§ 5» er oppdiktet.",
    tekst: "Når samlet søknad overstiger bevilgningen, kan avslag begrunnes etter samlet prioritering, jf. simulert forskrift § 5. Paragrafen er fiktiv øvelse. Den plantede feilen i prototypen er at KI henter § 14 om golf/anlegg i stedet for jobbtilbud 4.2."
  },
  {
    id: "OEV-PV",
    type: "fiktiv",
    tittel: "Øvelsesregel 2026 — personopplysninger i søknadstekst",
    kilde: "Fiktiv øvelsesregel i personvernmodulen (ikke hjemmelsvurdering)",
    tekst: "Fødselsnummer, helse og navngitte barn skal sladdes før teksten går til KI. E-post, telefon og adresse sladdes som hovedregel. Modulen er mønstersøk — ikke et vedtak om at behandlingen er lovlig, og ikke en erstatning for DPIA."
  }
];

const JUS_TYPELABEL = { lov: "Lov", veileder: "Veileder", fiktiv: "Fiktiv øvelse", kurs: "Kurs" };
