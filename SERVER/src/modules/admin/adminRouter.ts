import express from "express";
import rewardRouter from "./reward/rewardRouter"
import courseRouter from "./course/courseRouter"

const router = express.Router();

router.use("/reward", rewardRouter);

router.use("/course", courseRouter)

router.use("/health", (req, res) => {
  res.json("ADMIN REWARD MODULE HEALTH OK");
});

export default router;
