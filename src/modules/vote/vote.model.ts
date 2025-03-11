import { Schema, model } from "mongoose";
import { TVote } from "./vote.interface";

const voteSchema = new Schema<TVote>({
    pollId: { type: String, unique: true, required: true },
    userIp: { type: String, required: true },
},
    { timestamps: true }
);

export const VoteModel = model<TVote>("Vote", voteSchema);