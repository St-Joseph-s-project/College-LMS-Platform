import * as express from "express";
import { validateJWT, checkPermission, validateTenant } from "./../../../middleware";
import { getAllRewardsController, getRewardByIdController, buyRewardController, getClientRewardsHistoryController } from "./rewardController";

const router = express.Router();

router.get(
  "/get-all",
  validateJWT,
  validateTenant,
  getAllRewardsController,
);

router.get(
  "/history",
  validateJWT,
  validateTenant,
  getClientRewardsHistoryController,
);

router.get(
  "/get/:id",
  validateJWT,
  validateTenant,
  getRewardByIdController,
)

router.post(
  "/purchase/:id",
  validateJWT,
  validateTenant,
  buyRewardController,
);


router.use("/health", (req, res) => {
  res.json("CLIENT HEALTH OK");
})

export default router;