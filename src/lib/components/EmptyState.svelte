<script lang="ts">
  interface Props {
    title: string;
    hint?: string;
  }
  let { title, hint }: Props = $props();
</script>

<div class="lr-card" style="text-align: center">
  <h2 class="lr-card-title">{title}</h2>
  {#if hint}<p class="lr-muted">{hint}</p>{/if}
</div>
