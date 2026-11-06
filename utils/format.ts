import type { CargoStatus } from '~/types/cargo';

export function yandexMapUrl(lat: number, lng: number, zoom = 15): string {
  return `https://yandex.uz/maps/?pt=${lng},${lat}&z=${zoom}&l=map`;
}

export function yandexRouteUrl(fromLat: number, fromLng: number, toLat: number, toLng: number): string {
  return `https://yandex.uz/maps/?rtext=${fromLat},${fromLng}~${toLat},${toLng}&rtt=auto`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function prettyPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
}

export function cargoStatusClass(status: CargoStatus): string {
  if (status === 'PUBLISHED' || status === 'COMPLETED' || status === 'IN_PROGRESS') return 'bg-ok-bg text-ok';
  if (status === 'REJECTED' || status === 'CANCELLED') return 'bg-bad-bg text-bad';
  return 'bg-warn-bg text-warn';
}
