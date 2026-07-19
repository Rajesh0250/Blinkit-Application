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
    'user-service': { title: 'User Service', description: 'Manages customer identity and tenant profile information.', items: Array.from({ length: 120 }, (_, i) => ({ name: `User Profile ${i + 1}`, detail: 'Registered customer with delivery preferences', badge: 'Active' })) },
    'profile-service': { title: 'Profile Service', description: 'Stores and retrieves customer profile preferences and details.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Profile ${i + 1}`, detail: 'Saved preference and loyalty profile', badge: 'Personalized' })) },
    'address-service': { title: 'Address Service', description: 'Handles saved addresses and delivery locations.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Address ${i + 1}`, detail: 'Home / Office / Family location', badge: 'Saved' })) },
    'catalog-service': { title: 'Catalog Service', description: 'Provides the product catalog for groceries, pharmacy, and essentials.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Catalog Item ${i + 1}`, detail: 'Fresh grocery or pharmacy item', badge: 'In stock' })) },
    'search-service': { title: 'Search Service', description: 'Enables fast search across products and categories.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Search Result ${i + 1}`, detail: 'Matched keyword and category suggestion', badge: 'Trending' })) },
    'inventory-service': { title: 'Inventory Service', description: 'Tracks real-time product availability and stock status.', items: Array.from({ length: 120 }, (_, i) => ({ name: `SKU ${i + 1}`, detail: 'Available in warehouse and dark store', badge: 'Ready' })) },
    'pricing-service': { title: 'Pricing Service', description: 'Calculates pricing, promotions, and discounts.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Offer ${i + 1}`, detail: 'Discounted product pricing and combo deal', badge: 'Discount' })) },
    'cart-service': { title: 'Cart Service', description: 'Keeps the customer basket state and cart contents.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Cart Item ${i + 1}`, detail: 'Basket item with quantity and price', badge: 'Added' })) },
    'checkout-service': { title: 'Checkout Service', description: 'Handles checkout requests and total calculation.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Checkout ${i + 1}`, detail: 'Order summary and delivery estimate', badge: 'Processing' })) },
    'order-service': { title: 'Order Service', description: 'Manages placed orders and order status.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Order ${i + 1}`, detail: 'Confirmed or in progress delivery', badge: 'Confirmed' })) },
    'payment-service': { title: 'Payment Service', description: 'Initiates secure payment flows for the order.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Payment ${i + 1}`, detail: 'Wallet / UPI / Card mode', badge: 'Secure' })) },
    'coupon-service': { title: 'Coupon Service', description: 'Applies coupon codes and promotional offers.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Coupon ${i + 1}`, detail: 'Promo code available for order', badge: 'Active' })) },
    'delivery-slot-service': { title: 'Delivery Slot Service', description: 'Provides available delivery time windows.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Slot ${i + 1}`, detail: 'Fast delivery window and ETA', badge: 'Available' })) },
    'notification-service': { title: 'Notification Service', description: 'Sends order updates and reminders.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Notification ${i + 1}`, detail: 'Delivery and offer alert', badge: 'New' })) },
    'rating-review-service': { title: 'Rating Review Service', description: 'Stores feedback for products and delivery experience.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Review ${i + 1}`, detail: 'Customer rating and product feedback', badge: 'Top rated' })) },
    'customer-support-service': { title: 'Customer Support Service', description: 'Provides help and support links for customers.', items: Array.from({ length: 120 }, (_, i) => ({ name: `Support Case ${i + 1}`, detail: 'Issue resolution and helpdesk data', badge: 'Open' })) }
  };

  const service = serviceMap[req.params.serviceName];
  if (!service) {
    return res.status(404).send('Service page not found');
  }

  res.render('service-page', { serviceName: req.params.serviceName, title: service.title, description: service.description, items: service.items });
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
