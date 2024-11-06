import express from "express";
import { publicRouter } from "../route/public-api";
import { apiRouter } from "../route/api";
import { errorMiddleware } from "../middleware/error-middleware";
import corsMiddleware from "../middleware/cors";

export const web = express();

web.use(corsMiddleware);
web.options("/api/*", corsMiddleware);
web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);
