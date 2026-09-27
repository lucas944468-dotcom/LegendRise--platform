<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  let { data } = $props();
</script>

<h1>Users</h1>
<Card title={`Registered users (${data.users.length})`}>
  <table class="lr-table"><thead><tr><th scope="col">Email</th><th scope="col">Journey</th><th scope="col">Work</th><th scope="col">Flags</th></tr></thead>
  <tbody>{#each data.users as u}<tr><td>{u.email}</td><td>{u.goal}</td><td>{u.submissions} submissions · {u.evidence} evidence</td><td>{u.admin ? "admin " : ""}{u.verified ? "verified" : "unverified"}</td></tr>{/each}</tbody></table>
</Card>
