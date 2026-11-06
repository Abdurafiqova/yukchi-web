<template>
  <form class="grid gap-3 rounded-card bg-white p-4 shadow-float sm:p-5 lg:grid-cols-[1fr_1fr_auto]" @submit.prevent="search">
    <div class="relative">
      <label class="label" for="hero-from">{{ t('filter.from') }}</label>
      <MapPin :size="17" class="pointer-events-none absolute bottom-[15px] left-3.5 text-orange" />
      <select id="hero-from" v-model="from" class="field pl-10">
        <option value="">{{ t('filter.cityPlaceholder') }}</option>
        <option v-for="city in cityOptions()" :key="city.value" :value="city.value">{{ city.label }}</option>
      </select>
    </div>

    <div class="relative">
      <label class="label" for="hero-to">{{ t('filter.to') }}</label>
      <Flag :size="17" class="pointer-events-none absolute bottom-[15px] left-3.5 text-navy" />
      <select id="hero-to" v-model="to" class="field pl-10">
        <option value="">{{ t('filter.cityPlaceholder') }}</option>
        <option v-for="city in cityOptions()" :key="city.value" :value="city.value">{{ city.label }}</option>
      </select>
    </div>

    <div class="flex items-end">
      <button type="submit" class="btn-primary h-[46px] w-full px-7 lg:w-auto">
        <Search :size="17" />
        {{ t('home.findCargo') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Flag, MapPin, Search } from 'lucide-vue-next';

const { t, cityOptions } = useI18n();

const from = ref('');
const to = ref('');
const router = useRouter();

function search() {
  const query: Record<string, string> = {};
  if (from.value) query.dan = from.value;
  if (to.value) query.ga = to.value;
  router.push({ path: '/yuklar', query });
}
</script>
