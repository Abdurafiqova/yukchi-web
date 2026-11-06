import type { Cargo } from '~/types/cargo';
import { getCargos } from '~/server/utils/store';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  const cargo = getCargos().find((c) => c.id === id);
  if (!cargo) {
    throw createError({ statusCode: 404, statusMessage: 'E’lon topilmadi' });
  }
  return cargo;
});
