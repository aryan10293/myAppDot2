import express from "express";
import main from "../controller/main";
import interactions from "../controller/interactions/interactions";
import { requireAuth } from "../middleware/main";
const router = express.Router();

router.get("/profile", requireAuth, main.getProfile)
router.get("/getgoals", requireAuth, interactions.getGoals);

router.post("/register", main.register);
router.post("/login", main.login);
router.post("/logout", requireAuth, main.logout);
router.post('/creategoal', requireAuth, interactions.createGoal);

router.patch("/checkin", requireAuth, interactions.checkIn);
router.patch("/checkforcheckin", requireAuth, interactions.checkForCheckIn);

router.delete("/deletegoal/:goalname", requireAuth, interactions.deleteGoal);

export default router;