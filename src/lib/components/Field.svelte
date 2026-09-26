<script lang="ts">
  interface Props {
    label: string;
    name: string;
    error?: string;
    children: import("svelte").Snippet;
  }
  let { label, name, error, children }: Props = $props();
</script>

<div class="lr-field">
  <label for={name}>{label}</label>
  {@render children()}
  {#if error}<span class="lr-field-error" role="alert">{error}</span>{/if}
</div>
