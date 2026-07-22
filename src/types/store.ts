import type { Toast } from '~types/toast';

export interface Store {
  toasts: Toast[];
  isDark: boolean;
}
