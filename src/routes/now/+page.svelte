<script lang="ts">
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { tempDotClass, type TempTone } from '$lib/now-sensors';

  import SensorBlock from './SensorBlock.svelte';

  import type { PageProps } from './$types';

  dayjs.extend(relativeTime);

  let { data }: PageProps = $props();

  let now = $derived(data.now);
  const lastUpdated = $derived(dayjs(now.updatedAt).fromNow());
  const sensors = $derived(Object.entries(now.sensors ?? {}));

  interface TempArgs {
    title: string;
    tempF: string;
    humidity?: number;
    tone?: TempTone;
  }

  interface LightArgs {
    title: string;
    on: boolean;
    since?: string;
  }
</script>

<div class="flex flex-row items-center gap-1">
  <div class="font-welcome text-5xl font-extrabold text-greeting-fg">Right now</div>
  <div class="ml-auto text-xs text-site-muted-fg">updated {lastUpdated}</div>
</div>

<div class="my-4">A live look at my house and what I've been watching.</div>

{#snippet sensorTemp({ title, tempF, humidity, tone = 'ok' }: TempArgs)}
  <SensorBlock
    dotClass={tempDotClass[tone]}
    {title}
    footer={humidity === undefined ? undefined : `${humidity}% humidity`}
  >
    {tempF}<span class="ml-1 text-xs">&deg;F</span>
  </SensorBlock>
{/snippet}

{#snippet sensorLight({ title, on, since }: LightArgs)}
  <SensorBlock
    dotClass={on ? 'bg-now-sensor-on' : 'bg-now-sensor-off'}
    {title}
    footer={since ? `Since ${since}` : undefined}
  >
    <span class="font-semibold {on ? 'text-now-sensor-on' : 'text-now-sensor-off'}">{on ? 'On' : 'Off'}</span>
  </SensorBlock>
{/snippet}

{#if sensors.length > 0 || now.office}
  <h2 class="section">Environment</h2>
  <div class="divider mt-0"></div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
    {#each sensors as [sensorId, reading] (sensorId)}
      {@render sensorTemp({ title: reading.label, tempF: reading.tempF, humidity: reading.humidity })}
    {/each}
    {#if now.office}
      {@render sensorLight({ title: 'Office', on: now.office.lightsOn })}
    {/if}
  </div>
{/if}
