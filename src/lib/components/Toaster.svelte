<script lang="ts">
  import { store } from '$lib/store.svelte';

  import type { ToastType } from '~types/toast';

  const alertClass: Record<ToastType, string> = {
    info: 'bg-toast-info-bg border border-toast-info-border text-toast-info-fg',
    success: 'bg-toast-success-bg border border-toast-success-border text-toast-success-fg',
    warning: 'bg-toast-warning-bg border border-toast-warning-border text-toast-warning-fg',
    error: 'bg-toast-error-bg border border-toast-error-border text-toast-error-fg',
  };
</script>

<div class="toast toast-center toast-top z-50">
  {#each store.toasts as toast (toast.id)}
    <div class="alert {alertClass[toast.type]}">
      <span>{toast.message}</span>
    </div>
  {/each}
</div>
