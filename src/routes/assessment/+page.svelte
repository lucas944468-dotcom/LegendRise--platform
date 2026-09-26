<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import RubricTable from "$lib/components/RubricTable.svelte";
  import { mockRubric } from "$lib/mock";
  let saved = $state(false);
</script>

<h1>Assessment — Status-update writing</h1>

<Card title="Task"><p>Submit the status-update draft from Practice 3.1. It is scored against the rubric below — every score links to observable criteria.</p></Card>

<Card title="Rubric & scores">
  <RubricTable rows={mockRubric} caption="Status-update rubric with sample scores" />
  <p class="lr-muted">Feedback: clarity and tone are demonstrated; completeness needs one more element (the risk mitigation). Revise and resubmit to improve.</p>
</Card>

<Card title="Evidence">
  {#if saved}
    <p role="status"><strong>Saved to portfolio</strong> as capability evidence. <a href="/portfolio">View portfolio</a></p>
  {:else}
    <Button type="button" onclick={() => (saved = true)}>Save as evidence</Button>
  {/if}
</Card>
