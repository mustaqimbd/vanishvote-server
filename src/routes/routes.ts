import express, { Router } from "express";
import { PollsRoutes } from "../modules/poll/poll.routes";
import { VoteRoutes } from "../modules/vote/vote.routes";

type TModuleTypes = {
    path: string;
    route: Router;
};

const router = express();

const moduleRoutes: TModuleTypes[] = [
    {
        path: "/polls",
        route: PollsRoutes,
    },
    {
        path: "/votes",
        route: VoteRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
