const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3012);
const cart = [];
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'cart-service' }));
app.post('/cart/add', (req, res) => {
  const item = req.body;
  const existing = cart.find(x => x.name === item.name);
  if (existing) existing.quantity += 1; else cart.push({ ...item, quantity: 1 });
  res.json({ success: true, cart });
});
app.get('/cart', (_req, res) => res.json(cart));
app.listen(port, () => console.log(`cart-service listening on ${port}`));
