import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import { Request, Response } from "express";
import pool from "../../config/neon";
import { DateTime } from "luxon";
import {createGoal} from "../../model/createGoal";


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

            let checkin: any = DateTime.fromJSDate(new Date(raw)); 
            let today: any = DateTime.fromJSDate(new Date())

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
    }, 
    checkForCheckIn: async (req: Request, res: Response) => {
        const userId = (req as any).user.sub;
            
        const { rows } = await pool.query(
        "SELECT id, streak, last_checkin, time_zone FROM users WHERE id = $1",
        [userId]
        );

        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });
        const raw = user.last_checkin + ""; 

        let checkin: any = DateTime.fromJSDate(new Date(raw)); 
        let today: any = DateTime.fromJSDate(new Date())

        checkin = checkin.toISO().slice(0,10);
        checkin =  DateTime.fromISO(checkin);

        today = today.toISO().slice(0,10);
        today = DateTime.fromISO(today);

        const diff = today.diff(checkin, 'days').days

        if(diff>1){
            const updateQuery = `
                UPDATE users
                SET streak = $1,
                    last_checkin = NOW()
                WHERE id = $2
                RETURNING *;
            `;
            const updateValues = [1, user.id];
            const result = await pool.query(updateQuery, updateValues);
            return res.status(200).json({
                reset: true,
                message: "Your streak reset after a few missed days, but you’re back in! We’ve checked you in — time to rebuild that streak and keep pushing.",
                streak: user.streak,
            });
        } 
        return res.status(200).json({message:"no issues found"})
    },
    getGoals: async (req: Request, res: Response) => {
        const userId = (req as any).user.sub;
        const data = await pool.query('SELECT * FROM goals WHERE userid = $1', [userId]);
        res.status(200).json(data.rows)
    },
    createGoal: async (req: Request, res: Response) => {
        const userId = (req as any).user.sub;
        const {title, privacy, minutes} = req.body
        const user = await createGoal(userId, title, minutes, privacy );
        res.status(201).send({status:"201", message:"goal was entered succesfully"})
    },
    deleteGoal: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            const { goalname } = req.params;
            const data = await pool.query('SELECT * FROM goals WHERE userid = $1 and goalname = $2', [userId, goalname]);
            const goalData = await pool.query('DELETE FROM goals WHERE id = $1', [data.rows[0].id]);
            res.status(200).send({status:"200", message:"goal was deleted"});
            
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error})
            
        }
    }, editGoal: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            console.log(userId)
            const { id } = req.params;
            const { title, userid  } = req.body;

            const data = await pool.query(
                'UPDATE goals SET goalname = $1 WHERE id = $2 AND userid = $3 RETURNING *',
                [title, id, userId]
            );

            if (data.rowCount === 0) {
                return res.status(404).send({ status: "404", message: "Goal not found or you do not have permission to edit this goal." });
            }

            res.status(200).send({ status: "200", message: "Goal was updated successfully", goal: data.rows[0] });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    }
}
export default interactions

