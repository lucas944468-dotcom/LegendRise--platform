// Minimal OpenAI chat client (Phase 6). No SDK — plain fetch, server-only.
// Returns null whenever OPENAI_API_KEY is absent OR the call fails, so every
// service falls back to its deterministic v0 (never a fake "AI" answer).
export interface ChatMsg {
  role: "system" | "user" | "assistant";
  content: string;
}

function key(): string | null {
  return process.env.OPENAI_API_KEY || null;
}

async function post(messages: ChatMsg[], maxTokens: number, json: boolean): Promise<string | null> {
  const k = key();
  if (!k) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function chatJson<T>(messages: ChatMsg[], maxTokens = 800): Promise<T | null> {
  const raw = await post(messages, maxTokens, true);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function chatText(messages: ChatMsg[], maxTokens = 500): Promise<string | null> {
  return post(messages, maxTokens, false);
}

export function aiConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
