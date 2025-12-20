import express from "express";
import main from "../controller/main";
import interactions from "../controller/interactions/interactions";
import { requireAuth } from "../middleware/main";
const router = express.Router();

router.get("/profile", requireAuth, main.getProfile)
router.get("/goal", requireAuth, interactions.getGoals);
router.get("/goal/:goalname", requireAuth, interactions.getGoalByName);
router.get("/tags/:goalname", requireAuth, interactions.getTags);
router.get("/checkins/:goalname", requireAuth, interactions.getCheckInDates);
router.get('/weeklyprogress', requireAuth, interactions.getWeeklyProgress);

router.post("/register", main.register);
router.post("/login", main.login);
router.post("/logout", requireAuth, main.logout);
router.post('/goal', requireAuth, interactions.createGoal);


router.patch("/checkin", requireAuth, interactions.checkIn);
router.patch("/checkforcheckin", requireAuth, interactions.checkForCheckIn);
router.patch("/goal/:id", requireAuth, interactions.editGoal);
router.patch("/checkin/:goalname", requireAuth, interactions.goalCheckIn);
router.patch("/history/:goalname", requireAuth, interactions.history);

router.delete("/goal/:goalname", requireAuth, interactions.deleteGoal);

export default router;