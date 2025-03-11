import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { PollServices } from "./poll.service";


const createPoll = catchAsync(async (req: Request, res: Response) => {
  const result = await PollServices.createPollIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Poll created successfully!',
    data: result,
  });
});

const getAPoll = catchAsync(async (req: Request, res: Response) => {
  const { pollId } = req.params;
  const userIp = req.clientIp
  const result = await PollServices.getAPollFromDB(
    pollId,
    userIp as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Poll retrieved successfully!',
    data: result,
  });
});

const reactionInPoll = catchAsync(async (req: Request, res: Response) => {
  const { pollId } = req.params;
  const { reaction } = req.body;
  const userIp = req.clientIp
  await PollServices.reactionInPollIntoDB(
    pollId,
    reaction,
    userIp as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reaction recorded successfully!',
    data: null
  });
});

export const PollControllers = {
  createPoll,
  getAPoll,
  reactionInPoll
};
