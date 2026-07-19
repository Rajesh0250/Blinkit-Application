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

const port = Number(process.env.PORT || 3003);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'orders-service' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/orders', async (req, res) => {
  const { customerName, items, total } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_name, items, total) VALUES ($1, $2, $3) RETURNING id, customer_name, items, total, created_at',
      [customerName, JSON.stringify(items), total]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/orders', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, customer_name, items, total, created_at FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Orders service listening on port ${port}`);
});
