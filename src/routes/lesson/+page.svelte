<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import { mockLesson } from "$lib/mock";
</script>

<h1>{mockLesson.title}</h1>

<Card title="Lesson">
  <p>{mockLesson.body}</p>
  <p class="lr-muted">[Narrated media + screen demo play here in the built product.]</p>
</Card>

<Card title="Resources">
  <ul>{#each mockLesson.resources as r}<li><a href="/lesson">{r}</a></li>{/each}</ul>
</Card>

<p style="display:flex;gap:0.75rem;flex-wrap:wrap">
  <Button href="/practice">Continue to practice</Button>
  <Button href="/coach" variant="secondary">Ask the tutor</Button>
</p>
