<template>
  <div class="card p-4 sm:p-5">
    <form class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto]" @submit.prevent="apply">
      <div>
        <label class="label" for="filter-from">{{ t('filter.from') }}</label>
        <select id="filter-from" v-model="form.from" class="field">
          <option value="">{{ t('filter.allCities') }}</option>
          <option v-for="city in cityOptions()" :key="city.value" :value="city.value">{{ city.label }}</option>
        </select>
      </div>

      <div>
        <label class="label" for="filter-to">{{ t('filter.to') }}</label>
        <select id="filter-to" v-model="form.to" class="field">
          <option value="">{{ t('filter.allCities') }}</option>
          <option v-for="city in cityOptions()" :key="city.value" :value="city.value">{{ city.label }}</option>
        </select>
      </div>

      <div>
        <label class="label" for="filter-vehicle">{{ t('filter.vehicle') }}</label>
        <select id="filter-vehicle" v-model="form.vehicle" class="field">
          <option value="">{{ t('filter.all') }}</option>
          <option v-for="type in VEHICLE_TYPES" :key="type" :value="type">{{ vehicleLabel(type) }}</option>
        </select>
      </div>

      <div>
        <label class="label" for="filter-weight">{{ t('filter.weight') }}</label>
        <select id="filter-weight" v-model="form.minWeight" class="field">
          <option v-for="option in weightOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </div>

      <div class="flex items-end gap-2">
        <button type="submit" class="btn-primary h-[46px] flex-1 px-5">
          <Search :size="16" />
          {{ t('filter.apply') }}
        </button>
        <button
          v-if="hasFilters"
          type="button"
          class="btn-ghost h-[46px] px-4"
          @click="reset"
        >
          {{ t('filter.clear') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { VEHICLE_TYPES, WEIGHT_OPTIONS } from '~/shared/constants';

const { t, cityOptions, vehicleLabel } = useI18n();
const route = useRoute();
const router = useRouter();

const form = reactive({ from: '', to: '', vehicle: '', minWeight: '' });

const weightOptions = computed(() =>
  WEIGHT_OPTIONS.map((option) => ({
    value: option.value,
    label: option.value ? t('filter.weightMin', { n: option.value }) : t('filter.anyWeight'),
  })),
);

const hasFilters = computed(() => Boolean(form.from || form.to || form.vehicle || form.minWeight));

function syncFromRoute() {
  form.from = String(route.query.dan ?? '');
  form.to = String(route.query.ga ?? '');
  form.vehicle = String(route.query.mashina ?? '');
  form.minWeight = String(route.query.ogirlik ?? '');
}

watchEffect(syncFromRoute);

function apply() {
  const query: Record<string, string> = {};
  if (form.from) query.dan = form.from;
  if (form.to) query.ga = form.to;
  if (form.vehicle) query.mashina = form.vehicle;
  if (form.minWeight) query.ogirlik = form.minWeight;
  if (route.query.saralash) query.saralash = String(route.query.saralash);
  if (route.query.qidiruv) query.qidiruv = String(route.query.qidiruv);
  router.push({ path: '/yuklar', query });
}

function reset() {
  form.from = '';
  form.to = '';
  form.vehicle = '';
  form.minWeight = '';
  router.push({ path: '/yuklar' });
}
</script>
