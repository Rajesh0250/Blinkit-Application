const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3007);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'profile-service' }));
app.get('/profile', (_req, res) => res.json({ name: 'Demo User', phone: '+91-99999-99999', avatar: '🥑' }));
app.listen(port, () => console.log(`profile-service listening on ${port}`));
