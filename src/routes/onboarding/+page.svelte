<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
</script>

<h1>Onboarding</h1>
<p class="lr-muted">Tell us your goal, level, experience and availability. Saved to your profile.</p>

<Card title="Your goal">
  <form method="post" action="?/save">
    <Field label="Goal type" name="goal"><select id="goal" name="goal"><option value="CAREER">Career</option><option value="VENTURE">Venture (later release)</option></select></Field>
    <Field label="Target career and level" name="target"><input id="target" name="target" placeholder="e.g. Support Specialist — Junior" /></Field>
    <Field label="Current level" name="level"><select id="level" name="level"><option>Student / graduate</option><option>Entry level</option><option>Mid level</option><option>Changing career</option></select></Field>
    <Field label="Experience (a few words)" name="experience"><input id="experience" name="experience" placeholder="e.g. NYSC, 1yr volunteering" /></Field>
    <Field label="Weekly availability (hours)" name="hours"><input id="hours" name="hours" inputmode="numeric" placeholder="e.g. 5" /></Field>
    <Button type="submit">Continue to baseline</Button>
  </form>
</Card>
