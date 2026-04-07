import { shuffle } from 'shufflr';

export interface Team {
    name: string;
    members: Array<string>;
}

export type ShuffleFn = <T>(items: Array<T>) => Array<T>;

/**
 * Splits participants into teams of (at most) `teamSize` members.
 * Last team may be smaller. The shuffle function can be injected for deterministic tests.
 */
export function formTeams(
    participants: ReadonlyArray<string>,
    teamSize: number,
    shuffleFn: ShuffleFn = shuffle,
): Array<Team> {
    if (teamSize <= 0 || participants.length === 0) {
        return [];
    }

    const shuffled = shuffleFn([...participants]);
    const numTeams = Math.ceil(shuffled.length / teamSize);
    const teams: Array<Team> = [];

    for (let i = 0; i < numTeams; i++) {
        const start = i * teamSize;
        const end = start + teamSize;
        teams.push({
            name: `Team ${i + 1}`,
            members: shuffled.slice(start, end),
        });
    }

    return teams;
}
