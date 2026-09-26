<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import ChatThread, { type ChatMessage } from "$lib/components/ChatThread.svelte";
  import Field from "$lib/components/Field.svelte";
  import { mockCoach } from "$lib/mock";

  let messages: ChatMessage[] = $state([...mockCoach]);
  let draft = $state("");

  function ask() {
    const q = draft.trim();
    if (!q) return;
    messages = [
      ...messages,
      { role: "user", text: q },
      { role: "ai", text: "Good question. In the built product I answer only from your current lesson and approved materials — with sources and uncertainty shown. (Prototype reply.)" },
    ];
    draft = "";
  }
</script>

<h1>AI Coach</h1>

<Card title="Contextual support">
  <ChatThread {messages} label="Coach conversation" />
  <form onsubmit={(e) => { e.preventDefault(); ask(); }} style="margin-top:1rem">
    <Field label="Ask about your current lesson" name="q">
      <input id="q" name="q" bind:value={draft} placeholder="e.g. What makes a status update scannable?" />
    </Field>
    <Button type="submit">Ask</Button>
  </form>
</Card>
