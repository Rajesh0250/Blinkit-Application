const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT || 3005);
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const catalogServiceUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
const ordersServiceUrl = process.env.ORDERS_SERVICE_URL || 'http://orders-service:3003';

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${authServiceUrl}/auth/login`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${authServiceUrl}/auth/register`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/catalog/products', async (_req, res) => {
  try {
    const response = await axios.get(`${catalogServiceUrl}/catalog/products`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const response = await axios.post(`${ordersServiceUrl}/orders`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`);
});
