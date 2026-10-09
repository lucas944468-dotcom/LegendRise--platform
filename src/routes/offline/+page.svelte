<svelte:head>
  <title>Offline — LegendRise</title>
  <meta name="description" content="You are offline. LegendRise will reconnect automatically." />
</svelte:head>

<script lang="ts">
  function retry() {
    window.location.reload();
  }
</script>

<div class="lr-card" style="text-align:center;max-width:34rem;margin:2rem auto">
  <svg width="72" height="72" viewBox="0 0 512 512" role="img" aria-label="LegendRise mark">
    <rect x="16" y="16" width="480" height="480" rx="112" fill="#5b21b6" />
    <circle cx="330" cy="180" r="62" fill="#f59e0b" />
    <polygon points="96,360 196,200 296,360" fill="#ffffff" />
    <polygon points="216,360 316,180 416,360" fill="#ffffff" />
    <rect x="110" y="392" width="292" height="26" rx="4" fill="#f59e0b" />
  </svg>
  <h1>You're offline</h1>
  <p class="lr-muted">LegendRise needs an internet connection for your dashboard, lessons and AI coach. Check your connection and try again — your progress is saved.</p>
  <p style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
    <button class="lr-btn lr-btn-primary" onclick={retry}>Try again</button>
    <a class="lr-btn lr-btn-secondary" href="/">Back to home</a>
  </p>
</div>
