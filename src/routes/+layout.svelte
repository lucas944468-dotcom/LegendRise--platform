<script lang="ts">
  import "../app.css";
  let { children } = $props();
  const links = [
    ["Onboarding", "/onboarding"],
    ["Dashboard", "/dashboard"],
    ["Path", "/path"],
    ["Lesson", "/lesson"],
    ["Practice", "/practice"],
    ["Simulation", "/simulation"],
    ["Assessment", "/assessment"],
    ["Portfolio", "/portfolio"],
    ["Coach", "/coach"],
  ] as const;
</script>

<a class="lr-skip" href="#main">Skip to content</a>
<header class="lr-header">
  <div class="lr-header-inner">
    <a class="lr-brand" href="/">LegendRise™ <span class="lr-muted">prototype</span></a>
    <nav class="lr-nav" aria-label="Prototype screens">
      {#each links as [label, href]}<a {href}>{label}</a>{/each}
    </nav>
  </div>
</header>
<main id="main" class="lr-container lr-page lr-stack">
  {@render children()}
</main>
