# Hvordan Fungerer Språkmodeller?

Pedagogisk kursopplegg om språkmodeller og tilskuddsøvelse. **Ikke et Bufdir-verktøy.** Forskrift, policy, presedens og saker er oppdiktet. Siden er ikke beslutningsstøtte og fatter ikke vedtak. Sist oppdatert 27. august 2026.

[om.html](om.html) er personlig manus til gjennomgang: én tekstblokk per foil (si-høyt, faglig, teknisk). Samme blokk vises øverst på hver side. Det er ikke kursinnhold.

## Lokal kjøring

Åpne `index.html` i nettleseren, eller server mappen statisk:

```bash
npx serve .
```

## Deploy

Appen er en Vercel-side med `index.html`, `/api/chat` (Prompt Lab / Datalab) og `/api/graph` (tilskudd: LangGraph med RAG → utkast → sjekk). Sett `OPENAI_API_KEY` i `.env.local` (`vercel dev`) og i Vercel-prosjektet. Uten nøkkel kjører grafen likevel med merkede øvelsesutkast og samme validator. Lokal kjøring av grafen krever `npm install` og `vercel dev`.

## Moduser

- **Enkel forklaring** — pedagogisk gjennomgang
- **Teknisk dypdykk** — transformer-arkitektur, formler og KV-cache

## Sider

Hvert punkt er en egen side. Start på `index.html`. Deretter `om.html`, `kapittel-1.html` … `kapittel-12.html` og `teknisk.html`. Forrige/Neste og piltaster hopper mellom sidene.

- **Del 1** — tokens, temperatur, ikke-determinisme, teknisk dypdykk
- **Del 2** — Prompt Lab, trygg bruk, trafikklys og plikter
- **Del 3** — kildeforankret KI og fiktiv datalab
- **Del 4** — tilskuddsløp, cockpit, «slik er løsningen bygget», personlig agent
- **Del 5** — forslag: lese, foreslå og forarbeid
