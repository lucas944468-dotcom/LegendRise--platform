<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  let { data } = $props();
</script>

<h1>Content CMS</h1>

<Card title="New career">
  <form method="post" action="?/addCareer" style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:end">
    <Field label="Name" name="name"><input id="cname" name="name" required /></Field>
    <Field label="Description" name="description"><input id="cdesc" name="description" /></Field>
    <Button type="submit" size="sm">Add career</Button>
  </form>
</Card>

{#each data.careers as c}
  <Card title={`${c.isPublished ? "[PUBLISHED] " : "[DRAFT] "}${c.name}`}>
    <form method="post" action="?/toggleCareer"><input type="hidden" name="id" value={c.id} /><Button type="submit" size="sm" variant="secondary">{c.isPublished ? "Unpublish" : "Publish"}</Button></form>
    {#each c.milestones as m}
      <h3>Milestone {m.order} — {m.title}</h3>
      <ul>
        {#each m.lessons as l}<li>Lesson: {l.title} [{l.isPublished ? "published" : "draft"}]
          <form method="post" action="?/toggleLesson" style="display:inline"><input type="hidden" name="id" value={l.id} /><button class="lr-btn lr-btn-ghost lr-btn-sm" type="submit">toggle</button></form></li>{/each}
        {#each m.assessments as a}<li>Assessment: {a.task.slice(0, 60)}… [{a.isPublished ? "published" : "draft"}]
          <form method="post" action="?/toggleAssessment" style="display:inline"><input type="hidden" name="id" value={a.id} /><button class="lr-btn lr-btn-ghost lr-btn-sm" type="submit">toggle</button></form></li>{/each}
      </ul>
      <details>
        <summary class="lr-muted">Add lesson / assessment to milestone {m.order}</summary>
        <form method="post" action="?/addLesson"><input type="hidden" name="milestoneId" value={m.id} />
          <Field label="Lesson title" name="ltitle"><input id={`lt-${m.id}`} name="title" required /></Field>
          <Field label="Lesson text" name="ltext"><textarea id={`lx-${m.id}`} name="text" rows="3"></textarea></Field>
          <Button type="submit" size="sm">Add lesson (draft)</Button></form>
        <form method="post" action="?/addAssessment"><input type="hidden" name="milestoneId" value={m.id} />
          <Field label="Assessment task" name="atask"><textarea id={`at-${m.id}`} name="task" rows="2" required></textarea></Field>
          <Button type="submit" size="sm">Add assessment (draft)</Button></form>
      </details>
    {/each}
    <details>
      <summary class="lr-muted">Add milestone to this career</summary>
      <form method="post" action="?/addMilestone"><input type="hidden" name="careerPathId" value={c.id} />
        <Field label="Title" name="mtitle"><input id={`mt-${c.id}`} name="title" required /></Field>
        <Field label="Level" name="mlevel"><input id={`ml-${c.id}`} name="level" /></Field>
        <Button type="submit" size="sm">Add milestone</Button></form>
    </details>
  </Card>
{/each}
