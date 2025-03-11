export type TPoll = {
    pollId: string;
    question: string;
    options: string[];
    votes: Map<string, number>
    reactions: Record<string, number>
    expiresAt: number;
    hideResults: boolean;
    hasVoted: boolean;
}

export type TReaction = {
    pollId: string;
    userIp: string;
    reaction: string
}