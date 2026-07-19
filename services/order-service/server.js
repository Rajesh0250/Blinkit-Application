const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3014);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'order-service' }));
app.get('/orders', (_req, res) => res.json([{ id: 'ord-1001', status: 'Confirmed' }]));
app.listen(port, () => console.log(`order-service listening on ${port}`));
