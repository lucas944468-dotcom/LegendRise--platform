<script lang="ts">
  // PRD §13.2: completed / in-progress / locked / needs-attention / evidence
  // must be visually distinct.
  interface Props {
    state: "completed" | "in-progress" | "locked" | "needs-attention" | "evidence";
    label?: string;
  }
  let { state, label }: Props = $props();
  const fallback: Record<Props["state"], string> = {
    completed: "Completed",
    "in-progress": "In progress",
    locked: "Locked",
    "needs-attention": "Needs attention",
    evidence: "Evidence",
  };
</script>

<span class={`lr-badge lr-badge-${state}`}>{label ?? fallback[state]}</span>
