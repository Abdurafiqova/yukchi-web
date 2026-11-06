import type { Cargo } from '~/types/cargo';
import { getCargos } from '~/server/utils/store';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const q = String(query.q ?? '').trim().toLowerCase();
  const from = String(query.from ?? '').trim().toLowerCase();
  const to = String(query.to ?? '').trim().toLowerCase();
  const vehicle = String(query.vehicle ?? '').trim();
  const minWeight = Number(query.minWeight ?? 0);
  const sort = String(query.sort ?? 'new');

  let items = getCargos().filter((c) => c.status === 'PUBLISHED');

  if (q) {
    items = items.filter((c) =>
      [c.title, c.cargoType, c.description, c.pickup.city, c.dropoff.city, c.owner.name]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }
  if (from) items = items.filter((c) => c.pickup.city.toLowerCase() === from || c.pickup.region.toLowerCase() === from);
  if (to) items = items.filter((c) => c.dropoff.city.toLowerCase() === to || c.dropoff.region.toLowerCase() === to);
  if (vehicle) items = items.filter((c) => c.requiredVehicleType === vehicle);
  if (minWeight > 0) items = items.filter((c) => c.weightKg >= minWeight * 1000);

  const sorters: Record<string, (a: Cargo, b: Cargo) => number> = {
    new: (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    weight_desc: (a, b) => b.weightKg - a.weightKg,
  };

  items = [...items].sort(sorters[sort] ?? sorters.new);

  return { items, total: items.length };
});
