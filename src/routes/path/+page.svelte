<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import MilestoneBadge from "$lib/components/MilestoneBadge.svelte";
  let { data } = $props();
</script>

<h1>Career Path</h1>
<p class="lr-muted">{data.careerName}</p>

{#each data.milestones as m}
  <Card title={`Milestone ${m.order} — ${m.title}`}>
    <MilestoneBadge state={m.state} />
    {#if m.state === "in-progress"}<p><a href="/lesson">Continue learning</a></p>{/if}
  </Card>
{/each}
