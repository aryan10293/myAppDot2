import pool from "../config/neon";
import { v4 as uuidv4 } from "uuid";
import hashPassword from "../config/hashPassword";

// password will end being hashed in the future
export  async function createUser(firstName:string, lastName:string, email:string, password:string, time_zone:string) {
    const id = uuidv4();
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
        throw new Error("Failed to hash password");
    }
    // insert user into past needs to look exactly how it does in the createTables function
  const query = `
    INSERT INTO users (id, firstName, lastName, email, password, streak, time_zone)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [id, firstName, lastName, email, hashedPassword, 1, time_zone];
  const result = await pool.query(query, values);
  return result.rows[0];
}