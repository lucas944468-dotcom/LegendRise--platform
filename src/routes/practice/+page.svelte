<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import { mockPractice } from "$lib/mock";
  let submitted = $state(false);
</script>

<h1>{mockPractice.title}</h1>

<Card title="Brief"><p>{mockPractice.brief}</p></Card>

<Card title="Hints">
  <ul>{#each mockPractice.hints as h}<li>{h}</li>{/each}</ul>
</Card>

<Card title="Your work">
  {#if submitted}
    <p role="status"><strong>Submitted.</strong> In the built product this goes to rubric assessment. <a href="/assessment">See how it is scored</a>.</p>
  {:else}
    <Field label="Draft (max ~150 words)" name="draft"><textarea id="draft" name="draft" rows="6"></textarea></Field>
    <Button type="button" onclick={() => (submitted = true)}>Submit work</Button>
  {/if}
</Card>
