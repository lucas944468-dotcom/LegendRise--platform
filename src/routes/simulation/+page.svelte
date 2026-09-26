<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import ChatThread from "$lib/components/ChatThread.svelte";
  import { mockSimulation } from "$lib/mock";
  let finished = $state(false);
</script>

<h1>Simulation — Difficult client call</h1>

<Card title="Scenario"><p>{mockSimulation.scenario}</p></Card>

<Card title="Role-play">
  <ChatThread messages={mockSimulation.messages} label="Simulation conversation" />
</Card>

<Card title="Feedback">
  {#if finished}
    <p>{mockSimulation.feedback}</p>
    <p><Button href="/simulation" variant="secondary" size="sm">Retry scenario</Button></p>
  {:else}
    <Button type="button" onclick={() => (finished = true)}>Finish & get feedback</Button>
  {/if}
</Card>
