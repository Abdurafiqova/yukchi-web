<template>
  <label
    class="relative flex h-10 w-[92px] cursor-pointer items-center rounded-xl border border-line bg-white text-navy"
    :title="t('currency.viewIn')"
  >
    <Coins :size="15" class="pointer-events-none absolute left-2.5 text-ink-3" />
    <select
      :value="currency"
      class="h-full w-full cursor-pointer appearance-none bg-transparent pl-8 pr-5 text-[12px] font-bold uppercase tracking-wide outline-none"
      :aria-label="t('currency.viewIn')"
      @change="onChange"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.value }} — {{ option.label }}
      </option>
    </select>
    <ChevronDown :size="14" class="pointer-events-none absolute right-2 text-ink-3" />
  </label>
</template>

<script setup lang="ts">
import { ChevronDown, Coins } from 'lucide-vue-next';
import type { CurrencyCode } from '~/shared/currency';

const { t } = useI18n();
const { currency, setCurrency, options } = useCurrency();

function onChange(event: Event) {
  setCurrency((event.target as HTMLSelectElement).value as CurrencyCode);
}
</script>
