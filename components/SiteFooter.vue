<template>
  <footer class="mt-20 border-t border-line bg-white">
    <div class="container-page grid gap-10 py-12 md:grid-cols-4">
      <div>
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-2xl bg-orange text-lg font-extrabold text-white">Y</span>
          <span class="text-[15px] font-extrabold tracking-wide text-navy">YUKCHI.UZ</span>
        </div>
        <p class="mt-4 max-w-[260px] text-sm leading-relaxed text-ink-2">
          {{ t('footer.about') }}
        </p>
      </div>

      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-navy">{{ t('footer.platform') }}</h4>
        <ul class="mt-4 space-y-2.5 text-sm text-ink-2">
          <li><NuxtLink to="/yuklar" class="hover:text-navy">{{ t('footer.cargos') }}</NuxtLink></li>
          <li><NuxtLink to="/elon-ber" class="hover:text-navy">{{ t('footer.post') }}</NuxtLink></li>
          <li><NuxtLink to="/#qanday" class="hover:text-navy">{{ t('footer.how') }}</NuxtLink></li>
          <li><NuxtLink to="/kirish" class="hover:text-navy">{{ t('footer.login') }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-navy">{{ t('footer.directions') }}</h4>
        <ul class="mt-4 space-y-2.5 text-sm text-ink-2">
          <li v-for="city in footerCities" :key="city">
            <NuxtLink :to="{ path: '/yuklar', query: { dan: city } }" class="hover:text-navy">
              {{ t('footer.fromCity', { city: cityLabel(city) }) }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-navy">{{ t('footer.contact') }}</h4>
        <ul class="mt-4 space-y-2.5 text-sm text-ink-2">
          <li>+998 71 200 00 00</li>
          <li>hello@yukchi.uz</li>
          <li>{{ t('footer.city') }}</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-line">
      <div class="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-ink-3 sm:flex-row sm:items-center">
        <span>{{ t('footer.rights', { year: new Date().getFullYear() }) }}</span>
        <span>{{ t('footer.madeIn') }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, cityLabel } = useI18n();

const footerCities = ['Toshkent', 'Samarqand', 'Buxoro', "Farg'ona"];
</script>
