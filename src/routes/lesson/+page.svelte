<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  let { data } = $props();
</script>

{#if !data.lesson}
  <EmptyState title="No published lesson yet" hint="An admin publishes the first lesson in /admin (Phase 8)." />
{:else}
  <h1>{data.lesson.title}</h1>
  <Card title="Lesson">
    <p>{data.lesson.text}</p>
    {#if data.lesson.mediaUrl}<p class="lr-muted">Media: {data.lesson.mediaUrl}</p>{/if}
  </Card>
  {#if data.lesson.resources.length > 0}
    <Card title="Resources">
      <ul>{#each data.lesson.resources as r}<li>{r}</li>{/each}</ul>
    </Card>
  {/if}
  <form method="post" action="?/complete" style="display:flex;gap:0.75rem;flex-wrap:wrap">
    <Button type="submit">Mark complete & continue to practice</Button>
    <Button href="/coach" variant="secondary">Ask the tutor</Button>
  </form>
{/if}
