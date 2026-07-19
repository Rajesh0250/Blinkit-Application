const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3015);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'payment-service' }));
app.post('/payment/initiate', (req, res) => res.json({ success: true, paymentId: 'pay-001', mode: 'UPI' }));
app.listen(port, () => console.log(`payment-service listening on ${port}`));
