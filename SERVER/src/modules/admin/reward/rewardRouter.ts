import express from "express";
import { checkPermission, validateJWT, validateTenant } from "../../../middleware";
import multer from "multer";
import fs from "fs";

import { rewardValidator } from "./rewardValidator";
import {
  createRewardController,
  getRewardsController,
  deleteRewardController,
  getRewardByIdController,
  updateRewardController,
  getPendingRewardsController,
  getDeliveredRewardsController,
  updateOrderStatusController
} from "./rewardController";



const storage = multer.memoryStorage();
const upload = multer({ storage });



const router = express.Router();

router.get("/get-all", validateJWT, validateTenant, checkPermission("LMS_REWARD_VIEW"), getRewardsController)

router.get("/get/:id", validateJWT, validateTenant, checkPermission("LMS_REWARD_VIEW"), getRewardByIdController)

router.post(
  "/add",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARD_ADD"),
  upload.single("image"),  
  rewardValidator.createReward,
  createRewardController
);

router.put(
  "/update/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARD_UPDATE"),
  upload.single("image"), 
  rewardValidator.updateReward,
  updateRewardController
);


//newly added routes
router.get(
  "/track-rewards",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARD_VIEW"),
  getPendingRewardsController
);

router.get(
  "/history-rewards",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARD_VIEW"),
  getDeliveredRewardsController
);


router.delete("/delete/:id", validateJWT, validateTenant, checkPermission("LMS_REWARD_DELETE"), deleteRewardController)


router.put(
  "/orders/update-status/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_UPDATE"),
  rewardValidator.updateOrderStatus,
  updateOrderStatusController
);

export default router;