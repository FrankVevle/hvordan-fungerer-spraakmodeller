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

## Innhold

- **Del 1** — tokens, neste ord, temperatur og at samme prompt gir ulike svar
- **Del 2** — trygg bruk, trafikklys, innsyn/arkiv og skillet beslutningsstøtte vs. automatisert vedtak
- **Del 3** — kildeforankret KI (hva det ikke løser) og en fiktiv datalab (ikke beslutningsstøtte)
- **Del 4** — syntetisk tilskuddsløp (kap. 9), skrivebord med plantet feilgrep (kap. 10), avslutning (kap. 11)

I kapittel 9 kan du journalføre handlinger, vise tre ulike brev for samme sak, og svare på et innsynskrav.
