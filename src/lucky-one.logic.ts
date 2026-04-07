import { shuffle } from 'shufflr';
import type { ShuffleFn } from './random-teams.logic';

/**
 * Parses participant strings of the form `name:tickets` into structured objects.
 * Defaults tickets to 1 when missing or unparseable.
 */
export function parseParticipantsWithTickets(strs: ReadonlyArray<string>): Array<ParticipantWithTickets> {
    return strs.map(p => {
        const parts = p.split(':');
        if (parts.length === 2) {
            return { name: parts[0], tickets: parseInt(parts[1]) || 1 };
        }
        return { name: p, tickets: 1 };
    });
}

/**
 * Builds a flat pool where each participant appears `tickets` times.
 */
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
        const result = [...pool];
        const original = [...pool];
        for (let i = 0; i < 5; i++) {
            result.push(...original);
        }
        return result;
    }
    return [...pool];
}

/**
 * Picks one lucky participant from the (already-built) pool.
 */
export function pickLuckyOne(
    pool: ReadonlyArray<string>,
    shuffleFn: ShuffleFn = shuffle,
): string {
    return shuffleFn([...pool])[0];
}
