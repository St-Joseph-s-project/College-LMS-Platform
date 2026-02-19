import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createRewardController,
  getRewardsController,
  deleteRewardController,
  getRewardByIdController,
  updateRewardController,
  getOrdersController,
  updateOrderStatusController,
} from "./adminController";
import { adminValidators } from "./adminValidator";
import { checkPermission, validateJWT, validateTenant } from "../../middleware";



const router = express.Router();
const uploadPath = "uploads/rewards";





// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });





//this route (method post) is used to put the new rewards in db
router.post(
  "/rewards",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_ADD"),
  upload.single("image"),
  adminValidators.createReward,
  createRewardController
);



//this route (get method) is used to get all the rewards availabe in db
router.get(
  "/rewards",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_VIEW"),
  getRewardsController
);



//this route (get method) is used to get a single rewards using its id
router.get(
  "/rewards/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_VIEW"),
  getRewardByIdController
);


//this route (delete method) is used to delete the rewards by its id
router.delete(
  "/rewards/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_DELETE"),
  deleteRewardController
);



//this route (put method) is used to update the rewards by its id
router.put(
  "/rewards/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_UPDATE"),
  upload.single("image"),
  adminValidators.updateReward,
  updateRewardController
);




// this route (get method) is used to get all orders
router.get(
  "/orders",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_VIEW"),
  getOrdersController
);

// this route (put method) is used to update order status
router.put(
  "/orders/:id/status",
  validateJWT,
  validateTenant,
  checkPermission("LMS_REWARDS_UPDATE"),
  updateOrderStatusController
);
router.use("/health", (req, res) => {
  res.json("ADMIN REWARD MODULE HEALTH OK");
});

export default router;
