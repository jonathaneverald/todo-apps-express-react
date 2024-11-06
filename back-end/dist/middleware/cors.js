"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const allowedOrigins = ["http://localhost:3000"];
const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    //   credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "X-API-TOKEN", "Authorization", "Accept"],
    exposedHeaders: ["X-API-TOKEN"],
});
console.log("CORS Middleware Applied"); // Add this for debugging
exports.default = corsMiddleware;
