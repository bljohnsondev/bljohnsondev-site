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

<form method="POST" use:enhance novalidate class="w-full space-y-4 md:w-1/2">
  <div>
    <label class="label" for="name">Name</label>
    <input
      id="name"
      type="text"
      name="name"
      autocomplete="name"
      class="input w-full"
      placeholder="Name"
      maxlength={64}
      aria-invalid={!!$errors.name}
      aria-describedby={$errors.name ? 'name-error' : undefined}
      bind:value={$form.name}
    />
    {#if $errors.name}<div id="name-error" class="invalid">{$errors.name}</div>{/if}
  </div>
  <div>
    <label class="required label" for="email">Email</label>
    <input
      id="email"
      type="email"
      name="email"
      autocomplete="email"
      class="input w-full"
      placeholder="Email"
      maxlength={254}
      aria-required="true"
      aria-invalid={!!$errors.email}
      aria-describedby={$errors.email ? 'email-error' : undefined}
      bind:value={$form.email}
    />
    {#if $errors.email}<div id="email-error" class="invalid">{$errors.email[0]}</div>{/if}
  </div>
  <div>
    <label class="required label" for="message">Message</label>
    <textarea
      id="message"
      name="message"
      class="textarea w-full"
      placeholder="Message"
      maxlength={1000}
      aria-required="true"
      aria-invalid={!!$errors.message}
      aria-describedby={$errors.message ? 'message-error' : undefined}
      bind:value={$form.message}
    ></textarea>
    {#if $errors.message}<div id="message-error" class="invalid">{$errors.message}</div>{/if}
  </div>
  <div>
    <Turnstile siteKey={env.PUBLIC_CF_TURNSTILE_SITE_KEY} bind:reset theme={store.isDark ? 'dark' : 'light'} />
    {#if $errors['cf-turnstile-response']}<div class="invalid">{$errors['cf-turnstile-response']}</div>{/if}
  </div>
  <button class="btn btn-primary">Send Message</button>
</form>
