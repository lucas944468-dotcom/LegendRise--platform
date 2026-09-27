<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import ChatThread, { type ChatMessage } from "$lib/components/ChatThread.svelte";
  import Field from "$lib/components/Field.svelte";

  let messages: ChatMessage[] = $state([
    { role: "ai", text: "I am your LegendRise coach. I answer from your current lesson and approved materials. What are you stuck on?" },
  ]);
  let draft = $state("");
  let busy = $state(false);

  async function ask(e: Event) {
    e.preventDefault();
    const q = draft.trim();
    if (!q || busy) return;
    draft = "";
    busy = true;
    messages = [...messages, { role: "user", text: q }];
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const out = (await res.json()) as { answer?: string; uncertain?: boolean; error?: string };
      messages = [
        ...messages,
        {
          role: "ai",
          text: out.error ? `Error: ${out.error}` : `${out.answer ?? ""}${out.uncertain ? " (uncertain — verify against the lesson)" : ""}`,
        },
      ];
    } catch {
      messages = [...messages, { role: "ai", text: "The coach is unreachable right now. Try again." }];
    } finally {
      busy = false;
    }
  }
</script>

<h1>AI Coach</h1>

<Card title="Contextual support">
  <ChatThread {messages} label="Coach conversation" />
  <form onsubmit={ask} style="margin-top:1rem">
    <Field label="Ask about your current lesson" name="q">
      <input id="q" name="q" bind:value={draft} placeholder="e.g. What makes a status update scannable?" />
    </Field>
    <Button type="submit">{busy ? "Thinking…" : "Ask"}</Button>
  </form>
</Card>
