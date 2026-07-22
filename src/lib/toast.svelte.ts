import { v4 as uuidv4 } from 'uuid';

import { store } from '$lib/store.svelte';

import type { ToastType } from '~types/toast';

const TOAST_DURATION = 5000;

export const toast = (message: string, type: ToastType = 'info') => {
  const id = uuidv4();
  store.toasts.push({ id, message, type });

  setTimeout(() => {
    store.toasts = store.toasts.filter(toast => toast.id !== id);
  }, TOAST_DURATION);
};
