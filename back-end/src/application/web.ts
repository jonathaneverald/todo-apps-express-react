import express from "express";
import { publicRouter } from "../route/public-api";
import { apiRouter } from "../route/api";
import { errorMiddleware } from "../middleware/error-middleware";
import corsMiddleware from "../middleware/cors";
import { swaggerUiServe, swaggerUiSetup } from "./swagger";

export const web = express();

web.use("/api-docs", swaggerUiServe, swaggerUiSetup);

web.use(corsMiddleware);
web.options("/api/*", corsMiddleware);
web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);
