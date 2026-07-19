const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'blinkit',
  password: process.env.DB_PASSWORD || 'blinkitpass',
  database: process.env.DB_NAME || 'blinkitdb'
});

const port = Number(process.env.PORT || 3001);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'auth-service' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, username, role FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const token = `mock-jwt-${user.id}-${Date.now()}`;
    await pool.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) ON CONFLICT (token) DO NOTHING', [user.id, token]);

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/auth/register', async (req, res) => {
  const { username, password, role = 'customer' } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const inserted = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role', [username, password, role]);
    const user = inserted.rows[0];
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/auth/users', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`);
});
