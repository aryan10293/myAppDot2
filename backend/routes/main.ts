import express from "express";
import main from "../controller/main";
import { requireAuth } from "../middleware/main";
const router = express.Router();

// router.get("/");



router.get("/profile", requireAuth, main.getProfile)

export default router;