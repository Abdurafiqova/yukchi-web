import type { Cargo } from '~/types/cargo';
import { CARGO_SEED } from '../data/cargos';

const state = globalThis as unknown as { __yukchiCargos?: Cargo[] };

export function getCargos(): Cargo[] {
  if (!state.__yukchiCargos) {
    state.__yukchiCargos = [...CARGO_SEED];
  }
  return state.__yukchiCargos;
}

export function nextCargoId(): string {
  const current = getCargos().reduce((max, c) => {
    const n = Number(c.id.replace('YC-', ''));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `YC-${current + 1}`;
}
