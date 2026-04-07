import type { ShuffleFn } from '../shuffle.types';

export const identityShuffle: ShuffleFn = <T>(items: Array<T>) => [...items];
