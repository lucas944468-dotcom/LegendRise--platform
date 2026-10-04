<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import { authClient } from "$lib/auth-client";

  let email = $state("");
  let error = $state("");
  let sent = $state(false);

  async function request(e: Event) {
    e.preventDefault();
    error = "";
    const res = await authClient.requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      { onError: (ctx) => { error = ctx.error.message ?? "Request failed"; } },
    );
    if (res?.data) sent = true;
  }
</script>

<h1>Forgot password</h1>
<Card title="Reset link">
  {#if sent}
    <p role="status"><strong>Check your email.</strong> If the address is registered, a one-time reset link is on its way (expires in 1 hour).</p>
  {:else}
    <form onsubmit={request}>
      <Field label="Account email" name="email"><input id="email" name="email" type="email" required bind:value={email} /></Field>
      {#if error}<p class="lr-field-error" role="alert">{error}</p>{/if}
      <Button type="submit">Send reset link</Button>
    </form>
  {/if}
</Card>
