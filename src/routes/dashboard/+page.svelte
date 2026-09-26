<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import EvidenceCard from "$lib/components/EvidenceCard.svelte";
  import { mockCareer, mockEvidence } from "$lib/mock";
</script>

<h1>Dashboard</h1>

<Card title="Next action">
  <div class="lr-highlight" style="padding-left:var(--space-3)">
  <p><strong>{mockCareer.nextAction.title}</strong></p>
  <Button href={mockCareer.nextAction.href} size="sm">Start now</Button>
  </div>
</Card>

<div class="lr-grid-2">
  <Card title={mockCareer.name}>
    <p class="lr-muted">{mockCareer.level}</p>
    <ProgressBar value={mockCareer.progress} label={`Path progress ${mockCareer.progress} percent`} />
  </Card>
  <Card title="Upcoming assessment">
    <p class="lr-muted">{mockCareer.upcomingAssessment}</p>
    <Button href="/assessment" variant="secondary" size="sm">Preview rubric</Button>
  </Card>
</div>

<Card title="Evidence snapshot">
  {#each mockEvidence.slice(0, 2) as e}<div style="margin-bottom:0.5rem"><EvidenceCard {...e} /></div>{/each}
  <p><a href="/portfolio">Open full portfolio</a> · <a href="/coach">Ask the coach</a></p>
</Card>
