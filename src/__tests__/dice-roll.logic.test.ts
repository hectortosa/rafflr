import { describe, it, expect } from 'vitest';
import {
    generateDiceSetupArray,
    generateDicesFromDiceSetup,
    rollDices,
} from '../dice-roll.logic';
import { identityShuffle } from './helpers';

describe('generateDicesFromDiceSetup', () => {
    it('parses a single dice spec', () => {
        expect(generateDicesFromDiceSetup('1d6')).toEqual([{ sides: 6, value: 1 }]);
    });

    it('expands count into multiple dice', () => {
        expect(generateDicesFromDiceSetup('3d6')).toEqual([
            { sides: 6, value: 1 },
            { sides: 6, value: 1 },
            { sides: 6, value: 1 },
        ]);
    });

    it('parses multiple dice specs separated by ;', () => {
        const result = generateDicesFromDiceSetup('2d6;1d20');
        expect(result).toHaveLength(3);
        expect(result.filter(d => d.sides === 6).length).toBe(2);
        expect(result.filter(d => d.sides === 20).length).toBe(1);
    });

    it('lowercases the input so D6 == d6', () => {
        expect(generateDicesFromDiceSetup('1D6')).toEqual([{ sides: 6, value: 1 }]);
    });

    it('skips garbage entries', () => {
        expect(generateDicesFromDiceSetup('garbage;1d6')).toEqual([{ sides: 6, value: 1 }]);
    });
});

describe('generateDiceSetupArray', () => {
    it('groups dice by side count', () => {
        const result = generateDiceSetupArray([
            { sides: 6, value: 1 },
            { sides: 6, value: 1 },
            { sides: 20, value: 1 },
        ]);
        expect(result).toEqual(['2d6', '1d20']);
    });

    it('returns empty for empty input', () => {
        expect(generateDiceSetupArray([])).toEqual([]);
    });

    it('round-trips with generateDicesFromDiceSetup', () => {
        const dices = generateDicesFromDiceSetup('2d6;1d20');
        expect(generateDiceSetupArray(dices)).toEqual(['2d6', '1d20']);
    });
});

describe('rollDices', () => {
    it('returns one result per input dice', () => {
        const result = rollDices([{ sides: 6, value: 1 }, { sides: 20, value: 1 }]);
        expect(result).toHaveLength(2);
    });

    it('every value is within [1, sides]', () => {
        const dices = generateDicesFromDiceSetup('5d6;3d20');
        const rolled = rollDices(dices);
        for (const d of rolled) {
            expect(d.value).toBeGreaterThanOrEqual(1);
            expect(d.value).toBeLessThanOrEqual(d.sides);
        }
    });

    it('with identity shuffle returns the first face (1)', () => {
        const result = rollDices(
            [{ sides: 6, value: 1 }, { sides: 20, value: 1 }],
            identityShuffle,
        );
        expect(result).toEqual([
            { sides: 6, value: 1 },
            { sides: 20, value: 1 },
        ]);
    });
});
