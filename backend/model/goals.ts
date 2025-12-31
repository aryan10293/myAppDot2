import pool from "../config/neon";
import getDate from "../config/getDate";
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
                checkindates VARCHAR(255)[] NOT NULL,
                minutes INTEGER NOT NULL DEFAULT 1,
                longeststreak INTEGER NOT NULL DEFAULT 1,
                totalcheckins INTEGER NOT NULL DEFAULT 1,
                privacy VARCHAR(255) NOT NULL,
                lastcheckindate VARCHAR(255) DEFAULT '${getDate()}',
                createdDate VARCHAR(255) DEFAULT '${getDate()}'
            );
        `);
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};
export default createGoalTable;