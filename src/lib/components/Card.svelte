<script lang="ts">
  interface Props {
    title?: string;
    children: import("svelte").Snippet;
  }
  let { title, children }: Props = $props();
</script>

<section class="lr-card">
  {#if title}<h2 class="lr-card-title">{title}</h2>{/if}
  {@render children()}
</section>
