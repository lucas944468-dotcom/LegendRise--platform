<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import EvidenceCard from "$lib/components/EvidenceCard.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import { mockEvidence } from "$lib/mock";
</script>

<h1>Portfolio</h1>
<p class="lr-muted">Evidence first: every item traces back to source work and rubric scores.</p>

{#if mockEvidence.length === 0}
  <EmptyState title="No evidence yet" hint="Complete a practical task and save it as evidence." />
{:else}
  <Card title="Evidence record">
    <div class="lr-stack">
      {#each mockEvidence as e}<EvidenceCard {...e} />{/each}
    </div>
  </Card>
{/if}
