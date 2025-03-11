import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { VoteServices } from "./vote.service";

const voteInPoll = catchAsync(async (req: Request, res: Response) => {
  const { pollId } = req.params;
  const { option } = req.body;
  const userIp = req.clientIp
  const result = await VoteServices.voteInPollIntoDB(
    pollId,
    option,
    userIp as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vote recorded successfully!',
    data: result,
  });
});

const getAVoteResult = catchAsync(async (req: Request, res: Response) => {
  const { pollId } = req.params;
  const result = await VoteServices.getAVoteResultFromDB(
    pollId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vote result retrieved successfully!',
    data: result,
  });
});


export const VoteControllers = {
  voteInPoll,
  getAVoteResult
};
