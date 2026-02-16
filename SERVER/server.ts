import appRouter from "./src/app";
import { logger, connectDB } from "./src/config/index";
import {seedCredentials, seedPermissions}from "./src/config/dbSeeder"
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express from "express"
import morgan from "morgan"
dotenv.config();

const app = express()
// Configure CORS to allow the frontend origin and send cookies/credentials.
// Do NOT use '*' when requests use credentials (withCredentials = true).
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Add explicit preflight handling with same CORS options
app.options('*', cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

const PORT = process.env.PORT || 3000;

app.use("/api", appRouter)

const startServer = async () => {
  try {
    await connectDB();
    // seed required data before accepting requests
    await seedPermissions();
    await seedCredentials();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error creating server", error);
    process.exit(1);
  }
};

startServer();