<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { superForm } from 'sveltekit-superforms';
  import { Turnstile } from 'svelte-turnstile';

  import { store } from '$lib/store.svelte';
  import { toast } from '$lib/toast.svelte';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let reset = $state<() => void>();

  // superforms captures initial value intentionally - ignoring this warning
  // svelte-ignore state_referenced_locally
  const { form, errors, enhance } = superForm(data.form, {
    resetForm: true,
    onUpdated({ form }) {
      if (form.valid) {
        reset?.();
        toast(form.message ?? 'Your message has been sent', 'success');
      } else if (form.message) {
        toast(form.message, 'error');
      }
    },
  });
</script>

<h2 class="section">Contact</h2>
<p>Feel free to contact me with any questions or comments.</p>
<p class="mb-3 text-xs text-site-muted-fg">
  Due to the increasing amount of spam I've been receiving, I've added an annoying CAPTCHA.
</p>

<form method="POST" use:enhance class="w-full space-y-4 md:w-1/2">
  <div>
    <label class="label" for="name">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      class="input w-full"
      placeholder="Name"
      maxlength={64}
      bind:value={$form.name}
    />
    {#if $errors.name}<div class="invalid">{$errors.name}</div>{/if}
  </div>
  <div>
    <label class="required label" for="email">Email</label>
    <input
      type="text"
      id="email"
      name="email"
      class="input w-full"
      placeholder="Email"
      maxlength={254}
      bind:value={$form.email}
    />
    {#if $errors.email}<div class="invalid">{$errors.email[0]}</div>{/if}
  </div>
  <div>
    <label class="required label" for="message">Message</label>
    <textarea
      id="message"
      name="message"
      class="textarea w-full"
      placeholder="Message"
      maxlength={1000}
      bind:value={$form.message}
    ></textarea>
    {#if $errors.message}<div class="invalid">{$errors.message}</div>{/if}
  </div>
  <div>
    <Turnstile siteKey={env.PUBLIC_CF_TURNSTILE_SITE_KEY} bind:reset theme={store.isDark ? 'dark' : 'light'} />
    {#if $errors['cf-turnstile-response']}<div class="invalid">{$errors['cf-turnstile-response']}</div>{/if}
  </div>
  <button class="btn btn-primary">Send Message</button>
</form>
