const express = require('express');
const app = express();
app.use(express.json());
const port = Number(process.env.PORT || 3009);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'search-service' }));
app.get('/search', (_req, res) => res.json({ query: res.req.query.q || '', suggestions: ['fruits', 'groceries', 'kitchen'] }));
app.listen(port, () => console.log(`search-service listening on ${port}`));
