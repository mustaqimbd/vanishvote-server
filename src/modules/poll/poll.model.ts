import { Schema, model } from "mongoose";
import { TPoll, TReaction } from "./poll.interface";

const pollSchema = new Schema<TPoll>({
    pollId: { type: String, unique: true, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    votes: { type: Map, of: Number, default: {} },
    reactions: {
        type: Map,
        of: Number,
        default: { "🔥": 0, "👍": 0 }
    },
    expiresAt: { type: Number, required: true },
    hideResults: { type: Boolean, default: false },
    hasVoted: { type: Boolean, default: true }
},
    { timestamps: true }
);

const reactionSchema = new Schema<TReaction>({
    pollId: { type: String, required: true },
    userIp: { type: String, required: true },
    reaction: { type: String, required: true, enum: ["🔥", "👍"] }
},
    { timestamps: true }
);


export const PollModel = model<TPoll>("Poll", pollSchema);

export const ReactionModel = model<TReaction>("Reaction", reactionSchema);