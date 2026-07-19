const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3017);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'delivery-slot-service' }));
app.get('/slots', (_req, res) => res.json([{ slot: '10:00 AM - 12:00 PM', available: true }, { slot: '6:00 PM - 8:00 PM', available: true }]));
app.listen(port, () => console.log(`delivery-slot-service listening on ${port}`));
