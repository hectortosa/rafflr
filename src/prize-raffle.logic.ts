import { shuffle } from 'shufflr';
import type { ShuffleFn } from './random-teams.logic';

export const SPARE_PARTICIPANT = 'For sharing';

/**
 * If there are more prizes than tickets, repeats the ticket pool and pads
 * the remainder with a spare-participant marker so every prize gets assigned.
 */
export function buildParticipantsList(
    ticketPool: ReadonlyArray<string>,
    numberOfPrizes: number,
    spareParticipant: string = SPARE_PARTICIPANT,
): Array<string> {
    if (ticketPool.length === 0 || numberOfPrizes <= ticketPool.length) {
        return [...ticketPool];
    }

    const assignment = Math.floor(numberOfPrizes / ticketPool.length);
    const toShare = numberOfPrizes - assignment * ticketPool.length;

    const result: Array<string> = [];
    for (let i = 0; i < assignment; i++) {
        result.push(...ticketPool);
    }
    for (let j = 0; j < toShare; j++) {
        result.push(spareParticipant);
    }
    return result;
}

/**
 * Builds a flat ticket pool from participants-with-tickets (each name repeated).
 */
export function buildTicketPoolFromParticipants(
    participants: ReadonlyArray<ParticipantWithTickets>,
): Array<string> {
    const pool: Array<string> = [];
    for (const p of participants) {
        for (let i = 0; i < p.tickets; i++) {
            pool.push(p.name);
        }
    }
    return pool;
}

/**
 * Performs the prize raffle: shuffles participants and prizes, assigns each prize
 * to a participant, then groups by winner and returns sorted results.
 */
export function performRaffle(
    ticketPool: ReadonlyArray<string>,
    prizes: ReadonlyArray<string>,
    shuffleFn: ShuffleFn = shuffle,
): Array<RaffleResult> {
    const unrolled = buildParticipantsList(ticketPool, prizes.length);
    const shuffledParticipants = shuffleFn(unrolled);
    const shuffledPrizes = shuffleFn([...prizes]);

    const results: Array<RaffleResult> = [];
    for (let i = 0; i < prizes.length; i++) {
        const winnerName = shuffledParticipants[i];
        const existing = results.find(r => r.winner === winnerName);
        if (existing) {
            existing.prizes.push(shuffledPrizes[i]);
        } else {
            results.push({ winner: winnerName, prizes: [shuffledPrizes[i]] });
        }
    }

    results.sort((a, b) => {
        if (a.winner === b.winner) return 0;
        return a.winner < b.winner ? -1 : 1;
    });

    return results;
}
