<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import Field from "$lib/components/Field.svelte";
  import { authClient } from "$lib/auth-client";

  let password = $state("");
  let error = $state("");
  const token = $derived(page.url.searchParams.get("token") ?? "");

  async function reset(e: Event) {
    e.preventDefault();
    error = "";
    if (!token) {
      error = "This link is incomplete — open it from your email again.";
      return;
    }
    const res = await authClient.resetPassword(
      { newPassword: password, token },
      { onError: (ctx) => { error = ctx.error.message ?? "Reset failed"; } },
    );
    if (res?.data) goto("/login");
  }
</script>

<h1>Set a new password</h1>
<Card title="New password">
  <form onsubmit={reset}>
    <Field label="New password (8+ characters)" name="password"><input id="password" name="password" type="password" minlength={8} required bind:value={password} /></Field>
    {#if error}<p class="lr-field-error" role="alert">{error}</p>{/if}
    <Button type="submit">Save new password</Button>
  </form>
</Card>
