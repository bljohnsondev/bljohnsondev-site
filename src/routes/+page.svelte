<script lang="ts">
  import { groupSkillsByCategory } from '$lib/skills';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let profile = $derived(data.profile);
  let site = $derived(data.site);
  let education = $derived(data.education);
  let positions = $derived(data.positions);
  let skillCategories = $derived(groupSkillsByCategory(data.skills, site?.skillCategories));

  let showAll = $state(false);
  let hasMore = $derived(!!site?.employmentViewTotal && positions.length > site.employmentViewTotal);
  let visibleJobs = $derived(hasMore && !showAll ? positions.slice(0, site!.employmentViewTotal) : positions);

  const formatMonthYear = (dateStr: string): string => {
    const [year, month] = dateStr.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDetails = (description?: string): string[] =>
    (description ?? '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.slice(2));
</script>

{#if site.greeting}
  <div class="flex flex-col gap-1">
    {#if site.greeting}
      <div class="font-welcome text-5xl font-extrabold text-greeting-fg">{site.greeting}</div>
    {/if}
  </div>
{/if}

{#if profile.about}
  <div class="my-4">{profile.about}</div>
{/if}

<h2 class="section">Experience</h2>
<div class="divider mt-0"></div>

<div class="grid grid-cols-[16px_1fr] gap-2 md:gap-5">
  {#each visibleJobs as job, i (`${i}-${job.company}-${job.title}`)}
    <div class="divider m-0 divider-start divider-horizontal p-0 pt-1.5">
      <div class="h-3 w-3 shrink-0 rounded-full bg-employment-bullet"></div>
    </div>
    <div class="flex flex-col gap-1 md:flex-row md:gap-10">
      <div>
        <h1 class="text-base font-semibold">{job.company}</h1>
        <h2 class="mb-2 text-base font-normal">{job.title}</h2>
        <ul class="list-outside list-disc space-y-1 pl-4 text-sm text-employment-list">
          {#each getDetails(job.description) as detail, i (`${i}-${detail}`)}
            <li>{detail}</li>
          {/each}
        </ul>
      </div>
      <div
        class="order-first shrink-0 text-sm font-medium tracking-wide text-employment-date md:order-last md:ml-auto md:text-right"
      >
        {formatMonthYear(job.startedAt)}
        -
        {job.endedAt ? formatMonthYear(job.endedAt) : 'Present'}
      </div>
    </div>
  {/each}
</div>
{#if hasMore}
  <button
    class="
          btn
          mt-4
          w-full
          border-employment-show-border
          bg-employment-show-bg
          text-employment-show-fg
          transition-colors
          duration-150
          hover:bg-employment-show-hover-bg
          hover:text-employment-show-hover-fg
        "
    onclick={() => (showAll = !showAll)}
  >
    {showAll ? 'Show less' : 'Show more'}
  </button>
{/if}

{#if education && education.length > 0}
  <h2 class="section mt-8">Education</h2>
  <div class="divider mt-0"></div>

  <div class="flex flex-col gap-3">
    {#each education as entry (`${entry.institution}-${entry.startedAt}`)}
      <div>
        <div class="font-medium">{entry.institution}</div>
        {#if entry.degree && entry.fieldOfStudy}
          <div class="text-sm text-site-muted-fg">{entry.degree}, {entry.fieldOfStudy}</div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

{#snippet skillsList(label: string, skills?: string[])}
  {#if skills && skills.length > 0}
    <div class="flex flex-col items-start gap-3 md:flex-row">
      <span class="pt-1 text-sm font-medium">{label}:</span>
      <ul class="flex flex-wrap items-center gap-2">
        {#each skills as skill, i (`${i}-${label}-${skill}`)}
          <li class="rounded-xl border border-skill-border bg-skill-bg px-2.5 py-1 text-sm">{skill}</li>
        {/each}
      </ul>
    </div>
  {/if}
{/snippet}

<div class="mt-8">
  <h2 class="section">Skills</h2>
  <div class="divider mt-0"></div>
  <div class="space-y-4">
    {#each skillCategories as category (category.name)}
      {@render skillsList(category.name, category.skills)}
    {/each}
  </div>
</div>
