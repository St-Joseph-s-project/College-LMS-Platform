import express from "express";
import rewardRouter from "./reward/rewardRouter"
import courseRouter from "./course/courseRouter"
import subModuleRouter from "./submodule/subModuleRouter"
import moduleRouter from "./module/moduleRouter"

const router = express.Router();

router.use("/reward", rewardRouter);

router.use("/course", courseRouter)

router.use("/submodule", subModuleRouter)

router.use("/module", moduleRouter)

router.use("/health", (req, res) => {
  res.json("ADMIN REWARD MODULE HEALTH OK");
});

export default router;
