# Hvordan Fungerer Språkmodeller?

Pedagogisk kursopplegg om språkmodeller og tilskuddsøvelse. **Ikke et Bufdir-verktøy.** Forskrift, policy, presedens og saker er oppdiktet. Siden er ikke beslutningsstøtte og fatter ikke vedtak. Sist oppdatert 23. august 2026.

## Lokal kjøring

Åpne `index.html` i nettleseren, eller server mappen statisk:

```bash
npx serve .
```

## Deploy

Appen er en Vercel-side med `index.html` og serverless-ruten `/api/chat`. Prompt Lab og Datalab kaller OpenAI via den ruten. Sett `OPENAI_API_KEY` i `.env.local` (lokal `vercel dev`) og i Vercel-prosjektet. Uten nøkkel vises merkede simulerte eksempler.

## Moduser

- **Enkel forklaring** — pedagogisk gjennomgang
- **Teknisk dypdykk** — transformer-arkitektur, formler og KV-cache

## Sider

Hvert punkt er en egen side. Start på `index.html`. Deretter `kapittel-1.html` … `kapittel-11.html` og `teknisk.html`. Forrige/Neste og piltaster hopper mellom sidene.

- **Del 1** — tokens, temperatur, ikke-determinisme, teknisk dypdykk
- **Del 2** — Prompt Lab, trygg bruk, trafikklys og plikter
- **Del 3** — kildeforankret KI og fiktiv datalab
- **Del 4** — tilskuddsløp, agent, avslutning
