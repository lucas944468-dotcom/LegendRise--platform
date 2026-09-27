<script lang="ts">
  import Card from "$lib/components/Card.svelte";
</script>

<h1>Check your email</h1>
<Card title="Verify your account">
  <p>We sent a verification link to your email. Open it to activate your account, then <a href="/login">log in</a>.</p>
  <p class="lr-muted">No mail server is connected yet (founder task: Resend key). During prototype testing, ask the builder for your link.</p>
</Card>
