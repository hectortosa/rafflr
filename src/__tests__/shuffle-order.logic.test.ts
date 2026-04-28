import { describe, it, expect } from 'vitest';
import { shuffleOrder } from '../shuffle-order.logic';

describe('shuffleOrder', () => {
    it('returns a permutation (same multiset)', () => {
        const input = ['a', 'b', 'c', 'd'];
        const result = shuffleOrder(input);
        expect(result.slice().sort()).toEqual(input.slice().sort());
    });

    it('does not mutate the input array', () => {
        const input = ['a', 'b', 'c'];
        const snapshot = [...input];
        shuffleOrder(input);
        expect(input).toEqual(snapshot);
    });

    it('uses the injected shuffle function', () => {
        const reverse = <T>(items: Array<T>) => [...items].reverse();
        expect(shuffleOrder(['a', 'b', 'c'], reverse)).toEqual(['c', 'b', 'a']);
    });
});
