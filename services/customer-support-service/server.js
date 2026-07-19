const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3020);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'customer-support-service' }));
app.get('/support', (_req, res) => res.json({ help: 'Call support at 1800-123-4567' }));
app.listen(port, () => console.log(`customer-support-service listening on ${port}`));
