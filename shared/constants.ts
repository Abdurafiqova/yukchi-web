import type { VehicleType } from '~/types/cargo';

export const CITIES = [
  'Toshkent',
  'Samarqand',
  'Buxoro',
  'Jizzax',
  "Farg'ona",
  'Andijon',
  'Namangan',
  'Nukus',
  'Termiz',
  'Qarshi',
  'Navoiy',
  'Xorazm',
] as const;

export const VEHICLE_TYPES: VehicleType[] = ['Awning', 'Flatbed', 'Refrigerated', 'Tipper', 'Tanker'];

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  Awning: 'Tentli (Awning)',
  Flatbed: 'Platforma (Flatbed)',
  Refrigerated: 'Refrijerator',
  Tipper: 'Samosval',
  Tanker: 'Sisterna',
};

export const CARGO_TYPES = [
  'Qurilish materiallari',
  'Oziq-ovqat',
  'Metall',
  "To'qimachilik",
  "Qishloq xo'jaligi",
  'Aralash yuk',
  'Boshqa',
];

export const WEIGHT_OPTIONS = [
  { value: '', label: "Har qanday og'irlik" },
  { value: '5', label: '5 t va yuqori' },
  { value: '10', label: '10 t va yuqori' },
  { value: '15', label: '15 t va yuqori' },
  { value: '20', label: '20 t va yuqori' },
];

export const SORT_OPTIONS = [
  { value: 'new', label: 'Yangi e’lonlar' },
  { value: 'price_asc', label: 'Narx: arzondan' },
  { value: 'price_desc', label: 'Narx: qimmatdan' },
  { value: 'weight_desc', label: "Og'irlik: kattadan" },
];
