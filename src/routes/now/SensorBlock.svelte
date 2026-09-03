<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    dotClass: string;
    title: string;
    footer?: string;
    children: Snippet;
  }

  let { dotClass, title, footer, children }: Props = $props();
</script>

<section class="flex flex-col gap-1 rounded border border-now-sensor-border bg-now-sensor-bg p-3">
  <div class="flex flex-row items-center gap-2">
    <div class="h-2 w-2 rounded-full {dotClass}"></div>
    <span class="text-sm">{title}</span>
  </div>
  <div class="text-lg font-medium">{@render children()}</div>
  {#if footer}
    <div class="text-sm text-site-muted-fg">{footer}</div>
  {/if}
</section>
