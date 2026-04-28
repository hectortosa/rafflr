import { shuffle } from 'shufflr';
import type { ShuffleFn } from './shuffle.types';

export interface Team {
    name: string;
    members: Array<string>;
}

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
        teams.push({
            name: `Team ${i + 1}`,
            members: shuffled.slice(start, start + teamSize),
        });
    }

    return teams;
}
