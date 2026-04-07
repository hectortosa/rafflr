export interface Dice {
    sides: number;
    value: number;
}

/**
 * Picks a uniformly random integer in [1, sides]. Injectable for deterministic tests.
 */
export type RollFn = (sides: number) => number;

const defaultRoll: RollFn = sides => Math.floor(Math.random() * sides) + 1;

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
    roll: RollFn = defaultRoll,
): Array<Dice> {
    return dices.map(dice => ({ sides: dice.sides, value: roll(dice.sides) }));
}
