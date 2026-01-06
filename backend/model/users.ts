import pool from "../config/neon";
import getDate from "../config/getDate";
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) NOT NULL,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                time_zone VARCHAR(255) NOT NULL,
                streak INTEGER NOT NULL DEFAULT 0,
                last_checkin VARCHAR(255) DEFAULT ${getDate()}
                
            );
        `);
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};
export default createTables;