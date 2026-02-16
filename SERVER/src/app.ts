import express from "express";
import adminRouter from "./routes/admin";
import clientRouter from "./routes/client";
import authRouter from "./routes/authRouter"

const app = express.Router();



app.use("/admin", adminRouter);
app.use("/client", clientRouter);
app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;