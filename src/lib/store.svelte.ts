import type { Store } from '~types/store';

export const store = $state<Store>({
  toasts: [],
  isDark: false,
});
