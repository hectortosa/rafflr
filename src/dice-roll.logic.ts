import { shuffle } from 'shufflr';
import type { ShuffleFn } from './shuffle.types';

export interface Dice {
    sides: number;
    value: number;
}

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

export function generateDiceSetupArray(dices: ReadonlyArray<Dice>): Array<string> {
    const counts = new Map<string, number>();
    for (const dice of dices) {
        const type = `d${dice.sides}`;
        counts.set(type, (counts.get(type) ?? 0) + 1);
    }
    return Array.from(counts.entries(), ([type, count]) => `${count}${type}`);
}

export function rollDices(
    dices: ReadonlyArray<Dice>,
    shuffleFn: ShuffleFn = shuffle,
): Array<Dice> {
    return dices.map(dice => {
        const faces = Array.from({ length: dice.sides }, (_, idx) => idx + 1);
        return { sides: dice.sides, value: shuffleFn(faces)[0] };
    });
}
