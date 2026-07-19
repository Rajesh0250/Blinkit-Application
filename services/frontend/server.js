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

const cartStore = new Map();

app.get('/', async (_req, res) => {
  try {
    const productsRes = await axios.get(`${apiGatewayUrl}/catalog/products`);
    const products = productsRes.data || [];
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    res.render('index', { products, categories, selectedCategory: 'All', apiGatewayUrl, cartCount: 0 });
  } catch (error) {
    res.render('index', { products: [], categories: [], selectedCategory: 'All', apiGatewayUrl, cartCount: 0, error: 'Unable to reach API gateway' });
  }
});

app.get('/category/:category', async (req, res) => {
  try {
    const productsRes = await axios.get(`${apiGatewayUrl}/catalog/products`);
    const products = productsRes.data || [];
    const selectedCategory = req.params.category;
    const filtered = selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    res.render('index', { products: filtered, categories, selectedCategory, apiGatewayUrl, cartCount: 0 });
  } catch (error) {
    res.render('index', { products: [], categories: [], selectedCategory: req.params.category, apiGatewayUrl, cartCount: 0, error: 'Unable to reach API gateway' });
  }
});

app.get('/cart', (_req, res) => {
  const cart = Array.from(cartStore.values());
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  res.render('cart', { cart, total });
});

app.post('/cart/add', (req, res) => {
  const { name, price, category } = req.body;
  const existing = cartStore.get(name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartStore.set(name, { name, price, category, quantity: 1 });
  }
  res.json({ success: true, cartCount: cartStore.size });
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
    cartStore.clear();
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Frontend listening on port ${port}`);
});
