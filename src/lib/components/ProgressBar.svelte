<script lang="ts">
  interface Props {
    value: number; // 0..100
    label: string; // accessible name, e.g. "Path progress 40 percent"
  }
  let { value, label }: Props = $props();
  const pct = $derived(Math.max(0, Math.min(100, Math.round(value))));
</script>

<div class="lr-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
  <span style={`width: ${pct}%`}></span>
</div>
