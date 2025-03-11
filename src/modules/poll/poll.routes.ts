import { Router } from "express";
import { PollControllers } from "./poll.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TPollSchema, TReactionSchema,  } from "./poll.validation";

const router = Router();

router.post(
  "/create",
  validateRequest(TPollSchema),
  PollControllers.createPoll
);

router.get(
  "/:pollId",
  PollControllers.getAPoll
);

router.post(
  "/:pollId/react",
  validateRequest(TReactionSchema),
  PollControllers.reactionInPoll
);

export const PollsRoutes = router;
