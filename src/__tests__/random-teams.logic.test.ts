import { describe, it, expect } from 'vitest';
import { formTeams } from '../random-teams.logic';

const identity = <T>(items: Array<T>) => [...items];
const reverse = <T>(items: Array<T>) => [...items].reverse();

describe('formTeams', () => {
    it('returns empty array when participants are empty', () => {
        expect(formTeams([], 3, identity)).toEqual([]);
    });

    it('returns empty array when teamSize is 0 or negative', () => {
        expect(formTeams(['a', 'b'], 0, identity)).toEqual([]);
        expect(formTeams(['a', 'b'], -1, identity)).toEqual([]);
    });

    it('splits participants into teams of the requested size', () => {
        const result = formTeams(['a', 'b', 'c', 'd'], 2, identity);
        expect(result).toEqual([
            { name: 'Team 1', members: ['a', 'b'] },
            { name: 'Team 2', members: ['c', 'd'] },
        ]);
    });

    it('puts the remainder into a smaller last team', () => {
        const result = formTeams(['a', 'b', 'c', 'd', 'e'], 2, identity);
        expect(result).toHaveLength(3);
        expect(result[2].members).toEqual(['e']);
    });

    it('places every participant exactly once', () => {
        const participants = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const result = formTeams(participants, 3, identity);
        const flattened = result.flatMap(t => t.members).sort();
        expect(flattened).toEqual([...participants].sort());
    });

    it('uses the injected shuffle function', () => {
        const result = formTeams(['a', 'b', 'c', 'd'], 2, reverse);
        expect(result[0].members).toEqual(['d', 'c']);
        expect(result[1].members).toEqual(['b', 'a']);
    });

    it('produces a single team when teamSize >= participants', () => {
        const result = formTeams(['a', 'b'], 5, identity);
        expect(result).toEqual([{ name: 'Team 1', members: ['a', 'b'] }]);
    });
});
