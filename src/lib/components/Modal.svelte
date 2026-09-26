<script lang="ts">
  import { onMount } from "svelte";
  interface Props {
    title: string;
    onClose: () => void;
    children: import("svelte").Snippet;
  }
  let { title, onClose, children }: Props = $props();
  let dialog: HTMLElement | undefined = $state();

  onMount(() => {
    dialog?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
</script>

<div class="lr-modal-backdrop" role="presentation" onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
  <div class="lr-modal" role="dialog" aria-modal="true" aria-label={title} tabindex="-1" bind:this={dialog}>
    <h2 class="lr-card-title">{title}</h2>
    {@render children()}
  </div>
</div>
