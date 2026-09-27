<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import { authClient } from "$lib/auth-client";

  let email = $state("");
  let password = $state("");
  let error = $state("");

  async function signup(e: Event) {
    e.preventDefault();
    error = "";
    const res = await authClient.signUp.email(
      { email, password, name: email, callbackURL: "/onboarding" },
      { onError: (ctx) => { error = ctx.error.message ?? "Sign-up failed"; } },
    );
    if (res?.data) goto("/verify-notice");
  }
</script>

<h1>Sign up</h1>
<Card title="Create your account">
  <form onsubmit={signup}>
    <Field label="Email" name="email"><input id="email" name="email" type="email" required bind:value={email} /></Field>
    <Field label="Password (8+ characters)" name="password"><input id="password" name="password" type="password" minlength={8} required bind:value={password} /></Field>
    {#if error}<p class="lr-field-error" role="alert">{error}</p>{/if}
    <Button type="submit">Sign up</Button>
  </form>
  <p class="lr-muted">Have an account? <a href="/login">Log in</a></p>
</Card>
