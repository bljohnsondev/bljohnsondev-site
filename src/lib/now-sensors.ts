export type TempTone = 'cold' | 'ok' | 'hot';

export const tempDotClass: Record<TempTone, string> = {
  cold: 'bg-now-temp-cold',
  ok: 'bg-now-temp-ok',
  hot: 'bg-now-temp-hot',
};

export const outdoorTone = (tempF: number): TempTone => (tempF < 32 ? 'cold' : tempF > 80 ? 'hot' : 'ok');

// Appliance sensors (fridge/freezer) only ever read as "safely cold" or "too warm" - never 'ok'.
export type ApplianceTone = Extract<TempTone, 'cold' | 'hot'>;

export const freezerTone = (tempF: number, safeMaxF: number): ApplianceTone => (tempF <= safeMaxF ? 'cold' : 'hot');

const FREEZER_SAFE_MAX_F = 5;
const FRIDGE_SAFE_MAX_F = 40;

const applianceToneLabel: Record<ApplianceTone, string> = {
  cold: 'Nominal temp range',
  hot: 'Too hot',
};

export interface TempStatus {
  tone: TempTone;
  label?: string;
}

const applianceStatus = (tempF: number, safeMaxF: number): TempStatus => {
  const tone = freezerTone(tempF, safeMaxF);
  return { tone, label: applianceToneLabel[tone] };
};

const entityTempStatusById: Record<string, (tempF: number) => TempStatus> = {
  outdoor: tempF => ({ tone: outdoorTone(tempF) }),
  freezer: tempF => applianceStatus(tempF, FREEZER_SAFE_MAX_F),
  fridge: tempF => applianceStatus(tempF, FRIDGE_SAFE_MAX_F),
};

export const entityTempStatus = (entityId: string, tempF: number): TempStatus | undefined =>
  entityTempStatusById[entityId]?.(tempF);
