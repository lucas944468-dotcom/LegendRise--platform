<script lang="ts">
  import MilestoneBadge from "./MilestoneBadge.svelte";
  interface Props {
    title: string;
    type: string;
    source?: string;
    status: "completed" | "in-progress" | "needs-attention" | "evidence";
  }
  let { title, type, source, status }: Props = $props();
</script>

<article class="lr-evidence">
  <div>
    <strong>{title}</strong>
    <div class="lr-muted">{type}{source ? ` · Source: ${source}` : ""}</div>
  </div>
  <span style="margin-left: auto"><MilestoneBadge state={status} /></span>
</article>
