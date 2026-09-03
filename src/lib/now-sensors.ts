export type TempTone = 'cold' | 'ok' | 'hot';

export const tempDotClass: Record<TempTone, string> = {
  cold: 'bg-now-temp-cold',
  ok: 'bg-now-temp-ok',
  hot: 'bg-now-temp-hot',
};

export const outdoorTone = (tempF: number): TempTone => (tempF < 32 ? 'cold' : tempF > 80 ? 'hot' : 'ok');

export const freezerTone = (tempF: number, safeMaxF = 5): TempTone => (tempF <= safeMaxF ? 'ok' : 'hot');
