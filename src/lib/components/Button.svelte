<script lang="ts">
  interface Props {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "md" | "sm";
    href?: string;
    type?: "button" | "submit";
    onclick?: (e: MouseEvent) => void;
    children: import("svelte").Snippet;
  }
  let { variant = "primary", size = "md", href, type = "button", onclick, children }: Props = $props();
  const cls = $derived(`lr-btn lr-btn-${variant}${size === "sm" ? " lr-btn-sm" : ""}`);
</script>

{#if href}
  <a class={cls} {href} {onclick}>{@render children()}</a>
{:else}
  <button class={cls} {type} {onclick}>{@render children()}</button>
{/if}
