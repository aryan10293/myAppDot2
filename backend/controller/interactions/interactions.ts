import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

import { Request, Response } from "express";
import pool from "../../config/neon";

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
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [(req as any).user.sub]);;
            console.log(user.rows[0])
        } catch (error) {
            
        }
      }
}
export default interactions

