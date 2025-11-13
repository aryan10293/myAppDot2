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
        try {
            const userId = (req as any).user.sub;
            
            const { rows } = await pool.query(
            "SELECT id, streak, last_checkin, time_zone FROM users WHERE id = $1",
            [userId]
            );

            const user = rows[0];

            if (!user) return res.status(404).json({ message: "User not found" });

            const raw = user.last_checkin + ""; // raw

            let checkin = DateTime.fromJSDate(new Date(raw)); 
            let today = DateTime.fromJSDate(new Date())

            checkin = checkin.toISO().slice(0,10);
            checkin =  DateTime.fromISO(checkin);

            today = today.toISO().slice(0,10);
            today = DateTime.fromISO(today);

            const diff = today.diff(checkin, 'days').days

            const updateQuery = `
                UPDATE users
                SET streak = $1,
                    last_checkin = NOW()
                WHERE id = $2
                RETURNING *;
            `;

            if(diff <= 0){
                return res.status(200).json({
                    updated: false,
                    message: "Already checked in today.",
                    streak: user.streak,
                });
            } else {
                const updateValues = [user.streak + 1, user.id];
                const result = await pool.query(updateQuery, updateValues);

                
                return res.status(200).json({
                updated: true,
                message: "Check-in successful.",
                ...result.rows[0],
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error });
        }
    }
}
export default interactions

