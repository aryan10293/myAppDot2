import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import { Request, Response } from "express";
import pool from "../../config/neon";
import { DateTime } from "luxon";
import {createGoal} from "../../model/createGoal";
import getCurrentWeekRange from "../../config/getWeekRange";
import { stat } from "fs";
import { get } from "http";


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

            let checkin = DateTime.fromJSDate(user.last_checkin, { zone: user.time_zone }).startOf("day");
            let today  = DateTime.now().setZone(user.time_zone).startOf("day");

            const diff = today.diff(checkin, 'days').days
            console.log(diff, 'this is the diff')
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

        let checkin = DateTime.fromJSDate(user.last_checkin).setZone(user.time_zone).startOf("day");
        let today  = DateTime.now().setZone(user.time_zone).startOf("day");
        
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
        const {title, privacy, minutes, description, frequency} = req.body
        const user = await createGoal(userId, title, minutes, privacy, description, frequency );
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
            const { id } = req.params;
            const { title, description, frequency, minutes, privacy } = req.body;

            const data = await pool.query(
                'UPDATE goals SET goalname = $1, description = $2, frequency = $3, minutes = $4, privacy = $5 WHERE id = $6 AND userid = $7 RETURNING *',
                [title, description, frequency, minutes, privacy, id, userId]
            );

            if (data.rowCount === 0) {
                return res.status(404).send({ status: "404", message: "Goal not found or you do not have permission to edit this goal." });
            }

            res.status(200).send({ status: "200", message: "Goal was updated successfully", goal: data.rows[0] });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    getGoalByName: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            const { goalname } = req.params;
            const data = await pool.query('SELECT * FROM goals WHERE userid = $1 and urlname = $2', [userId, goalname]);
            if(data.rowCount === 0){
                return res.status(404).send({status:"404", message:"Goal not found"});
            }
            res.status(200).json({goal: data.rows[0]})
        } catch (error) {
            console.log(error)
            res.status(500).send({error})
        }
    },
    goalCheckIn: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            const { goalname } = req.params;

            const goalData = await pool.query('SELECT * FROM goals WHERE userid = $1 and urlname = $2', [userId, goalname]);
            const totalcheckins = goalData.rows[0].totalcheckins + 1;
            const longeststreak = goalData.rows[0].longeststreak;
            if(goalData.rowCount === 0){
                return res.status(404).send({status:"404", message:"Goal not found"});
            }

            const goal = goalData.rows[0];

            const lastCheckinRaw = goal.lastcheckindate + ""; 

            let lastCheckin: any = lastCheckinRaw ? DateTime.fromJSDate(new Date(lastCheckinRaw)) : null; 
            let today: any = DateTime.fromJSDate(new Date())

            if(lastCheckin){
                lastCheckin = lastCheckin.toISO().slice(0,10);
                lastCheckin =  DateTime.fromISO(lastCheckin);
            }

            today = today.toISO().slice(0,10);
            today = DateTime.fromISO(today);

            let diff = lastCheckin ? today.diff(lastCheckin, 'days').days : null;

            if(diff !== null && diff <= 0){
                return res.status(200).json({
                    updated: false,
                    message: "Already checked in for this goal today.",
                });
            } else {
                const updateQuery = `
                    UPDATE goals
                    SET streak = $1,
                        tags = array_append(tags, $2),
                        checkindates = array_append(checkindates, $5),
                        totalcheckins = $3,
                        longeststreak = CASE 
                            WHEN $1 > longeststreak THEN $1 
                            ELSE longeststreak 
                        END,
                        lastcheckindate = NOW()
                    WHERE id = $4
                    RETURNING *;
                `;
                const tagUpdate = today.toISODate();
                
                const newStreak = (diff !== null && diff === 1) ? goal.streak + 1 : 1;
                const updateValues = [newStreak, `${tagUpdate} | Checked in — stayed consistent for this day`, totalcheckins, goal.id, `${tagUpdate}`];
                const result = await pool.query(updateQuery, updateValues);

                
                return res.status(200).json({
                status: "200",
                updated: true,
                message: "Goal check-in successful.",
                ...result.rows[0],
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error });
        }
    },
    history: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            const {goalname} = req.params;
            const {text} = req.body;
            console.log(goalname)
            let today: any = DateTime.fromJSDate(new Date())
            today = today.toISO().slice(0,10);
            today = DateTime.fromISO(today);
            today = today.toISODate();

            // const goalData = await pool.query('SELECT * FROM goals WHERE userid = $1 and goalname = $2', [userId, goalname]);
            // if(goalData.rowCount === 0){
            //     return res.status(404).send({status:"404", message:"Goal not found"});
            // }

            const updateQuery = `
                    UPDATE goals
                    SET tags = array_append(tags, $2)
                    WHERE urlname = $3 AND userid = $1
                    RETURNING *;
                `;

            //const goal = goalData.rows[0];
            const tagUpdate = `${today} | ${text}`;
            const updateValues = [userId, tagUpdate, goalname];
            const result = await pool.query(updateQuery, updateValues);

            return res.status(200).json({
                status: "200",
                message: "reflection added successfully.",
                ...result.rows[0],
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error });
        }
    },
    getTags: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            const { goalname } = req.params;

            const goalData = await pool.query('SELECT * FROM goals WHERE userid = $1 and urlname = $2', [userId, goalname]);
            if(goalData.rowCount === 0){
                return res.status(404).send({status:"404", message:"Goal not found"});
            }
            const goal = goalData.rows[0];
            console.log(goal.tags);
            const tags = goal.tags.reverse() || [];
            res.status(200).json({tags: tags});
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error})
        }

    },
    getCheckInDates: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.sub;
            const { goalname } = req.params;
            const { start } = getCurrentWeekRange();
            let currentMonthArray: boolean[];
            const currentMonth = new Date(start).getMonth()+1
            const currentWeekArray: boolean[] = [false, false, false, false, false, false, false];
            if (currentMonth === 1 || currentMonth === 3 || currentMonth === 5 || currentMonth === 7 || currentMonth === 8 || currentMonth === 10 || currentMonth === 12){
                currentMonthArray = new Array(31).fill(false);
            } else if (currentMonth === 4 || currentMonth === 6 || currentMonth === 9 || currentMonth === 11){
                currentMonthArray = new Array(30).fill(false);
            } else {
                currentMonthArray = new Array(28).fill(false);
            }
            
            // if checkin date is in week range return one or true and if not return zero or false
            // get the dates to be able to show the differnts in time passed. 

            let theStartOfWeek: any = DateTime.fromISO(start, { zone: "America/Los_Angeles" }).startOf("day");
            
            const goalData = await pool.query('SELECT * FROM goals WHERE userid = $1 and urlname = $2', [userId, goalname]);
            if(goalData.rowCount === 0){
                return res.status(404).send({status:"404", message:"Goal not found"});
            }

            const goal = goalData.rows[0];
            const checkInDates = goal.checkindates || [];

            if( checkInDates.length === 0){
                return  res.status(200).json({ checkInDates: [], currentWeekArray, currentMonthArray });
            }

            for(let i=0; i<checkInDates.length; i++){ {
                let today: any = DateTime.fromJSDate(checkInDates[i], { zone: "America/Los_Angeles" }).startOf("day");
                if(today.month === currentMonth && today.year === theStartOfWeek.year){
                    currentMonthArray[today.day-1] = true;
                }
                
                let diff = theStartOfWeek ? today.diff(theStartOfWeek, 'days').days : null;

                if(diff !== null && diff >=0 && diff <=6){
                    currentWeekArray[diff] = true;
                }

            } };
            res.status(200).json({ checkInDates, currentWeekArray, currentMonthArray });
        } catch (error) {
            console.log(error)
            res.status(500).send({error})
        }
    }
}
export default interactions

