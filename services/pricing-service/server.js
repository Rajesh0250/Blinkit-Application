const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3011);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'pricing-service' }));
app.post('/pricing/quote', (req, res) => res.json({ subtotal: req.body.price || 0, discount: 10, finalAmount: (req.body.price || 0) * 0.9 }));
app.listen(port, () => console.log(`pricing-service listening on ${port}`));
