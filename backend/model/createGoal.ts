import pool from "../config/neon";
import { v4 as uuidv4 } from "uuid";

// password will end being hashed in the future
export async function createGoal(userId:string, goalName:string, streak:number,  privacy: string) {
    const id = uuidv4();

    // insert user into past needs to look exactly how it does in the createTables function
  const query = `
    INSERT INTO goals (id, userid, goalName, streak, privacy)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [id, userId, goalName, 0, privacy];
  const result = await pool.query(query, values);
  return result.rows[0];
}