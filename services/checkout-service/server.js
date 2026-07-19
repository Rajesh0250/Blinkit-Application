const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3013);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'checkout-service' }));
app.post('/checkout', (req, res) => res.json({ success: true, message: 'Checkout completed', orderId: 'ord-1001', total: req.body.total || 0 }));
app.listen(port, () => console.log(`checkout-service listening on ${port}`));
