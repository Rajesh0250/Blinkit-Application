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
const sessionStore = new Map();

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

app.get('/service/:serviceName', (req, res) => {
  const serviceMap = {
    'user-service': { title: 'User Service', description: 'Manages customer identity and tenant profile information.' },
    'profile-service': { title: 'Profile Service', description: 'Stores and retrieves customer profile preferences and details.' },
    'address-service': { title: 'Address Service', description: 'Handles saved addresses and delivery locations.' },
    'catalog-service': { title: 'Catalog Service', description: 'Provides the product catalog for groceries, pharmacy, and essentials.' },
    'search-service': { title: 'Search Service', description: 'Enables fast search across products and categories.' },
    'inventory-service': { title: 'Inventory Service', description: 'Tracks real-time product availability and stock status.' },
    'pricing-service': { title: 'Pricing Service', description: 'Calculates pricing, promotions, and discounts.' },
    'cart-service': { title: 'Cart Service', description: 'Keeps the customer basket state and cart contents.' },
    'checkout-service': { title: 'Checkout Service', description: 'Handles checkout requests and total calculation.' },
    'order-service': { title: 'Order Service', description: 'Manages placed orders and order status.' },
    'payment-service': { title: 'Payment Service', description: 'Initiates secure payment flows for the order.' },
    'coupon-service': { title: 'Coupon Service', description: 'Applies coupon codes and promotional offers.' },
    'delivery-slot-service': { title: 'Delivery Slot Service', description: 'Provides available delivery time windows.' },
    'notification-service': { title: 'Notification Service', description: 'Sends order updates and reminders.' },
    'rating-review-service': { title: 'Rating Review Service', description: 'Stores feedback for products and delivery experience.' },
    'customer-support-service': { title: 'Customer Support Service', description: 'Provides help and support links for customers.' }
  };

  const service = serviceMap[req.params.serviceName];
  if (!service) {
    return res.status(404).send('Service page not found');
  }

  res.render('service-page', { serviceName: req.params.serviceName, title: service.title, description: service.description });
});

app.post('/cart/add', (req, res) => {
  const { name, price, category, token } = req.body;
  const existing = cartStore.get(name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartStore.set(name, { name, price, category, quantity: 1 });
  }
  if (token) {
    sessionStore.set(token, Array.from(cartStore.values()));
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

app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${apiGatewayUrl}/auth/register`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Frontend listening on port ${port}`);
});
