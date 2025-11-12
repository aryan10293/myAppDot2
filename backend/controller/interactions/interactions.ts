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
      checkIn: async  (req:Request, res:Response) => {
        try {
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [(req as any).user.sub]);
            const lastCheckIn: string  = user.rows[0].last_checkin + "";
            const parts = lastCheckIn.split(" ");
            const idkWhatToCallThis = (parts[1] ?? "") + (parts[2] ?? "") + (parts[3] ?? "");
            let date: string | string[] = new Date()+"";
            date = date.split(" ")
            const getTodaysDate = (date[1] ?? "") + (date[2] ?? "") + (date[3] ?? "")
            console.log(getTodaysDate);
            console.log(idkWhatToCallThis)

            if(idkWhatToCallThis === getTodaysDate){
                console.log("this may work for now")
            }
            
            const query = `
                UPDATE users 
                SET streak = $1 
                WHERE id = $2
                RETURNING *;
            `;

            const values = [user.rows[0].streak + 1, user.rows[0].id];
            const result = await pool.query(query, values);
            
            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.log(error);
        }
      }
}
export default interactions

