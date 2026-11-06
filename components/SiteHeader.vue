<template>
  <header class="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
    <div class="container-page flex h-[72px] items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center gap-3">
        <span class="grid h-10 w-10 place-items-center rounded-2xl bg-orange text-lg font-extrabold text-white">Y</span>
        <span class="leading-tight">
          <span class="block text-[15px] font-extrabold tracking-wide text-navy">YUKCHI.UZ</span>
          <span class="block text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3">{{ t('brand.tagline') }}</span>
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-7 md:flex">
        <NuxtLink to="/yuklar" class="link-muted text-[15px] font-medium">{{ t('nav.cargos') }}</NuxtLink>
        <NuxtLink to="/#qanday" class="link-muted text-[15px] font-medium">{{ t('nav.how') }}</NuxtLink>
        <NuxtLink to="/#haydovchilar" class="link-muted text-[15px] font-medium">{{ t('nav.forDrivers') }}</NuxtLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <div class="hidden md:block">
          <CurrencySwitcher />
        </div>
        <div class="hidden md:block">
          <LangSwitcher />
        </div>

        <ClientOnly>
          <NuxtLink v-if="user" to="/profil" class="flex items-center gap-2 rounded-full border border-line px-2 py-1.5 pr-4 transition hover:border-navy">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-navy text-xs font-bold text-white">
              {{ user.initials }}
            </span>
            <span class="hidden text-sm font-semibold text-ink sm:block">{{ user.fullName.split(' ')[0] }}</span>
          </NuxtLink>
          <NuxtLink v-else :to="loginLink" class="btn-ghost px-4 py-2 text-sm">{{ t('nav.login') }}</NuxtLink>
        </ClientOnly>

        <NuxtLink to="/elon-ber" class="btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
          {{ t('nav.postCargo') }}
        </NuxtLink>

        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink-2 md:hidden"
          :aria-label="t('nav.menu')"
          @click="open = !open"
        >
          <X v-if="open" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>

    <div v-if="open" class="border-t border-line bg-white md:hidden">
      <div class="container-page flex flex-col gap-1 py-3">
        <NuxtLink to="/yuklar" class="rounded-lg px-3 py-2.5 font-medium hover:bg-navy-soft" @click="open = false">{{ t('nav.cargos') }}</NuxtLink>
        <NuxtLink to="/#qanday" class="rounded-lg px-3 py-2.5 font-medium hover:bg-navy-soft" @click="open = false">{{ t('nav.how') }}</NuxtLink>
        <NuxtLink to="/#haydovchilar" class="rounded-lg px-3 py-2.5 font-medium hover:bg-navy-soft" @click="open = false">{{ t('nav.forDrivers') }}</NuxtLink>
        <div class="flex items-center justify-between px-3 py-2">
          <span class="text-sm font-medium text-ink-2">{{ t('currency.viewIn') }}</span>
          <CurrencySwitcher />
        </div>
        <div class="flex items-center justify-between px-3 py-2">
          <span class="text-sm font-medium text-ink-2">{{ t('lang.switch') }}</span>
          <LangSwitcher />
        </div>
        <NuxtLink to="/elon-ber" class="btn-primary mt-2" @click="open = false">{{ t('nav.postCargo') }}</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next';

const { t } = useI18n();
const open = ref(false);
const { user } = useAuth();
const route = useRoute();

const loginLink = computed(() => {
  const next = route.fullPath;
  if (next === '/' || next.startsWith('/kirish')) return '/kirish';
  return { path: '/kirish', query: { next } };
});
</script>
