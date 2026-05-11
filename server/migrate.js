require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function run() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  await pool.end();
  console.log('Database migration completed.');
}

run().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
