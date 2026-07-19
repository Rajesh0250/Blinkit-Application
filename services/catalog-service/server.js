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

const getProductColumns = async () => {
  try {
    const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products'");
    return new Set(result.rows.map((row) => row.column_name));
  } catch (_error) {
    return new Set();
  }
};

const buildProductQuery = async (whereClause = '') => {
  const columns = await getProductColumns();
  const selectedColumns = [
    'id', 'name', 'price', 'category', 'stock'
  ];
  if (columns.has('subcategory')) selectedColumns.push('subcategory');
  if (columns.has('brand')) selectedColumns.push('brand');
  if (columns.has('unit')) selectedColumns.push('unit');
  if (columns.has('description')) selectedColumns.push('description');
  if (columns.has('image_url')) selectedColumns.push('image_url');
  const columnList = selectedColumns.join(', ');
  return `SELECT ${columnList} FROM products${whereClause}`;
};

app.get('/catalog/products', async (_req, res) => {
  try {
    const query = await buildProductQuery(' ORDER BY id');
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/catalog/category/:category', async (req, res) => {
  try {
    const query = await buildProductQuery(' WHERE category = $1 ORDER BY id');
    const result = await pool.query(query, [req.params.category]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/catalog/products/:id', async (req, res) => {
  try {
    const query = await buildProductQuery(' WHERE id = $1');
    const result = await pool.query(query, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Catalog service listening on port ${port}`);
});
