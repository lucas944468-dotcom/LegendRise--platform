<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  let { data } = $props();
</script>

<h1>Baseline diagnostic</h1>
<p class="lr-muted">Four quick questions. We estimate your level, flag gaps — and mark what is still uncertain.</p>

<Card title="Starting-point check">
  <form method="post" action="?/answer">
    {#each data.questions as q}
      <Field label={q.text} name={q.id}><input id={q.id} name={q.id} /></Field>
    {/each}
    <Button type="submit">See my roadmap</Button>
  </form>
</Card>
