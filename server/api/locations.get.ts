import { cityPoint } from '~/server/data/locations';
import { CITIES, VEHICLE_LABELS, VEHICLE_TYPES } from '~/shared/constants';

export default defineEventHandler(() => {
  const cityPoints: Record<string, { lat: number; lng: number }> = {};
  for (const city of CITIES) {
    const p = cityPoint(city, '');
    cityPoints[city] = { lat: p.lat, lng: p.lng };
  }
  return { cities: CITIES, vehicleTypes: VEHICLE_TYPES, vehicleLabels: VEHICLE_LABELS, cityPoints };
});
