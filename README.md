# Hvordan Fungerer Språkmodeller?

Interaktiv veiledning for forståelse, trygg bruk og datadrevet forvaltning med språkmodeller.

## Lokal kjøring

Åpne `index.html` i nettleseren, eller server mappen statisk:

```bash
npx serve .
```

## Deploy

Appen er en Vercel-side med `index.html` og serverless-ruten `/api/chat`. Prompt Lab og Datalab kaller OpenAI via den ruten. Sett `OPENAI_API_KEY` i `.env.local` (lokal `vercel dev`) og i Vercel-prosjektet. Uten nøkkel vises merkede simulerte eksempler.

## Moduser

- **Enkel forklaring** — pedagogisk gjennomgang av tokens, neste ord og trygg bruk
- **Teknisk dypdykk** — transformer-arkitektur, formler og KV-cache
