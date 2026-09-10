export type TempTone = 'cold' | 'ok' | 'hot';

// Record order isn't guaranteed, so manually set a display order.
// Unlisted entity ids sort after all listed ones, in whatever order they appear in the record.
const ENTITY_DISPLAY_ORDER = ['outdoor', 'plant_room', 'study_light', 'fridge', 'freezer'];

// Default tone thresholds, for any temp sensor without an appliance-specific override below (outdoor, plant_room, ...).
const DEFAULT_COLD_MAX_F = 32;
const DEFAULT_HOT_MIN_F = 80;

// Appliance safe-max thresholds (fridge/freezer only ever read as "safely cold" or "too warm" - never 'ok').
const FREEZER_SAFE_MAX_F = 5;
const FRIDGE_SAFE_MAX_F = 40;

export const formatTempF = (tempF: number): string => Math.round(tempF).toString();

export const tempDotClass: Record<TempTone, string> = {
  cold: 'bg-now-temp-cold',
  ok: 'bg-now-temp-ok',
  hot: 'bg-now-temp-hot',
};

export const defaultTempTone = (tempF: number): TempTone =>
  tempF < DEFAULT_COLD_MAX_F ? 'cold' : tempF > DEFAULT_HOT_MIN_F ? 'hot' : 'ok';

export type ApplianceTone = Extract<TempTone, 'cold' | 'hot'>;

export const freezerTone = (tempF: number, safeMaxF: number): ApplianceTone => (tempF <= safeMaxF ? 'cold' : 'hot');

const applianceToneLabel: Record<ApplianceTone, string> = {
  cold: 'In range',
  hot: 'Too warm',
};

export interface TempStatus {
  tone: TempTone;
  label?: string;
}

const applianceStatus = (tempF: number, safeMaxF: number): TempStatus => {
  const tone = freezerTone(tempF, safeMaxF);
  return { tone, label: applianceToneLabel[tone] };
};

// Appliance-specific overrides only - any other temp sensor id falls back to defaultTempTone.
const entityTempStatusById: Record<string, (tempF: number) => TempStatus> = {
  freezer: tempF => applianceStatus(tempF, FREEZER_SAFE_MAX_F),
  fridge: tempF => applianceStatus(tempF, FRIDGE_SAFE_MAX_F),
};

export const entityTempStatus = (entityId: string, tempF: number): TempStatus =>
  entityTempStatusById[entityId]?.(tempF) ?? { tone: defaultTempTone(tempF) };

export const compareEntityOrder = (entityIdA: string, entityIdB: string): number => {
  const indexA = ENTITY_DISPLAY_ORDER.indexOf(entityIdA);
  const indexB = ENTITY_DISPLAY_ORDER.indexOf(entityIdB);

  if (indexA === -1 && indexB === -1) return 0;
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};
