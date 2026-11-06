<template>
  <div class="container-page py-8">
    <div v-if="route.query.yangi === '1'" class="mb-6 flex items-start gap-3 rounded-card border border-ok/30 bg-ok-bg px-5 py-4">
      <CheckCircle2 :size="20" class="mt-0.5 shrink-0 text-ok" />
      <div>
        <p class="font-semibold text-ok">{{ t('detail.successTitle') }}</p>
        <p class="text-sm text-ink-2">{{ t('detail.successText') }}</p>
      </div>
    </div>

    <nav class="flex items-center gap-2 text-sm text-ink-3">
      <NuxtLink to="/" class="hover:text-navy">{{ t('detail.home') }}</NuxtLink>
      <ChevronRight :size="14" />
      <NuxtLink to="/yuklar" class="hover:text-navy">{{ t('detail.cargos') }}</NuxtLink>
      <ChevronRight :size="14" />
      <span class="font-medium text-ink">{{ cargo.id }}</span>
    </nav>

    <div class="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="min-w-0 space-y-6">
        <div class="card overflow-hidden">
          <div v-if="cargo.images.length" class="relative aspect-[16/9] bg-navy-soft">
            <img :src="activeImage?.url" :alt="activeImage?.alt" class="h-full w-full object-cover" />
            <span class="absolute left-4 top-4 chip bg-white/95">{{ cargo.id }}</span>
            <span v-if="cargo.priceNegotiable" class="absolute right-4 top-4 chip-warm">{{ t('detail.negotiable') }}</span>
          </div>
          <div v-else class="relative flex aspect-[16/9] flex-col items-center justify-center gap-3 bg-surface-2">
            <VehicleMark :type="cargo.requiredVehicleType" :label="vehicleLabel(cargo.requiredVehicleType)" :size="140" />
            <p class="text-sm font-medium text-ink-3">{{ t('detail.noPhoto') }}</p>
            <span class="absolute left-4 top-4 chip bg-white/95">{{ cargo.id }}</span>
            <span v-if="cargo.priceNegotiable" class="absolute right-4 top-4 chip-warm">{{ t('detail.negotiable') }}</span>
          </div>
          <div v-if="cargo.images.length > 1" class="flex gap-2 p-3">
            <button
              v-for="(image, index) in cargo.images"
              :key="image.url + index"
              type="button"
              class="h-16 w-24 overflow-hidden rounded-lg border-2 transition"
              :class="index === activeIndex ? 'border-orange' : 'border-transparent opacity-70 hover:opacity-100'"
              @click="activeIndex = index"
            >
              <img :src="image.url" :alt="image.alt" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 class="text-[26px] font-extrabold leading-tight text-navy sm:text-[30px]">{{ cargo.title }}</h1>
              <p class="mt-1.5 text-sm text-ink-2">
                {{ cargoTypeLabel(cargo.cargoType) }} · {{ t('detail.posted', { time: relativeTime(cargo.publishedAt) }) }} · {{ t('detail.views', { count: cargo.viewCount }) }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] font-bold">
                <span class="inline-flex items-center gap-1" :class="cargo.readyToLoad ? 'text-ok' : 'text-ink-3'">
                  <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="cargo.readyToLoad ? 'bg-ok' : 'bg-ink-3'" />
                  {{ cargo.readyToLoad ? t('cargo.ready') : formatDateTime(cargo.pickupDate) }}
                </span>
                <span v-if="cargo.isAdditionalLoad" class="rounded-full bg-orange-soft px-2 py-0.5 text-[11px] font-bold text-orange-deep">
                  {{ t('cargo.additional') }}
                </span>
              </div>
            </div>
            <span class="chip" :class="cargoStatusClass(cargo.status)">{{ statusLabel(cargo.status) }}</span>
          </div>

          <div class="mt-6 rounded-xl border border-line bg-surface-2 p-5">
            <div class="flex items-start gap-4">
              <div class="flex flex-col items-center pt-1.5">
                <span class="h-3 w-3 rounded-full border-[3px] border-navy" />
                <span class="my-1 h-14 w-px border-l border-dashed border-line-strong" />
                <span class="h-3 w-3 rounded-full bg-orange" />
              </div>
              <div class="flex-1 space-y-5">
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.pickup') }}</p>
                  <p class="mt-0.5 font-semibold text-ink">{{ cityLabel(cargo.pickup.city) }} — {{ cargo.pickup.address }}</p>
                  <p class="text-sm text-ink-2">{{ formatDateTime(cargo.pickupDate) }}</p>
                </div>
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.dropoff') }}</p>
                  <p class="mt-0.5 font-semibold text-ink">{{ cityLabel(cargo.dropoff.city) }} — {{ cargo.dropoff.address }}</p>
                  <p class="text-sm text-ink-2">{{ cargo.dropoff.region }}</p>
                </div>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              <a :href="pickupMapUrl" target="_blank" rel="noopener" class="btn-ghost px-4 py-2 text-sm">
                <MapPin :size="15" />
                {{ t('detail.openPickupMap') }}
              </a>
              <a :href="routeMapUrl" target="_blank" rel="noopener" class="btn-navy px-4 py-2 text-sm">
                <Navigation :size="15" />
                {{ t('detail.openRoute') }}
              </a>
            </div>
          </div>

          <dl class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-line p-4">
              <dt class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.weight') }}</dt>
              <dd class="mt-1 text-[17px] font-bold text-navy">{{ formatTons(cargo.weightKg) }}</dd>
            </div>
            <div class="rounded-xl border border-line p-4">
              <dt class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.volume') }}</dt>
              <dd class="mt-1 text-[17px] font-bold text-navy">{{ cargo.volumeM3 ? cargo.volumeM3 + ' m³' : '—' }}</dd>
            </div>
            <div class="rounded-xl border border-line p-4">
              <dt class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.vehicle') }}</dt>
              <dd class="mt-1 text-[17px] font-bold text-navy">{{ vehicleLabel(cargo.requiredVehicleType) }}</dd>
            </div>
            <div class="rounded-xl border border-line p-4">
              <dt class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.cargoType') }}</dt>
              <dd class="mt-1 text-[15px] font-bold text-navy">{{ cargoTypeLabel(cargo.cargoType) }}</dd>
            </div>
          </dl>

          <div class="mt-4 rounded-xl border border-line p-5">
            <h2 class="text-sm font-bold uppercase tracking-wider text-ink-2">{{ t('detail.paymentMethod') }}</h2>
            <div class="mt-3 flex flex-wrap gap-2 text-[13px] font-semibold">
              <span class="rounded-full bg-navy-soft px-3 py-1.5 text-navy">{{ paymentLabel(cargo.paymentMethod) }}</span>
              <span class="rounded-full bg-surface-2 px-3 py-1.5 text-ink-2">
                {{ t('detail.advance') }}:
                {{ cargo.advanceAmount ? formatPrice(cargo.advanceAmount, cargo.currency) + ' ' + currency : '—' }}
              </span>
              <span class="rounded-full bg-surface-2 px-3 py-1.5 text-ink-2">
                {{ t('detail.trucksNeeded') }}: {{ cargo.trucksNeeded }}
              </span>
              <span
                class="rounded-full px-3 py-1.5"
                :class="cargo.readyToLoad ? 'bg-ok-bg text-ok' : 'bg-surface-2 text-ink-2'"
              >
                {{ cargo.readyToLoad ? t('detail.readyToLoad') : `${t('detail.scheduledFor')}: ${formatDateTime(cargo.pickupDate)}` }}
              </span>
              <span v-if="cargo.isAdditionalLoad" class="rounded-full bg-orange-soft px-3 py-1.5 text-orange-deep">
                {{ t('detail.additionalLoad') }}
              </span>
            </div>
          </div>

          <div v-if="cargo.description" class="mt-6">
            <h2 class="text-sm font-bold uppercase tracking-wider text-ink-2">{{ t('detail.about') }}</h2>
            <p class="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink-2">{{ cargo.description }}</p>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-ink-2">{{ t('detail.owner') }}</h2>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="grid h-12 w-12 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                {{ cargo.owner.initials }}
              </span>
              <div>
                <p class="font-semibold text-ink">{{ cargo.owner.name }}</p>
                <p class="text-sm text-ink-2">
                  {{ t('detail.ownerStats', { count: cargo.owner.postedCount, minutes: cargo.owner.replyMinutes }) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 rounded-full bg-ok-bg px-3 py-1.5 text-sm font-bold text-ok">
              <Star :size="15" class="fill-ok" />
              {{ cargo.owner.rating ? cargo.owner.rating.toFixed(1) : t('common.new') }}
            </div>
          </div>
        </div>

        <section v-if="similar.length">
          <h2 class="mb-3 text-lg font-extrabold text-navy">{{ t('detail.similar') }}</h2>
          <div class="space-y-2.5">
            <CargoCard v-for="item in similar" :key="item.id" :cargo="item" />
          </div>
        </section>
      </div>

      <aside class="space-y-4 lg:sticky lg:top-[88px] lg:self-start">
        <div class="card p-6">
          <p class="text-[11px] font-bold uppercase tracking-wider text-ink-3">{{ t('detail.payment') }}</p>
          <p class="mt-1 text-[30px] font-extrabold leading-none text-navy">
            {{ cargo.priceNegotiable || !cargo.price ? t('cargo.negotiable') : formatPrice(cargo.price, cargo.currency) }}
            <span v-if="!cargo.priceNegotiable && cargo.price" class="text-sm font-semibold text-ink-3">{{ currency }}</span>
          </p>
          <p class="mt-1.5 text-sm text-ink-2">
            {{ cargo.priceNegotiable ? t('detail.negotiable') : t('detail.fixed') }}
          </p>

          <div class="mt-3 flex flex-wrap gap-1.5 text-[12px] font-semibold">
            <span class="rounded-full bg-navy-soft px-2.5 py-1 text-navy">{{ paymentLabel(cargo.paymentMethod) }}</span>
            <span v-if="cargo.advanceAmount" class="rounded-full bg-surface-2 px-2.5 py-1 text-ink-2">
              {{ t('detail.advance') }}: {{ formatPrice(cargo.advanceAmount, cargo.currency) }} {{ currency }}
            </span>
          </div>

          <div class="mt-5 space-y-2.5">
            <a
              v-if="user"
              :href="telHref(cargo.owner.phone)"
              class="btn-primary w-full"
            >
              <Phone :size="17" />
              {{ prettyPhone(cargo.owner.phone) }}
            </a>
            <NuxtLink v-else :to="{ path: '/kirish', query: { next: route.fullPath } }" class="btn-primary w-full">
              <Phone :size="17" />
              {{ t('detail.showPhone') }}
            </NuxtLink>

            <a :href="routeMapUrl" target="_blank" rel="noopener" class="btn-ghost w-full">
              <Navigation :size="17" />
              Yandex Navigator
            </a>
          </div>

          <p v-if="!user" class="mt-3 text-center text-[12px] leading-relaxed text-ink-3">
            {{ t('detail.phoneHidden') }}
          </p>
        </div>

        <div class="card p-5">
          <div class="flex items-center gap-2 text-sm font-semibold text-navy">
            <ShieldCheck :size="17" class="text-ok" />
            {{ t('detail.safetyTitle') }}
          </div>
          <ul class="mt-3 space-y-2 text-[13px] leading-relaxed text-ink-2">
            <li>{{ t('detail.safety1') }}</li>
            <li>{{ t('detail.safety2') }}</li>
            <li>{{ t('detail.safety3') }}</li>
          </ul>
        </div>

        <div class="rounded-card border border-line bg-white p-5 text-[13px] text-ink-2">
          <p>{{ t('detail.expires') }} <span class="font-semibold text-ink">{{ formatDate(cargo.expiresAt) }}</span></p>
          <p class="mt-1">{{ t('detail.cargoId') }} <span class="font-semibold text-ink">{{ cargo.id }}</span></p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-vue-next';
import type { Cargo } from '~/types/cargo';

const { t, cityLabel, vehicleLabel, paymentLabel, cargoTypeLabel, statusLabel, formatMoney, formatTons, formatDate, formatDateTime, relativeTime } = useI18n();
const { currency, formatPrice } = useCurrency();
const route = useRoute();
const { user } = useAuth();

const { data, error } = await useFetch<Cargo>(`/api/cargos/${route.params.id}`);

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: t('detail.notFound') });
}

const cargo = computed(() => data.value as Cargo);
const activeIndex = ref(0);
const activeImage = computed(() => cargo.value.images[activeIndex.value] ?? cargo.value.images[0]);

const { data: allCargos } = await useFetch<{ items: Cargo[] }>('/api/cargos');

function similarity(item: Cargo) {
  let score = 0;
  if (item.cargoType === cargo.value.cargoType) score += 2;
  if (item.pickup.city === cargo.value.pickup.city) score += 1;
  if (item.dropoff.city === cargo.value.dropoff.city) score += 1;
  if (item.requiredVehicleType === cargo.value.requiredVehicleType) score += 1;
  return score;
}

const similar = computed(() =>
  (allCargos.value?.items ?? [])
    .filter((item) => item.id !== cargo.value.id && item.status === 'PUBLISHED')
    .sort(
      (a, b) =>
        similarity(b) - similarity(a) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    )
    .slice(0, 3),
);

const pickupMapUrl = computed(() =>
  yandexMapUrl(cargo.value.pickup.lat, cargo.value.pickup.lng),
);
const routeMapUrl = computed(() =>
  yandexRouteUrl(
    cargo.value.pickup.lat,
    cargo.value.pickup.lng,
    cargo.value.dropoff.lat,
    cargo.value.dropoff.lng,
  ),
);

useSeoMeta({
  title: () =>
    t('detail.seoTitle', {
      title: cargo.value.title,
      from: cityLabel(cargo.value.pickup.city),
      to: cityLabel(cargo.value.dropoff.city),
    }),
  description: () =>
    t('detail.seoDescription', {
      title: cargo.value.title,
      weight: formatTons(cargo.value.weightKg),
      from: cityLabel(cargo.value.pickup.city),
      to: cityLabel(cargo.value.dropoff.city),
      price: formatMoney(cargo.value.price),
      currency: cargo.value.currency,
    }),
  ogTitle: () => `${cargo.value.title} — Yukchi.uz`,
  ogImage: () => cargo.value.images[0]?.url,
});
</script>
