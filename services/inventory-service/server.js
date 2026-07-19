const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3010);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'inventory-service' }));
app.get('/inventory', (_req, res) => res.json([{ sku: 'apple', stock: 120 }, { sku: 'milk', stock: 80 }]));
app.listen(port, () => console.log(`inventory-service listening on ${port}`));
