import { shuffle } from 'shufflr';
import type { ShuffleFn } from './random-teams.logic';

export interface Dice {
    sides: number;
    value: number;
}

/**
 * Parses standard dice notation (e.g. "2d6;1d20") into an array of dice with default value 1.
 */
export function generateDicesFromDiceSetup(diceSetup: string): Array<Dice> {
    return diceSetup.toLowerCase().split(';').flatMap(dice => {
        const [countStr, sidesStr] = dice.split('d');
        const count = parseInt(countStr, 10);
        const sides = parseInt(sidesStr, 10);
        if (!Number.isFinite(count) || !Number.isFinite(sides)) {
            return [];
        }
        return Array<Dice>(count).fill({ sides, value: 1 });
    });
}

/**
 * Reverses `generateDicesFromDiceSetup`: groups dice by side count into NdS strings.
 */
export function generateDiceSetupArray(dices: ReadonlyArray<Dice>): Array<string> {
    const counts = new Map<string, number>();
    for (const dice of dices) {
        const type = `d${dice.sides}`;
        counts.set(type, (counts.get(type) ?? 0) + 1);
    }
    return Array.from(counts.entries(), ([type, count]) => `${count}${type}`);
}

/**
 * Rolls every dice once. Each value lies within `[1, sides]`.
 */
export function rollDices(
    dices: ReadonlyArray<Dice>,
    shuffleFn: ShuffleFn = shuffle,
): Array<Dice> {
    return dices.map(dice => {
        const faces = Array.from({ length: dice.sides }, (_, idx) => idx + 1);
        const value = shuffleFn(faces)[0];
        return { sides: dice.sides, value };
    });
}
