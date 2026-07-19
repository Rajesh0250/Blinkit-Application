const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3019);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'rating-review-service' }));
app.get('/reviews', (_req, res) => res.json([{ product: 'Fresh Apples', rating: 4.9, review: 'Very fresh and crisp' }]));
app.listen(port, () => console.log(`rating-review-service listening on ${port}`));
