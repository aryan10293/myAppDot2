import pool from "../config/neon";
const findUserEmail = async (email: string) => {
    // Placeholder function to simulate finding a user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

export default findUserEmail;