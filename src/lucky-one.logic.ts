import { shuffle } from 'shufflr';
import type { ShuffleFn } from './shuffle.types';

export function parseParticipantsWithTickets(strs: ReadonlyArray<string>): Array<ParticipantWithTickets> {
    return strs.map(p => {
        const parts = p.split(':');
        if (parts.length === 2) {
            return { name: parts[0], tickets: parseInt(parts[1]) || 1 };
        }
        return { name: p, tickets: 1 };
    });
}

export function buildTicketPool(participants: ReadonlyArray<ParticipantWithTickets>): Array<string> {
    const pool: Array<string> = [];
    for (const participant of participants) {
        for (let i = 0; i < participant.tickets; i++) {
            pool.push(participant.name);
        }
    }
    return pool;
}

/**
 * When only 2 unique participants exist, inflate the pool to make shuffling more meaningful.
 */
export function inflatePoolForTwoParticipants(pool: ReadonlyArray<string>, uniqueCount: number): Array<string> {
    if (uniqueCount === 2 && pool.length < 10) {
        const inflated: Array<string> = [];
        for (let i = 0; i < 6; i++) {
            inflated.push(...pool);
        }
        return inflated;
    }
    return [...pool];
}

export function pickLuckyOne(
    pool: ReadonlyArray<string>,
    shuffleFn: ShuffleFn = shuffle,
): string {
    return shuffleFn([...pool])[0];
}
