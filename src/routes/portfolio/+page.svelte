<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import EvidenceCard from "$lib/components/EvidenceCard.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  let { data } = $props();
</script>

<h1>Portfolio</h1>
<p class="lr-muted">Evidence first: every item traces back to source work and rubric scores.</p>

{#if data.items.length === 0}
  <EmptyState title="No evidence yet" hint="Complete a practical task, score Demonstrated, and it lands here automatically." />
{:else}
  <Card title="Evidence record">
    <div class="lr-stack">
      {#each data.items as e}<EvidenceCard {...e} />{/each}
    </div>
  </Card>
{/if}
