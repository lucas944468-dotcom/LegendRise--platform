<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  let { data } = $props();
</script>

<h1>Admin</h1>

<div class="lr-grid-3">
  <Card title="Content"><p class="lr-kpi">{data.careers} careers · {data.milestones} milestones</p><p class="lr-muted">{data.lessons} lessons · {data.assessments} assessments</p><p><a href="/admin/content">Manage content</a></p></Card>
  <Card title="Users & events"><p class="lr-kpi">{data.users} users</p><p class="lr-muted">{data.events} analytics events</p><p><a href="/admin/users">View users</a></p></Card>
  <Card title="Support"><p class="lr-kpi">{data.openReports} open</p><p><a href="/admin/reports">Review reports</a> · <a href="/admin/ai">AI config</a></p></Card>
</div>
