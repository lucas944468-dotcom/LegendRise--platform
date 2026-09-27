<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  let { data } = $props();
</script>

<h1>Practice</h1>

{#if !data.brief}
  <EmptyState title="No practice task yet" hint="Publish an assessment for your current milestone first." />
{:else}
  <Card title="Brief"><p>{data.brief}</p></Card>
  <Card title="Your work">
    <form method="post" action="?/submit">
      <input type="hidden" name="assessmentId" value={data.assessmentId} />
      <Field label="Draft" name="draft"><textarea id="draft" name="draft" rows="6" required></textarea></Field>
      <Button type="submit">Submit work</Button>
    </form>
    <p class="lr-muted">Submitting stores a versioned draft; scoring happens on the assessment page.</p>
  </Card>
{/if}
