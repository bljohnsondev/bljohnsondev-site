<script lang="ts">
  interface Props {
    song: string;
    album: string;
    artist: string;
    imageUrl?: string;
  }

  let { song, album, artist, imageUrl }: Props = $props();
</script>

<section class="flex grow gap-3 rounded border border-now-sensor-border bg-now-sensor-bg p-3">
  {#if imageUrl}
    <img src={imageUrl} alt="{album} box art" class="h-auto w-24 shrink-0 self-start rounded" />
  {/if}
  <div class="flex flex-col gap-1">
    <div class="text-xs font-semibold tracking-wide text-site-muted-fg uppercase">Last Listened</div>
    <div class="text-lg font-bold text-now-tv-show">{song}</div>
    <div class="text-sm text-now-tv-seasonep">{album}</div>
    <div class="text-sm">{artist}</div>
  </div>
</section>
