import { runGrantGraph } from "../lib/grant-graph.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
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

  try {
    const result = await runGrantGraph({
      task: body?.task || "sak",
      sak: body?.sak || {},
      soknad: body?.soknad
    });
    res.status(200).json(result);
  } catch (e) {
    const code = e?.message === "invalid_prompt" ? 400 : 502;
    res.status(code).json({
      error: e?.message || "graph_error",
      simulation: true
    });
  }
}
