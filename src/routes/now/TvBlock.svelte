<script lang="ts">
  interface Props {
    show: string;
    season: number;
    episode: number;
    episodeTitle?: string;
  }

  let { show, season, episode, episodeTitle }: Props = $props();
</script>

<section class="flex flex-col gap-1 rounded border border-now-sensor-border bg-now-sensor-bg p-3">
  <div class="text-xs font-semibold tracking-wide text-site-muted-fg uppercase">Last Watched</div>
  <div class="text-lg font-bold text-now-tv-show">{show}</div>
  <div class="text-sm text-now-tv-seasonep">Season {season} &middot; Episode: {episode} - {episodeTitle}</div>
</section>
