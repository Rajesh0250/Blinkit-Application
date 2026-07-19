const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);
const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:3005';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', async (_req, res) => {
  try {
    const productsRes = await axios.get(`${apiGatewayUrl}/catalog/products`);
    res.render('index', { products: productsRes.data, apiGatewayUrl });
  } catch (error) {
    res.render('index', { products: [], apiGatewayUrl, error: 'Unable to reach API gateway' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${apiGatewayUrl}/auth/login`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/checkout', async (req, res) => {
  try {
    const response = await axios.post(`${apiGatewayUrl}/orders`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Frontend listening on port ${port}`);
});
