import pool from "../config/neon";
import { v4 as uuidv4 } from "uuid";

// password will end being hashed in the future
export async function createGoal(userId:string, goalName:string, minutes:number,  privacy: string, description?: string, frequency?: string) {
    const id = uuidv4();

    // insert user into past needs to look exactly how it does in the createTables function
  const query = `
    INSERT INTO goals (id, userid, goalName, privacy, minutes, description, frequency)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [id, userId, goalName, privacy, minutes, description, frequency];
  const result = await pool.query(query, values);
  return result.rows[0];
}