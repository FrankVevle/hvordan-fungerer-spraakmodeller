export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "missing_key", simulation: true });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "invalid_json" });
      return;
    }
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const system = typeof body?.system === "string" ? body.system.trim() : "";
  if (!prompt || prompt.length > 80000) {
    res.status(400).json({ error: "invalid_prompt" });
    return;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const messages = [];
  if (system) messages.push({ role: "system", content: system.slice(0, 24000) });
  messages.push({ role: "user", content: prompt });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages,
      }),
    });

    if (!response.ok) {
      res.status(502).json({ error: "openai_error", simulation: true });
      return;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    if (!text) {
      res.status(502).json({ error: "empty_response", simulation: true });
      return;
    }

    res.status(200).json({ text, model });
  } catch {
    res.status(502).json({ error: "network_error", simulation: true });
  }
}
