import { describe, it, expect } from 'vitest';
import {
    SPARE_PARTICIPANT,
    buildParticipantsList,
    performRaffle,
} from '../prize-raffle.logic';
import { identityShuffle } from './helpers';

describe('buildParticipantsList', () => {
    it('returns the pool unchanged when prizes <= participants', () => {
        expect(buildParticipantsList(['a', 'b', 'c'], 2)).toEqual(['a', 'b', 'c']);
    });

    it('repeats the pool when prizes > participants', () => {
        expect(buildParticipantsList(['a', 'b'], 4)).toEqual(['a', 'b', 'a', 'b']);
    });

    it('pads remainder with the spare participant', () => {
        expect(buildParticipantsList(['a', 'b'], 5)).toEqual(['a', 'b', 'a', 'b', SPARE_PARTICIPANT]);
    });

    it('returns empty for empty pool', () => {
        expect(buildParticipantsList([], 5)).toEqual([]);
    });
});

describe('performRaffle', () => {
    it('assigns each prize to a winner', () => {
        const results = performRaffle(['alice', 'bob', 'carol'], ['gold', 'silver', 'bronze'], identityShuffle);
        const allPrizes = results.flatMap(r => r.prizes).sort();
        expect(allPrizes).toEqual(['bronze', 'gold', 'silver']);
    });

    it('returns winners sorted by name', () => {
        const results = performRaffle(['carol', 'alice', 'bob'], ['x', 'y', 'z'], identityShuffle);
        expect(results.map(r => r.winner)).toEqual(['alice', 'bob', 'carol']);
    });

    it('groups multiple prizes won by the same participant', () => {
        // identity shuffle: pool = [alice, alice, bob], prizes = [x, y, z]
        const results = performRaffle(['alice', 'alice', 'bob'], ['x', 'y', 'z'], identityShuffle);
        const alice = results.find(r => r.winner === 'alice');
        expect(alice).toBeDefined();
        expect(alice!.prizes.sort()).toEqual(['x', 'y']);
    });

    it('uses the spare participant when prizes do not divide evenly into tickets', () => {
        const results = performRaffle(['alice', 'bob'], ['p1', 'p2', 'p3', 'p4', 'p5'], identityShuffle);
        const winnerNames = results.map(r => r.winner);
        expect(winnerNames).toContain('alice');
        expect(winnerNames).toContain('bob');
        expect(winnerNames).toContain(SPARE_PARTICIPANT);
        expect(results.flatMap(r => r.prizes)).toHaveLength(5);
    });
});
