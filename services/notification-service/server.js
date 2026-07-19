const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3018);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'notification-service' }));
app.post('/notify', (_req, res) => res.json({ success: true, message: 'Notification sent' }));
app.listen(port, () => console.log(`notification-service listening on ${port}`));
