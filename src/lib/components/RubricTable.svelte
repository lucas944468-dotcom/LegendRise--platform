<script lang="ts">
  export interface RubricRow {
    criterion: string;
    levels: string[]; // e.g. ["Beginning", "Developing", "Demonstrated"]
    score?: number;   // index into levels when scored
  }
  interface Props {
    rows: RubricRow[];
    caption?: string;
  }
  let { rows, caption = "Assessment rubric" }: Props = $props();
  const maxLevels = $derived(Math.max(...rows.map((r) => r.levels.length)));
</script>

<table class="lr-table">
  <caption class="lr-muted">{caption}</caption>
  <thead>
    <tr><th scope="col">Criterion</th><th scope="col" colspan={maxLevels}>Levels</th><th scope="col">Score</th></tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <th scope="row">{row.criterion}</th>
        {#each row.levels as level}
          <td>{level}</td>
        {/each}
        {#each Array(maxLevels - row.levels.length) as _}<td></td>{/each}
        <td>{row.score === undefined ? "—" : row.levels[row.score]}</td>
      </tr>
    {/each}
  </tbody>
</table>
