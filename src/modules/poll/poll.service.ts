import { v4 as uuidv4 } from 'uuid';
import { PollModel, ReactionModel } from './poll.model';
import ApiError from '../../errorHandlers/ApiError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config/config';
import { VoteModel } from '../vote/vote.model';

const createPollIntoDB = async (payload: { question: any; options: string[]; expiration: any; hideResults: any; }) => {
    const { question, options, expiration, hideResults } = payload;
    const pollId = uuidv4();

    const expiresAt = new Date(Date.now() + expiration * 3600000).getTime();
    if (isNaN(expiresAt)) {
        throw new ApiError(400, "Invalid Date");
    }

    const pollData = {
        pollId,
        question,
        options,
        votes: options.reduce((acc: { [key: string]: number }, option: string) => {
            acc[option] = 0;
            return acc;
        }, {}),
        expiresAt,
        hideResults,
    };

    await PollModel.create(pollData);

    return { pollId, }

}

const getAPollFromDB = async (pollId: string, userIp: string) => {

    const poll = await PollModel.findOne({ pollId }).lean();

    if (!poll) throw new ApiError(httpStatus.NOT_FOUND, "'Poll not found'");

    // Check if poll has expired
    if (Date.now() > poll.expiresAt) {
        poll.hideResults = false
        return poll
    }

    // Check if user has already voted
    const isVoted = await VoteModel.findOne({ pollId, userIp }).lean();
    if (isVoted) {
        if (!poll.hideResults) {
            return poll
        }
    }
    poll.votes = {}
    
    return poll
}

// reaction in Poll
const reactionInPollIntoDB = async (pollId: string, reaction: string, userIp: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Find poll and check if it exists
        const poll = await PollModel.findOne({ pollId }).lean();
        if (!poll) {
            throw new ApiError(httpStatus.NOT_FOUND, "Poll not found");
        }

        // Check if poll has expired
        if (Date.now() > poll.expiresAt) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Poll has expired");
        }

        // Check if user has already reacted
        const isReacted = await ReactionModel.findOne({ pollId, userIp }).lean();
        if (isReacted) {
            throw new ApiError(httpStatus.BAD_REQUEST, "You already reacted!");
        }

        // Check if the reaction type is valid
        const validReactions = ["🔥", "👍"];
        if (!validReactions.includes(reaction)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid reaction type");
        }

        // Atomically update reaction count
        const updatedPoll = await PollModel.findOneAndUpdate(
            { pollId },
            { $inc: { [`reactions.${reaction}`]: 1 } },
            { new: true, session }
        );

        // Save reaction record (ensures no duplicate reactions in race conditions)
        await ReactionModel.findOneAndUpdate(
            { pollId, userIp }, // Query
            { pollId, userIp }, // Update data
            { upsert: true, new: true, session } // Prevent duplicates
        );

        await session.commitTransaction();
        return updatedPoll;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const PollServices = {
    createPollIntoDB,
    getAPollFromDB,
    reactionInPollIntoDB
}