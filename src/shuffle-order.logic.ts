import { shuffle } from 'shufflr';
import type { ShuffleFn } from './shuffle.types';

export function shuffleOrder(
    items: ReadonlyArray<string>,
    shuffleFn: ShuffleFn = shuffle,
): Array<string> {
    return shuffleFn([...items]);
}
