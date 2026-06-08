require('dotenv').config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD type:", typeof process.env.DB_PASSWORD);
console.log("DB_PASSWORD exists:", Boolean(process.env.DB_PASSWORD));
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get('/api/messages', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM messages ORDER BY created_at ASC'
  );
  res.json(result.rows);
});

app.post('/api/messages', async (req, res) => {
  const { username, text } = req.body;
  const result = await pool.query(
    'INSERT INTO messages (username, text) VALUES ($1, $2) RETURNING *',
    [username, text]
  );
  res.json(result.rows[0]);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `サーバが起動しました： http://localhost:${process.env.PORT || 3000}`,
  );
});