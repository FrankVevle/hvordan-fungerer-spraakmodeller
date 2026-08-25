# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Static, dependency-free educational website (Norwegian) about language models, plus a
client-side "Tilskudd" grant-caseworker prototype under `tilskudd/`. Pages are plain
`*.html` + `*.js` served as static files. There is no `package.json`, no build step, no
linter, and no automated test suite. See `README.md` for the page map.

The only server-side code is the Vercel serverless route `api/chat.js` (`/api/chat`),
which proxies OpenAI. It is optional: the frontend catches any failure and falls back to
clearly-labeled simulated content, so the whole site is fully usable as pure static files.

### Running it (development)
The update script pre-warms the `serve` CLI cache. Start the dev server from the repo root:

```bash
npx serve . -l 3000
```

`serve` honors extensionless clean URLs (e.g. `/tilskudd/behandle`, `/kapittel-1`), which
matches `vercel.json` `cleanUrls: true`, so links resolve the same as in production.

- Do NOT open raw `file://` HTML — clean-URL links and absolute paths (`/tilskudd/...`)
  only resolve when served over HTTP from the repo root.
- Core caseworker flow to smoke-test: open `/tilskudd/behandle`, open a case, click an
  action (e.g. `Bekreft forslag`). It runs entirely client-side; no key needed.

### The `/api/chat` route (live OpenAI)
`npx serve` does NOT execute `api/chat.js` — requests to `/api/chat` 404 and the client
silently uses simulation. To exercise the real serverless function locally use
`vercel dev` (Vercel CLI), which requires a Vercel login/token AND `OPENAI_API_KEY`
(and optional `OPENAI_MODEL`, default `gpt-4o-mini`) in `.env.local`. Neither is required
to develop or demo the site.
