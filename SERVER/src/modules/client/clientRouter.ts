import * as express from "express";
import { validateJWT, checkPermission, validateTenant } from "../../middleware";
import { getAllRewardsController, getRewardByIdController, buyRewardController, getClientRewardsHistoryController } from "./clientController";
import { permissions } from "../../constants";

const router = express.Router();

router.get(
  "/rewards/get-all",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_VIEW"),
  getAllRewardsController,
);

router.get(
  "/rewards/history",
  validateJWT,
  validateTenant,
  getClientRewardsHistoryController,
);

router.get(
  "/rewards/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_VIEW"),
  getRewardByIdController,
)

router.post(
  "/rewards/purchase-reward",
  validateJWT,
  validateTenant,
  buyRewardController,
);

router.use("/health", (req, res) => {
  res.json("CLIENT HEALTH OK");
})

export default router;