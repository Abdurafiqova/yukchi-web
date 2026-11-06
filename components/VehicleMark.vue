<template>
  <span class="inline-flex flex-col items-center gap-1">
    <span
      class="grid place-items-center rounded-2xl border border-line bg-surface-2 text-navy"
      :style="{ width: `${size}px`, height: `${size * 0.72}px` }"
    >
      <component :is="icon" :size="size * 0.42" :stroke-width="1.6" />
    </span>
    <span v-if="showLabel" class="max-w-[110px] truncate text-[11px] font-semibold text-ink-3">
      {{ label }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { Car, Container, Droplets, Package, Snowflake, Truck, Wrench } from 'lucide-vue-next';
import type { VehicleType } from '~/types/cargo';

const props = withDefaults(
  defineProps<{ type: VehicleType; label?: string; size?: number; showLabel?: boolean }>(),
  { label: '', size: 64, showLabel: true },
);

const ICONS: Record<string, unknown> = {
  Awning: Truck,
  Flatbed: Truck,
  Refrigerated: Snowflake,
  Tipper: Truck,
  Tanker: Droplets,
  Van: Package,
  Isothermal: Snowflake,
  Container,
  'Car Carrier': Car,
  Crane: Wrench,
};

const icon = computed(() => ICONS[props.type] ?? Truck);
</script>
