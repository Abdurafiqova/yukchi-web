<template>
  <NuxtLink
    :to="`/yuklar/${cargo.id}`"
    class="card group block overflow-hidden px-5 py-4 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-float"
  >
    <div class="grid grid-cols-[84px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-x-4">
      <div class="row-span-2 flex flex-col items-center justify-center gap-1">
        <VehicleMark :type="cargo.requiredVehicleType" :label="vehicleLabel(cargo.requiredVehicleType)" :size="84" />
      </div>

      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-1.5 text-[12px] font-bold">
            <span
              class="inline-flex items-center gap-1"
              :class="cargo.readyToLoad ? 'text-ok' : 'text-ink-3'"
            >
              <span
                class="h-1.5 w-1.5 shrink-0 rounded-full"
                :class="cargo.readyToLoad ? 'bg-ok' : 'bg-ink-3'"
              />
              {{ cargo.readyToLoad ? t('cargo.ready') : formatDate(cargo.pickupDate) }}
            </span>
            <span v-if="cargo.isAdditionalLoad" class="rounded-full bg-orange-soft px-2 py-0.5 text-[11px] font-bold text-orange-deep">
              {{ t('cargo.additional') }}
            </span>
          </div>

          <div class="mt-1.5 truncate text-[20px] font-extrabold leading-tight text-ink">
            {{ cityLabel(cargo.pickup.city) }}
          </div>

          <div class="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-ink-2">
            <span class="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-[3px]">
              <Weight :size="12" class="text-ink-3" />
              {{ formatTons(cargo.weightKg) }}
            </span>
            <span v-if="cargo.volumeM3" class="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-[3px]">
              {{ cargo.volumeM3 }} m³
            </span>
            <span v-if="cargo.trucksNeeded > 1" class="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-[3px]">
              <Truck :size="12" class="text-ink-3" />
              {{ t('cargo.trucks', { n: cargo.trucksNeeded }) }}
            </span>
          </div>
        </div>

        <div class="shrink-0 text-right">
          <div class="text-[17px] font-extrabold leading-none text-ink sm:text-[18px]">
            {{ cargo.priceNegotiable || !cargo.price ? t('cargo.negotiable') : formatPrice(cargo.price, cargo.currency) }}
          </div>
          <div v-if="!cargo.priceNegotiable && cargo.price" class="mt-0.5 text-[10.5px] font-semibold text-ink-3">
            {{ currency }}
          </div>
          <span class="mt-1.5 inline-block rounded-full bg-navy-soft px-2.5 py-[3px] text-[11.5px] font-bold text-navy">
            {{ paymentLabel(cargo.paymentMethod) }}
          </span>
          <div class="mt-1 flex items-center justify-end gap-1 text-[11.5px] font-medium text-ink-3">
            {{ formatTime(cargo.publishedAt) }}
            <Eye :size="12" class="ml-0.5 shrink-0" />
            {{ cargo.viewCount }}
          </div>
        </div>
      </div>

      <div class="col-span-2 mt-3.5 flex items-center gap-3 sm:col-span-1">
        <span class="min-w-0 max-w-[40%]">
          <span class="block truncate text-[13px] font-semibold text-ink-2">
            {{ cityLabel(cargo.pickup.city) }}
          </span>
        </span>

        <span class="min-w-0 flex-1">
          <span class="block truncate text-center text-[11px] font-semibold text-ink-3">
            {{ cargo.title }}
          </span>
          <span class="relative mt-1 block h-[16px]">
            <span class="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-line-strong" />
            <span class="absolute left-1/2 top-1/2 grid h-5 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded bg-surface text-orange">
              <Truck :size="16" :stroke-width="2.2" />
            </span>
          </span>
        </span>

        <span class="min-w-0 max-w-[40%] text-right">
          <span class="block truncate text-[13px] font-semibold text-ink-2">
            {{ cityLabel(cargo.dropoff.city) }}
          </span>
        </span>
      </div>
    </div>

    <p class="mt-2 truncate text-[12px] font-medium text-ink-3 sm:pl-[112px]">
      {{ cargo.description || cargo.title }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Eye, Truck, Weight } from 'lucide-vue-next';
import type { Cargo } from '~/types/cargo';

defineProps<{ cargo: Cargo }>();

const { t, cityLabel, vehicleLabel, paymentLabel, formatTons, formatDate, formatTime } = useI18n();
const { currency, formatPrice } = useCurrency();
</script>
