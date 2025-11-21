import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 10_000,
});

// Transaction が不要な場合
async function getSimpleConnection() {
  return pool;
}

// Transaction を使用する場合
async function getTxConnection() {
  const client = await pool.connect();
  const end = async (sql: string) => {
    await client.query(sql);
    client.release();
  };
  await client.query("BEGIN");

  return {
    query: client.query,
    commit: () => end("COMMIT"),
    rollback: () => end("ROLLBACK"),
  };
}

export { getSimpleConnection, getTxConnection };
