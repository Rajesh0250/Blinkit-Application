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

const port = Number(process.env.PORT || 3002);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'catalog-service' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/catalog/products', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, category, stock FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/catalog/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, category, stock FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Catalog service listening on port ${port}`);
});
