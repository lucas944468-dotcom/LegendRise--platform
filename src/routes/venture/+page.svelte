<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { ventureEnabled } from "$lib/flags";
</script>

<h1>Venture Lab</h1>
{#if ventureEnabled}
  <Card title="Founder pathway"><p>Venture stages ship here (PRD Phase 3 of product).</p></Card>
{:else}
  <Card title="Locked until the career engine is validated">
    <p>The Venture Lab (idea → problem → customer validation → market → feasibility → model → financials → plan → pilot) unlocks after the career pathway proves useful with real users. MVP discipline (PRD §6).</p>
    <p class="lr-muted">Tables and stubs already exist in the architecture (ADR-007); no venture UI ships before validation.</p>
  </Card>
{/if}
