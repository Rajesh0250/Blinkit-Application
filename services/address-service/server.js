const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3008);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'address-service' }));
app.get('/addresses', (_req, res) => res.json([{ id: 'a1', label: 'Home', address: '123, Green Park, Delhi' }]));
app.listen(port, () => console.log(`address-service listening on ${port}`));
