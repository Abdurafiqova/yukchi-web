import type { Cargo, CargoImage, CargoOwner, CargoPaymentMethod, VehicleType } from '~/types/cargo';
import { cityPoint } from '~/server/data/locations';
import { VEHICLE_TYPES } from '~/shared/constants';
import { isCurrencyCode } from '~/shared/currency';
import { getCargos, nextCargoId } from '~/server/utils/store';

type Body = {
  title?: string;
  description?: string;
  cargoType?: string;
  weightKg?: number | string;
  volumeM3?: number | string;
  requiredVehicleType?: string;
  price?: number | string;
  currency?: string;
  priceNegotiable?: boolean;
  paymentMethod?: string;
  advanceAmount?: number | string;
  trucksNeeded?: number | string;
  isAdditionalLoad?: boolean;
  readyToLoad?: boolean;
  pickupDate?: string;
  pickupTime?: string;
  pickupCity?: string;
  pickupAddress?: string;
  dropoffCity?: string;
  dropoffAddress?: string;
  images?: CargoImage[];
  ownerName?: string;
  ownerPhone?: string;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event);

  const title = (body.title ?? '').trim();
  const pickupCity = (body.pickupCity ?? '').trim();
  const dropoffCity = (body.dropoffCity ?? '').trim();
  const weightKg = Number(body.weightKg);
  const price = Number(body.price);
  const vehicle = (body.requiredVehicleType ?? '') as VehicleType;

  const errors: Record<string, string> = {};
  if (title.length < 5) errors.title = 'Yuk nomini kamida 5 belgi bilan yozing';
  if (!pickupCity) errors.pickupCity = 'Qayerdan shaharni tanlang';
  if (!dropoffCity) errors.dropoffCity = 'Qayerga shaharni tanlang';
  if (pickupCity && pickupCity === dropoffCity) errors.dropoffCity = 'Qayerdan va qayerga shaharlari bir xil';
  if (!Number.isFinite(weightKg) || weightKg <= 0) errors.weightKg = "Og'irlikni tonnada kiriting";
  if (!VEHICLE_TYPES.includes(vehicle)) errors.requiredVehicleType = 'Mashina turini tanlang';
  if (!Number.isFinite(price) || price < 0) errors.price = 'Narxni kiriting';

  if (Object.keys(errors).length) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: { errors } });
  }

  const date = (body.pickupDate ?? '').slice(0, 10);
  const time = /^\d{2}:\d{2}$/.test(body.pickupTime ?? '') ? body.pickupTime : '09:00';
  const pickupDate = date ? `${date}T${time}:00+05:00` : new Date().toISOString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const owner: CargoOwner = {
    id: 'u-self',
    name: (body.ownerName ?? '').trim() || 'Yukchi foydalanuvchisi',
    initials: ((body.ownerName ?? 'YK')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || 'YK') as string,
    phone: (body.ownerPhone ?? '').trim() || '+998 90 000 00 00',
    rating: 0,
    postedCount: 0,
    replyMinutes: 10,
  };

  const PAYMENT_METHODS: CargoPaymentMethod[] = ['CASH', 'TRANSFER', 'MIXED'];

  const images = (body.images ?? []).slice(0, 5).filter((i) => i && typeof i.url === 'string');
  const paymentMethod = PAYMENT_METHODS.includes(body.paymentMethod as CargoPaymentMethod)
    ? (body.paymentMethod as CargoPaymentMethod)
    : 'CASH';

  const cargo: Cargo = {
    id: nextCargoId(),
    title,
    description: (body.description ?? '').trim(),
    cargoType: (body.cargoType ?? '').trim() || 'Boshqa',
    weightKg,
    volumeM3: Number(body.volumeM3) || 0,
    requiredVehicleType: vehicle,
    price,
    currency: isCurrencyCode(body.currency) ? body.currency : 'UZS',
    priceNegotiable: Boolean(body.priceNegotiable),
    paymentMethod,
    advanceAmount: Number(body.advanceAmount) || 0,
    trucksNeeded: Math.max(1, Number(body.trucksNeeded) || 1),
    isAdditionalLoad: Boolean(body.isAdditionalLoad),
    readyToLoad: body.readyToLoad !== false,
    pickupDate,
    status: 'PENDING_REVIEW',
    pickup: cityPoint(pickupCity, (body.pickupAddress ?? '').trim() || pickupCity),
    dropoff: cityPoint(dropoffCity, (body.dropoffAddress ?? '').trim() || dropoffCity),
    images,
    owner,
    publishedAt: now.toISOString(),
    expiresAt,
    viewCount: 0,
  };

  getCargos().unshift(cargo);
  return cargo;
});
