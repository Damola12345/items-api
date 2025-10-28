const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
});

async function init(){
  // create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}

async function addItem(name) {
  const { rows } = await pool.query('INSERT INTO items(name) VALUES($1) RETURNING *', [name]);
  return rows[0];
}

async function listItems() {
  const { rows } = await pool.query('SELECT * FROM items ORDER BY id DESC LIMIT 100');
  return rows;
}

module.exports = { pool, init, addItem, listItems };
