<script lang="ts">
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { compareEntityOrder, entityTempStatus, tempDotClass, type TempTone } from '$lib/now-sensors';

  import SensorBlock from './SensorBlock.svelte';
  import TvBlock from './TvBlock.svelte';

  import type { PageProps } from './$types';

  dayjs.extend(relativeTime);

  let { data }: PageProps = $props();

  let now = $derived(data.now);
  const lastUpdated = $derived(dayjs(now.updatedAt).fromNow());
  const entities = $derived(
    Object.entries(now.entities ?? {}).sort(([entityIdA], [entityIdB]) => compareEntityOrder(entityIdA, entityIdB))
  );
  const nowWatching = $derived(now.nowWatching);

  interface TempArgs {
    title: string;
    tempF: string;
    footer?: string;
    tone?: TempTone;
  }

  interface ToggleArgs {
    title: string;
    on: boolean;
  }
</script>

<div class="flex flex-row items-center gap-1">
  <div class="font-welcome text-5xl font-extrabold text-greeting-fg">Right now</div>
  <div class="ml-auto text-xs text-site-muted-fg">updated {lastUpdated}</div>
</div>

<div class="my-4">A live look at my house and what I've been watching.</div>

{#snippet sensorTemp({ title, tempF, footer, tone = 'ok' }: TempArgs)}
  <SensorBlock dotClass={tempDotClass[tone]} {title} {footer}>
    {tempF}<span class="ml-1 text-xs">&deg;F</span>
  </SensorBlock>
{/snippet}

{#snippet sensorToggle({ title, on }: ToggleArgs)}
  <SensorBlock dotClass={on ? 'bg-now-sensor-on' : 'bg-now-sensor-off'} {title}>
    <span class="font-semibold {on ? 'text-now-sensor-on' : 'text-now-sensor-off'}">{on ? 'On' : 'Off'}</span>
  </SensorBlock>
{/snippet}

{#if entities.length > 0}
  <h2 class="section">Environment</h2>
  <div class="divider mt-0"></div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
    {#each entities as [entityId, entity] (entityId)}
      {#if entity.type === 'temp'}
        {@const status = entityTempStatus(entityId, parseFloat(entity.tempF))}
        {@render sensorTemp({
          title: entity.label,
          tempF: entity.tempF,
          tone: status?.tone,
          footer: entity.humidity !== undefined ? `${entity.humidity}% humidity` : status?.label,
        })}
      {:else}
        {@render sensorToggle({ title: entity.label, on: entity.on })}
      {/if}
    {/each}
  </div>
{/if}

{#if nowWatching}
  <div class="pt-5">
    <h2 class="section">Watching</h2>
    <div class="divider mt-0"></div>

    <TvBlock
      show={nowWatching.show}
      season={nowWatching.season}
      episode={nowWatching.episode}
      episodeTitle={nowWatching.episodeTitle}
      imageUrl={nowWatching.imageUrl}
    />
  </div>
{/if}
