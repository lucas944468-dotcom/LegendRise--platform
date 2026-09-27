<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import RubricTable from "$lib/components/RubricTable.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  let { data } = $props();

  let draft = $state("");
  let scoring = $state(false);
  let result: {
    criterionScores: { criterion: string; level: number; evidence: string }[];
    feedback: string;
    average: number;
    version: number;
    evidenceId: string | null;
    unlocked: string | null;
  } | null = $state(null);
  let error = $state("");

  async function score() {
    if (!draft.trim() || !data.assessment) return;
    scoring = true;
    error = "";
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: data.assessment.id, submission: draft }),
      });
      if (!res.ok) throw new Error(`Scoring failed (${res.status})`);
      result = await res.json();
    } catch (e) {
      error = e instanceof Error ? e.message : "Scoring failed";
    } finally {
      scoring = false;
    }
  }
</script>

<h1>Assessment</h1>

{#if !data.assessment}
  <EmptyState title="No published assessment yet" hint="An admin publishes one per milestone in /admin (Phase 8)." />
{:else}
  <Card title="Task"><p>{data.assessment.task}</p></Card>

  <Card title="Rubric & scores">
    <RubricTable
      rows={data.rows.map((r) => ({
        criterion: r.criterion,
        levels: r.levels,
        score: result
          ? (result.criterionScores.find((s) => s.criterion === r.criterion)?.level ?? r.score)
          : r.score,
      }))}
      caption="Rubric with your latest scores"
    />
    {#if data.latest?.feedback && !result}<p class="lr-muted">Last feedback (v{data.latest.version}): {data.latest.feedback}</p>{/if}
    {#if result}
      <p role="status"><strong>Score: {result.average.toFixed(2)} (v{result.version})</strong> — {result.feedback}</p>
      {#if result.evidenceId}<p role="status">Saved to portfolio as evidence. <a href="/portfolio">View portfolio</a></p>{/if}
      {#if result.unlocked}<p role="status">Milestone complete — unlocked: <strong>{result.unlocked}</strong>. <a href="/path">View path</a></p>{/if}
    {/if}
    {#if data.versions > 0 && !result}<p class="lr-muted">{data.versions} submission version(s) so far — retry to improve.</p>{/if}
  </Card>

  <Card title="Submit / retry">
    <Field label="Your work" name="work"><textarea id="work" bind:value={draft} rows="6"></textarea></Field>
    {#if error}<p class="lr-field-error" role="alert">{error}</p>{/if}
    <Button type="button" onclick={score}>{scoring ? "Scoring…" : data.versions > 0 ? "Submit new version" : "Score my work"}</Button>
  </Card>
{/if}
