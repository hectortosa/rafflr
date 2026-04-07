import { describe, it, expect } from 'vitest';
import {
    buildTicketPool,
    inflatePoolForTwoParticipants,
    parseParticipantsWithTickets,
    pickLuckyOne,
} from '../lucky-one.logic';
import { identityShuffle } from './helpers';

describe('parseParticipantsWithTickets', () => {
    it('parses name:tickets entries', () => {
        expect(parseParticipantsWithTickets(['alice:3', 'bob:1'])).toEqual([
            { name: 'alice', tickets: 3 },
            { name: 'bob', tickets: 1 },
        ]);
    });

    it('defaults tickets to 1 when missing', () => {
        expect(parseParticipantsWithTickets(['alice'])).toEqual([{ name: 'alice', tickets: 1 }]);
    });

    it('defaults tickets to 1 when unparseable', () => {
        expect(parseParticipantsWithTickets(['alice:nope'])).toEqual([{ name: 'alice', tickets: 1 }]);
    });
});

describe('buildTicketPool', () => {
    it('repeats each participant by ticket count', () => {
        expect(buildTicketPool([
            { name: 'a', tickets: 2 },
            { name: 'b', tickets: 1 },
            { name: 'c', tickets: 3 },
        ])).toEqual(['a', 'a', 'b', 'c', 'c', 'c']);
    });

    it('returns empty pool for empty input', () => {
        expect(buildTicketPool([])).toEqual([]);
    });
});

describe('inflatePoolForTwoParticipants', () => {
    it('inflates 2-participant pools to >= 12 entries', () => {
        const result = inflatePoolForTwoParticipants(['a', 'b'], 2);
        expect(result.length).toBe(12);
        expect(result.filter(x => x === 'a').length).toBe(6);
        expect(result.filter(x => x === 'b').length).toBe(6);
    });

    it('does not inflate for 3+ participants', () => {
        const pool = ['a', 'b', 'c'];
        expect(inflatePoolForTwoParticipants(pool, 3)).toEqual(pool);
    });

    it('does not inflate when 2-participant pool is already large', () => {
        const pool = Array(10).fill('a');
        const result = inflatePoolForTwoParticipants(pool, 2);
        expect(result.length).toBe(10);
    });
});

describe('pickLuckyOne', () => {
    it('returns the first element of the shuffled pool', () => {
        expect(pickLuckyOne(['a', 'b', 'c'], identityShuffle)).toBe('a');
    });

    it('uses the injected shuffle function', () => {
        const reverseShuffle = <T>(items: Array<T>) => [...items].reverse();
        expect(pickLuckyOne(['a', 'b', 'c'], reverseShuffle)).toBe('c');
    });
});
