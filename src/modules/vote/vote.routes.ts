import { Router } from "express";
import { VoteControllers } from "./vote.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TVoteSchema } from "./vote.validation";

const router = Router();

router.post(
  "/:pollId",
  validateRequest(TVoteSchema),
  VoteControllers.voteInPoll
);

router.get(
  "/:pollId/result",
  VoteControllers.getAVoteResult
);

export const VoteRoutes = router;
