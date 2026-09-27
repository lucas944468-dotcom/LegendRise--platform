<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  let { form } = $props();
</script>

<h1>Support</h1>
<Card title="Report a problem or incorrect AI output">
  {#if form?.ok}
    <p role="status"><strong>Received.</strong> An admin reviews the queue in /admin/reports. Thank you.</p>
  {:else}
    <form method="post" action="?/report">
      <Field label="Type" name="kind"><select id="kind" name="kind"><option value="bug">Something is broken</option><option value="incorrect-ai">Incorrect AI output</option><option value="other">Other</option></select></Field>
      <Field label="Where (page or feature)" name="context"><input id="context" name="context" placeholder="e.g. Simulation feedback" /></Field>
      <Field label="What happened" name="message"><textarea id="message" name="message" rows="5" required></textarea></Field>
      <Button type="submit">Send report</Button>
    </form>
    <p class="lr-muted">Login not required to report, but signed-in reports attach to your account for follow-up.</p>
  {/if}
</Card>
