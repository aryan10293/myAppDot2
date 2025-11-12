import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import getTodaysDate from "../../middleware/utils";
import { Request, Response } from "express";
import pool from "../../config/neon";
import { DateTime } from "luxon";

let interactions = {
    getProfile: async (req:Request, res:Response) => {
        try {
            // this is the login user (req as any).user.sub) code
            
            const getUser = await pool.query('SELECT * FROM users WHERE id = $1', [(req as any).user.sub]);
            res.json({ message: "Welcome back! " + getUser.rows[0].firstname, user: getUser.rows[0] });
          
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: '500', error: 'Internal server error' });
        }
      },
      checkIn: async (req: Request, res: Response) => {
        // task for tomorrow
        // if user goes mor ethan one day with out checking in set strek to 0
        // if some
        try {
            const userId = (req as any).user.sub;

            
            const { rows } = await pool.query(
            "SELECT id, streak, last_checkin, time_zone FROM users WHERE id = $1",
            [userId]
            );
            const user = rows[0];
            if (!user) return res.status(404).json({ message: "User not found" });

            
            const tz = user.timezone || "UTC";
            const lastLocal = new Date(user.last_checkin).toLocaleDateString("en-CA", {
            timeZone: tz,
            }); 
            const nowLocal = new Date().toLocaleDateString("en-CA", { timeZone: tz });

            console.log({ tz, lastLocal, nowLocal });

            
            if (lastLocal === nowLocal) {
            return res.status(200).json({
                updated: false,
                message: "Already checked in today.",
                streak: user.streak,
            });
            }

            
            const updateQuery = `
            UPDATE users
            SET streak = $1,
                last_checkin = NOW()
            WHERE id = $2
            RETURNING *;
            `;
            const updateValues = [user.streak + 1, user.id];
            const result = await pool.query(updateQuery, updateValues);

            
            return res.status(200).json({
            updated: true,
            message: "Check-in successful.",
            ...result.rows[0],
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error });
        }
    }
}
export default interactions

