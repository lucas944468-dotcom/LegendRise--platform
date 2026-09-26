<script lang="ts">
  export interface ChatMessage {
    role: "ai" | "user";
    text: string;
  }
  interface Props {
    messages: ChatMessage[];
    label?: string;
  }
  let { messages, label = "Conversation" }: Props = $props();
</script>

<div class="lr-chat" aria-label={label}>
  {#each messages as m}
    <div class={`lr-bubble lr-bubble-${m.role === "ai" ? "ai" : "user"}`}>{m.text}</div>
  {/each}
</div>
