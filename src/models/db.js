import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://hlopg_user:bRUV9nYRhtNh0No4b7ANp342lcPvGId6@dpg-d3hkr4e3jp1c73fkgurg-a.oregon-postgres.render.com/hlopg",
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

 

export default pool;
