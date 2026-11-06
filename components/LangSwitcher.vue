<template>
  <div
    class="flex h-10 items-center gap-0.5 rounded-xl border border-line bg-white p-0.5"
    role="group"
    :aria-label="t('lang.switch')"
  >
    <button
      v-for="code in LOCALES"
      :key="code"
      type="button"
      class="h-full rounded-lg px-2 text-[11.5px] font-bold uppercase tracking-wide transition"
      :class="locale === code ? 'bg-navy text-white' : 'text-ink-3 hover:bg-navy-soft hover:text-navy'"
      :aria-pressed="locale === code"
      :title="LOCALE_LABELS[code]"
      @click="setLocale(code)"
    >
      {{ code }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { LOCALES, LOCALE_LABELS } from '~/i18n/messages';

const { t, locale, setLocale } = useI18n();
</script>
