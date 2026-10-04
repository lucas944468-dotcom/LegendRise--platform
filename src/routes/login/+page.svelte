<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import { authClient } from "$lib/auth-client";

  let email = $state("");
  let password = $state("");
  let error = $state("");

  async function login(e: Event) {
    e.preventDefault();
    error = "";
    const res = await authClient.signIn.email(
      { email, password, callbackURL: "/dashboard" },
      { onError: (ctx) => { error = ctx.error.message ?? "Login failed"; } },
    );
    if (res?.data) goto("/dashboard");
  }
</script>

<h1>Log in</h1>
<Card title="Welcome back">
  <form onsubmit={login}>
    <Field label="Email" name="email"><input id="email" name="email" type="email" required bind:value={email} /></Field>
    <Field label="Password" name="password"><input id="password" name="password" type="password" required bind:value={password} /></Field>
    {#if error}<p class="lr-field-error" role="alert">{error}</p>{/if}
    <Button type="submit">Log in</Button>
  </form>
  <p class="lr-muted">No account? <a href="/signup">Sign up</a> · <a href="/forgot-password">Forgot password?</a></p>
</Card>
