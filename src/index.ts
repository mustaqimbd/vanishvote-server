import express, { Request, Response, Application } from 'express';
import cors from "cors";
import requestIp from "request-ip";
import router from './routes/routes';
import globalErrorhandler from './middlewares/globalErrorHandler';
import { notFoundRoute } from './middlewares/notFoundRoute';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestIp.mw());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to poll Server!');
});

// api endpoints
app.use("/api", router);

// Global error handler
app.use(globalErrorhandler);

// handle not found route
app.use(notFoundRoute);

export default app;