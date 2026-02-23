import * as express from "express";
import rewardRouter from "./reward/rewardRouter"
import roadmapRouter from "./roadmap/roadmapRouter"
import courseRouter from "./course/courseRouter"

const router = express.Router();

router.use("/reward", rewardRouter)
router.use("/roadmap", roadmapRouter)
router.use("/course", courseRouter)

router.use("/health", (req, res) => {
  res.json("CLIENT HEALTH OK");
})

export default router;