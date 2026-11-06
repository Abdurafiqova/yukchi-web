<template>
  <div class="container-page py-10">
    <div v-if="!ready" class="card h-40 animate-pulse bg-navy-soft/40" />

    <div v-else-if="!user" class="card mx-auto max-w-md p-8 text-center">
      <span class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-navy-soft text-navy">
        <UserRound :size="24" />
      </span>
      <h1 class="mt-4 text-xl font-extrabold text-navy">{{ t('profile.loginRequiredTitle') }}</h1>
      <p class="mt-1.5 text-sm text-ink-2">{{ t('profile.loginRequiredText') }}</p>
      <NuxtLink :to="{ path: '/kirish', query: { next: '/profil' } }" class="btn-primary mt-5 w-full">
        {{ t('profile.login') }}
      </NuxtLink>
    </div>

    <template v-else>
      <div class="card overflow-hidden">
        <div class="h-24 bg-navy" />
        <div class="flex flex-wrap items-end justify-between gap-4 px-6 pb-6">
          <div class="-mt-8 flex items-end gap-4">
            <span class="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-orange text-2xl font-extrabold text-white">
              {{ user.initials }}
            </span>
            <div class="pb-1">
              <h1 class="text-xl font-extrabold text-navy">{{ user.fullName }}</h1>
              <p class="text-sm text-ink-2">{{ prettyPhone(user.phone) }} · {{ t('profile.owner') }}</p>
            </div>
          </div>
          <div class="flex gap-2 pb-1">
            <NuxtLink to="/elon-ber" class="btn-primary px-4 py-2.5 text-sm">
              <Plus :size="16" />
              {{ t('profile.newCargo') }}
            </NuxtLink>
            <button type="button" class="btn-ghost px-4 py-2.5 text-sm" @click="logout">{{ t('profile.logout') }}</button>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="card p-5">
          <p class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('profile.statMyCargos') }}</p>
          <p class="mt-1 text-2xl font-extrabold text-navy">{{ myCargos.length }}</p>
        </div>
        <div class="card p-5">
          <p class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('profile.statActive') }}</p>
          <p class="mt-1 text-2xl font-extrabold text-navy">{{ activeCount }}</p>
        </div>
        <div class="card p-5">
          <p class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('profile.statViews') }}</p>
          <p class="mt-1 text-2xl font-extrabold text-navy">{{ totalViews }}</p>
        </div>
      </div>

      <section class="mt-8">
        <h2 class="text-lg font-extrabold text-navy">{{ t('profile.myCargos') }}</h2>

        <div v-if="loading" class="mt-4 card h-32 animate-pulse bg-navy-soft/40" />

        <div v-else-if="myCargos.length" class="mt-4 space-y-3">
          <NuxtLink
            v-for="cargo in myCargos"
            :key="cargo.id"
            :to="`/yuklar/${cargo.id}`"
            class="card flex flex-wrap items-center gap-4 p-4 transition hover:border-navy/30"
          >
            <img :src="cargo.images[0]?.url" :alt="cargo.title" class="h-16 w-24 rounded-lg object-cover" />
            <div class="min-w-[180px] flex-1">
              <p class="font-bold text-navy">{{ cargo.title }}</p>
              <p class="text-sm text-ink-2">{{ cityLabel(cargo.pickup.city) }} → {{ cityLabel(cargo.dropoff.city) }}</p>
            </div>
            <div class="text-sm text-ink-2">
              <p class="font-semibold text-ink">{{ formatPrice(cargo.price, cargo.currency) }} {{ currency }}</p>
              <p>{{ relativeTime(cargo.publishedAt) }}</p>
            </div>
            <span class="chip" :class="cargoStatusClass(cargo.status)">{{ statusLabel(cargo.status) }}</span>
            <ChevronRight :size="18" class="text-ink-3" />
          </NuxtLink>
        </div>

        <div v-else class="card mt-4 flex flex-col items-center px-6 py-12 text-center">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-orange-soft text-orange">
            <PackagePlus :size="24" />
          </span>
          <h3 class="mt-3 font-bold text-navy">{{ t('profile.emptyTitle') }}</h3>
          <p class="mt-1 max-w-sm text-sm text-ink-2">{{ t('profile.emptyText') }}</p>
          <NuxtLink to="/elon-ber" class="btn-primary mt-4">{{ t('profile.postCargo') }}</NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, PackagePlus, Plus, UserRound } from 'lucide-vue-next';
import type { Cargo, CargoListResponse } from '~/types/cargo';

const { t, cityLabel, statusLabel, relativeTime } = useI18n();
const { currency, formatPrice } = useCurrency();
const { user, restore, logout: clearSession } = useAuth();
const router = useRouter();

const ready = ref(false);
const loading = ref(false);
const myCargos = ref<Cargo[]>([]);

const activeCount = computed(() => myCargos.value.filter((c) => c.status === 'PUBLISHED').length);
const totalViews = computed(() => myCargos.value.reduce((sum, c) => sum + c.viewCount, 0));

function logout() {
  clearSession();
  router.push('/');
}

onMounted(async () => {
  restore();
  ready.value = true;
  if (!user.value) return;

  loading.value = true;
  try {
    const res = await $fetch<CargoListResponse>('/api/cargos');
    myCargos.value = res.items.filter((c) => c.owner.phone === user.value?.phone);
  } finally {
    loading.value = false;
  }
});

useSeoMeta({
  title: () => t('profile.seoTitle'),
  robots: 'noindex',
});
</script>
