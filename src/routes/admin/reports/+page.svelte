<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  let { data } = $props();
</script>

<h1>Support reports</h1>
{#if data.reports.length === 0}
  <EmptyState title="Queue empty" hint="User reports from /support land here." />
{:else}
  {#each data.reports as r}
    <Card title={`${r.kind} — ${r.status}`}>
      <p>{r.message}</p>
      {#if r.context}<p class="lr-muted">Context: {r.context}</p>{/if}
      {#if r.status === "OPEN"}
        <form method="post" action="?/resolve"><input type="hidden" name="id" value={r.id} /><Button type="submit" size="sm">Mark resolved</Button></form>
      {/if}
    </Card>
  {/each}
{/if}
