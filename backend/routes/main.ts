import express from "express";
import main from "../controller/main";
import interactions from "../controller/interactions/interactions";
import { requireAuth } from "../middleware/main";
const router = express.Router();


router.post("/register", main.register);
router.post("/login", main.login);
router.get("/profile", requireAuth, main.getProfile)
router.post("/logout", requireAuth, main.logout);
router.patch("/checkin", requireAuth, interactions.checkIn);
router.patch("/checkforcheckin", requireAuth, interactions.checkForCheckIn);

export default router;