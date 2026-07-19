const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3006);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'user-service' }));
app.get('/users/me', (_req, res) => res.json({ id: 'u1', name: 'Demo User', email: 'demo@blinkit.com' }));
app.listen(port, () => console.log(`user-service listening on ${port}`));
