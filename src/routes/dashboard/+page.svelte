<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import EvidenceCard from "$lib/components/EvidenceCard.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import { authClient } from "$lib/auth-client";
  let { data } = $props();

  async function signOut() {
    await authClient.signOut();
    goto("/");
  }
</script>

<h1>Dashboard</h1>

<Card title="Next action">
  <div class="lr-highlight" style="padding-left:var(--space-3)">
    {#if data.next}
      <p><strong>Continue: {data.next.title}</strong></p>
      <Button href="/lesson" size="sm">Start now</Button>
    {:else}
      <p class="lr-muted">Roadmap complete — new milestones unlock in Phase 7.</p>
    {/if}
  </div>
</Card>

<div class="lr-grid-2">
  <Card title={data.careerName}>
    <p class="lr-muted">{data.level}</p>
    <ProgressBar value={data.pct} label={`Path progress ${data.pct} percent`} />
  </Card>
  <Card title="Upcoming assessment">
    {#if data.upcomingTask}
      <p class="lr-muted">{data.upcomingTask}</p>
      <Button href="/assessment" variant="secondary" size="sm">Preview rubric</Button>
    {:else}
      <p class="lr-muted">No assessment on the current milestone yet.</p>
    {/if}
  </Card>
</div>

<Card title="Evidence snapshot">
  {#if data.evidence.length === 0}
    <EmptyState title="No evidence yet" hint="Complete a practical task and save it as evidence." />
  {:else}
    {#each data.evidence as e}<div style="margin-bottom:0.5rem"><EvidenceCard {...e} /></div>{/each}
  {/if}
  <p><a href="/portfolio">Open full portfolio</a> · <a href="/coach">Ask the coach</a></p>
</Card>

<p><Button variant="ghost" size="sm" type="button" onclick={signOut}>Sign out</Button></p>
