import { PollModel } from './../poll/poll.model';
import { VoteModel } from './vote.model';
import ApiError from '../../errorHandlers/ApiError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';


// Vote in Poll
const voteInPollIntoDB = async (pollId: string, option: string, userIp: string) => {
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

        // Validate option exists in the poll
        if (!poll.options.includes(option)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid voting option");
        }

        // Check if user has already voted
        const isVoted = await VoteModel.findOne({ pollId, userIp }).lean();
        if (isVoted) {
            throw new ApiError(httpStatus.BAD_REQUEST, "You already voted!");
        }

        // Atomically update vote count
        const updatedPoll = await PollModel.findOneAndUpdate(
            { pollId },
            { $inc: { [`votes.${option}`]: 1 } },
            { new: true, session }
        );

        // Save vote record (ensures no duplicate votes in race conditions)
        await VoteModel.findOneAndUpdate(
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

const getAVoteResultFromDB = async (pollId: string) => {

    const poll = await PollModel.findOne({ pollId });

    if (!poll) throw new ApiError(httpStatus.NOT_FOUND, "'Poll not found'");

    return poll
}

export const VoteServices = {
    voteInPollIntoDB,
    getAVoteResultFromDB
}