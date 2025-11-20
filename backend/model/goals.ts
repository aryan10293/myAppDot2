import pool from "../config/neon";

const createGoalTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goals (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                userid VARCHAR(255) NOT NULL,
                goalName VARCHAR(255) NOT NULL,
                streak INTEGER NOT NULL DEFAULT 0,
                minutes INTEGER NOT NULL DEFAULT 0,
                privacy VARCHAR(255) NOT NULL
            );
        `);
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};
export default createGoalTable;