import type { MessageKey } from '~/i18n/messages';
import { CURRENCY_CODES, convertCurrency, formatCurrencyAmount, isCurrencyCode, type CurrencyCode } from '~/shared/currency';

const CURRENCY_COOKIE = 'yukchi-currency';

export function useCurrency() {
  const { locale, t } = useI18n();
  const cookie = useCookie<string>(CURRENCY_COOKIE, {
    default: () => 'UZS',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  const currency = computed<CurrencyCode>(() =>
    isCurrencyCode(cookie.value) ? cookie.value : 'UZS',
  );

  function setCurrency(next: CurrencyCode) {
    cookie.value = next;
  }

  const options = computed(() =>
    CURRENCY_CODES.map((code) => ({
      value: code,
      label: t(`currency.${code.toLowerCase()}` as MessageKey),
    })),
  );

  function currencyLabel(code: CurrencyCode = currency.value) {
    return t(`currency.${code.toLowerCase()}` as MessageKey);
  }

  function convert(amount: number, from: CurrencyCode = 'UZS') {
    return convertCurrency(amount, from, currency.value);
  }

  function formatPrice(amount: number, from: CurrencyCode = 'UZS') {
    return formatCurrencyAmount(convert(amount, from), currency.value, locale.value);
  }

  return {
    currency,
    setCurrency,
    options,
    currencyLabel,
    convert,
    formatPrice,
  };
}
