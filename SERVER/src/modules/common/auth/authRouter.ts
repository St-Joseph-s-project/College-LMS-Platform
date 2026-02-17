import * as express from "express";
import { authValidators } from "./authValidator";
import {loginController} from "./authController"
const router = express.Router();


router.post("/login", authValidators.login, loginController)

router.use("/health", (req, res) => {
  res.json("ADMIN HEALTH OK");
})

export default router;