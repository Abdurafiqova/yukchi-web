<template>
  <div class="container-page py-10">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-[30px] font-extrabold tracking-tight text-navy sm:text-[36px]">{{ t('list.title') }}</h1>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-ok-bg px-2.5 py-1 text-[12px] font-bold text-ok">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
            {{ t('list.live') }}
          </span>
        </div>
        <p class="mt-1.5 text-[15px] text-ink-2">
          {{ pending ? t('list.loading') : t('list.count', { count: total }) }}
        </p>
      </div>

      <div class="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
        <form class="flex flex-1 gap-2" @submit.prevent="submitSearch">
          <div class="relative flex-1">
            <Search :size="17" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              v-model="search"
              type="search"
              class="field pl-10"
              :placeholder="t('list.searchPlaceholder')"
              :aria-label="t('list.searchAria')"
            />
          </div>
          <button type="submit" class="btn-navy px-5">{{ t('list.searchBtn') }}</button>
        </form>
        <NuxtLink to="/elon-ber" class="btn-primary shrink-0 px-5">
          <Plus :size="16" />
          {{ t('list.postCargo') }}
        </NuxtLink>
      </div>
    </div>

    <div class="mt-6">
      <FilterBar />
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-ink-2">
        <span class="font-semibold text-ink">{{ t('list.results', { count: total }) }}</span>
        <template v-if="activeFilterText"> · {{ activeFilterText }}</template>
      </p>
      <label class="flex items-center gap-2 text-sm text-ink-2">
        {{ t('list.sort') }}
        <select :value="sort" class="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-navy" @change="changeSort">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
    </div>

    <div v-if="pending" class="mx-auto mt-6 max-w-[920px] space-y-2.5">
      <div v-for="n in 6" :key="n" class="card h-[150px] animate-pulse bg-navy-soft/40" />
    </div>

    <div v-else-if="items.length" class="mx-auto mt-6 max-w-[920px] space-y-2.5">
      <CargoCard v-for="cargo in items" :key="cargo.id" :cargo="cargo" />
    </div>

    <div v-else class="card mt-8 flex flex-col items-center px-6 py-16 text-center">
      <span class="grid h-14 w-14 place-items-center rounded-2xl bg-navy-soft text-navy">
        <SearchX :size="26" />
      </span>
      <h2 class="mt-4 text-lg font-bold text-navy">{{ t('list.emptyTitle') }}</h2>
      <p class="mt-1.5 max-w-md text-sm text-ink-2">
        {{ t('list.emptyText') }}
      </p>
      <NuxtLink to="/yuklar" class="btn-ghost mt-5">{{ t('list.clearFilters') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search, SearchX } from 'lucide-vue-next';
import type { CargoListResponse } from '~/types/cargo';

const { t, cityLabel, vehicleLabel, sortOptions } = useI18n();
const route = useRoute();
const router = useRouter();

const search = ref(String(route.query.qidiruv ?? ''));
const sort = computed(() => String(route.query.saralash ?? 'new'));

const apiQuery = computed(() => ({
  q: String(route.query.qidiruv ?? ''),
  from: String(route.query.dan ?? ''),
  to: String(route.query.ga ?? ''),
  vehicle: String(route.query.mashina ?? ''),
  minWeight: String(route.query.ogirlik ?? ''),
  sort: sort.value,
}));

const { data, pending } = await useFetch<CargoListResponse>('/api/cargos', {
  query: apiQuery,
  watch: [apiQuery],
});

const items = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);

const activeFilterText = computed(() => {
  const parts: string[] = [];
  if (route.query.dan) parts.push(t('list.filterFrom', { city: cityLabel(String(route.query.dan)) }));
  if (route.query.ga) parts.push(t('list.filterTo', { city: cityLabel(String(route.query.ga)) }));
  if (route.query.mashina) parts.push(vehicleLabel(String(route.query.mashina)));
  if (route.query.ogirlik) parts.push(t('filter.weightMin', { n: route.query.ogirlik }));
  if (route.query.qidiruv) parts.push(`«${route.query.qidiruv}»`);
  return parts.join(' · ');
});

watch(search, (value) => {
  if (!value && route.query.qidiruv) {
    const rest = { ...route.query };
    delete rest.qidiruv;
    router.push({ path: '/yuklar', query: rest });
  }
});

function submitSearch() {
  router.push({ path: '/yuklar', query: { ...route.query, qidiruv: search.value || undefined } });
}

function changeSort(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  router.push({ path: '/yuklar', query: { ...route.query, saralash: value === 'new' ? undefined : value } });
}

const title = computed(() => {
  const parts: string[] = [];
  if (route.query.dan) parts.push(t('list.filterFrom', { city: cityLabel(String(route.query.dan)) }));
  if (route.query.ga) parts.push(t('list.filterTo', { city: cityLabel(String(route.query.ga)) }));
  return parts.length
    ? t('list.seoTitleFiltered', { route: parts.join(' ') })
    : t('list.seoTitle');
});

useSeoMeta({
  title,
  description: () => t('list.seoDescription'),
});
</script>
