import express from "express";
import rewardRouter from "./reward/rewardRouter"
import courseRouter from "./course/courseRouter"
import subModuleRouter from "./submodule/subModuleRouter"
import moduleRouter from "./module/moduleRouter"
import { validateJWT, validateTenant, checkPermission } from "middleware";


const router = express.Router();

router.use("/reward", rewardRouter);

router.use("/course", courseRouter)

router.use("/submodule", subModuleRouter)

router.use("/module", moduleRouter)

// // this route (put method) is used to update order status
// router.put(
//   "/orders/:id/status",
//   validateJWT,
//   validateTenant,
//   checkPermission("LMS_REWARDS_UPDATE"),
//   updateOrderStatusController
// );
router.use("/health", (req, res) => {
  res.json("ADMIN REWARD MODULE HEALTH OK");
});

export default router;
