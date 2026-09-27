<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  let { data } = $props();
</script>

<h1>AI configuration</h1>
<Card title="Model backend"><p>{data.openai}</p><p class="lr-muted">{data.conversations} stored AI conversations (private to their owners).</p></Card>
<Card title="Service prompt versions">
  <table class="lr-table"><thead><tr><th scope="col">Service</th><th scope="col">Prompt version</th></tr></thead>
  <tbody>{#each data.services as s}<tr><td>{s.name}</td><td class="lr-mono">{s.version}</td></tr>{/each}</tbody></table>
</Card>
