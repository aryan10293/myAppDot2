import pool from "../config/neon";

const createGoalTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goals (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                userid VARCHAR(255) NOT NULL,
                goalName VARCHAR(255) NOT NULL,
                urlName VARCHAR(255) NOT NULL,
                description TEXT,
                frequency VARCHAR(255),
                streak INTEGER NOT NULL DEFAULT 1,
                tags TEXT[] DEFAULT '{}',
                checkindates TIMESTAMPTZ[] DEFAULT '{}',
                minutes INTEGER NOT NULL DEFAULT 1,
                longeststreak INTEGER NOT NULL DEFAULT 1,
                totalcheckins INTEGER NOT NULL DEFAULT 1,
                privacy VARCHAR(255) NOT NULL,
                lastcheckindate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};
export default createGoalTable;