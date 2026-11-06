import type { GeoPoint } from '~/types/cargo';
import { CITIES } from '~/shared/constants';

type CityNode = {
  city: (typeof CITIES)[number];
  region: string;
  lat: number;
  lng: number;
};

export const CITY_NODES: CityNode[] = [
  { city: 'Toshkent', region: 'Toshkent shahri', lat: 41.3111, lng: 69.2797 },
  { city: 'Samarqand', region: 'Samarqand viloyati', lat: 39.6542, lng: 66.9597 },
  { city: 'Buxoro', region: 'Buxoro viloyati', lat: 39.7747, lng: 64.4286 },
  { city: 'Jizzax', region: 'Jizzax viloyati', lat: 40.1158, lng: 67.8422 },
  { city: "Farg'ona", region: "Farg'ona viloyati", lat: 40.3864, lng: 71.7864 },
  { city: 'Andijon', region: 'Andijon viloyati', lat: 40.7829, lng: 72.3442 },
  { city: 'Namangan', region: 'Namangan viloyati', lat: 41.0011, lng: 71.6673 },
  { city: 'Nukus', region: "Qoraqalpog'iston", lat: 42.4531, lng: 59.6103 },
  { city: 'Termiz', region: 'Surxondaryo viloyati', lat: 37.2242, lng: 67.2783 },
  { city: 'Qarshi', region: 'Qashqadaryo viloyati', lat: 38.8606, lng: 65.7891 },
  { city: 'Navoiy', region: 'Navoiy viloyati', lat: 40.0844, lng: 65.3792 },
  { city: 'Xorazm', region: 'Xorazm viloyati', lat: 41.5506, lng: 60.6316 },
];

export function cityPoint(city: string, address: string): GeoPoint {
  const node = CITY_NODES.find((c) => c.city === city) ?? CITY_NODES[0];
  return { lat: node.lat, lng: node.lng, address, city: node.city, region: node.region };
}
