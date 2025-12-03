import express from "express";
import main from "../controller/main";
import interactions from "../controller/interactions/interactions";
import { requireAuth } from "../middleware/main";
const router = express.Router();

router.get("/profile", requireAuth, main.getProfile)
router.get("/goal", requireAuth, interactions.getGoals);

router.post("/register", main.register);
router.post("/login", main.login);
router.post("/logout", requireAuth, main.logout);
router.post('/goal', requireAuth, interactions.createGoal);

router.patch("/checkin", requireAuth, interactions.checkIn);
router.patch("/checkforcheckin", requireAuth, interactions.checkForCheckIn);
router.patch("/goal/:id", requireAuth, interactions.editGoal);

router.delete("/goal/:goalname", requireAuth, interactions.deleteGoal);

export default router;