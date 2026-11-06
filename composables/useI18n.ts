import type { Locale, MessageKey } from '~/i18n/messages';
import { LOCALES, messages } from '~/i18n/messages';
import { CARGO_TYPES, CITIES, SORT_OPTIONS } from '~/shared/constants';

const LOCALE_COOKIE = 'yukchi.locale';

const CITY_KEYS: Record<string, string> = {
  Toshkent: 'Toshkent',
  Samarqand: 'Samarqand',
  Buxoro: 'Buxoro',
  Jizzax: 'Jizzax',
  "Farg'ona": 'Fargona',
  Andijon: 'Andijon',
  Namangan: 'Namangan',
  Nukus: 'Nukus',
  Termiz: 'Termiz',
  Qarshi: 'Qarshi',
  Navoiy: 'Navoiy',
  Xorazm: 'Xorazm',
};

const CARGO_TYPE_KEYS = [
  'construction',
  'food',
  'metal',
  'textile',
  'agriculture',
  'mixed',
  'other',
];

const SORT_KEYS: Record<string, string> = {
  new: 'new',
  price_asc: 'priceAsc',
  price_desc: 'priceDesc',
  weight_desc: 'weightDesc',
};

const MONTHS: Record<Locale, string[]> = {
  uz: [
    'yanvar',
    'fevral',
    'mart',
    'aprel',
    'may',
    'iyun',
    'iyul',
    'avgust',
    'sentabr',
    'oktabr',
    'noyabr',
    'dekabr',
  ],
  ru: [
    'янв.',
    'февр.',
    'мар.',
    'апр.',
    'мая',
    'июн.',
    'июл.',
    'авг.',
    'сент.',
    'окт.',
    'нояб.',
    'дек.',
  ],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

// Hosting builds in UTC while visitors browse from any timezone; pinning the
// display zone keeps prerendered HTML and client render identical.
const DISPLAY_TZ = 'Asia/Tashkent';

function zonedParts(iso: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DISPLAY_TZ,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(iso));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return {
    day: Number(value('day')),
    month: Number(value('month')) - 1,
    year: Number(value('year')),
    time: `${value('hour')}:${value('minute')}`,
  };
}

export function useI18n() {
  const cookie = useCookie<Locale>(LOCALE_COOKIE, {
    default: () => 'uz',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });

  const state = useState<Locale>('yukchi-locale', () =>
    LOCALES.includes(cookie.value) ? cookie.value : 'uz',
  );

  const locale = computed<Locale>(() => state.value);

  // Frozen during prerender and shipped in the payload, so "2 kun oldin"
  // labels match between the built HTML and the browser.
  const renderNow = useState<number>('yukchi-render-now', () => Date.now());

  function setLocale(next: Locale) {
    state.value = next;
    cookie.value = next;
  }

  function t(key: MessageKey, params?: Record<string, string | number>) {
    let value = messages[locale.value][key] ?? messages.uz[key] ?? key;
    if (params) {
      for (const [name, replacement] of Object.entries(params)) {
        value = value.split(`{${name}}`).join(String(replacement));
      }
    }
    return value;
  }

  function statusLabel(value: string) {
    const key = `status.${value}` as MessageKey;
    return messages[locale.value][key] ?? value;
  }

  function vehicleLabel(value: string) {
    const key = `vehicle.${value}` as MessageKey;
    return messages[locale.value][key] ?? value;
  }

  function paymentLabel(value: string) {
    const key = `payment.${value.toLowerCase()}` as MessageKey;
    return messages[locale.value][key] ?? value;
  }

  function cityLabel(value: string) {
    const suffix = CITY_KEYS[value];
    if (!suffix) return value;
    const key = `city.${suffix}` as MessageKey;
    return messages[locale.value][key] ?? value;
  }

  function cargoTypeLabel(value: string) {
    const index = (CARGO_TYPES as readonly string[]).indexOf(value);
    if (index < 0) return value;
    const key = `cargoType.${CARGO_TYPE_KEYS[index]}` as MessageKey;
    return messages[locale.value][key] ?? value;
  }

  function cityOptions() {
    return CITIES.map((city) => ({ value: city, label: cityLabel(city) }));
  }

  const sortOptions = computed(() =>
    SORT_OPTIONS.map((option) => ({
      value: option.value,
      label: t(`sort.${SORT_KEYS[option.value]}` as MessageKey),
    })),
  );

  function formatMoney(value: number) {
    const rounded = String(Math.round(value));
    if (locale.value === 'en') return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function formatTons(kg: number) {
    const value = (kg / 1000).toFixed(kg % 1000 === 0 ? 0 : 1);
    return `${value} ${t('unit.ton')}`;
  }

  function formatDate(iso: string | null | undefined) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    const z = zonedParts(iso);
    return `${z.day} ${MONTHS[locale.value][z.month]} ${z.year}`;
  }

  function formatDateTime(iso: string | null | undefined) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    const z = zonedParts(iso);
    const day = locale.value === 'uz' ? `${z.day}-${MONTHS.uz[z.month]}` : `${z.day} ${MONTHS[locale.value][z.month]}`;
    return `${day}, ${z.time}`;
  }

  function relativeTime(iso: string | null | undefined) {
    if (!iso) return '';
    const diff = renderNow.value - new Date(iso).getTime();
    const minutes = Math.max(1, Math.round(diff / 60000));
    if (minutes < 60) return t('rel.minutes', { n: minutes });
    const hours = Math.round(minutes / 60);
    if (hours < 24) return t('rel.hours', { n: hours });
    const days = Math.round(hours / 24);
    if (days < 30) return t('rel.days', { n: days });
    return formatDate(iso);
  }

  function formatTime(iso: string | null | undefined) {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return zonedParts(iso).time;
  }

  return {
    locale,
    setLocale,
    t,
    statusLabel,
    vehicleLabel,
    paymentLabel,
    cityLabel,
    cargoTypeLabel,
    cityOptions,
    sortOptions,
    formatMoney,
    formatTons,
    formatDate,
    formatDateTime,
    relativeTime,
    formatTime,
  };
}
