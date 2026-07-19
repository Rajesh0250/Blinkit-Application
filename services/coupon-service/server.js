const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3016);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'coupon-service' }));
app.get('/coupons', (_req, res) => res.json([{ code: 'SAVE10', discount: 10 }, { code: 'FREESHIP', discount: 0 }]));
app.listen(port, () => console.log(`coupon-service listening on ${port}`));
