import * as express from "express";
import rewardRouter from "./reward/rewardRouter"

const router = express.Router();

router.use("/reward", rewardRouter)

router.use("/health", (req, res) => {
  res.json("CLIENT HEALTH OK");
})

export default router;