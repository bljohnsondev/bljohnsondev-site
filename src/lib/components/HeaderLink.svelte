<script lang="ts">
  import { SquareArrowOutUpRight } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  /* eslint-disable svelte/no-navigation-without-resolve */

  interface Props {
    href: string;
    current?: boolean;
    external?: boolean;
    children: Snippet;
  }

  let { href, current = false, external = false, children }: Props = $props();
</script>

<a
  {href}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  class="
    flex
    cursor-pointer
    items-center
    gap-1
    rounded-full
    px-5
    py-2
    text-sm
    font-medium
    transition-colors
    duration-300
    sm:gap-2
  "
  class:bg-header-btn-current-bg={current}
  class:hover:bg-header-btn-hover-bg={!current}
>
  {@render children()}
  {#if external}
    <SquareArrowOutUpRight size={14} />
  {/if}
</a>
