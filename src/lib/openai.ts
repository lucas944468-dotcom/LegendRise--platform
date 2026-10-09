// Minimal AI chat client (Phase 6). No SDK — plain fetch, server-only.
// Supports Groq (OpenAI-compatible) FIRST, then OpenAI as fallback.
// Returns null whenever no key is set OR the call fails, so every
// service falls back to its deterministic v0 (never a fake "AI" answer).
export interface ChatMsg {
  role: "system" | "user" | "assistant";
  content: string;
}

interface Provider {
  name: "groq" | "openai";
  url: string;
  key: string;
  model: string;
}

function provider(): Provider | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return {
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    };
  }
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return {
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    };
  }
  return null;
}

async function post(messages: ChatMsg[], maxTokens: number, json: boolean): Promise<string | null> {
  const p = provider();
  if (!p) return null;
  try {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: p.model,
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) {
      console.warn(`[ai] ${p.name} call failed: ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.warn(`[ai] ${p.name} call error, using v0 fallback`, err);
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
  return provider() !== null;
}

export function aiProvider(): string {
  return provider()?.name ?? "none (v0 fallbacks)";
}
