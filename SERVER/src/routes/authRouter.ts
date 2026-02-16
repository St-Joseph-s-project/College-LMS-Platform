import express from "express";
import { authValidators, loginValidator } from "../validator";
import { loginController } from "../controllers/auth/authController";

const router = express.Router();

router.post("/login", loginValidator, loginController);

router.use("/health", (req, res) => {
  res.json("AUTH HEALTH OK");
})

export default router;