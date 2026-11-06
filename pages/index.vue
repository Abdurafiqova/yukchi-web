<template>
  <div>
    <section class="relative overflow-hidden bg-navy text-white">
      <div
        class="absolute inset-0 opacity-[0.12]"
        style="
          background-image: linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 56px 56px;
        "
      />
      <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/25 blur-3xl" />
      <div class="container-page relative pb-12 pt-14 lg:pb-16 lg:pt-20">
        <div class="max-w-3xl">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold">
            <span class="h-1.5 w-1.5 rounded-full bg-orange" />
            {{ t('home.badge') }}
          </span>
          <h1 class="mt-5 text-[34px] font-extrabold leading-[1.12] tracking-tight sm:text-[44px] lg:text-[52px]">
            {{ t('home.heroLine1') }}<br class="hidden sm:block" />
            {{ t('home.heroLine2Pre') }}<span class="text-orange">{{ t('home.heroHighlight') }}</span>{{ t('home.heroLine2Post') }}
          </h1>
          <p class="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
            {{ t('home.subtitle') }}
          </p>
        </div>

        <div class="mt-8 max-w-4xl">
          <HeroSearch />
        </div>

        <dl class="mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-wider text-white/55">{{ t('home.stat.drivers') }}</dt>
            <dd class="mt-1 text-2xl font-extrabold">1 284</dd>
          </div>
          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-wider text-white/55">{{ t('home.stat.activeCargos') }}</dt>
            <dd class="mt-1 text-2xl font-extrabold">{{ total }}</dd>
          </div>
          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-wider text-white/55">{{ t('home.stat.completed') }}</dt>
            <dd class="mt-1 text-2xl font-extrabold">342</dd>
          </div>
          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-wider text-white/55">{{ t('home.stat.onTime') }}</dt>
            <dd class="mt-1 text-2xl font-extrabold">94,2%</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="container-page py-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-[26px] font-extrabold tracking-tight text-navy sm:text-[30px]">{{ t('home.latestTitle') }}</h2>
          <p class="mt-1.5 text-[15px] text-ink-2">{{ t('home.latestSubtitle') }}</p>
        </div>
        <NuxtLink to="/yuklar" class="btn-ghost px-4 py-2.5 text-sm">
          {{ t('home.allCargos') }}
          <ArrowRight :size="16" />
        </NuxtLink>
      </div>

      <div class="mx-auto mt-7 max-w-[920px] space-y-2.5">
        <CargoCard v-for="cargo in latest" :key="cargo.id" :cargo="cargo" />
      </div>
    </section>

    <section class="border-y border-line bg-white py-14">
      <div class="container-page">
        <div class="max-w-2xl">
          <span class="text-[13px] font-bold uppercase tracking-[0.18em] text-orange">{{ t('home.whyEyebrow') }}</span>
          <h2 class="mt-2 text-[26px] font-extrabold tracking-tight text-navy sm:text-[32px]">{{ t('home.whyTitle') }}</h2>
          <p class="mt-3 text-[15px] leading-relaxed text-ink-2">{{ t('home.whyText') }}</p>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="item in whyItems" :key="item.title" class="card p-5">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-orange-soft text-orange">
              <component :is="item.icon" :size="21" />
            </span>
            <h3 class="mt-4 text-[16px] font-bold text-navy">{{ item.title }}</h3>
            <p class="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{{ item.text }}</p>
          </div>
        </div>

        <div class="relative mt-8 overflow-hidden rounded-card bg-navy px-6 py-8 text-white sm:px-9">
          <div class="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange/25 blur-3xl" />
          <div class="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider">
                {{ t('home.appBadge') }}
              </span>
              <h3 class="mt-3 text-[24px] font-extrabold leading-tight sm:text-[28px]">{{ t('home.appTitle') }}</h3>
              <p class="mt-2 max-w-lg text-[14.5px] leading-relaxed text-white/75">{{ t('home.appText') }}</p>
              <div class="mt-5 flex flex-wrap gap-3">
                <span class="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold">
                  <Smartphone :size="16" />
                  App Store
                </span>
                <span class="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold">
                  <Smartphone :size="16" />
                  Google Play
                </span>
              </div>
            </div>
            <ul class="grid gap-2.5 sm:grid-cols-2">
              <li v-for="item in appFeatures" :key="item" class="flex items-start gap-2 rounded-xl bg-white/10 px-3.5 py-3 text-[13.5px] font-medium leading-snug">
                <Check :size="16" class="mt-0.5 shrink-0 text-orange" />
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-line bg-white py-12">
      <div class="container-page">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-semibold text-ink-2">{{ t('home.cargoTypes') }}</span>
          <NuxtLink
            v-for="type in cargoTypes"
            :key="type"
            :to="{ path: '/yuklar', query: { qidiruv: type } }"
            class="chip transition hover:bg-navy hover:text-white"
          >
            {{ cargoTypeLabel(type) }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="qanday" class="container-page py-16">
      <div class="max-w-2xl">
        <span class="text-[13px] font-bold uppercase tracking-[0.18em] text-orange">{{ t('home.howEyebrow') }}</span>
        <h2 class="mt-2 text-[26px] font-extrabold tracking-tight text-navy sm:text-[32px]">{{ t('home.howTitle') }}</h2>
        <p class="mt-3 text-[15px] leading-relaxed text-ink-2">
          {{ t('home.howText') }}
        </p>
      </div>

      <div class="mt-9 grid gap-5 md:grid-cols-3">
        <div v-for="(step, index) in steps" :key="step.title" class="card p-6">
          <div class="flex items-center justify-between">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-navy-soft text-lg font-extrabold text-navy">
              {{ index + 1 }}
            </span>
            <component :is="step.icon" :size="22" class="text-orange" />
          </div>
          <h3 class="mt-5 text-[17px] font-bold text-navy">{{ step.title }}</h3>
          <p class="mt-2 text-[14px] leading-relaxed text-ink-2">{{ step.text }}</p>
        </div>
      </div>
    </section>

    <section id="haydovchilar" class="container-page pb-16">
      <div class="grid gap-5 lg:grid-cols-2">
        <div class="card overflow-hidden">
          <div class="border-b border-line bg-orange-soft p-6">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-orange text-white">
              <Package :size="22" />
            </span>
            <h3 class="mt-4 text-xl font-extrabold text-navy">{{ t('home.ownerTitle') }}</h3>
            <p class="mt-1.5 text-[14px] text-ink-2">{{ t('home.ownerSubtitle') }}</p>
          </div>
          <ul class="space-y-3 p-6 text-[14px] text-ink-2">
            <li v-for="item in ownerBenefits" :key="item" class="flex gap-2.5">
              <Check :size="18" class="mt-0.5 shrink-0 text-ok" />
              {{ item }}
            </li>
          </ul>
          <div class="px-6 pb-6">
            <NuxtLink to="/elon-ber" class="btn-primary w-full">{{ t('home.ownerCta') }}</NuxtLink>
          </div>
        </div>

        <div class="card overflow-hidden">
          <div class="border-b border-line bg-navy-soft p-6">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-navy text-white">
              <Truck :size="22" />
            </span>
            <h3 class="mt-4 text-xl font-extrabold text-navy">{{ t('home.driverTitle') }}</h3>
            <p class="mt-1.5 text-[14px] text-ink-2">{{ t('home.driverSubtitle') }}</p>
          </div>
          <ul class="space-y-3 p-6 text-[14px] text-ink-2">
            <li v-for="item in driverBenefits" :key="item" class="flex gap-2.5">
              <Check :size="18" class="mt-0.5 shrink-0 text-ok" />
              {{ item }}
            </li>
          </ul>
          <div class="px-6 pb-6">
            <NuxtLink to="/yuklar" class="btn-navy w-full">{{ t('home.driverCta') }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-page pb-20">
      <div class="relative overflow-hidden rounded-card bg-navy px-6 py-10 text-white sm:px-10">
        <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/25 blur-3xl" />
        <div class="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div class="max-w-xl">
            <h2 class="text-[26px] font-extrabold leading-tight sm:text-[30px]">{{ t('home.ctaTitle') }}</h2>
            <p class="mt-2 text-[15px] text-white/75">
              {{ t('home.ctaText') }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/elon-ber" class="btn-primary">{{ t('home.ctaPost') }}</NuxtLink>
            <NuxtLink to="/kirish" class="btn border border-white/25 text-white hover:bg-white/10">{{ t('home.ctaLogin') }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  BadgePercent,
  Check,
  FilePlus2,
  ImagePlus,
  MessageCircle,
  Navigation,
  Package,
  ShieldCheck,
  Smartphone,
  Truck,
  UserCheck,
  Zap,
} from 'lucide-vue-next';
import type { CargoListResponse } from '~/types/cargo';
import { CARGO_TYPES } from '~/shared/constants';

const { t, cargoTypeLabel } = useI18n();

const { data } = await useFetch<CargoListResponse>('/api/cargos', { query: { sort: 'new' } });

const latest = computed(() => (data.value?.items ?? []).slice(0, 4));
const total = computed(() => data.value?.total ?? 0);
const cargoTypes = CARGO_TYPES.slice(0, 5);

const steps = computed(() => [
  { title: t('home.step1Title'), text: t('home.step1Text'), icon: UserCheck },
  { title: t('home.step2Title'), text: t('home.step2Text'), icon: FilePlus2 },
  { title: t('home.step3Title'), text: t('home.step3Text'), icon: Truck },
]);

const ownerBenefits = computed(() => [
  t('home.ownerB1'),
  t('home.ownerB2'),
  t('home.ownerB3'),
  t('home.ownerB4'),
]);

const driverBenefits = computed(() => [
  t('home.driverB1'),
  t('home.driverB2'),
  t('home.driverB3'),
  t('home.driverB4'),
]);

const whyItems = computed(() => [
  { icon: BadgePercent, title: t('home.why1Title'), text: t('home.why1Text') },
  { icon: Zap, title: t('home.why2Title'), text: t('home.why2Text') },
  { icon: ShieldCheck, title: t('home.why3Title'), text: t('home.why3Text') },
  { icon: MessageCircle, title: t('home.why4Title'), text: t('home.why4Text') },
  { icon: Navigation, title: t('home.why5Title'), text: t('home.why5Text') },
  { icon: ImagePlus, title: t('home.why6Title'), text: t('home.why6Text') },
]);

const appFeatures = computed(() => [
  t('home.appF1'),
  t('home.appF2'),
  t('home.appF3'),
  t('home.appF4'),
  t('home.appF5'),
  t('home.appF6'),
]);

useSeoMeta({
  title: () => t('home.seoTitle'),
  description: () => t('home.seoDescription'),
  ogTitle: () => t('home.ogTitle'),
  ogDescription: () => t('home.ogDescription'),
  ogType: 'website',
});
</script>
