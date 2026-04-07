import { shuffle } from 'shufflr';
import type { ShuffleFn } from './random-teams.logic';

/**
 * Returns a shuffled copy of the input list.
 */
export function shuffleOrder(
    items: ReadonlyArray<string>,
    shuffleFn: ShuffleFn = shuffle,
): Array<string> {
    return shuffleFn([...items]);
}
