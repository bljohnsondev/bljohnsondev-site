<script lang="ts">
  interface Props {
    show: string;
    season: number;
    episode: number;
    episodeTitle?: string;
    imageUrl?: string;
  }

  let { show, season, episode, episodeTitle, imageUrl }: Props = $props();
</script>

<section class="flex gap-3 rounded border border-now-sensor-border bg-now-sensor-bg p-3">
  {#if imageUrl}
    <img src={imageUrl} alt="{show} box art" class="h-auto w-24 shrink-0 self-start rounded" />
  {/if}
  <div class="flex flex-col gap-1">
    <div class="text-xs font-semibold tracking-wide text-site-muted-fg uppercase">Last Watched</div>
    <div class="text-lg font-bold text-now-tv-show">{show}</div>
    <div class="text-sm text-now-tv-seasonep">Season {season} &middot; Episode: {episode} - {episodeTitle}</div>
  </div>
</section>
