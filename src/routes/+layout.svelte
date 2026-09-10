<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from '@lucide/svelte';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import HeaderLink from '$lib/components/HeaderLink.svelte';
  import Toaster from '$lib/components/Toaster.svelte';
  import { store } from '$lib/store.svelte';

  import '~styles/main.css';

  import '@fontsource-variable/caveat';
  import '@fontsource-variable/montserrat';

  import type { LayoutProps } from './$types';

  let { children, data }: LayoutProps = $props();

  let profile = $derived(data.profile);
  let site = $derived(data.site);
  let externalAccounts = $derived(data.externalAccounts);
  let nowEnabled = $derived(data.nowEnabled);
  let githubUrl = $derived(externalAccounts.find(account => account.platform === 'github')?.url);
  let linkedinUrl = $derived(externalAccounts.find(account => account.platform === 'linkedin')?.url);
  let windowTitle = $derived(site?.pageTitles?.find(entry => entry.path === page.url.pathname)?.title);

  const toggleTheme = () => {
    store.isDark = !store.isDark;
    document.documentElement.classList.toggle('dark', store.isDark);
    document.documentElement.setAttribute('data-theme', store.isDark ? 'business' : 'corporate');
    localStorage.setItem('theme', store.isDark ? 'dark' : 'light');
  };

  onMount(() => {
    store.isDark = document.documentElement.classList.contains('dark');
  });
</script>

<svelte:head>
  {#if site?.metaDescription}
    <meta name="description" content={site.metaDescription} />
  {/if}
  {#if windowTitle}
    <title>{windowTitle}</title>
  {/if}
</svelte:head>

<main class="mx-auto max-w-6xl px-5 sm:px-16">
  <header class="flex flex-col items-center gap-3 py-5 sm:py-8 md:flex-row">
    <a href={resolve('/')} class="group flex items-center gap-3">
      {#if profile.avatar}
        <img
          src={profile.avatar}
          alt="Avatar"
          height="48"
          width="48"
          class="
            block
            size-12
            shrink-0
            rounded-full
            border-2
            border-blue-500/80
            transition-transform
            duration-300
            group-hover:scale-110
          "
        />
      {/if}
      <h1 class="font-semibold tracking-tight">{profile.displayName}</h1>
    </a>
    <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:ml-auto">
      <nav aria-label="Primary" class="flex basis-full justify-center gap-1 sm:basis-auto sm:gap-2">
        <HeaderLink href="/" current={page.url.pathname === '/'}>Home</HeaderLink>
        {#if nowEnabled}
          <HeaderLink href="/now" current={page.url.pathname === '/now'}>Now</HeaderLink>
        {/if}
        <HeaderLink href="/contact" current={page.url.pathname === '/contact'}>Contact</HeaderLink>
      </nav>
      <nav
        aria-label="External profiles"
        class="flex basis-full items-center justify-center gap-1 sm:basis-auto sm:gap-2"
      >
        {#if githubUrl}
          <HeaderLink href={githubUrl} external={true}>GitHub</HeaderLink>
        {/if}
        {#if linkedinUrl}
          <HeaderLink href={linkedinUrl} external={true}>LinkedIn</HeaderLink>
        {/if}
        {#if profile.handle}
          <HeaderLink href={`https://sifa.id/p/${profile.handle}`} external={true}>Sifa ID</HeaderLink>
        {/if}
      </nav>
      <button
        onclick={toggleTheme}
        aria-label="Toggle Theme"
        class="cursor-pointer border-0 text-header-theme-toggle transition-colors duration-150 hover:text-header-theme-toggle-hover"
      >
        {#if store.isDark}
          <Sun size={24} strokeWidth={2} />
        {:else}
          <Moon size={24} strokeWidth={2} />
        {/if}
      </button>
    </div>
  </header>
  <section class="rounded-md border border-content-border bg-content-bg p-5">
    {@render children()}
  </section>
  <Toaster />
</main>
