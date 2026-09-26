<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
</script>

<div class="lr-hero">
  <h1>Choose what you want to become or build.</h1>
  <p class="lr-muted">LegendRise assesses where you are, maps the route, teaches what you need, lets you practise, evaluates your work — and always tells you what to do next.</p>
  <p style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
    <Button href="/onboarding">Start with Career</Button>
    <Button href="/dashboard" variant="secondary">See the dashboard</Button>
  </p>
</div>

<div class="lr-grid-3">
  <Card title="Assess"><p class="lr-muted">A short diagnostic finds your level, gaps — and marks what is still uncertain.</p></Card>
  <Card title="Practise for real"><p class="lr-muted">Workplace tasks plus AI role-play with clients, managers and customers.</p></Card>
  <Card title="Prove it"><p class="lr-muted">Rubric-scored work becomes portfolio evidence. The dashboard always shows one next action.</p></Card>
</div>
