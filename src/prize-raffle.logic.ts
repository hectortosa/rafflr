import { shuffle } from 'shufflr';
import type { ShuffleFn } from './shuffle.types';

export const SPARE_PARTICIPANT = 'For sharing';

/**
 * If there are more prizes than tickets, repeats the ticket pool and pads
 * the remainder with a spare-participant marker so every prize gets assigned.
 */
export function buildParticipantsList(
    ticketPool: ReadonlyArray<string>,
    numberOfPrizes: number,
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
        result.push(SPARE_PARTICIPANT);
    }
    return result;
}

export function performRaffle(
    ticketPool: ReadonlyArray<string>,
    prizes: ReadonlyArray<string>,
    shuffleFn: ShuffleFn = shuffle,
): Array<RaffleResult> {
    const unrolled = buildParticipantsList(ticketPool, prizes.length);
    const shuffledParticipants = shuffleFn(unrolled);
    const shuffledPrizes = shuffleFn([...prizes]);

    const byWinner = new Map<string, RaffleResult>();
    for (let i = 0; i < prizes.length; i++) {
        const winnerName = shuffledParticipants[i];
        const existing = byWinner.get(winnerName);
        if (existing) {
            existing.prizes.push(shuffledPrizes[i]);
        } else {
            byWinner.set(winnerName, { winner: winnerName, prizes: [shuffledPrizes[i]] });
        }
    }

    return Array.from(byWinner.values()).sort((a, b) => a.winner < b.winner ? -1 : a.winner > b.winner ? 1 : 0);
}
