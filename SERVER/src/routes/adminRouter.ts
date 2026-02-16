import express from "express";
const router = express.Router();



router.use("/health", (req, res) => {
  res.json("ADMIN HEALTH OK");
})

export default router;